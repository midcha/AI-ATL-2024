const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
require('dotenv').config();
const fs = require('fs');

async function generateContent() {
    console.log("using categorize");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
    const fileManager = new GoogleAIFileManager(process.env.GEMINI_KEY);
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const uploadResponse = await fileManager.uploadFile("./TestPapers/Paper1.pdf", {
        mimeType: "application/pdf",
        displayName: "ResearchPaperPDF",
    });
    
    const prompt = fs.readFileSync('./Prompts/getJSON.txt', 'utf8');
    const result = await model.generateContent([
        {
            fileData: {
                mimeType: uploadResponse.file.mimeType,
                fileUri: uploadResponse.file.uri,
            },
        },
        { text: prompt },
    ]);

    // Write the result to a JSON file
    fs.writeFileSync('./Outputs/result.json', JSON.stringify(result.response.text(), null, 2));
    console.log("Result has been exported to result.json");
}

generateContent();
