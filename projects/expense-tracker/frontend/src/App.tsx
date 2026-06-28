import { useState, useEffect } from 'react'
import { DollarSign, TrendingUp, TrendingDown, Trash2, PlusCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface Transaction {
  id?: number;
  title: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

const CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investments', 'Other Income'],
  expense: ['Food', 'Housing', 'Transportation', 'Entertainment', 'Health', 'Other Expense']
};

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES.expense[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<'income' | 'expense'>('expense');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch transactions from Spring Boot REST API
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Update category selection automatically when type changes
  useEffect(() => {
    setCategory(CATEGORIES[type][0]);
  }, [type]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/transactions');
      if (!res.ok) throw new Error('API server returned error');
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      setError('Could not connect to backend server. Make sure it is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    const newTransaction: Transaction = {
      title,
      amount: parseFloat(amount),
      category,
      date,
      type
    };

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction)
      });
      
      if (!res.ok) throw new Error('Failed to save transaction');
      
      setTitle('');
      setAmount('');
      fetchTransactions(); // Refresh from db
    } catch (err) {
      alert('Error saving transaction.');
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete transaction');
      fetchTransactions(); // Refresh
    } catch (err) {
      alert('Error deleting transaction.');
    }
  };

  // Calculations
  const incomeTotal = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenseTotal = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = incomeTotal - expenseTotal;

  // Chart Formatting: Expense by Category
  const categoryChartData = Object.entries(
    transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const COLORS = ['#7b61ff', '#00c9a7', '#ff6b35', '#f5c518', '#e53e3e', '#777777'];

  return (
    <div className="min-h-screen p-6 font-sans text-slate-800 bg-[#fafcf2]">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-8 flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Personal Expense Tracker
          </h1>
          <p className="text-sm text-slate-500 font-light mt-1">
            Java 21 Spring Boot + React Full-Stack Portfolio Project
          </p>
        </div>
        <div className="flex gap-2">
          <span className="text-xs bg-slate-200 px-3 py-1.5 rounded-full font-mono text-slate-700">
            Port: 5174
          </span>
          <span className="text-xs bg-brand text-white px-3 py-1.5 rounded-full font-mono">
            H2 Database Enabled
          </span>
        </div>
      </header>

      {error && (
        <div className="max-w-6xl mx-auto mb-6 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm font-medium">
          {error}
        </div>
      )}

      <main className="max-w-6xl mx-auto grid md:grid-cols-12 gap-8 items-start">
        {/* Left Side - Controls & Analytics (Column Width: 5/12) */}
        <section className="md:col-span-5 space-y-6">
          {/* KPI Dashboard Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 block mb-1">Net Balance</span>
              <span className={`text-lg font-bold ${netBalance >= 0 ? 'text-slate-900' : 'text-red-500'}`}>
                ${netBalance.toFixed(2)}
              </span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <span className="text-xs text-slate-500 block mb-1 flex items-center gap-1">
                <TrendingUp size={12} className="text-green-500" /> Income
              </span>
              <span className="text-lg font-bold text-green-600">${incomeTotal.toFixed(2)}</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <span className="text-xs text-slate-500 block mb-1 flex items-center gap-1">
                <TrendingDown size={12} className="text-red-500" /> Expenses
              </span>
              <span className="text-lg font-bold text-red-600">${expenseTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Form to Add Transaction */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <PlusCircle size={18} className="text-brand" /> Add Transaction
            </h2>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    type === 'expense' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    type === 'income' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'
                  }`}
                >
                  Income
                </button>
              </div>

              <div>
                <label className="block text-[0.65rem] font-bold text-slate-500 uppercase mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Groceries"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.65rem] font-bold text-slate-500 uppercase mb-1">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition"
                  />
                </div>
                <div>
                  <label className="block text-[0.65rem] font-bold text-slate-500 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition"
                  >
                    {CATEGORIES[type].map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[0.65rem] font-bold text-slate-500 uppercase mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white hover:opacity-90 font-semibold text-sm transition"
              >
                Log Transaction
              </button>
            </form>
          </div>

          {/* Chart Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Expenses by Category
            </h2>
            {categoryChartData.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8 font-light">
                No expense transactions logged yet.
              </p>
            ) : (
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="value" fill="#7b61ff" radius={[4, 4, 0, 0]}>
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </section>

        {/* Right Side - Transaction History Log (Column Width: 7/12) */}
        <section className="md:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Transaction History
            </h2>
            <button
              onClick={fetchTransactions}
              className="text-xs font-semibold text-brand hover:underline"
            >
              Refresh Table
            </button>
          </div>

          {loading ? (
            <div className="text-center py-20 text-sm text-slate-400 font-light">
              Loading transactions from Spring Boot database...
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-20 text-sm text-slate-400 font-light">
              No transactions logged yet. Try adding one!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-[0.65rem] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">Title</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3 text-right">Amount</th>
                    <th className="pb-3 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map(t => (
                    <tr key={t.id} className="group hover:bg-slate-50/50 transition">
                      <td className="py-3.5 font-medium text-slate-900">{t.title}</td>
                      <td className="py-3.5">
                        <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-600 font-mono">
                          {t.category}
                        </span>
                      </td>
                      <td className="py-3.5 text-xs text-slate-400 font-light">{t.date}</td>
                      <td className={`py-3.5 text-right font-bold ${t.type === 'income' ? 'text-green-600' : 'text-slate-900'}`}>
                        {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                      </td>
                      <td className="py-3.5 text-center">
                        <button
                          onClick={() => t.id && handleDeleteTransaction(t.id)}
                          className="text-slate-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
