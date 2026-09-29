'use client';

import { useMemo, useState } from 'react';

type Role = 'Anastasia' | 'Richard' | 'Jean-Claude' | 'Manager';
type Transaction = { id: string; type: 'Sale' | 'Expense'; label: string; amount: number; commission: number; net: number; owner: string; status: 'Pending review' | 'Posted'; date: string };

const rate: Record<Role, number> = { Anastasia: 0.14, Richard: 0.12, 'Jean-Claude': 0.09, Manager: 0 };
const people = ['Anastasia','Richard','Jean-Claude'] as const;
const money = (n: number) => new Intl.NumberFormat('en-US',{style:'currency',currency:'EUR'}).format(n);

export default function FinanceApp() {
  const [role, setRole] = useState<Role>('Anastasia');
  const [sale, setSale] = useState({ customer: '', packageName: 'Standard package', amount: '' });
  const [expense, setExpense] = useState({ category: 'Transport', amount: '', note: '' });
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id:'S-1001', type:'Sale', label:'Wedding guest package', amount:950, commission:133, net:817, owner:'Anastasia', status:'Posted', date:'Today' },
    { id:'E-1001', type:'Expense', label:'Transport — client event', amount:85, commission:0, net:-85, owner:'Richard', status:'Pending review', date:'Today' }
  ]);
  const [notice, setNotice] = useState('Ready for a new transaction.');
  const summary = useMemo(() => transactions.reduce((a,t) => ({ sales:a.sales+(t.type==='Sale'?t.amount:0), expenses:a.expenses+(t.type==='Expense'?t.amount:0), commission:a.commission+t.commission, net:a.net+t.net }), {sales:0,expenses:0,commission:0,net:0}),[transactions]);
  function addSale(){
    const amount=Number(sale.amount); if(!sale.customer || !amount){setNotice('Add a customer and sale amount first.'); return;}
    const commission=Math.round(amount*rate[role]); const reference='S-'+String(1002+transactions.length);
    setTransactions([{id:reference,type:'Sale',label:sale.packageName+' — '+sale.customer,amount,commission,net:amount-commission,owner:role,status:role==='Manager'?'Posted':'Pending review',date:'Now'},...transactions]);
    setSale({customer:'',packageName:'Standard package',amount:''}); setNotice(reference+' was saved and queued for manager approval.');
  }
  function addExpense(){
    const amount=Number(expense.amount); if(!amount || !expense.note){setNotice('Add an expense amount and description first.'); return;}
    const reference='E-'+String(1002+transactions.length);
    setTransactions([{id:reference,type:'Expense',label:expense.category+' — '+expense.note,amount,commission:0,net:-amount,owner:role,status:role==='Manager'?'Posted':'Pending review',date:'Now'},...transactions]);
    setExpense({category:'Transport',amount:'',note:''}); setNotice(reference+' expense was saved and queued for manager approval.');
  }
  function approve(id:string){setTransactions(ts=>ts.map(t=>t.id===id?{...t,status:'Posted'}:t)); setNotice(id+' approved by manager.');}
  const input={width:'100%',boxSizing:'border-box' as const,padding:'11px',borderRadius:8,border:'1px solid #385071',background:'#0b1b2f',color:'#fff'};
  return <main style={{maxWidth:1180,margin:'auto',padding:28}}>
    <header style={{display:'flex',justifyContent:'space-between',gap:20,alignItems:'center',marginBottom:26,flexWrap:'wrap'}}>
      <div><p style={{color:'#75d6ff',fontWeight:700,letterSpacing:1,margin:0}}>WEDDING GUESTS FOR HIRE</p><h1 style={{margin:'6px 0'}}>Friends Included Finance</h1><p style={{margin:0,color:'#aebfd3'}}>Sales, commissions, expenses and manager approvals in one workspace.</p></div>
      <label style={{fontWeight:700}}>Demo sign-in<br/><select value={role} onChange={e=>setRole(e.target.value as Role)} style={{...input,marginTop:6}}><option>Anastasia</option><option>Richard</option><option>Jean-Claude</option><option>Manager</option></select></label>
    </header>
    <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:14,marginBottom:22}}>
      {[['Sales',money(summary.sales),'#75d6ff'],['Expenses',money(summary.expenses),'#ffad78'],['Commissions',money(summary.commission),'#d5a6ff'],['Net company income',money(summary.net),'#78e6a2']].map(([label,value,color])=><div key={label} style={{background:'#10243d',padding:18,borderRadius:12,border:'1px solid #294463'}}><div style={{color:'#aebfd3'}}>{label}</div><strong style={{fontSize:25,color}}>{value}</strong></div>)}
    </section>
    <p style={{background:'#0e3150',border:'1px solid #23618d',padding:12,borderRadius:8,color:'#d9f1ff'}}>{notice}</p>
    <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:18}}>
      <div style={{background:'#10243d',padding:20,borderRadius:12}}><h2>New sale</h2><p style={{color:'#aebfd3'}}>Your role earns {Math.round(rate[role]*100)}% commission.</p><input aria-label="Customer name" placeholder="Customer name" value={sale.customer} onChange={e=>setSale({...sale,customer:e.target.value})} style={input}/><input aria-label="Package" placeholder="Package" value={sale.packageName} onChange={e=>setSale({...sale,packageName:e.target.value})} style={{...input,marginTop:10}}/><input aria-label="Sale amount" type="number" placeholder="Amount in EUR" value={sale.amount} onChange={e=>setSale({...sale,amount:e.target.value})} style={{...input,marginTop:10}}/><button onClick={addSale} style={{marginTop:12,width:'100%',padding:12,border:0,borderRadius:8,background:'#45b8ed',fontWeight:800,cursor:'pointer'}}>Record sale</button></div>
      <div style={{background:'#10243d',padding:20,borderRadius:12}}><h2>New expense</h2><p style={{color:'#aebfd3'}}>All expenses are visible to the manager for review.</p><select aria-label="Expense category" value={expense.category} onChange={e=>setExpense({...expense,category:e.target.value})} style={input}><option>Transport</option><option>Venue</option><option>Supplies</option><option>Marketing</option></select><input aria-label="Expense amount" type="number" placeholder="Amount in EUR" value={expense.amount} onChange={e=>setExpense({...expense,amount:e.target.value})} style={{...input,marginTop:10}}/><input aria-label="Expense description" placeholder="Description" value={expense.note} onChange={e=>setExpense({...expense,note:e.target.value})} style={{...input,marginTop:10}}/><button onClick={addExpense} style={{marginTop:12,width:'100%',padding:12,border:0,borderRadius:8,background:'#ffb36e',fontWeight:800,cursor:'pointer'}}>Record expense</button></div>
    </section>
    <section style={{marginTop:22,background:'#10243d',padding:20,borderRadius:12,overflowX:'auto'}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}><h2>Transaction ledger</h2><span style={{color:'#aebfd3'}}>{role==='Manager'?'Manager review mode':'Personal dashboard mode'}</span></div><table style={{width:'100%',borderCollapse:'collapse',minWidth:690}}><thead><tr style={{textAlign:'left',color:'#aebfd3'}}>{['Reference','Type','Description','Amount','Commission','Status','Action'].map(h=><th key={h} style={{padding:'10px 6px',borderBottom:'1px solid #294463'}}>{h}</th>)}</tr></thead><tbody>{transactions.map(t=><tr key={t.id}><td style={{padding:8,fontWeight:700}}>{t.id}</td><td style={{padding:8}}>{t.type}</td><td style={{padding:8}}>{t.label}</td><td style={{padding:8}}>{money(t.amount)}</td><td style={{padding:8}}>{money(t.commission)}</td><td style={{padding:8,color:t.status==='Posted'?'#78e6a2':'#ffcf73'}}>{t.status}</td><td style={{padding:8}}>{role==='Manager'&&t.status==='Pending review'?<button onClick={()=>approve(t.id)} style={{padding:'7px 10px',border:0,borderRadius:6,background:'#78e6a2',fontWeight:700}}>Approve</button>:'—'}</td></tr>)}</tbody></table></section>
    <footer style={{marginTop:24,color:'#aebfd3',fontSize:14}}>Setup links: <a href="https://docs.google.com/spreadsheets/d/1_n2GLZbfBtQIrQDmaEZjnUtO1J4i0WQojqCFdQx7P0g/edit" style={{color:'#75d6ff'}}>Google Sheets ledger</a> · <a href="https://github.com/biernemarta-cpu/friends-included-finance" style={{color:'#75d6ff'}}>GitHub repository</a><br/>Telegram bot and database sync are prepared in the private deployment configuration.</footer>
  </main>;
}
