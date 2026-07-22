import cors from 'cors';
import express, { type Express } from 'express';

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    console.log("Hello world");
});