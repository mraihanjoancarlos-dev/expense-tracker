import { useState, useEffect } from "react";
import axios from "axios";

const catIcons = { food:"🍜", transport:"🚗", shopping:"🛍", salary:"💼", health:"💊" };
const fmt = n => "Rp " + Math.round(n).toLocaleString("id-ID");

export default function App() {
  const [txs, setTxs] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [cat, setCat] = useState("food");
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));

  useEffect(() => { fetchTxs(); }, []);

  const fetchTxs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/transactions");
      setTxs(res.data);
    } catch { setTxs([]); }
  };

  const addTx = async () => {
    if (!name || !amount) return;
    await axios.post("http://localhost:5000/api/transactions", { name, amount: parseFloat(amount), type, category: cat, date });
    setName(""); setAmount("");
    fetchTxs();
  };

  const delTx = async (id) => {
    await axios.delete(`http://localhost:5000/api/transactions/${id}`);
    fetchTxs();
  };

  const income = txs.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
  const expense = txs.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);

  return (
    <div style={{maxWidth:700,margin:"0 auto",padding:24,fontFamily:"sans-serif"}}>
      <h1 style={{marginBottom:24}}>💰 Expense Tracker</h1>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:24}}>
        {[["Income",fmt(income),"#22c55e"],["Expense",fmt(expense),"#ef4444"],["Balance",fmt(income-expense),income-expense>=0?"#22c55e":"#ef4444"]].map(([l,v,c])=>(
          <div key={l} style={{background:"#f3f4f6",borderRadius:12,padding:"14px 16px"}}>
            <div style={{fontSize:12,color:"#6b7280",marginBottom:4}}>{l}</div>
            <div style={{fontSize:20,fontWeight:600,color:c}}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:12,padding:16,marginBottom:24}}>
        <h3 style={{marginBottom:12}}>Add Transaction</h3>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Description" style={{width:"100%",marginBottom:8,padding:"8px 12px",borderRadius:8,border:"1px solid #d1d5db",boxSizing:"border-box"}} />
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
          <input value={amount} onChange={e=>setAmount(e.target.value)} type="number" placeholder="Amount (Rp)" style={{padding:"8px 12px",borderRadius:8,border:"1px solid #d1d5db"}} />
          <select value={type} onChange={e=>setType(e.target.value)} style={{padding:"8px 12px",borderRadius:8,border:"1px solid #d1d5db"}}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
          <select value={cat} onChange={e=>setCat(e.target.value)} style={{padding:"8px 12px",borderRadius:8,border:"1px solid #d1d5db"}}>
            <option value="food">🍜 Food</option>
            <option value="transport">🚗 Transport</option>
            <option value="shopping">🛍 Shopping</option>
            <option value="health">💊 Health</option>
            <option value="salary">💼 Salary</option>
          </select>
          <input value={date} onChange={e=>setDate(e.target.value)} type="date" style={{padding:"8px 12px",borderRadius:8,border:"1px solid #d1d5db"}} />
        </div>
        <button onClick={addTx} style={{width:"100%",padding:"10px",background:"#3b82f6",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:15}}>+ Add</button>
      </div>

      <div>
        <h3 style={{marginBottom:12}}>Transactions</h3>
        {txs.length === 0 && <p style={{color:"#9ca3af",textAlign:"center"}}>No transactions yet</p>}
        {txs.map(t=>(
          <div key={t._id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",background:"#f9fafb",borderRadius:10,marginBottom:8}}>
            <span style={{fontSize:24}}>{catIcons[t.category]}</span>
            <div style={{flex:1}}>
              <div style={{fontWeight:500}}>{t.name}</div>
              <div style={{fontSize:12,color:"#9ca3af"}}>{t.date?.slice(0,10)} · {t.category}</div>
            </div>
            <div style={{fontWeight:600,color:t.type==="expense"?"#ef4444":"#22c55e"}}>
              {t.type==="expense"?"-":"+"}{fmt(t.amount)}
            </div>
            <button onClick={()=>delTx(t._id)} style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:"#9ca3af"}}>🗑</button>
          </div>
        ))}
      </div>
    </div>
  );
}