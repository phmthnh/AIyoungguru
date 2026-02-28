import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./smartstudy.db");

db.serialize(()=>{

db.run(`
CREATE TABLE IF NOT EXISTS knowledge(
id INTEGER PRIMARY KEY AUTOINCREMENT,
content TEXT
)
`);

});

export default db;