# 🎓 Peer Evaluation System

Peer Evaluation System is an open-source web application currently in development, built using the MERN stack (MongoDB, Express.js, React, Node.js). Our goal is to simplify and enhance the peer evaluation process for academic courses through a modern, user-friendly platform.

## 📦 Backend

### ▶️ How to Run the Backend

1. Navigate to the backend folder:
   ```bash
   cd backend

2. Create a `.env` file and define the following environment variables:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_JWT_key
   PORT=your_port_number # Omit this line to use default
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

> The backend runs on **port 5000** by default.

### 📚 Student APIs

For details about student-related API endpoints, check:  
[`backend/student_api_endpoints.md`](./backend/student_api_endpoints.md)

---

## 💻 Frontend

### ▶️ How to Run the Frontend

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Create a `.env` file and define the following environment variables:
   ```env
   VITE_BACKEND_PORT= your_port_number #You need this incase you used a custom backend port.
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

> The frontend runs on **port 5173** by default.

---

## 🛠 Tech Stack

- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Node.js + Express.js
- **Database:** MongoDB
- **API:** RESTful services

---

## 🧪 Status

🚧 Currently under active development.

---

## 📬 Contributing

Contributions, feedback, and suggestions are welcome!  
Feel free to fork the repo, create a branch, and submit a pull request.
