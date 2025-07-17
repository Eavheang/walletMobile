// react custom hook files

import { useCallback, useState } from "react"
import { Alert } from "react-native";

const API_URL = "https://walletmobile.onrender.com/api";

export const useTransactions = (userId) =>{
    const [ transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({
        balance : 0,
        income : 0,
        expense : 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    const fetchTransactions = useCallback(async () =>{
        try{
            const response = await fetch(`${API_URL}/transactions/${userId}`);
            const data = await response.json()
            setTransactions(data);
        } catch( error) {
            console.error("Error Fetching data")
        }
    },[userId]);

    const fetchSummary = useCallback(async () =>{
        try{
            const response = await fetch(`${API_URL}/transactions/summary/${userId}`);
            const data = await response.json()
            setSummary(data);
        } catch( error) {
            console.error("Error Fetching data")
        }
    },[userId]);

    const loadData = useCallback(async () =>{
        if (!userId) return;
        setIsLoading(true);
        try {
            await Promise.all([fetchSummary(), fetchTransactions()]);
        } catch(error){
            console.error("Error Loading data")
        } finally {
            setIsLoading(false);
        }
    },[fetchSummary, fetchTransactions, userId]);

    const deleteTransaction = useCallback(async (id) =>{
        try {
            const response = await fetch(`${API_URL}/transactions/${id}`, {method: "DELETE"});
            if (!response.ok) throw new Error ("Failed to delete transaction");
    
            loadData();
            Alert.alert("Success", "Transaction deleted successfully");
        } catch (error) {
            console.error("Error Deleting transaction")
            Alert.alert("Error", error.message)
        }
    })

    return { transactions, summary, isLoading, loadData, deleteTransaction};
}