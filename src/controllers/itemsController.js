import { itemStore } from "../models/itemStore.js";

export const getItems = (req, res) => {
  const { search, completed } = req.query;
  const items = itemStore.getAll({ search, completed });
  res.json({
    success: true,
    count: items.length,
    data: items
  });
};

export const getItemById = (req, res) => {
  const { id } = req.params;
  const numericId = Number(id);

  if (Number.isNaN(numericId)) {
    return res.status(400).json({
      success: false,
      error: "Item ID must be a valid number"
    });
  }

  const item = itemStore.getById(numericId);
  if (!item) {
    return res.status(404).json({
      success: false,
      error: `Item with ID ${id} not found`
    });
  }

  res.json({
    success: true,
    data: item
  });
};

export const createItem = (req, res) => {
  const { title, description, completed } = req.body || {};

  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({
      success: false,
      error: "Field 'title' is required and must be a non-empty string"
    });
  }

  if (description !== undefined && typeof description !== "string") {
    return res.status(400).json({
      success: false,
      error: "Field 'description' must be a string if provided"
    });
  }

  if (completed !== undefined && typeof completed !== "boolean") {
    return res.status(400).json({
      success: false,
      error: "Field 'completed' must be a boolean if provided"
    });
  }

  const newItem = itemStore.create({ title, description, completed });
  res.status(201).json({
    success: true,
    data: newItem
  });
};

export const updateItem = (req, res) => {
  const { id } = req.params;
  const numericId = Number(id);

  if (Number.isNaN(numericId)) {
    return res.status(400).json({
      success: false,
      error: "Item ID must be a valid number"
    });
  }

  const { title, description, completed } = req.body || {};

  if (title === undefined && description === undefined && completed === undefined) {
    return res.status(400).json({
      success: false,
      error: "At least one field (title, description, completed) must be provided for update"
    });
  }

  if (title !== undefined && (typeof title !== "string" || title.trim() === "")) {
    return res.status(400).json({
      success: false,
      error: "Field 'title' must be a non-empty string"
    });
  }

  if (description !== undefined && typeof description !== "string") {
    return res.status(400).json({
      success: false,
      error: "Field 'description' must be a string"
    });
  }

  if (completed !== undefined && typeof completed !== "boolean") {
    return res.status(400).json({
      success: false,
      error: "Field 'completed' must be a boolean"
    });
  }

  const updatedItem = itemStore.update(numericId, { title, description, completed });
  if (!updatedItem) {
    return res.status(404).json({
      success: false,
      error: `Item with ID ${id} not found`
    });
  }

  res.json({
    success: true,
    data: updatedItem
  });
};

export const deleteItem = (req, res) => {
  const { id } = req.params;
  const numericId = Number(id);

  if (Number.isNaN(numericId)) {
    return res.status(400).json({
      success: false,
      error: "Item ID must be a valid number"
    });
  }

  const deleted = itemStore.delete(numericId);
  if (!deleted) {
    return res.status(404).json({
      success: false,
      error: `Item with ID ${id} not found`
    });
  }

  res.json({
    success: true,
    message: `Item ${numericId} deleted successfully`
  });
};
