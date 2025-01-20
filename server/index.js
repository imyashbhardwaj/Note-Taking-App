require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
const { createServer } = require("node:http");
const noteCreationRouter = require("./src/controllers/noteCreationController");
const getNotesRouter = require("./src/controllers/getNotesController");
const socketHandler = require("./src/handleSockets");

mongoose.connect(process.env.MONGO_URI);

const app = express();
app.use(express.json());
app.use(cors());


const server = createServer(app);
const io = new Server(server, {
    path: "/socket",
    cors: {
        origin: true
      }
});

app.use("/", noteCreationRouter);
app.use("/", getNotesRouter);

io.on("connection", socketHandler(io));

server.listen(process.env.VITE_BACKEND_SERVER_PORT, () => {
  console.log("server is running on port " + process.env.VITE_BACKEND_SERVER_PORT);
});

