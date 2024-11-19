const express = require("express");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(bodyParser.json());

// Configure OpenAI API
require('dotenv').config();
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Endpoint to handle car symptom diagnosis
app.post("/api/diagnose", async (req, res) => {
  const { symptoms } = req.body;
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a car repair expert." },
        { role: "user", content: symptoms },
      ],
    });
    res.json({ diagnosis: response.data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error communicating with GPT");
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
