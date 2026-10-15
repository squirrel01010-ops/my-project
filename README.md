# Node.js REST API

A clean, modern RESTful API built with **Node.js** (ES Modules) and **Express**.

## Features

- **Express 5** with native async/await error propagation.
- **RESTful CRUD Resource** (`/api/items`) with filtering, validation, and status codes.
- **Health Check Endpoint** (`/api/health`) reporting system uptime and timestamp.
- **Security & Utilities**: CORS enabled, JSON body parser with malformed payload handling, request logging via Morgan.
- **Zero-Dependency Automated Tests**: Built-in `node:test` and `node:assert` combined with `supertest`.
- **Graceful Shutdown**: Handles `SIGTERM` and `SIGINT` signals cleanly.

---

## Project Structure

```
my-project/
├── src/
│   ├── app.js               # Express app configuration & middleware
│   ├── server.js            # HTTP server entry point & lifecycle management
│   ├── routes/
│   │   ├── index.js         # Root API router (/api)
│   │   └── items.js         # /api/items routes
│   ├── controllers/
│   │   └── itemsController.js # Request validation & response logic
│   ├── models/
│   │   └── itemStore.js     # Data store / repository
│   └── middleware/
│       ├── errorHandler.js  # Centralized error handler
│       └── notFound.js      # 404 Not Found handler
├── test/
│   └── api.test.js          # API integration tests
├── .env.example             # Example environment configuration
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or later (v20+ or v22+ recommended)
- **npm**: v9+

### Installation

```bash
npm install
```

### Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Configuration variables:
- `PORT`: Port number for the HTTP server (default: `3000`)
- `NODE_ENV`: Application environment (`development`, `test`, `production`)

### Running the API

#### Production Mode
```bash
npm start
```

#### Development Mode (with hot-reload using Node `--watch`)
```bash
npm run dev
```

The server will start at `http://localhost:3000`.

---

## Running Tests

Run the integration test suite using Node's native test runner:

```bash
npm test
```

---

## API Endpoints

### Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API metadata and documentation links |
| `GET` | `/api/health` | Health check & uptime |
| `GET` | `/api/items` | List items (supports `?search=` and `?completed=`) |
| `GET` | `/api/items/:id` | Get item by ID |
| `POST` | `/api/items` | Create new item |
| `PUT` | `/api/items/:id` | Update an existing item |
| `DELETE` | `/api/items/:id` | Delete an item |

---

### Endpoints Detail

#### 1. Root & Health Check

##### `GET /`
Returns API metadata and available endpoints.

##### `GET /api/health`
```json
{
  "status": "ok",
  "uptime": 12.34,
  "timestamp": "2026-10-15T13:51:37.595Z"
}
```

---

#### 2. Items Resource (`/api/items`)

##### `GET /api/items`
Query Parameters:
- `search` *(optional)*: Search term in title or description.
- `completed` *(optional)*: Filter by `true` or `false`.

**Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "title": "Set up project structure",
      "description": "Initialize Node.js REST API with Express",
      "completed": true,
      "createdAt": "2026-10-15T13:50:00.000Z",
      "updatedAt": "2026-10-15T13:50:00.000Z"
    }
  ]
}
```

##### `GET /api/items/:id`
**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Set up project structure",
    "description": "Initialize Node.js REST API with Express",
    "completed": true,
    "createdAt": "2026-10-15T13:50:00.000Z",
    "updatedAt": "2026-10-15T13:50:00.000Z"
  }
}
```

##### `POST /api/items`
**Request Body:**
```json
{
  "title": "Build user authentication",
  "description": "Add JWT authentication support",
  "completed": false
}
```
**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "title": "Build user authentication",
    "description": "Add JWT authentication support",
    "completed": false,
    "createdAt": "2026-10-15T13:52:00.000Z",
    "updatedAt": "2026-10-15T13:52:00.000Z"
  }
}
```

##### `PUT /api/items/:id`
**Request Body (any subset of fields):**
```json
{
  "completed": true
}
```
**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "title": "Implement CRUD endpoints",
    "description": "Support GET, POST, PUT, DELETE operations on /api/items",
    "completed": true,
    "createdAt": "2026-10-15T13:50:00.000Z",
    "updatedAt": "2026-10-15T13:52:30.000Z"
  }
}
```

##### `DELETE /api/items/:id`
**Response (200 OK):**
```json
{
  "success": true,
  "message": "Item 1 deleted successfully"
}
```

---

## Example cURL Commands

```bash
# Health check
curl http://localhost:3000/api/health

# List all items
curl http://localhost:3000/api/items

# Filter completed items
curl "http://localhost:3000/api/items?completed=true"

# Search items
curl "http://localhost:3000/api/items?search=project"

# Get item by ID
curl http://localhost:3000/api/items/1

# Create item
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{"title": "Deploy to cloud", "description": "Deploy Node.js REST API"}'

# Update item
curl -X PUT http://localhost:3000/api/items/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": false}'

# Delete item
curl -X DELETE http://localhost:3000/api/items/1
```
