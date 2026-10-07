const express = require("express");

const app = express();

const PORT = 3000;


// Allow JSON requests
app.use(express.json());


// Serve frontend
app.use(express.static("public"));

// ===============================
// SAFE JSON PARSER
// ===============================

function parseAIResponse(responseText) {

    try {

        // Try normal JSON parsing first

        return JSON.parse(responseText);

    } catch (error) {

        console.log(
            "AI returned extra text. Trying to extract JSON..."
        );

        // Find the first { and last }

        const start =
            responseText.indexOf("{");

        const end =
            responseText.lastIndexOf("}");

        // If JSON brackets are not found

        if (
            start === -1 ||
            end === -1
        ) {

            throw new Error(
                "AI did not return valid JSON"
            );

        }

        // Extract only the JSON part

        const jsonText =
            responseText.substring(
                start,
                end + 1
            );

        // Try parsing extracted JSON

        return JSON.parse(jsonText);

    }

}

// Generate AI mission
app.post("/api/generate", async (req, res) => {

    try {

        const {
    time,
    activity,
    energy,
    mood,
    company
} = req.body;


        const prompt = `
You are TouchGrass AI.

Your job is to create ONE personalized outdoor mission that helps the user leave their screen and interact with the real world.

USER INFORMATION:

- Time available: ${time}
- Preferred activity: ${activity}
- Energy level: ${energy}
- Mood: ${mood}
- Going with: ${company}

PERSONALIZATION:

Use ALL of the user's information when creating the mission.

Energy:
- Low energy → suggest a relaxing and low-effort activity.
- Medium energy → suggest a moderate activity.
- High energy → suggest a more active or challenging activity.

Mood:
- Tired → suggest something calm and refreshing.
- Bored → suggest something interesting or playful.
- Stressed → suggest something relaxing and peaceful.
- Happy → suggest something fun and positive.
- Adventurous → suggest something exploratory or exciting.

Company:
- Alone → create a mission that works well independently.
- Friend → make it social when appropriate.
- Friends → make it interactive or fun for the group.
- Family → make it suitable for doing together.

RULES:

- The activity must be possible outdoors.
- It must fit the available time.
- It should be specific rather than generic.
- It should encourage interaction with the real world.
- Do not suggest dangerous activities.
- Do not require expensive equipment.
- Do not require special skills.
- Keep the mission simple and realistic.
- Encourage the user to spend less time on their phone.
- Keep the description concise.

OUTPUT:

Return ONLY valid JSON.
Do not use markdown.
Do not use code blocks.
Do not add any text before or after the JSON.

Use exactly this format:

{
  "title": "Short mission name",
  "description": "Clear instructions for the outdoor activity.",
  "difficulty": "Easy",
  "time": "${time}",
  "phoneRule": "One short rule encouraging the user to put their phone away."
}
`;

        
        const response = await fetch(
            "http://localhost:11434/api/generate",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    model: "llama3.2:3b",

                    prompt: prompt,

                    stream: false

                })

            }
        );


        const data = await response.json();


        const missionData =
    parseAIResponse(data.response);

    
    if (
    !missionData.title ||
    !missionData.description ||
    !missionData.difficulty ||
    !missionData.time ||
    !missionData.phoneRule
        ) {

        throw new Error(
        "AI returned incomplete mission data"
         );

    }

        res.json(missionData);


    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Could not generate mission"
        });

    }

});


// Start server
app.listen(PORT, () => {

    console.log(
        `TouchGrass AI running at http://localhost:${PORT}`
    );

});