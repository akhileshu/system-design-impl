import express from "express";
import os from "os";
const app = express();
const port = 3000;

app.get("/", (_req, res) => {
  // Add a unique identifier (e.g., from env or random)
  // res.send(`Hello from server ${process.env.SERVER_ID || "default"}`);
  res.send(`Hello from ${os.hostname()}`); // Hostname = unique per replica , identifier when running multiple containers
});

// Dummy data
const users = [
  { id: 1, name: "Akhilesh" },
  { id: 2, name: "Ravi" },
];

// API route
app.get("/api/users", (_req, res) => {
  res.json(users);
});
app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
