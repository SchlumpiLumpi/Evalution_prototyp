'use strict'
import express from "express"
import OpenAI from "openai"
import cors from "cors"
import fs from "fs/promises"


//app
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static("public"))
app.set("view engine","ejs")

//instaciate OpenAI
const openAI = new OpenAI({
    apiKey:  'your_apiKey'
})
//default message and context (data)
let messages = [{
    role: "system",
    content: 'You are a helpful assistant'
}];
// set ApiKey via text input
app.post("/apiKey",async(req,res) => {
    const apiKey = req.body.apiKey.toString()
    openAI.apiKey = apiKey
})

//basic routing
app.get("/",async (req,res)=>{
    //clear instructions
    messages=[]
    //load reference data
    const referenceData = await getReferenceData("public/data/referenceData/refA.json")
    const referenceDataString = JSON.stringify(referenceData) 
    //set instructions
    messages.push({
        role: "system",
        // content: `You are helping generating insights for this reference data: ${referenceDataString}.
        //           You keep your answers short and well structured. If you provide additional information or hypothesizing about the dataset,
        //           at the end of your response add at least 2 and at most 3 reliable ressources of your claims`
        content: 'You always reply: A'
    })
        
    res.render("index")
})
app.get("/DB", async (req,res) => {
    //clear instructions
    messages=[]
    //load reference data
    const referenceData = await getReferenceData("public/data/referenceData/refB.json")
    const referenceDataString = JSON.stringify(referenceData) 
    //set instructions
    messages.push({
        role: "system",
        // content: `You are helping generating insights for this reference data: ${referenceDataString}.
        //           You keep your answers short and well structured. If you provide additional information or hypothesizing about the dataset,
        //           at the end of your response add at least 2 and at most 3 reliable ressources of your claims`
        content: 'You always reply: B'
    })
    res.render("DB")
})


//Chat Component
app.post("/chat", async (req, res) => {
    // receive user input
    const userMessage = req.body.message;
    messages.push({ role: "user", content: userMessage });
    // receive and send OpenAI response 
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


//deployment port (render env port) || local port
const PORT = process.env.PORT || 3000 
app.listen(PORT, () => console.log("Server running on PORT:", PORT));


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