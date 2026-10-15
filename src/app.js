import express from "express";
import cors from "cors";
import morgan from "morgan";
import apiRouter from "./routes/index.js";
import { notFoundHandler } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Standard middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP request logging (disabled during automated tests)
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Root endpoint with API info
app.get("/", (req, res) => {
  res.json({
    name: "Node.js REST API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      health: "GET /api/health",
      items: {
        list: "GET /api/items",
        getById: "GET /api/items/:id",
        create: "POST /api/items",
        update: "PUT /api/items/:id",
        delete: "DELETE /api/items/:id"
      }
    }
  });
});

// Mount API routes
app.use("/api", apiRouter);

// 404 and Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
