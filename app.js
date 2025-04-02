'use strict'
import express from "express"
import OpenAI from "openai"
import cors from "cors"
import fs from "fs/promises"

//read data from file
async function getReferenceData(filepath) {
    try {
        const data = await fs.readFile(filepath, "utf-8")
        return JSON.parse(data)
    }
    catch (error) {
        console.log('something went wrong', error)
        return null
    }
}
const referenceData = await getReferenceData("public/data/referenceData/scatter_dataset.json")
const referenceDataString = JSON.stringify(referenceData) 
// console.log(referenceData)


//app
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static("public"))

//instaciate OpenAI
const openAI = new OpenAI({
    apiKey:  'your_apiKey'
})
 
// set ApiKey via text input
app.post("/apiKey",async(req,res) => {
    const apiKey = req.body.apiKey.toString()
    openAI.apiKey = apiKey
})


//give context
const messages = [{
    role: "system",
    // content: `reference data: ${JSON.stringify(referenceData)}`,
    // content: `You are a helpful assistant. You are helping generating insights for this data ${referenceDataString}`
    content: 'You are a helpful assistant'
}];

//communication with chat component of index.html
app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;
    messages.push({ role: "user", content: userMessage });

    try {
        const completion = await openAI.chat.completions.create({
            model: "gpt-4o",
            messages: messages,
        });

        const responseText = completion.choices[0].message.content;
        messages.push({ role: "assistant", content: responseText });

        res.json({ reply: responseText });
    } catch (error) {
        res.status(500).json({ error: "Something went wrong!" });
    }
});
//LocalHost

const PORT = process.env.PORT || 3000 
app.listen(PORT, () => console.log("Server running on http://localhost:3000"));