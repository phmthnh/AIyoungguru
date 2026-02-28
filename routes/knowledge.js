import express from "express";
import db from "../database/database.js";

const router = express.Router();

/* ADD KNOWLEDGE */
router.post("/add", (req, res) => {

    const { content } = req.body;

    db.run(
        "INSERT INTO knowledge (content) VALUES (?)",
        [content],
        function(err){
            if(err){
                return res.status(500).json(err);
            }

            res.json({
                success: true,
                id: this.lastID
            });
        }
    );
});

/* GET ALL */
router.get("/", (req,res)=>{
    db.all("SELECT * FROM knowledge",[],(err,rows)=>{
        res.json(rows);
    });
});

export default router;