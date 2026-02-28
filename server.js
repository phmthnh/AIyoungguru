import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

import db from "./database/database.js";
import knowledgeRoutes from "./routes/knowledge.js";
import chat from "./routes/chat.js";
import journal from "./routes/journal.js";

dotenv.config();

const app = express();

/* =====================
   GEMINI SETUP
===================== */

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL
});

/* =====================
   MIDDLEWARE
===================== */
app.use("/knowledge", knowledgeRoutes);
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

/* =====================
   TEST
===================== */

app.get("/api/test", (req, res) => {
    res.json({ message: "✅ Server running OK" });
});

/* =====================
   AI ROUTE
===================== */

app.post("/api/ai", async (req, res) => {

    try {

        const { prompt } = req.body;

        // lấy journal
        const notes = await new Promise((resolve, reject) => {

            db.all(
                "SELECT content FROM journal ORDER BY id DESC LIMIT 5",
                [],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );

        });

        const historyText =
            notes.map(n => "- " + n.content).join("\n");

        /* ======================
           SYSTEM CONTEXT
        ====================== */

        const fullPrompt = `
Bạn là SmartStudy AI — trợ lý học tập cá nhân.

Thông tin học tập gần đây của người dùng:
${historyText}

Nhiệm vụ:
- Phân tích tình hình học tập
- Đưa lời khuyên cụ thể
- Trả lời sâu, thực tế
- Không trả lời chung chung

Câu hỏi:
${prompt}
`;

        const result =
            await model.generateContent(fullPrompt);

        const response =
            await result.response;

        res.json({
            reply: response.text()
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            reply: "AI error"
        });
    }
});

/* =====================
   ROUTES
===================== */

app.use("/api/chat", chat);
app.use("/api/journal", journal);

/* =====================
   START
===================== */

app.listen(3000, () => {
    console.log("✅ SmartStudy running at http://localhost:3000");
});