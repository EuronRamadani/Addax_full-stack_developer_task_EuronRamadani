# Calendar Task Manager

A full-stack monthly calendar application where users can create, edit, drag-and-drop, and search tasks. Tasks are persisted in MongoDB via a Node.js/Express backend. Public holidays are fetched from the Nager.Date API.

---

## Tech Stack

**Frontend**
- React 18 + TypeScript
- Vite
- Emotion (CSS-in-JS)
- Native HTML5 Drag & Drop API

**Backend**
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- CORS, dotenv

---

## Setup Instructions

### Prerequisites
- Node.js >= 18
- MongoDB running locally (or a MongoDB Atlas URI)

### 1. Clone the repository
```bash
git clone <repo-url>
cd calendar-task-manager
```

### 2. Set up the server
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI if needed
npm install
npm run dev
```

### 3. Set up the client
```bash
cd client
cp .env.example .env
# Edit .env if your API URL differs
npm install
npm run dev
```

The client runs at `http://localhost:5173` and the server at `http://localhost:5000`.

---

## API Endpoints

| Method | Endpoint              | Description                                    |
|--------|-----------------------|------------------------------------------------|
| GET    | `/api/tasks`          | Get all tasks (optional `?month=YYYY-MM`)      |
| POST   | `/api/tasks`          | Create a new task                              |
| PUT    | `/api/tasks/reorder`  | Bulk update task positions after drag-and-drop |
| PUT    | `/api/tasks/:id`      | Update a task by ID                            |
| DELETE | `/api/tasks/:id`      | Delete a task by ID                            |

---

## Features

- **Monthly calendar grid** — 6 rows × 7 columns, always starts on Sunday, days from adjacent months fill the grid
- **Task management** — create, inline-edit (double-click), and delete tasks per day
- **Drag & drop** — drag tasks between days or reorder within the same day using native HTML5 DnD
- **Search & highlight** — real-time search filters tasks across all cells; matching text is highlighted in yellow
- **Holidays** — US public holidays fetched from Nager.Date API and shown as green badges, pinned to the top of each cell
- **Persistent storage** — all tasks saved to MongoDB; data survives page refresh
- **Today highlight** — current day number shown with a blue circle
- **Emotion styling** — all styles written in CSS-in-JS with Emotion styled components
