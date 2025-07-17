import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // <--- ✅ Import cors
import { sql, initDB } from "./config/db.js";
import ratelimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";
import job from "./config/cron.js";
dotenv.config();
const app = express();

app.use(cors()); // <--- ✅ Enable CORS for all requests
app.use(express.json());
app.use(ratelimiter);


if (process.env.NODE_ENV === 'production') job.start();

const PORT = process.env.PORT || 5001;

app.use("/api/transactions", transactionsRoute);


app.get("/api/health", (req,res) =>{
    res.status(200).json({status: "ok"})
})

app.use("/", (req, res) => {
    res.send("Hello World");
});

initDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is running on port 5001");
    });
});
