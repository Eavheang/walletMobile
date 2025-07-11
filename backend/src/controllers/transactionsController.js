import { sql } from "../config/db.js";

export async function getTransactionsByUserId(req, res){
    const { user_id } = req.params;
    try{
        const transactions = await sql`SELECT * FROM transactions WHERE user_id = ${user_id} ORDER BY created_at DESC`;
        res.status(200).json(transactions);
    }catch(error){
        res.status(500).json({ message: "Error fetching transactions", error: error.message });
    }
}

export async function createTransaction(req, res){
    try{
        const { user_id, title, amount, category } = req.body;
        if(!user_id || !title || !category || amount == undefined){
            return res.status(400).json({ message: "All fields are required" });
        }

        const transaction = await sql`
        INSERT INTO transactions (user_id, title, amount, category) VALUES (${user_id}, ${title}, ${amount}, ${category})
        RETURNING *
        `
        console.log(transaction);
        res.status(201).json({ message: "Transaction created successfully" });

    }catch(error){
        res.status(500).json({ message: "Error creating transaction", error: error.message });
    }
}

export async function deleteTransaction(req, res){
    const { id } = req.params;

    if(isNaN(parseInt(id))){
        return res.status(400).json({ message: "Invalid transaction ID" });
    }

    try{
        const result = await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`;
        if(result.length === 0){
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.status(200).json({ message: "Transaction deleted successfully", transaction: result[0] });
    }catch(error){
        res.status(500).json({ message: "Error deleting transaction", error: error.message });
    }
}

export async function updateTransaction(req, res){
    const { id } = req.params;
    const { title, amount, category } = req.body;
    try{
        const result = await sql`UPDATE transactions SET title = ${title}, amount = ${amount}, category = ${category} WHERE id = ${id} RETURNING *`;
        if(result.length === 0){
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.status(200).json({ message: "Transaction updated successfully", transaction: result[0] });
    }catch(error){
        res.status(500).json({ message: "Error updating transaction", error: error.message });
    }
}

export async function getTransactionSummary(req, res){
    const { user_id } = req.params;
    try{
        const result = await sql`SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions WHERE user_id = ${user_id} `;
        const incomeResult = await sql`SELECT COALESCE(SUM(amount), 0) AS income FROM transactions WHERE user_id = ${user_id} AND amount > 0`;
        const expenseResult = await sql`SELECT COALESCE(SUM(amount), 0) AS expense FROM transactions WHERE user_id = ${user_id} AND amount < 0`;

        res.status(200).json({
            balance: result[0].balance,
            income: incomeResult[0].income,
            expense: expenseResult[0].expense
        });
    }catch(error){
        res.status(500).json({ message: "Error fetching summary", error: error.message });
    }
}