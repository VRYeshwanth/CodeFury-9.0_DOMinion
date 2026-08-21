require("dotenv").config();

const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

async function checkModels() {
    try {
        const models = await groq.models.list();

        for (const model of models.data) {
            console.log(model.id);
        }
    } catch (error) {
        console.error(error);
    }
}

checkModels();