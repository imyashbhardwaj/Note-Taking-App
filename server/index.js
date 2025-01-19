require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
const { createServer } = require("node:http");
const noteCreationRouter = require("./src/controllers/noteCreationController");
const getNotesRouter = require("./src/controllers/getNotesController");
const socketHandler = require("./src/handleSockets");

const mongoDbConnectionString = `mongodb://127.0.0.1:${process.env.MONGODB_SERVER_PORT}/note`;
mongoose.connect(mongoDbConnectionString);

const app = express();
app.use(express.json());
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
    path: "/socket",
    cors: {
        origin: `http://localhost:${process.env.FRONTEND_SERVER_PORT}`
      }
});

app.use("/", noteCreationRouter);
app.use("/", getNotesRouter);

io.on("connection", socketHandler(io));

server.listen(process.env.VITE_SERVER_PORT, () => {
  console.log("server is running");
});

