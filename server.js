import http from "http";
import app from "./app/app";

const server = http.createServer(app);
