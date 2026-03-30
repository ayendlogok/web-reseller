"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Check, Loader2, Gamepad2, ShoppingCart, QrCode, CreditCard, MessageCircle, Info } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const PAYMENT_METHODS = [
  { id: 'dana', name: 'DANA', type: 'E-Wallet', img: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_dana_blue.svg' },
  { id: 'gopay', name: 'GoPay', type: 'E-Wallet', img: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg' },
  { id: 'ovo', name: 'OVO', type: 'E-Wallet', img: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/OVO_Logo.svg' },
  { id: 'seabank', name: 'SeaBank', type: 'Transfer Bank', img: '/seabank.svg' },
];

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [paymentAccount, setPaymentAccount] = useState('');

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [transaction, setTransaction] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products`);
      setProducts(res.data);
    } catch (e) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const submitPaymentSimulation = async (isSuccess: boolean) => {
    if (!isSuccess) {
      setPaymentError(selectedPayment.type === 'E-Wallet' ? 'Saldo tidak mencukupi atau PIN diblokir.' : 'Transfer dibatalkan / Saldo kurang.');
      toast.error('Pembayaran Gagal: Saldo tidak mencukupi', { id: 'payment' });
      return;
    }

    setPaymentError('');
    setIsProcessingPayment(true);
    toast.loading('Memverifikasi pembayaran...', { id: 'payment' });
    
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      await axios.post(`${API_URL}/webhook/payment`, {
        transactionId: transaction.transactionId,
        status: 'PAID'
      });
      toast.success(`Pembayaran ${selectedPayment.name} Berhasil!`, { id: 'payment' });

      setTimeout(() => {
        window.location.href = `/track?id=${transaction.transactionId}`;
      }, 1500);
    } catch (e) {
      toast.error('Sistem sedang sibuk, coba lagi.', { id: 'payment' });
      setIsProcessingPayment(false);
    }
  };

  const handleCheckout = async () => {
    if (!userId) return toast.error('Silakan isi User ID PUBG Anda');
    if (!selectedProduct) return toast.error('Silakan pilih nominal Top Up');
    if (!selectedPayment) return toast.error('Silakan pilih metode pembayaran');
    if (!paymentAccount) return toast.error(`Silakan isi ${selectedPayment.type === 'E-Wallet' ? 'Nomor HP' : 'Nomor Rekening'} Anda`);
    if (!email) return toast.error('Silakan isi email untuk bukti transaksi');

    setIsCheckingOut(true);
    try {
      const res = await axios.post(`${API_URL}/transactions/create`, {
        userIdPubg: userId,
        zoneIdPubg: '-',
        productId: selectedProduct.id,
      });

      setTransaction(res.data);
      setIsCheckingOut(false);
      setShowPaymentModal(true); // Open the mock gateway app for confirmation
    } catch (e) {
      toast.error('Gagal membuat pesanan');
      setIsCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="w-16 h-16 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pb-24 relative mt-4 md:mt-8">
      
      {/* BANNER SECTION */}
      <div className="relative w-full h-[250px] md:h-[350px] lg:h-[450px] rounded-3xl overflow-hidden shadow-2xl shadow-orange-500/10 mb-8 border border-slate-700/50 group">
        <img 
          src="/pubg-banner.png" 
          alt="PUBG Mobile Top Up Banner" 
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/40 to-transparent"></div>
        <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 z-10 w-full pr-10">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white drop-shadow-lg tracking-tighter mb-3">
            PUBG <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">MOBILE</span>
          </h1>
          <p className="text-slate-200 font-medium text-sm md:text-lg max-w-xl drop-shadow-md mb-6 leading-relaxed">
            Top up UC instan dan aman. Tersedia pembayaran via DANA, GoPay, SeaBank, dan OVO!
          </p>
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            {[
              { name: 'DANA', color: 'bg-blue-600/30 border-blue-500/60 text-blue-300' },
              { name: 'GoPay', color: 'bg-sky-600/30 border-sky-500/60 text-sky-300' },
              { name: 'OVO', color: 'bg-purple-600/30 border-purple-500/60 text-purple-300' },
              { name: 'SeaBank', color: 'bg-orange-600/30 border-orange-500/60 text-orange-300' },
            ].map(p => (
              <span key={p.name} className={`px-4 py-1.5 rounded-full border backdrop-blur-md text-xs md:text-sm font-bold shadow-lg ${p.color}`}>
                {p.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* === LEFT COLUMN: STEPS === */}
        <div className="flex-1 space-y-6">

          {/* STEP 1 */}
          <section className="glass-panel p-6">
            <div className="flex items-center gap-3 border-b border-slate-700/50 pb-4 mb-4">
              <div className="bg-orange-500 w-8 h-8 rounded-full flex items-center justify-center text-white font-black shadow-lg shadow-orange-500/30">1</div>
              <h2 className="text-xl font-bold">Masukkan Detail Akun</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-400 font-medium">Player ID PUBG</label>
                <input
                  type="text"
                  placeholder="Contoh: 558766782"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors text-xl font-mono tracking-wider"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value.replace(/\D/g, ''))}
                />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3 italic">*Untuk mengetahui Player ID Anda, silakan klik menu profile di kiri atas pada menu utama game.</p>
          </section>

          {/* STEP 2 */}
          <section className="glass-panel p-6">
            <div className="flex items-center gap-3 border-b border-slate-700/50 pb-4 mb-4">
              <div className="bg-orange-500 w-8 h-8 rounded-full flex items-center justify-center text-white font-black shadow-lg shadow-orange-500/30">2</div>
              <h2 className="text-xl font-bold">Pilih Nominal Top Up</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {products.map((p: any) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedProduct(p)}
                  className={`relative bg-slate-900/50 border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:-translate-y-1 ${selectedProduct?.id === p.id
                      ? 'border-orange-500 bg-orange-500/10 shadow-[0_0_15px_rgba(249,115,22,0.3)]'
                      : 'border-slate-700 hover:border-slate-500'
                    }`}
                >
                  <div className="flex flex-col items-center justify-center gap-2 h-full py-2">
                    <span className="font-black text-xl text-white tracking-tight">{p.name}</span>
                  </div>
                  {selectedProduct?.id === p.id && (
                    <div className="absolute -top-3 -right-3 bg-orange-500 text-white p-1 rounded-full shadow-lg z-10">
                      <Check className="w-5 h-5" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* STEP 3 */}
          <section className="glass-panel p-6">
            <div className="flex items-center gap-3 border-b border-slate-700/50 pb-4 mb-4">
              <div className="bg-orange-500 w-8 h-8 rounded-full flex items-center justify-center text-white font-black shadow-lg shadow-orange-500/30">3</div>
              <h2 className="text-xl font-bold">Pilih Saluran Pembayaran</h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-slate-400 font-semibold mb-3 tracking-wider text-sm flex items-center gap-2"><QrCode className="w-4 h-4" /> E-WALLET</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PAYMENT_METHODS.filter(m => m.type === 'E-Wallet').map(m => (
                    <div
                      key={m.id}
                      onClick={() => setSelectedPayment(m)}
                      className={`relative flex items-center gap-4 bg-slate-900/50 border-2 rounded-xl p-4 cursor-pointer transition-all ${selectedPayment?.id === m.id ? 'border-sky-500 bg-sky-500/10 shadow-[0_0_10px_rgba(14,165,233,0.3)]' : 'border-slate-700 hover:border-slate-500'
                        }`}
                    >
                      <img src={m.img} alt={m.name} className="h-6 w-auto object-contain bg-white rounded p-1" />
                      <div className="font-bold flex-1">{m.name}</div>

                      {selectedProduct && (
                        <div className="text-orange-400 font-bold text-sm">
                          Rp {selectedProduct.totalPrice.toLocaleString('id-ID')}
                        </div>
                      )}

                      {selectedPayment?.id === m.id && (
                        <div className="absolute -top-3 -right-3 bg-sky-500 text-white p-1 rounded-full shadow-lg z-10">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-slate-400 font-semibold mb-3 tracking-wider text-sm flex items-center gap-2"><CreditCard className="w-4 h-4" /> TRANSFER BANK</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PAYMENT_METHODS.filter(m => m.type === 'Transfer Bank').map(m => (
                    <div
                      key={m.id}
                      onClick={() => setSelectedPayment(m)}
                      className={`relative flex items-center gap-4 bg-slate-900/50 border-2 rounded-xl p-4 cursor-pointer transition-all ${selectedPayment?.id === m.id ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_10px_rgba(245,158,11,0.3)]' : 'border-slate-700 hover:border-slate-500'
                        }`}
                    >
                      <img src={m.img} alt={m.name} className="h-6 w-auto object-contain bg-white rounded p-1" />
                      <div className="font-bold flex-1">{m.name}</div>

                      {selectedProduct && (
                        <div className="text-orange-400 font-bold text-sm">
                          Rp {selectedProduct.totalPrice.toLocaleString('id-ID')}
                        </div>
                      )}

                      {selectedPayment?.id === m.id && (
                        <div className="absolute -top-3 -right-3 bg-amber-500 text-white p-1 rounded-full shadow-lg z-10">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {selectedPayment && (
                <div className="mt-6 p-5 border border-slate-700/50 rounded-xl bg-slate-900/60 shadow-inner animate-in fade-in slide-in-from-top-4 duration-500">
                  <h3 className="text-slate-200 font-bold mb-3 flex items-center gap-2">
                    <Check className="w-5 h-5 text-orange-500" /> Masukkan Informasi Akun {selectedPayment.name}
                  </h3>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400 font-medium">
                      {selectedPayment.type === 'E-Wallet' ? `Nomor HP (${selectedPayment.name})` : `Nomor Rekening (${selectedPayment.name})`}
                    </label>
                    <input
                      type="text"
                      placeholder={selectedPayment.type === 'E-Wallet' ? "Contoh: 08123456789" : "Contoh: 1234567890"}
                      className="w-full bg-slate-950/50 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors font-mono tracking-wider text-white"
                      value={paymentAccount}
                      onChange={(e) => setPaymentAccount(e.target.value.replace(/\D/g, ''))}
                    />
                    <p className="text-xs text-orange-400/80">
                      *Pastikan nomor valid untuk memverifikasi dan memproses saldo {selectedPayment.name} secara langsung.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

        </div>

        {/* === RIGHT COLUMN: CHECKOUT === */}
        <div className="w-full lg:w-96">
          <div className="glass-panel p-6 sticky top-8 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ShoppingCart className="text-orange-500" />
              Checkout
            </h2>

            <div className="bg-slate-900/60 rounded-xl p-4 space-y-3 border border-slate-700/50">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Item</span>
                <span className="font-black text-white">{selectedProduct ? selectedProduct.name : '-'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Payment Method</span>
                <span className="font-black text-white">{selectedPayment ? selectedPayment.name : '-'}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-400 font-medium">Alamat Email (Wajib)</label>
              <input
                type="email"
                placeholder="Email untuk invoice"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs p-3 rounded-lg flex gap-2">
                <Info className="w-4 h-4 shrink-0" />
                Harap mengisi alamat email apabila ingin bukti pembayaran.
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/50">
              <div className="flex justify-between items-end mb-4">
                <span className="text-slate-300 font-medium tracking-wide">Total</span>
                <span className="text-3xl font-black text-orange-500">
                  <span className="text-base mr-1 font-bold text-orange-400">IDR</span>
                  {selectedProduct ? selectedProduct.totalPrice.toLocaleString('id-ID') : '0'}
                </span>
              </div>

              {!transaction ? (
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-lg font-black tracking-wide shadow-orange-500/40"
                >
                  {isCheckingOut ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin" /> <span>Mengamankan Pesanan...</span>
                    </div>
                  ) : (
                    <span>Bayar Sekarang</span>
                  )}
                </button>
              ) : (
                <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-4 mt-4 text-center space-y-3">
                  <div className="text-emerald-400 font-bold mb-2 flex flex-col items-center justify-center gap-2">
                    <Check className="w-8 h-8 text-emerald-500 bg-emerald-500/20 rounded-full p-1" /> 
                    <span>Order {transaction.transactionId} Terdaftar</span>
                  </div>
                  <button 
                    onClick={() => setShowPaymentModal(true)} 
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-lg transition-colors border border-slate-700"
                  >
                    Buka Konfirmasi {selectedPayment?.name}
                  </button>
                  <p className="text-xs text-slate-500 mt-2">Menunggu pembayaran diselesaikan pada aplikasi/gateway e-wallet.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      <a
        href="https://wa.me/6281234567890?text=Halo%20Admin%20KilatTopup,%20saya%20butuh%20bantuan"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 bg-[#25D366] text-white p-4 rounded-full shadow-xl shadow-green-500/40 hover:scale-110 hover:-translate-y-2 transition-all duration-300 z-40 flex items-center justify-center group"
      >
        <MessageCircle className="w-8 h-8" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap opacity-0 group-hover:opacity-100 font-bold ml-0 group-hover:ml-3">
          Hubungi CS (WhatsApp)
        </span>
      </a>

      {/* PAYMENT GATEWAY MODAL SIMULATION */}
      {showPaymentModal && transaction && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
            
            {/* Modal Header */}
            <div className={`p-4 flex items-center justify-center relative ${
              selectedPayment.name === 'DANA' ? 'bg-blue-600' :
              selectedPayment.name === 'OVO' ? 'bg-purple-600' :
              selectedPayment.name === 'GoPay' ? 'bg-sky-500' : 'bg-orange-500'
            }`}>
              <button 
                onClick={() => setShowPaymentModal(false)} 
                className="absolute left-4 text-white hover:text-white font-bold text-sm bg-black/20 px-3 py-1 rounded"
              >
                Tutup
              </button>
              <img src={selectedPayment.img} alt={selectedPayment.name} className="h-8 bg-white px-3 py-1 rounded" />
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-center">
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                <p className="text-slate-400 text-sm mb-1">Total Pembayaran</p>
                <p className="text-3xl font-black text-white">Rp {selectedProduct.totalPrice.toLocaleString('id-ID')}</p>
              </div>

              {selectedPayment.type === 'E-Wallet' ? (
                <div className="space-y-4">
                  <p className="text-slate-300 text-sm">
                    Silakan buka aplikasi <strong>{selectedPayment.name}</strong> di perangkat Anda untuk mengonfirmasi pembayaran dari akun <strong>{paymentAccount}</strong>.
                  </p>
                  
                  <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-6 my-4 text-center space-y-4 shadow-inner">
                    <div className="flex flex-col items-center justify-center gap-3">
                       <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" /> 
                       <span className="text-emerald-400 font-bold text-lg tracking-wide">Menunggu Pembayaran...</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Kami telah mengirimkan notifikasi ke aplikasi {selectedPayment.name} Anda. Masukkan PIN Anda di aplikasi tersebut untuk menyelesaikan transaksi.
                    </p>
                    {paymentError && <p className="text-red-400 text-sm font-medium animate-pulse mt-2">{paymentError}</p>}
                  </div>

                  <div className="text-left mt-4">
                    <p className="text-xs text-slate-500 italic bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                      *Mode Simulasi: Gunakan tombol di bawah ini untuk mensimulasikan respon dari aplikasi {selectedPayment.name}.*
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button 
                      onClick={() => submitPaymentSimulation(false)}
                      disabled={isProcessingPayment}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 py-4 rounded-xl font-bold transition-colors text-sm border border-slate-700"
                    >
                      [Simulasi] Dibatalkan
                    </button>
                    <button 
                      onClick={() => submitPaymentSimulation(true)}
                      disabled={isProcessingPayment}
                      className="bg-emerald-500 hover:bg-emerald-400 text-white py-4 rounded-xl font-bold transition-colors text-sm shadow-lg shadow-emerald-500/20"
                    >
                      {isProcessingPayment ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : '[Simulasi] Berhasil'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-slate-300 text-sm">
                    Silakan transfer tepat sejumlah total di atas ke Rekening Virtual {selectedPayment.name} berikut:
                  </p>
                  <div className="bg-slate-950 p-5 rounded-xl border border-slate-700 font-mono text-2xl tracking-wider text-orange-400 font-black shadow-inner">
                    8834 {paymentAccount.slice(-6).padEnd(6, '0')}
                  </div>
                  {paymentError && <p className="text-red-400 text-sm font-medium animate-pulse">{paymentError}</p>}
                  
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <button 
                      onClick={() => submitPaymentSimulation(false)}
                      disabled={isProcessingPayment}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 py-4 rounded-xl font-bold transition-colors text-sm border border-slate-700"
                    >
                      Simulasi Gagal
                    </button>
                    <button 
                      onClick={() => submitPaymentSimulation(true)}
                      disabled={isProcessingPayment}
                      className="bg-emerald-500 hover:bg-emerald-400 text-white py-4 rounded-xl font-bold transition-colors text-sm shadow-lg shadow-emerald-500/20"
                    >
                      {isProcessingPayment ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Cek Status Transfer'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
