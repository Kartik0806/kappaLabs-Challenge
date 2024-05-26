import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import { generatePrompt, regeneratePrompt } from './globalPrompt.js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const api_key = `Bearer ${process.env.EDAN_AI_API_KEY}`;

export const generateHandler = async (req, res) => {
    const { brandPositioning, features, tone, length } = req.body;
    const prompt = generatePrompt(brandPositioning, features, tone, length);

    const payload = {
        providers: ["openai"],
        text: prompt,
        model: "gpt-3.5-turbo",
        max_tokens: 500,
    };

    try {
        const response = await axios.post("https://api.edenai.run/v2/text/generation", payload, {
            headers: {
                'Authorization': api_key,
                'Content-Type': 'application/json'
            }
        });
        const generated_text = response.data.openai.generated_text;
        res.json({ result: generated_text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate response' });
    }
};

export const insertHandler = async (req, res) => {
    const { brandPositioning, features, tone, length, output } = req.body;

    try {
        const { data, error } = await supabase
            .from('storeOutput')
            .insert([
                { positioning: brandPositioning, features: features, tone: tone, length: length, output: output }
            ]);
        if (error) throw error;
        res.status(200).json({ message: 'Data inserted successfully', data });
    } catch (error) {
        console.error('Error inserting data:', error);
        res.json({ error: 'Failed to insert data' });
    }
};

export const regenerateHandler = async (req, res) => {
    const { selectedText, output, modificationOption } = req.body;
    const prompt = regeneratePrompt(output, selectedText, modificationOption);

    const payload = {
        providers: ["openai"],
        text: prompt,
        model: "gpt-3.5-turbo",
        max_tokens: 500,
    };

    try {
        const response = await axios.post("https://api.edenai.run/v2/text/generation", payload, {
            headers: {
                'Authorization': api_key,
                'Content-Type': 'application/json'
            }
        });
        const generated_text = response.data.openai.generated_text;
        res.json({ result: generated_text });
    } catch (error) {
        console.error('Error in regenerating data:', error);
        res.status(500).json({ error: 'Failed to generate response' });
    }
};
