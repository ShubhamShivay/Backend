import dotenv from "dotenv";
dotenv.config();
import http from "http";
import app from "./app/app.js";

// Create the server
const PORT = process.env.PORT || 2030;
const server = http.createServer(app);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
