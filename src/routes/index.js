import { Router } from "express";
import itemsRouter from "./items.js";

const router = Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Mount items resource router
router.use("/items", itemsRouter);

export default router;
