import express from "express";
import sqlite3 from "sqlite3";

const router = express.Router();

const db = new sqlite3.Database("./smartstudy.db");

db.run(`
CREATE TABLE IF NOT EXISTS journal(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT
)
`);

/* SAVE NOTE */
router.post("/", (req, res) => {

    const { content } = req.body;

    db.run(
        "INSERT INTO journal(content) VALUES(?)",
        [content],
        () => res.json({ success: true })
    );
});

/* GET NOTES */
router.get("/", (req, res) => {

    db.all(
        "SELECT * FROM journal ORDER BY id DESC",
        [],
        (err, rows) => {
            res.json(rows);
        }
    );
});

export default router;