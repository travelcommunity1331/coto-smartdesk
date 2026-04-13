import React from 'react';
import { KeyRound, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';

export default function KichHoatPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        
        {/* Banner */}
        <div className="bg-[#0284c7] p-8 text-center text-white relative">
          <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm border border-white/30">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Kích Hoạt Tài Khoản</h1>
          <p className="text-blue-100 mt-2 text-sm">Chào mừng đến với hệ thống Coto SmartDesk</p>
        </div>

        {/* Cổng nhập Key */}
        <div className="p-8">
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 mb-2">Mã Bản Quyền (License Key)</label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-4 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Ví dụ: COTO-ABCD-1234" 
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 text-lg uppercase tracking-widest font-mono focus:border-[#0284c7] focus:ring-0 outline-none transition transition-shadow"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">Vui lòng liên hệ nhà phân phối để mua Mã Kích Hoạt.</p>
          </div>

          <button className="w-full bg-[#0284c7] hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-md flex justify-center items-center gap-2 transition-transform active:scale-95">
             <Zap size={20} /> XÁC THỰC VÀ ĐĂNG NHẬP
          </button>
          
          <div className="mt-8 text-center text-xs text-slate-400">
            Powered by &copy; Coto SmartDesk 2026.
            <br />
            <Link href="/" className="text-[#0284c7] hover:underline mt-2 inline-block">Quay lại Demo Trang Chủ</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
