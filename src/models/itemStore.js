let currentId = 1;
let items = [];

const seedInitialData = () => {
  items = [
    {
      id: 1,
      title: "Set up project structure",
      description: "Initialize Node.js REST API with Express",
      completed: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 2,
      title: "Implement CRUD endpoints",
      description: "Support GET, POST, PUT, DELETE operations on /api/items",
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  currentId = 3;
};

// Initialize with seed data
seedInitialData();

export const itemStore = {
  getAll({ search, completed } = {}) {
    let result = [...items];

    if (search) {
      const query = search.toLowerCase();
      result = result.filter(
        item =>
          item.title.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query))
      );
    }

    if (completed !== undefined) {
      const isCompleted = completed === "true" || completed === true;
      result = result.filter(item => item.completed === isCompleted);
    }

    return result;
  },

  getById(id) {
    const numericId = Number(id);
    return items.find(item => item.id === numericId) || null;
  },

  create({ title, description = "", completed = false }) {
    const newItem = {
      id: currentId++,
      title: title.trim(),
      description: description ? description.trim() : "",
      completed: Boolean(completed),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    items.push(newItem);
    return newItem;
  },

  update(id, updates) {
    const numericId = Number(id);
    const index = items.findIndex(item => item.id === numericId);
    if (index === -1) {
      return null;
    }

    const currentItem = items[index];
    const updatedItem = {
      ...currentItem,
      ...(updates.title !== undefined ? { title: updates.title.trim() } : {}),
      ...(updates.description !== undefined ? { description: updates.description.trim() } : {}),
      ...(updates.completed !== undefined ? { completed: Boolean(updates.completed) } : {}),
      updatedAt: new Date().toISOString()
    };

    items[index] = updatedItem;
    return updatedItem;
  },

  delete(id) {
    const numericId = Number(id);
    const index = items.findIndex(item => item.id === numericId);
    if (index === -1) {
      return false;
    }
    items.splice(index, 1);
    return true;
  },

  reset() {
    seedInitialData();
  }
};
