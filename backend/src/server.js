import express from "express";
import dotenv from "dotenv";
import { sql, initDB } from "./config/db.js";
import ratelimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";

dotenv.config();
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(ratelimiter)

const PORT = process.env.PORT || 5001;

app.use("/api/transactions", transactionsRoute)


initDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is running on port 5001");
    })
})