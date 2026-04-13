"use client";
import React, { useState, useEffect } from 'react';
import { Database, Plus, RefreshCcw, Slash, Tag, Key, Loader2, CheckCircle2, Users, Phone, Mail, Building, Lock } from 'lucide-react';
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

  const [profiles, setProfiles] = useState<any[]>([]);
  const [fetchingProfiles, setFetchingProfiles] = useState(true);

  // Security Gate
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [pinError, setPinError] = useState(false);

  // Fetch data when component mounts
  useEffect(() => {
    // Check if previously unlocked
    const savedPin = sessionStorage.getItem('boss_pin');
    if (savedPin === '131331') {
      setIsUnlocked(true);
      fetchLicenses();
      fetchProfiles();
    }
  }, []);

  const handleUnlock = () => {
    if (passcode === '131331') {
      sessionStorage.setItem('boss_pin', passcode);
      setIsUnlocked(true);
      setPinError(false);
      fetchLicenses();
      fetchProfiles();
    } else {
      setPinError(true);
      setPasscode('');
    }
  };

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

  const fetchProfiles = async () => {
    setFetchingProfiles(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching profiles:", error);
        return;
      }
      if (data) setProfiles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingProfiles(false);
    }
  };

  const handleExtend = async (id: string, currentDays: number) => {
    try {
      const { error } = await supabase
        .from('licenses')
        .update({ duration_days: currentDays + 30 })
        .eq('id', id);
      if (error) throw error;
      fetchLicenses();
    } catch (err) {
      alert("Lỗi nạp thêm ngày!");
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm("Giết chết mã Key này? Khách hàng sẽ bị khóa màn hình ngay lập tức!")) return;
    try {
      const { error } = await supabase
        .from('licenses')
        .update({ status: 'revoked' })
        .eq('id', id);
      if (error) throw error;
      fetchLicenses();
    } catch (err) {
      alert("Lỗi cắt ngưng!");
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

  // Hàm chuyển đổi ngày tháng cho đẹp
  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(d);
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 selection:bg-rose-500">
        <div className="bg-[#111111] border border-rose-500/20 p-8 rounded-2xl shadow-[0_0_50px_rgba(225,29,72,0.1)] text-center max-w-sm w-full relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-[50px] pointer-events-none"></div>
           
           <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 border border-rose-500/20">
             <Lock size={28} className="text-rose-500" />
           </div>
           
           <h2 className="text-xl font-bold text-white mb-2 tracking-widest uppercase relative z-10">Cổng An Ninh</h2>
           <p className="text-zinc-500 text-xs mb-8 uppercase tracking-wider relative z-10">Chỉ dành cho Super Boss</p>
           
           <div className="relative z-10">
             <input 
               type="password" 
               value={passcode}
               onChange={e => {
                 setPasscode(e.target.value);
                 if (pinError) setPinError(false);
               }}
               onKeyDown={e => {
                  if (e.key === 'Enter') handleUnlock();
               }}
               className={`w-full bg-[#1a1a1a] p-4 rounded-xl text-center text-rose-500 tracking-[0.5em] font-bold text-xl outline-none focus:ring-2 focus:ring-rose-500/50 transition mb-4 border ${pinError ? 'border-rose-500 animate-shake' : 'border-zinc-800'}`}
               placeholder="••••••"
               autoFocus
             />
             
             {pinError && <p className="text-rose-500 text-xs mb-4">Mật mã không đúng. Sự xâm nhập đã bị ghi lại!</p>}
             
             <button 
               onClick={handleUnlock}
               className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-xl uppercase tracking-widest transition shadow-[0_0_15px_rgba(225,29,72,0.3)]"
             >
               MỞ KHÓA VAULT
             </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100 font-mono selection:bg-rose-500 selection:text-white pb-12">
      
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
                   <select
                 value={duration}
                 onChange={e => setDuration(e.target.value)}
                 className="w-full bg-[#1a1a1a] border border-zinc-700 p-3 rounded text-white focus:border-red-500 transition outline-none"
               >
                 <option value={7}>Dùng thử (7 Ngày)</option>
                 <option value={30}>1 Tháng (30 Ngày)</option>
                 <option value={90}>3 Tháng (90 Ngày)</option>
                 <option value={365}>1 Năm (365 Ngày)</option>
                 <option value={36500}>Vĩnh Viễn (Trọn Đời)</option>
               </select>
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

        {/* Dashboard Quản Lý Khởi Tạo */}
        <div className="lg:col-span-2 bg-[#111111] border border-zinc-800 p-6 rounded-xl shadow-2xl h-fit">
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
           
           <div className="overflow-x-auto">
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
                     <th className="p-4 font-normal text-right">Trạng thái</th>
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
                           <span className="text-emerald-500 border border-emerald-900 bg-emerald-500/10 px-2 py-1 rounded text-xs">
                             {lic.duration_days === 36500 ? 'VĨNH VIỄN' : `${lic.duration_days} Ngày`}
                           </span>
                         </td>
                         <td className="p-4 flex flex-col items-end gap-1">
                            {lic.status === 'active' && <span className="bg-emerald-900/50 text-emerald-400 px-3 py-0.5 rounded-full text-xs font-bold ring-1 ring-emerald-500/50 block w-fit">ACTIVE</span>}
                            {lic.status === 'used' && <span className="bg-blue-900/50 text-blue-400 px-3 py-0.5 rounded-full text-xs font-bold ring-1 ring-blue-500/50 block w-fit">USED</span>}
                            {lic.status === 'revoked' && <span className="bg-rose-900/50 text-rose-400 px-3 py-0.5 rounded-full text-xs font-bold ring-1 ring-rose-500/50 block w-fit">REVOKED (CẮT)</span>}

                            <div className="flex gap-1 mt-1">
                               <button onClick={() => handleExtend(lic.id, lic.duration_days)} className="bg-zinc-800 hover:bg-emerald-900 border border-zinc-700 text-zinc-300 px-2 py-1 rounded text-xs transition">
                                 +30 Ngày
                               </button>
                               {lic.status !== 'revoked' && (
                                 <button onClick={() => handleRevoke(lic.id)} className="bg-zinc-800 hover:bg-rose-900 border border-zinc-700 text-zinc-300 px-2 py-1 rounded text-xs transition">
                                   Cắt
                                 </button>
                               )}
                            </div>
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

      {/* CRM Bảng Hồ Sơ Khách Hàng Tân Binh */}
      <div className="p-8 max-w-7xl mx-auto pt-0 mt-4">
         <div className="bg-[#111111] border border-coto-blue/30 p-6 rounded-xl shadow-[0_0_50px_rgba(30,58,138,0.1)] relative overflow-hidden">
           
           <div className="absolute top-0 right-0 w-64 h-64 bg-coto-blue/5 rounded-full blur-[80px] pointer-events-none"></div>

           <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-800 pb-4 mb-6 relative z-10">
              <div>
                <h2 className="text-coto-blue font-bold flex items-center gap-2 uppercase tracking-wide text-lg">
                  <Users size={20}/> Phân Tích Cơ Sở Khách Hàng Tiềm Năng (Leads)
                </h2>
                <p className="text-zinc-500 text-sm mt-1">Thông tin chiết xuất trực tiếp từ hành vi Đăng Ký của khách hàng, cập nhật realtime.</p>
              </div>
              <div className="flex items-center gap-3 mt-4 md:mt-0">
                <button onClick={fetchProfiles} className="bg-coto-blue/10 text-coto-blue px-3 py-2 rounded font-bold hover:bg-coto-blue hover:text-white transition flex items-center gap-2 text-xs uppercase tracking-wider">
                  <RefreshCcw size={14} className={fetchingProfiles ? "animate-spin" : ""} /> Dò tìm mới
                </button>
              </div>
           </div>

           <div className="overflow-x-auto relative z-10">
              {fetchingProfiles && profiles.length === 0 ? (
                 <div className="w-full h-32 flex flex-col items-center justify-center text-coto-blue/60 gap-3">
                   <Loader2 size={30} className="animate-spin" />
                   Đang hack vào buồng chứa auth.users...
                 </div>
              ) : (
                 <table className="w-full text-left text-sm">
                   <thead className="text-slate-400 uppercase bg-[#1a1c23]">
                     <tr>
                       <th className="p-4 font-normal rounded-tl-lg">Thời Gian ĐK</th>
                       <th className="p-4 font-normal">Cơ Sở Lưu Trú</th>
                       <th className="p-4 font-normal">Thông Tin LH (Chủ CS)</th>
                       <th className="p-4 font-normal text-right rounded-tr-lg">Trạng thái chốt Sale</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
                     {profiles.length === 0 ? (
                       <tr>
                         <td colSpan={4} className="p-12 text-center text-zinc-500 border border-dashed border-zinc-800 mt-4 rounded-lg bg-[#1a1a1a]">
                           {fetchingProfiles ? "Xin chờ..." : "Radar chưa quét được bóng chim nào. Bảng dữ liệu hiện đang trống!"}
                         </td>
                       </tr>
                     ) : (
                       profiles.map((pf, i) => (
                         <tr key={i} className="hover:bg-[#151a25] transition group">
                           <td className="p-4 align-top">
                             <div className="text-xs text-zinc-500">{formatDate(pf.created_at)}</div>
                           </td>
                           <td className="p-4 align-top">
                             <div className="font-bold text-white flex items-center gap-2 mb-1">
                               <Building size={14} className="text-coto-blue"/> {pf.facility_name || 'Chưa cập nhật'}
                             </div>
                             <div className="text-xs text-zinc-500">Tên ĐN: <span className="text-zinc-300 font-mono">{pf.username || 'N/A'}</span></div>
                           </td>
                           <td className="p-4 align-top">
                             <div className="font-bold text-zinc-200 mb-1">{pf.full_name || 'Khách Vô Danh'}</div>
                             <div className="flex flex-col gap-1 text-xs text-zinc-400">
                               <div className="flex items-center gap-1.5 hover:text-white"><Phone size={12}/> {pf.phone || 'Chưa cung cấp'}</div>
                               <div className="flex items-center gap-1.5 hover:text-white"><Mail size={12}/> {pf.email || 'N/A'}</div>
                             </div>
                           </td>
                           <td className="p-4 align-top flex flex-col items-end gap-2">
                             <span className="bg-amber-900/30 text-amber-500 border border-amber-500/20 px-3 py-1 rounded text-xs">Chưa Mua Key</span>
                             <button className="text-xs underline text-zinc-500 hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition">Đánh dấu đã chốt &rarr;</button>
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
