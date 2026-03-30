"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Loader2, LayoutDashboard, Settings, LogOut, Package as PackageIcon, RefreshCcw } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminDashboard() {
  const [token, setToken] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password123');
  const [loginLoading, setLoginLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('stats'); // 'stats', 'products', 'transactions'
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn, activeTab]);

  const api = axios.create({
    baseURL: API_URL,
    headers: { Authorization: `Bearer ${token}` }
  });

  api.interceptors.response.use(res => res, error => {
    if (error.response?.status === 401) {
      logout();
    }
    return Promise.reject(error);
  });

  const fetchData = async () => {
    try {
      if (activeTab === 'stats') {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } else if (activeTab === 'products') {
        const res = await api.get('/products');
        setProducts(res.data);
      } else if (activeTab === 'transactions') {
        const res = await api.get('/admin/transactions');
        setTransactions(res.data);
      }
    } catch (e) {
      toast.error(`Failed to load ${activeTab}`);
    }
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const res = await axios.post(`${API_URL}/admin/login`, { username, password });
      setToken(res.data.token);
      localStorage.setItem('adminToken', res.data.token);
      setIsLoggedIn(true);
      toast.success('Login successful');
    } catch (e) {
      toast.error('Invalid credentials');
    } finally {
      setLoginLoading(false);
    }
  };

  const logout = () => {
    setToken('');
    setIsLoggedIn(false);
    localStorage.removeItem('adminToken');
    setStats(null);
  };

  const updateMarkup = async (id: number, currentMarkup: number) => {
    const newMarkup = prompt('Enter new markup price (Rp):', currentMarkup.toString());
    if (newMarkup === null) return;
    
    const parsed = parseInt(newMarkup);
    if (isNaN(parsed)) return toast.error('Invalid number');

    try {
      await api.put(`/admin/products/${id}`, { markup: parsed });
      toast.success('Markup updated');
      fetchData();
    } catch (e) {
      toast.error('Failed to update');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto glass-panel p-8 mt-20 animate-fade-in">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-600">Admin Area</h1>
          <p className="text-slate-400 text-sm">Please login to continue</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="text" placeholder="Username" required
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
            value={username} onChange={e => setUsername(e.target.value)}
          />
          <input 
            type="password" placeholder="Password" required
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
            value={password} onChange={e => setPassword(e.target.value)}
          />
          <button type="submit" disabled={loginLoading} className="btn-primary w-full flex justify-center">
            {loginLoading ? <Loader2 className="w-5 h-5 animate-spin"/> : 'Login'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto md:h-[70vh]">
      {/* Sidebar */}
      <div className="w-full md:w-64 glass-panel p-4 flex flex-col gap-2 flex-shrink-0">
        <h2 className="text-lg font-bold mb-4 px-2 text-slate-300">Admin Panel</h2>
        
        <button onClick={() => setActiveTab('stats')} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'stats' ? 'bg-orange-500 text-white shadow-[0_4px_15px_rgba(249,115,22,0.3)]' : 'hover:bg-slate-800'}`}>
          <LayoutDashboard className="w-5 h-5" /> Dashboard
        </button>
        
        <button onClick={() => setActiveTab('products')} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'products' ? 'bg-orange-500 text-white shadow-[0_4px_15px_rgba(249,115,22,0.3)]' : 'hover:bg-slate-800'}`}>
          <Settings className="w-5 h-5" /> Pricing
        </button>

        <button onClick={() => setActiveTab('transactions')} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'transactions' ? 'bg-orange-500 text-white shadow-[0_4px_15px_rgba(249,115,22,0.3)]' : 'hover:bg-slate-800'}`}>
          <PackageIcon className="w-5 h-5" /> Transactions 
        </button>

        <div className="mt-auto pt-8">
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow glass-panel p-6 md:p-8 overflow-y-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold capitalize">{activeTab}</h2>
          <button onClick={fetchData} className="p-2 bg-slate-800/80 rounded-lg hover:bg-slate-700 transition"><RefreshCcw className="w-5 h-5 text-slate-300 hover:text-white"/></button>
        </div>

        {activeTab === 'stats' && stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl border border-slate-700/50 relative overflow-hidden">
              <div className="text-slate-400 text-sm mb-1 font-medium z-10 relative">Total Txs</div>
              <div className="text-4xl font-black z-10 relative">{stats.totalTransactions}</div>
              <LayoutDashboard className="w-24 h-24 absolute -right-4 -bottom-4 text-white/5" />
            </div>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl border border-slate-700/50 relative overflow-hidden">
              <div className="text-slate-400 text-sm mb-1 font-medium z-10 relative">Success Txs</div>
              <div className="text-4xl font-black text-emerald-400 z-10 relative">{stats.successTransactions}</div>
              <PackageIcon className="w-24 h-24 absolute -right-4 -bottom-4 text-emerald-400/5" />
            </div>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl border border-slate-700/50 relative overflow-hidden">
              <div className="text-slate-400 text-sm mb-1 font-medium z-10 relative">Gross Revenue</div>
              <div className="text-3xl font-black text-orange-400 z-10 relative">Rp {stats.totalRevenue.toLocaleString()}</div>
            </div>
            <div className="bg-gradient-to-br from-slate-900 to-emerald-900/20 p-6 rounded-xl border border-slate-700/50 relative overflow-hidden">
              <div className="text-slate-400 text-sm mb-1 font-medium z-10 relative">Total Profit</div>
              <div className="text-3xl font-black text-emerald-400 z-10 relative">Rp {stats.totalProfit.toLocaleString()}</div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-in">
            {products.map(p => (
              <div key={p.id} className="bg-slate-900/50 p-5 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="font-extrabold text-xl">{p.name}</div>
                    <div className="text-xs font-mono text-slate-500 mt-1">{p.productCode}</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-slate-400 mb-6 bg-slate-950/50 p-3 rounded-lg">
                  <div className="flex justify-between"><span>Base Price</span> <span>Rp {p.basePrice.toLocaleString()}</span></div>
                  <div className="flex justify-between font-medium"><span>Markup</span> <span className="text-emerald-400">Rp {p.markup.toLocaleString()}</span></div>
                  <div className="flex justify-between font-bold text-white pt-2 border-t border-slate-700/50"><span>Sale Price</span> <span className="text-orange-400">Rp {p.totalPrice.toLocaleString()}</span></div>
                </div>
                <button onClick={() => updateMarkup(p.id, p.markup)} className="w-full bg-slate-800 hover:bg-slate-700 py-3 rounded-lg text-sm font-bold text-white transition-colors">
                  Edit Markup
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="overflow-x-auto bg-slate-900/50 rounded-xl border border-slate-700/50">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-800/80 text-slate-300 border-b border-slate-700/50">
                <tr>
                  <th className="px-5 py-4 font-semibold">Order ID</th>
                  <th className="px-5 py-4 font-semibold">User Info</th>
                  <th className="px-5 py-4 font-semibold">Item</th>
                  <th className="px-5 py-4 font-semibold">Price</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(t => (
                  <tr key={t.id} className="border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-slate-400">{t.id.substring(0,8)}...</td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-white">{t.userIdPubg}</div>
                      <div className="text-xs text-slate-500">Zone: {t.zoneIdPubg}</div>
                    </td>
                    <td className="px-5 py-4 font-bold text-orange-400">{t.product?.name}</td>
                    <td className="px-5 py-4">Rp {t.price.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold 
                        ${t.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : ''}
                        ${t.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : ''}
                        ${t.status === 'PAID' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : ''}
                        ${t.status === 'FAILED' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : ''}
                      `}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-400 text-xs">{new Date(t.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
