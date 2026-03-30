"use client";

import { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { Loader2, Search, CheckCircle, Clock, XCircle, Package } from 'lucide-react';
import { toast } from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '';
  
  const [orderId, setOrderId] = useState(initialId);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialId) {
      fetchOrder(initialId);
    }
  }, [initialId]);

  const fetchOrder = async (idToFetch: string) => {
    if (!idToFetch) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/transactions/${idToFetch}`);
      setOrder(res.data);
    } catch (e) {
      toast.error('Pesanan tidak ditemukan');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'SUCCESS': return <CheckCircle className="w-12 h-12 text-emerald-500" />;
      case 'PENDING': return <Clock className="w-12 h-12 text-amber-500" />;
      case 'PAID': return <Package className="w-12 h-12 text-blue-500" />;
      case 'FAILED': return <XCircle className="w-12 h-12 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="glass-panel p-6 text-center space-y-4">
        <h1 className="text-2xl font-bold">Lacak Pesanan</h1>
        <p className="text-slate-400 text-sm">Masukkan Order ID Anda untuk melihat status top up.</p>
        
        <div className="flex gap-2 max-w-md mx-auto">
          <input 
            type="text" 
            placeholder="INV-XXXXX"
            className="flex-grow bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
          <button 
            onClick={() => fetchOrder(orderId)}
            disabled={loading}
            className="btn-primary px-4 py-3"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {order && (
        <div className="glass-panel p-6 space-y-6 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-800 rounded-bl-full -z-10 opacity-50"></div>
          
          <div className="flex flex-col items-center justify-center space-y-3 pb-6 border-b border-slate-700/50 text-center">
            <StatusIcon status={order.status} />
            <div>
              <h2 className="text-xl font-bold">Status: {order.status}</h2>
              <p className="text-slate-400 text-sm mt-1 text-center max-w-sm">
                {order.status === 'SUCCESS' && 'Top up berhasil dan UC telah ditambahkan ke akun Anda.'}
                {order.status === 'PENDING' && 'Menunggu pembayaran dari Anda.'}
                {order.status === 'PAID' && 'Pembayaran diterima. Sedang memproses top up ke supplier...'}
                {order.status === 'FAILED' && 'Transaksi gagal atau dibatalkan.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm mt-4">
            <div>
              <span className="text-slate-400 block mb-1">Order ID</span>
              <span className="font-semibold">{order.id}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Tanggal</span>
              <span className="font-semibold">{new Date(order.createdAt).toLocaleString('id-ID')}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">User ID / Zone ID</span>
              <span className="font-semibold">{order.userIdPubg} / {order.zoneIdPubg}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Item Detail</span>
              <span className="font-semibold text-orange-400">{order.product?.name}</span>
            </div>
            <div className="col-span-2 mt-4 pt-4 border-t border-slate-700/50">
              <div className="flex justify-between items-center text-lg">
                <span className="text-slate-300">Total Harga</span>
                <span className="font-black text-orange-400">Rp {order.price?.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          {order.status === 'PAID' && (
            <div className="text-center mt-4">
              <button 
                onClick={() => fetchOrder(order.id)} 
                className="text-sm text-orange-400 hover:text-orange-300 flex items-center justify-center gap-2 w-full mt-4"
              >
                <Loader2 className="w-4 h-4 animate-spin" /> Klik untuk refresh status
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TrackOrder() {
  return (
    <Suspense fallback={<div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-orange-500" /></div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
