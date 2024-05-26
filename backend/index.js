import express from 'express';
import axios from 'axios';
import cors from 'cors';
import {createClient}  from '@supabase/supabase-js'

const app = express();

const port = process.env.PORT || 5000;
const api_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYWQ0MDcwNWQtMzgzNS00N2M4LWI3NmQtNTZiZmNmNzM1YTAxIiwidHlwZSI6ImZyb250X2FwaV90b2tlbiJ9.45dF0Kwvj9z77cufYk1KSWjKdGQznhEwPuJ-8sjzhCg"

app.use(cors());
app.use(express.json());

const supabaseUrl = 'https://ifcvzcnjjynpvvkjikgk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmY3Z6Y25qanlucHZ2a2ppa2drIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY2MzY4ODAsImV4cCI6MjAzMjIxMjg4MH0.aEnl6ojLvafpJmjqncrxMh8NWr_CBJuAnw6fQGZwDoc'
const supabase = createClient(supabaseUrl, supabaseKey)

// generate
app.post('/generate', async (req, res) => {
    // console.log("post running")

    // res.json({ 'result': "post is again running" })

    const { brandPositioning, features, tone, length } = req.body;

    // console.log(brandPositioning, features, tone, length)
    const lengthMapping = {
        'Short': '4-6 sentences',
        'Medium': '8-10 sentences',
        'Long': '15-20 sentences'
    };
    const payload = {
        providers: ["openai"],
        text: `You are a copywriter at a marketing agency working on a brochure for a real estate developer.
        Generate a narrative flow for the real estate brochure keeping in mind the brand positioning and features of the property.
        <BRAND POSITIONING>
        ${brandPositioning}
        </BRAND POSITIONING>
        <FEATURES>
        ${features}
        </FEATURES>
        Keep the tone of the narrative ${tone}
        Also make sure that the length of the copy is ${lengthMapping[length]}`,
        model: "gpt-3.5-turbo",
        max_tokens: 500,
    };

    try {
        const response = await axios.post("https://api.edenai.run/v2/text/generation", payload, {
            headers: {
                'Authorization': `Bearer ${api_key}`,  // Replace with your actual Eden AI API key
                'Content-Type': 'application/json'
            }
        });
        // console.log(response.data.openai.generated_text)
        const generated_text = response.data.openai.generated_text
        res.json({ result: generated_text });
        } catch (error) {
        console.error(`Error: ${error.response ? error.response.data : error.message}`);
        res.status(500).json({ error: 'Failed to generate response' });
        }

})

// insert
app.post('/insert', async (req, res) => {

    const { positioning, features, tone, length, output } = req.body;
    console.log(positioning, features, tone, length)

    try {
        const { data, error } = await supabase
            .from('storeOutput')
            .insert([
                { positioning: positioning, features: features, tone: tone, length: length, output: output }
            ]);
        if (error) throw error;
        res.status(200).json({ message: 'Data inserted successfully', data });

    } catch (error) {
        console.error('Error inserting data:', error);
        res.json({ error: 'Failed to insert data' });
    }
})

// regenrate
app.post('/regenerate', async (req, res) => {
    
    const { selectedText, output, modificationOption } = req.body

    const payload = {
        providers: ["openai"],
        text:  `Please regenerate the narrative flow by modifying ONLY the selected portion of the complete text.
        Do not regenerate any other aspect of the complete text and ONLY give the output. Please make the text of the selection portion ${modificationOption}

        <COMPLETE TEXT>
        ${output}
        </COMPLETE TEXT>
        <SELECTED PORTION>
        ${selectedText}
        </SELECTED PORTION>
        Generate and return the complete text containing the modification, without providing any other information or sentences.`,
        model: "gpt-3.5-turbo",
        max_tokens: 500,
    };
    try {
        const response = await axios.post("https://api.edenai.run/v2/text/generation", payload, {
            headers: {
                'Authorization': `Bearer ${api_key}`,  // Replace with your actual Eden AI API key
                'Content-Type': 'application/json'
            }
        });
        console.log(response.data.openai.generated_text)
        var generated_text = response.data.openai.generated_text
        res.json({ result: generated_text });
    } catch (error) {
        console.error(`Error: ${error.response ? error.response.data : error.message}`);
        res.status(500).json({ error: 'Failed to generate response' });
    }

})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
