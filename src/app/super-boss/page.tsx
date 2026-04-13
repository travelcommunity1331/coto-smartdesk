import React from 'react';
import { Database, Plus, RefreshCcw, Slash, Tag, Key } from 'lucide-react';
import Link from 'next/link';

export default function SuperAdminPage() {
  const tenants = [
    { name: 'Homestay Hoàng Hôn', domain: 'hoanghon.cotosmartdesk.vn', expire: '345 ngày', status: 'active' },
    { name: 'Khách sạn Thái Hạc', domain: 'thaihac.cotosmartdesk.vn', expire: '0 ngày (Hết hạn)', status: 'expired' },
    { name: 'Villa Biển Nhớ', domain: 'biennho.cotosmartdesk.vn', expire: '15 ngày', status: 'active' },
  ];

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
        <div className="bg-[#111111] border border-zinc-800 p-6 rounded-xl shadow-2xl">
           <h2 className="text-rose-500 font-bold mb-6 flex items-center gap-2 uppercase tracking-wide border-b border-zinc-800 pb-3">
             <Key size={18}/> Máy Móc Sinh Mã (Generator)
           </h2>
           
           <div className="space-y-5">
             <div>
               <label className="text-xs text-zinc-500 block mb-2 uppercase">Mã KEY do Sếp tự định nghĩa</label>
               <input type="text" className="w-full bg-[#1a1a1a] border border-zinc-700 p-3 rounded text-zinc-300 outline-none focus:border-rose-500 font-bold tracking-widest uppercase" placeholder="VD: HHON-VIP-2026 (Để trống nếu muốn AI sinh tự động)" />
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="text-xs text-zinc-500 block mb-2 uppercase">Số ngày sử dụng</label>
                   <input type="number" className="w-full bg-[#1a1a1a] border border-zinc-700 p-3 rounded text-zinc-300 outline-none focus:border-rose-500" placeholder="VD: 45, 365" defaultValue="30" />
                </div>
                <div>
                   <label className="text-xs text-zinc-500 block mb-2 uppercase">Tên Khách Sạn (Ghi chú)</label>
                   <input type="text" className="w-full bg-[#1a1a1a] border border-zinc-700 p-3 rounded text-zinc-300 outline-none focus:border-rose-500" placeholder="VD: Cấp cho Thái Hạc" />
                </div>
             </div>
             
             <button className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded uppercase tracking-widest transition shadow-[0_0_20px_rgba(225,29,72,0.3)] mt-4">
                SINH KEY MỚI
             </button>
             
             {/* Key Sinh Ra */}
             <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
                <p className="text-zinc-500 text-xs mb-2">Key đã sẵn sàng để gửi khách</p>
                <div className="bg-[#1a1a1a] border-2 border-dashed border-emerald-500/50 p-4 rounded cursor-copy hover:bg-emerald-900/20 transition">
                   <h3 className="text-emerald-400 font-bold text-2xl tracking-[0.2em] uppercase">HHON-VIP-2026</h3>
                   <p className="text-xs text-emerald-600 font-mono mt-1">🏷 Nhãn: Cấp cho Thái Hạc | ⏳ Hạn: 365 ngày</p>
                </div>
             </div>
           </div>
        </div>

        {/* Dashboard Quản Lý Khách Hàng (Tổ chức) */}
        <div className="lg:col-span-2 bg-[#111111] border border-zinc-800 p-6 rounded-xl shadow-2xl">
           <div className="flex justify-between items-center border-b border-zinc-800 pb-3 mb-6">
              <h2 className="text-zinc-300 font-bold flex items-center gap-2 uppercase tracking-wide">
                <Database size={18}/> Các Đơn Vị Đang Sử Dụng Server
              </h2>
              <span className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded text-xs">Tổng: 3 Khách sạn</span>
           </div>
           
           <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
               <thead className="text-zinc-600 uppercase bg-[#1a1a1a]">
                 <tr>
                   <th className="p-4 font-normal">Tên Homestay/Khách sạn</th>
                   <th className="p-4 font-normal">Tên Miền (Domain)</th>
                   <th className="p-4 font-normal">Thời Hạn Nhượng Quyền</th>
                   <th className="p-4 font-normal text-right">Quyền Lực Sếp</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-zinc-800/50 text-zinc-400">
                 {tenants.map((t, i) => (
                   <tr key={i} className="hover:bg-[#1a1a1a] transition">
                     <td className="p-4">
                        <div className="font-bold text-zinc-200">{t.name}</div>
                     </td>
                     <td className="p-4">{t.domain}</td>
                     <td className="p-4">
                        {t.status === 'active' ? (
                          <span className="text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">Còn {t.expire}</span>
                        ) : (
                          <span className="text-rose-500 bg-rose-500/10 px-2 py-1 rounded animate-pulse">{t.expire}</span>
                        )}
                     </td>
                     <td className="p-4 flex gap-2 justify-end">
                        <button className="bg-zinc-800 hover:bg-emerald-900 border border-zinc-700 text-zinc-300 px-3 py-1.5 rounded flex items-center gap-2 transition" title="Cho thêm 30 ngày không cần mua key mới">
                          <Plus size={14}/> 30 Ngày
                        </button>
                        <button className="bg-zinc-800 hover:bg-rose-900 border border-zinc-700 text-zinc-300 px-3 py-1.5 rounded flex items-center gap-2 transition" title="Cắt điện phần mềm">
                          <Slash size={14}/> Cắt Ngưng
                        </button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>

      </div>
    </div>
  );
}
