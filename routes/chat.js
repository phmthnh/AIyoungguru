import express from "express";
import fetch from "node-fetch";
import db from "../database/database.js";

const router = express.Router();

router.post("/", async (req,res)=>{

const {message} = req.body;

const journals =
db.prepare(
"SELECT content FROM journal ORDER BY id DESC LIMIT 5"
).all();

const memory = journals.map(j=>j.content).join("\n");

const systemPrompt = `
You are SmartStudy AI Tutor.

Recent journals:
${memory}

Be motivating and adaptive.
`;

try{

const response = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
contents:[
{
parts:[
{text:systemPrompt + "\nUser:"+message}
]
}
]
})
});

const data = await response.json();

const reply =
data.candidates?.[0]?.content?.parts?.[0]?.text
|| "AI đang suy nghĩ...";

res.json({reply});

}catch(err){
console.log(err);
res.json({reply:"AI error"});
}

});

export default router;