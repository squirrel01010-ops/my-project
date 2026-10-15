import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../src/app.js";
import { itemStore } from "../src/models/itemStore.js";

process.env.NODE_ENV = "test";

describe("REST API Integration Tests", () => {
  beforeEach(() => {
    itemStore.reset();
  });

  describe("GET /", () => {
    it("should return root API metadata and endpoints list", async () => {
      const res = await request(app).get("/");
      assert.equal(res.status, 200);
      assert.equal(res.body.status, "running");
      assert.ok(res.body.endpoints);
      assert.equal(res.body.endpoints.health, "GET /api/health");
    });
  });

  describe("GET /api/health", () => {
    it("should return healthy status", async () => {
      const res = await request(app).get("/api/health");
      assert.equal(res.status, 200);
      assert.equal(res.body.status, "ok");
      assert.ok(res.body.timestamp);
    });
  });

  describe("Items CRUD (/api/items)", () => {
    it("should return list of all items", async () => {
      const res = await request(app).get("/api/items");
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(Array.isArray(res.body.data), true);
      assert.equal(res.body.count, 2);
    });

    it("should filter items by search query", async () => {
      const res = await request(app).get("/api/items?search=structure");
      assert.equal(res.status, 200);
      assert.equal(res.body.count, 1);
      assert.equal(res.body.data[0].id, 1);
    });

    it("should filter items by completion status", async () => {
      const res = await request(app).get("/api/items?completed=true");
      assert.equal(res.status, 200);
      assert.ok(res.body.data.every(item => item.completed === true));
    });

    it("should get an item by ID", async () => {
      const res = await request(app).get("/api/items/1");
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.id, 1);
      assert.equal(res.body.data.title, "Set up project structure");
    });

    it("should return 400 for invalid non-numeric ID", async () => {
      const res = await request(app).get("/api/items/abc");
      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
      assert.match(res.body.error, /must be a valid number/);
    });

    it("should return 404 for item that does not exist", async () => {
      const res = await request(app).get("/api/items/9999");
      assert.equal(res.status, 404);
      assert.equal(res.body.success, false);
      assert.match(res.body.error, /not found/);
    });

    it("should create a new item with 201 status", async () => {
      const newItem = {
        title: "Write documentation",
        description: "Add comprehensive README with API usage guide",
        completed: false
      };
      const res = await request(app)
        .post("/api/items")
        .send(newItem);

      assert.equal(res.status, 201);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.title, newItem.title);
      assert.equal(res.body.data.description, newItem.description);
      assert.equal(res.body.data.completed, false);
      assert.ok(res.body.data.id);
      assert.ok(res.body.data.createdAt);
    });

    it("should return 400 when creating item without title", async () => {
      const res = await request(app)
        .post("/api/items")
        .send({ description: "Missing title" });

      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
      assert.match(res.body.error, /title.*required/);
    });

    it("should return 400 when creating item with empty title", async () => {
      const res = await request(app)
        .post("/api/items")
        .send({ title: "   " });

      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
    });

    it("should update an existing item", async () => {
      const updates = {
        title: "Updated task title",
        completed: true
      };
      const res = await request(app)
        .put("/api/items/2")
        .send(updates);

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.id, 2);
      assert.equal(res.body.data.title, updates.title);
      assert.equal(res.body.data.completed, true);
    });

    it("should return 404 when updating non-existent item", async () => {
      const res = await request(app)
        .put("/api/items/999")
        .send({ title: "Doesn't exist" });

      assert.equal(res.status, 404);
      assert.equal(res.body.success, false);
    });

    it("should return 400 when updating with empty body", async () => {
      const res = await request(app)
        .put("/api/items/1")
        .send({});

      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
    });

    it("should delete an existing item", async () => {
      const res = await request(app).delete("/api/items/1");
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);

      // Verify it was deleted
      const checkRes = await request(app).get("/api/items/1");
      assert.equal(checkRes.status, 404);
    });

    it("should return 404 when deleting non-existent item", async () => {
      const res = await request(app).delete("/api/items/999");
      assert.equal(res.status, 404);
      assert.equal(res.body.success, false);
    });
  });

  describe("Error handling & 404 routes", () => {
    it("should return 404 for unknown route", async () => {
      const res = await request(app).get("/unknown/path");
      assert.equal(res.status, 404);
      assert.equal(res.body.success, false);
      assert.match(res.body.error, /Route not found/);
    });
  });
});
