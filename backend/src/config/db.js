import { neon } from "@neondatabase/serverless";
import "dotenv/config";

// Create a SQL connection using DB url
export const sql = neon(process.env.DATABASE_URL);

export async function initDB(){
    try{
        await sql `
        CREATE TABLE IF NOT EXISTS transactions (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount FLOAT NOT NULL,
            category VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `
        console.log("Database initialized successfully");
    }catch(error){
        console.error("Error initializing database:", error);
        process.exit(1);
    }
}