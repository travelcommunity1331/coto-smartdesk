import React from 'react';
import { TrendingUp, CreditCard, Banknote, CalendarCheck, FileOutput, ArrowUpRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function OwnerReportDashboard() {
  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 pb-20 md:pb-0">
      
      {/* Header Dành Riêng Cho Chủ Nhà */}
      <header className="bg-slate-900 text-white p-5 sticky top-0 z-20 shadow-md">
         <div className="flex items-center justify-between mb-4">
            <Link href="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition">
              <ChevronLeft size={20}/> Về sảnh chính
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center font-bold text-sm">BOSS</div>
              <span className="font-medium">Chủ Đầu Tư</span>
            </div>
         </div>
         <h1 className="text-2xl md:text-3xl font-bold">Báo Cáo Dòng Tiền</h1>
         <p className="text-slate-400 text-sm mt-1">Cập nhật lúc: 14:05 Hôm nay (Dữ liệu thời gian thực)</p>
      </header>

      {/* Tổng Doanh Thu Siêu Cấp */}
      <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto">
         
         <div className="bg-gradient-to-r from-coto-blue to-blue-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-20">
               <TrendingUp size={100} />
            </div>
            <p className="text-blue-100 font-medium mb-1">Tổng Doanh Thu (Tháng 4)</p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">124.500.000 đ</h2>
            
            <div className="flex items-center gap-2 bg-white/20 inline-flex px-3 py-1 rounded-full text-sm font-medium">
               <ArrowUpRight size={16} /> Tăng 15% so với tháng trước
            </div>
         </div>

         {/* Lõi bóc tách dòng tiền */}
         <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32">
               <div className="flex justify-between items-start">
                  <p className="text-sm font-medium text-slate-500">Tiền Phòng</p>
                  <CalendarCheck size={20} className="text-coto-blue" />
               </div>
               <h3 className="text-2xl font-bold text-slate-800">98.000.000 đ</h3>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32">
               <div className="flex justify-between items-start">
                  <p className="text-sm font-medium text-slate-500">Phụ Thu (Mì, Xe)</p>
                  <FileOutput size={20} className="text-amber-500" />
               </div>
               <h3 className="text-2xl font-bold text-slate-800">26.500.000 đ</h3>
            </div>
         </div>

         {/* Tiền mặt vs Chuyển khoản (Đóng ca Kế toán) */}
         <h3 className="text-lg font-bold text-slate-800 mt-8 mb-2">Đối soát két thu ngân (Ngày hôm nay)</h3>
         <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex border-b border-slate-100 p-4 items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg"><CreditCard size={20}/></div>
                  <div>
                     <p className="font-bold">Chuyển khoản (Mã QR)</p>
                     <p className="text-xs text-slate-500">Lễ tân: Tường Vy</p>
                  </div>
               </div>
               <span className="font-bold text-lg text-emerald-600">+ 3.200.000 đ</span>
            </div>
            
            <div className="flex p-4 items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="bg-rose-100 text-rose-600 p-2 rounded-lg"><Banknote size={20}/></div>
                  <div>
                     <p className="font-bold">Thu Tiền Mặt</p>
                     <p className="text-xs text-slate-500">Lễ tân: Tường Vy</p>
                  </div>
               </div>
               <span className="font-bold text-lg text-rose-600">+ 450.000 đ</span>
            </div>
         </div>
         
         <div className="mt-8 text-center bg-slate-100 border border-slate-200 rounded-lg p-6">
            <p className="text-slate-500">Hệ thống đang tích hợp đồng bộ số dư với <strong>Kênh OTA (Agoda)</strong>...</p>
         </div>

      </div>
    </div>
  );
}
