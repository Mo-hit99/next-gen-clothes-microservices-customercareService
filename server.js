import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import { createServer } from "http"; // Import createServer from 'http'
import { Server } from "socket.io"; // Import Server from 'socket.io'
import {db_connection} from './config/db_connection/db_connection.js'
import { CustomerCareChatBox_router } from "./routes/CustomerCare_router.js";
import { redisDatabaseConnection } from "./config/db_connection/redis_connection.js";

dotenv.config();

const port = process.env.PORT || 8000;
const app = express();
app.use(express.json());
app.use(helmet({crossOriginResourcePolicy: false}))// Allow cross-origin requests}));

// Allow CORS for specific origin
app.use(cors({
  origin: process.env.CLIENT_HTTP_LINK, // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true // Allow cookies and other credentials
}));

// Create HTTP server

const httpServer = createServer(app); // Create an HTTP server from the Express app
// Set up Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_HTTP_LINK, // Adjust this as needed for your client
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Middleware to make io available to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});



app.use(CustomerCareChatBox_router);

// Handle Socket.io connections
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle incoming messages
  socket.on("sendMessage", (message) => {
    console.log("Message received:", message);
    // You can emit this message to other clients
    socket.broadcast.emit("receiveMessage", message); // Broadcast the message to all other clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

if(process.env.NODE_ENV === 'production'){
  console.log('Production server Running')
}else{
  console.log('Development server Running')
}

// Start the server
httpServer.listen(port, () => {
  console.log("Server CustomerCare running at http://localhost:" + port);
  db_connection()
  redisDatabaseConnection();
});


