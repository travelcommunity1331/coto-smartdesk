"use client";
import React, { useState } from 'react';
import { supabase } from "@/lib/supabase";
import { X, User, Printer, Trash2, Edit3, MoreHorizontal } from 'lucide-react';

export function RoomDetailModal({ isOpen, onClose, onSuccess, booking, room }: any) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !booking || !room) return null;

  const handleCheckout = async () => {
    if (!confirm(`Xác nhận Trả phòng cho khách: ${booking.guest_name}?`)) return;
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'checked_out' })
        .eq('id', booking.id);

      if (error) throw error;
      onSuccess();
      onClose();
    } catch (err: any) {
      alert("Lỗi trả phòng: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatVND = (num: number) => new Intl.NumberFormat('vi-VN').format(num);

  // Tính số giờ đã ở
  const checkInDate = new Date(booking.check_in).getTime();
  const now = new Date().getTime();
  const diffHours = Math.max(1, Math.floor((now - checkInDate) / 3600000));
  const diffMins = Math.floor(((now - checkInDate) % 3600000) / 60000) || 0;

  return (
    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[100] backdrop-blur-[2px]">
      <div className="bg-white rounded-lg shadow-xl w-[700px] max-w-full overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-white border-b px-5 py-4 flex justify-between items-center">
           <h2 className="text-lg font-bold text-slate-800">Chi tiết {room.name}</h2>
           <div className="flex gap-2 text-slate-400">
             <button aria-label="Khác" className="hover:bg-slate-100 p-1.5 rounded"><MoreHorizontal size={18}/></button>
             <button aria-label="Thùng rác" className="hover:bg-slate-100 p-1.5 rounded"><Trash2 size={18}/></button>
             <button onClick={onClose} aria-label="Đóng" className="hover:bg-slate-100 p-1.5 rounded"><X size={18}/></button>
           </div>
        </div>

        {/* Content */}
        <div className="p-6">
           <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                 <span className="font-bold text-slate-800">{room.type}</span>
                 <span className="bg-[#eaf5f5] text-[#1b8655] px-2 py-0.5 rounded text-xs font-bold border border-[#a2e1c9]">Đang sử dụng $</span>
              </div>
              <div className="text-sm font-semibold flex items-center gap-1 text-slate-600">
                 <User size={14}/> Khách đến trực tiếp
              </div>
           </div>

           {/* Info grid */}
           <div className="grid grid-cols-3 gap-6 text-sm border-b pb-6">
              <div>
                 <span className="text-slate-400 text-xs block mb-1">Khách hàng</span>
                 <span className="font-bold text-slate-800">{booking.guest_name}</span>
              </div>
              <div>
                 <span className="text-slate-400 text-xs block mb-1">Khách lưu trú</span>
                 <span className="font-semibold text-slate-800">1 người lớn, 0 trẻ em</span>
              </div>
              <div>
                 <span className="text-slate-400 text-xs block mb-1">Mã đặt phòng</span>
                 <span className="font-bold text-slate-800">#{booking.id.split('-')[0].toUpperCase()}</span>
              </div>

              <div>
                 <span className="text-slate-400 text-xs block mb-1">Nhận phòng</span>
                 <span className="font-semibold text-slate-800">{new Date(booking.check_in).toLocaleDateString("vi-VN")}</span>
              </div>
              <div>
                 <span className="text-slate-400 text-xs block mb-1">Trả phòng</span>
                 <span className="font-semibold text-slate-800">{new Date(booking.check_out).toLocaleDateString("vi-VN")}</span>
              </div>
              <div>
                 <span className="text-slate-400 text-xs block mb-1">Thời gian lưu trú</span>
                 <div className="flex items-center gap-1">
                    <span className="font-semibold text-slate-800">1 ngày</span>
                    <span className="bg-slate-100 text-slate-500 text-[10px] px-1.5 py-0.5 rounded border">Đã sử dụng: {diffHours} giờ {diffMins} phút</span>
                 </div>
              </div>
           </div>

           <div className="py-4 text-sm text-slate-400 flex items-center gap-2 border-b">
              <Edit3 size={14} /> Chưa có ghi chú
           </div>

           {/* Billing summary */}
           <div className="py-4">
              <div className="flex justify-end gap-24 mb-2 text-sm text-slate-600">
                 <span>Tiền phòng / {room.name}</span>
                 <span className="font-bold text-slate-800">{formatVND(room.price_per_night)}</span>
              </div>
              <div className="flex justify-end gap-24 mb-2 text-sm text-slate-600">
                 <span>Khách đã trả</span>
                 <span className="font-bold text-slate-800">0</span>
              </div>
           </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 flex justify-end gap-3 items-center mt-auto">
           <button className="border border-[#1b8655] text-[#1b8655] px-6 py-2 rounded font-bold hover:bg-[#ebf8f2] transition">
             Sửa đặt phòng
           </button>
           <button 
             onClick={handleCheckout}
             disabled={isLoading}
             className="bg-[#1b8655] hover:bg-[#156e45] text-white px-6 py-2 rounded font-bold shadow-sm"
            >
             Trả phòng
           </button>
        </div>

      </div>
    </div>
  );
}
