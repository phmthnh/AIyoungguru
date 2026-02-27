import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

        const result =
            await model.generateContent(prompt);

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