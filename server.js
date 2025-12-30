import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// CORS (important for GitHub Pages)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.json({ reply: "No message received" });
    }

    const response = await fetch(
  "https://api.openai.com/v1/responses",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: userMessage
    })
  }
);

const data = await response.json();

if (!data.output || !data.output[0] || !data.output[0].content) {
  return res.json({ reply: "AI error" });
}

res.json({
  reply: data.output[0].content[0].text
});

    const result = await response.json(); // ✅ declared ONCE

    if (!result.choices) {
      return res.json({ reply: "AI error" });
    }

    res.json({ reply: result.choices[0].message.content });

  } catch (err) {
    console.error(err);
    res.json({ reply: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
