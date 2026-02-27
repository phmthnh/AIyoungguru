import Database from "better-sqlite3";

const db = new Database("smartstudy.db");

db.prepare(`
CREATE TABLE IF NOT EXISTS journal(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`).run();

export default db;