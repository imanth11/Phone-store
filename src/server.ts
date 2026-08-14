import express, { Request, Response } from "express";
import cors from "cors";
import * as path from "path";
import { db } from "./db";

const app = express();

app.use(cors());
app.use(express.json());


app.get("/test-db", (req: Request, res: Response) => {
  db.query("SELECT 1", (err) => {
    if (err) return res.status(500).send("Database connection failed");
    res.send("Connected to MySQL successfully");
  });
});

app.get("/users", (req: Request, res: Response) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});


app.post("/app/api/me", (req: Request, res: Response) => {
  const { name } = req.body;
  db.query("INSERT INTO users (name) VALUES (?)", [name], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ id: (result as any).insertId, name });
  });
});


app.use(express.static(path.join(__dirname, "public")));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

