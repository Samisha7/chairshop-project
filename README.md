# Lisbon Chair Co.

A full-stack modern web application for a premium chair shop based in Lisbon. Built using the **MERN** stack (MongoDB, Express, React, Node.js).

## Features

- **Dynamic Product Grid:** Browse premium ergonomic and luxury chairs.
- **Shopping Cart:** Add, remove, and adjust quantities seamlessly via a global React Context.
- **Checkout Simulation:** Submits order data to a secure backend database.
- **Contact Form:** Functional interface for customer inquiries.
- **Premium Aesthetics:** Vibrant colors, smooth gradients, and micro-animations for an elevated user experience.

## Tech Stack

- **Frontend:** React (Vite), Vanilla CSS, Context API.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (Mongoose ODM).

## Local Setup

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/try/download/community) (Running locally or a MongoDB Atlas URI)

### 1. Database Seeding

Before running the application, populate your MongoDB instance with the initial chair inventory.

```bash
cd backend
npm install
node seedData.js
```

### 2. Start the Backend Server

Start the Express.js API server (defaults to port 5000).

```bash
cd backend
# Make sure to install dependencies first if you haven't: npm install
node server.js
```

*(Optional: Create a `.env` file in the `backend` folder and add `MONGO_URI=your_connection_string` to use a cloud database).*

### 3. Start the Frontend Development Server

Open a new terminal window, install the React dependencies, and start Vite.

```bash
cd frontend
npm install
npm run dev
```

The application will be accessible at `http://localhost:5173/`.
