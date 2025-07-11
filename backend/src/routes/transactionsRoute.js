import express from "express";
import { sql } from "../config/db.js";
import { getTransactionsByUserId, createTransaction , deleteTransaction , updateTransaction , getTransactionSummary } from "../controllers/transactionsController.js";
const router = express.Router();

router.get("/:user_id", getTransactionsByUserId)

router.post("/", createTransaction)

router.delete("/:id", deleteTransaction)

router.put("/:id",updateTransaction)

router.get("/summary/:user_id", getTransactionSummary)

export default router;