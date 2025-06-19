# TaskMaster - ToDo Application

TaskMaster is a modern, full-stack ToDo application that allows users to manage their tasks efficiently with user authentication and a beautiful, responsive interface.

## Features

- User registration and login (JWT authentication)
- Add, edit, complete, and delete tasks
- Set deadlines for tasks
- Filter tasks by status (All, Pending, Completed)
- Responsive and modern UI
- Secure password hashing
- Persistent storage with MongoDB

## Tech Stack

- **Frontend:** HTML, CSS (custom, responsive), JavaScript (vanilla)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT (JSON Web Tokens), bcryptjs

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```env
     MONGODB_URI=mongodb://localhost:27017/todo-app
     JWT_SECRET=your-secret-key
     PORT=3000
     ```

4. **Start the server:**
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

5. **Access the app:**
   Open your browser and go to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── public/
│   ├── index.html      # Main frontend HTML
│   ├── script.js       # Frontend JS logic
│   └── styles.css      # Custom styles
├── server.js           # Express backend server
├── package.json        # Project metadata and dependencies
└── README.md           # Project documentation
```

## API Endpoints

### Auth
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive JWT

### Tasks (require JWT in `Authorization` header)
- `GET /api/tasks` — Get all tasks for the logged-in user
- `POST /api/tasks` — Create a new task
- `PUT /api/tasks/:id` — Edit a task
- `PATCH /api/tasks/:id` — Mark task as completed/pending
- `DELETE /api/tasks/:id` — Delete a task

## License

This project is licensed under the MIT License.

---

*Built with ❤️ by Ansh* 