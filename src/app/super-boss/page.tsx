"use client";
import React, { useState, useEffect } from 'react';
import { Database, Plus, RefreshCcw, Slash, Tag, Key, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from "@/lib/supabase";

function generateRandomKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'CT-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function SuperAdminPage() {
  const [keyCode, setKeyCode] = useState('');
  const [duration, setDuration] = useState('30');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [successKey, setSuccessKey] = useState<any>(null);
  const [licenses, setLicenses] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  // Fetch licenses when component mounts
  useEffect(() => {
    fetchLicenses();
  }, []);

  const fetchLicenses = async () => {
    setFetching(true);
    try {
      const { data, error } = await supabase
        .from('licenses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching licenses:", error);
        return;
      }
      if (data) setLicenses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setSuccessKey(null);
    
    // Nếu sếp để trống, tự tạo random
    const finalKey = keyCode.trim() || generateRandomKey();
    const finalDuration = parseInt(duration) || 30;

    try {
      const { data, error } = await supabase
        .from('licenses')
        .insert([
          { 
            key_code: finalKey, 
            duration_days: finalDuration, 
            facility_note: note,
            status: 'active'
          }
        ])
        .select();

      if (error) {
        alert("Lỗi tạo mã: " + error.message);
        return;
      }

      if (data && data.length > 0) {
        setSuccessKey(data[0]);
        setKeyCode(''); // clear form
        setNote('');
        fetchLicenses(); // reload table
      }
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi hệ thống.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100 font-mono selection:bg-rose-500 selection:text-white">
      
      <header className="border-b border-zinc-800 p-6 flex justify-between items-center bg-[#111111]">
        <div className="flex items-center gap-4">
           <div className="bg-rose-600 text-white w-12 h-12 flex items-center justify-center font-bold text-xl rounded shadow-[0_0_15px_rgba(225,29,72,0.5)]">
             SA
           </div>
           <div>
              <h1 className="text-2xl font-bold text-white tracking-widest">SUPER BOSS TERMINAL</h1>
              <p className="text-zinc-500 text-sm">Hệ thống sản xuất & Phân phối License Key</p>
           </div>
        </div>
        <Link href="/" className="text-zinc-400 hover:text-white underline decoration-zinc-700 underline-offset-4 text-sm">Thoát Terminal</Link>
      </header>

      <div className="p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Máy Dập Key */}
        <div className="bg-[#111111] border border-zinc-800 p-6 rounded-xl shadow-2xl h-fit">
           <h2 className="text-rose-500 font-bold mb-6 flex items-center gap-2 uppercase tracking-wide border-b border-zinc-800 pb-3">
             <Key size={18}/> Máy Móc Sinh Mã (Generator)
           </h2>
           
           <div className="space-y-5">
             <div>
               <label className="text-xs text-zinc-500 block mb-2 uppercase">Mã KEY do Sếp tự định nghĩa</label>
               <input 
                  type="text" 
                  value={keyCode}
                  onChange={e => setKeyCode(e.target.value.toUpperCase())}
                  className="w-full bg-[#1a1a1a] border border-zinc-700 p-3 rounded text-zinc-300 outline-none focus:border-rose-500 font-bold tracking-widest uppercase" 
                  placeholder="Để trống chấn lưu để AI sinh tự động" 
               />
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="text-xs text-zinc-500 block mb-2 uppercase">Số ngày hạn</label>
                   <input 
                     type="number" 
                     value={duration}
                     onChange={e => setDuration(e.target.value)}
                     className="w-full bg-[#1a1a1a] border border-zinc-700 p-3 rounded text-zinc-300 outline-none focus:border-rose-500" 
                   />
                </div>
                <div>
                   <label className="text-xs text-zinc-500 block mb-2 uppercase">Ghi chú (Tên KS)</label>
                   <input 
                     type="text" 
                     value={note}
                     onChange={e => setNote(e.target.value)}
                     className="w-full bg-[#1a1a1a] border border-zinc-700 p-3 rounded text-zinc-300 outline-none focus:border-rose-500" 
                     placeholder="VD: Thái Hạc" 
                   />
                </div>
             </div>
             
             <button 
               onClick={handleGenerate}
               disabled={loading}
               className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold py-4 rounded uppercase tracking-widest transition shadow-[0_0_20px_rgba(225,29,72,0.3)] disabled:shadow-none mt-4 flex items-center justify-center gap-2"
             >
                {loading ? <Loader2 size={20} className="animate-spin" /> : "SINH KEY MỚI"}
             </button>
             
             {/* Key Sinh Ra */}
             {successKey && (
               <div className="mt-6 pt-6 border-t border-zinc-800 text-center animate-in fade-in zoom-in duration-300">
                  <p className="text-emerald-500 text-xs mb-2 flex items-center justify-center gap-1">
                    <CheckCircle2 size={14}/> Key đã bấm lỗ xong, sẵn sàng xuất kho!
                  </p>
                  <div className="bg-[#1a1a1a] border-2 border-dashed border-emerald-500/50 p-4 rounded cursor-copy hover:bg-emerald-900/20 transition">
                     <h3 className="text-emerald-400 font-bold text-2xl tracking-[0.2em] uppercase">{successKey.key_code}</h3>
                     <p className="text-xs text-emerald-600 font-mono mt-1">🏷 Nhãn: {successKey.facility_note || 'Trống'} | ⏳ Hạn: {successKey.duration_days} ngày</p>
                  </div>
               </div>
             )}
           </div>
        </div>

        {/* Dashboard Quản Lý Khách Hàng (Tổ chức) */}
        <div className="lg:col-span-2 bg-[#111111] border border-zinc-800 p-6 rounded-xl shadow-2xl">
           <div className="flex justify-between items-center border-b border-zinc-800 pb-3 mb-6">
              <h2 className="text-zinc-300 font-bold flex items-center gap-2 uppercase tracking-wide">
                <Database size={18}/> Dữ Liệu Mã Thẻ (Licenses DB)
              </h2>
              <div className="flex items-center gap-3">
                <button onClick={fetchLicenses} className="text-zinc-500 hover:text-white transition">
                  <RefreshCcw size={16} className={fetching ? "animate-spin" : ""} />
                </button>
                <span className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded text-xs animate-pulse">Live</span>
              </div>
           </div>
           
           <div className="overflow-x-auto min-h-[300px]">
             {fetching && licenses.length === 0 ? (
               <div className="w-full h-32 flex items-center justify-center text-zinc-500">
                 Đang trích xuất dữ liệu từ Supabase...
               </div>
             ) : (
               <table className="w-full text-left text-sm">
                 <thead className="text-zinc-600 uppercase bg-[#1a1a1a]">
                   <tr>
                     <th className="p-4 font-normal">Mã Đích (Key)</th>
                     <th className="p-4 font-normal">Tên Vùng Chỉ Định (Ghi chú)</th>
                     <th className="p-4 font-normal">Công Suất Hạn</th>
                     <th className="p-4 font-normal text-right">Trạng thái (Quyền lực)</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-zinc-800/50 text-zinc-400">
                   {licenses.length === 0 ? (
                     <tr>
                       <td colSpan={4} className="p-8 text-center text-zinc-600">
                         Chưa có bất kỳ mã Key nào được tạo trong Database.
                       </td>
                     </tr>
                   ) : (
                     licenses.map((lic, i) => (
                       <tr key={i} className="hover:bg-[#1a1a1a] transition">
                         <td className="p-4 font-bold text-zinc-200 tracking-wider bg-zinc-800/20">{lic.key_code}</td>
                         <td className="p-4">{lic.facility_note || '----'}</td>
                         <td className="p-4">
                           <span className="text-emerald-500 border border-emerald-900 bg-emerald-500/10 px-2 py-1 rounded text-xs">{lic.duration_days} Ngày</span>
                         </td>
                         <td className="p-4 flex gap-2 justify-end">
                            {lic.status === 'active' ? (
                               <span className="bg-emerald-900/50 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-emerald-500/50 flex items-center gap-1">ACTIVE</span>
                            ) : (
                               <span className="bg-rose-900/50 text-rose-400 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-rose-500/50 flex items-center gap-1">USED</span>
                            )}
                         </td>
                       </tr>
                     ))
                   )}
                 </tbody>
               </table>
             )}
           </div>
        </div>

      </div>
    </div>
  );
}
