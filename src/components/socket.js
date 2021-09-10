import clientSocket from "socket.io-client";

export const SOCKET_URL = "http://localhost:3001";
export const socket = clientSocket(SOCKET_URL);
