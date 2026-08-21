const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";


async function explainMessage(message, language = "english") {

    const languageName =
        language === "kannada" ? "Kannada" : "English";

    const prompt = `
You are Saathi, a voice-first assistant designed for elderly Indian users.

Explain the following message in ${languageName}:

"${message}"

Rules:
- Use exactly 2 short sentences.
- Use very simple language suitable for a 65-year-old.
- First sentence: explain what the message means.
- Second sentence: clearly tell the user what action they need to take.
- If this is an OTP, tell the user never to share it with anyone.
- If the message appears suspicious, clearly warn the user.
- Do not invent information.
- Do not use headings.
- Do not use bullet points.
`;


    const completion = await groq.chat.completions.create({
        model: MODEL,

        messages: [
            {
                role: "system",
                content:
                    "You explain digital messages safely and simply to elderly Indian users."
            },
            {
                role: "user",
                content: prompt
            }
        ],

        temperature: 0.2,
        max_tokens: 1000
    });


    const result =
        completion.choices?.[0]?.message?.content?.trim();


    if (!result) {
        throw new Error("Groq returned an empty response.");
    }


    return result;
}


// IMPORTANT
// This must match the import in explainController.js

module.exports = {
    explainMessage
};