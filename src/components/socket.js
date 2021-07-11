import clientSocket from "socket.io-client";

export const API_URL = "http://localhost:3001";
export const socket = clientSocket(`${API_URL}`);
