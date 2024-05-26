// server.js

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { generateHandler, insertHandler, regenerateHandler } from './controller.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/generate', generateHandler);
app.post('/insert', insertHandler);
app.post('/regenerate', regenerateHandler);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

