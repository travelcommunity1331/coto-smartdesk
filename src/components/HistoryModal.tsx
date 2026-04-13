"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { X, History, Loader2, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HistoryModal({ isOpen, onClose }: HistoryModalProps) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) fetchHistory();
  }, [isOpen]);

  const fetchHistory = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch Bookings with limit 50
    const { data } = await supabase
      .from('bookings')
      .select('*, rooms(name)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);
    
    setHistory(data || []);
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'checked_in': return <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded bg-emerald-100 text-emerald-700 uppercase"><CheckCircle size={10}/> Đang ở</span>;
      case 'reserved': return <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded bg-coto-blue/10 text-coto-blue uppercase"><Clock size={10}/> Đã Đặt</span>;
      case 'cancelled': return <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded bg-rose-100 text-rose-700 uppercase"><XCircle size={10}/> Đã Hủy</span>;
      case 'checked_out': return <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded bg-slate-100 text-slate-500 uppercase"><FileText size={10}/> Đã Check-out</span>;
      default: return status;
    }
  };

  const formatDateTime = (isoString: string) => {
     const d = new Date(isoString);
     return d.toLocaleDateString('vi-VN') + " " + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const updateBookingStatus = async (id: string, newStatus: string) => {
    try {
      await supabase.from('bookings').update({ status: newStatus }).eq('id', id);
      fetchHistory(); // reload history
    } catch(err) {
      console.error(err);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-coto-dark text-white p-5 pr-12 flex items-center justify-between shrink-0">
           <h2 className="text-lg font-bold flex items-center gap-2">
             <History size={20} className="text-coto-blue"/> Nhật Ký Giao Dịch & Báo Cáo
           </h2>
        </div>
        <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-rose-400 bg-white/10 rounded-full p-1 transition">
          <X size={20} />
        </button>

        {/* Body */}
        <div className="p-0 overflow-y-auto flex-1 bg-slate-50">
          
          <div className="p-4 md:p-6 bg-white border-b border-slate-200">
             <h3 className="font-bold text-slate-800 text-sm uppercase mb-1">Giao dịch Đặt phòng gần đây</h3>
             <p className="text-xs text-slate-500 mb-4">Các booking cuối cùng được lưu vào hệ thống sẽ hiển thị tại đây.</p>
             
             {loading ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin text-coto-blue" /></div>
             ) : history.length === 0 ? (
                <div className="text-center p-8 text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">Chưa có giao dịch nào được ghi nhận.</div>
             ) : (
                <div className="overflow-x-auto w-full border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-sm border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                        <th className="p-3 py-4 font-bold">Ngày Tạo</th>
                        <th className="p-3 py-4 font-bold">Tên khách</th>
                        <th className="p-3 py-4 font-bold">Buồng/Phòng</th>
                        <th className="p-3 py-4 font-bold">Trạng thái</th>
                        <th className="p-3 py-4 font-bold text-center">Tác vụ Quản lý</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {history.map((item) => (
                         <tr key={item.id} className="hover:bg-slate-50 transition">
                           <td className="p-3 text-xs text-slate-500">{formatDateTime(item.created_at)}</td>
                           <td className="p-3 font-semibold">{item.guest_name}
                             <div className="text-[10px] text-slate-400 font-normal mt-0.5">Từ: {item.booking_source}</div>
                           </td>
                           <td className="p-3 text-coto-blue font-bold">
                             {(item.rooms as any)?.name}
                             <div className="text-[10px] text-slate-400 font-normal mt-0.5">{item.check_in} đến {item.check_out}</div>
                           </td>
                           <td className="p-3">
                             {getStatusBadge(item.status)}
                           </td>
                           <td className="p-3 text-center">
                              {/* Cập nhật các trạng thái thủ công */}
                              <select 
                                value={item.status}
                                onChange={(e) => updateBookingStatus(item.id, e.target.value)}
                                className="bg-white border border-slate-200 rounded px-2 py-1 text-xs outline-none focus:border-coto-blue"
                              >
                                 <option value="reserved">Chờ Nhận</option>
                                 <option value="checked_in">Đã Check-in</option>
                                 <option value="checked_out">Đã Trả Phòng</option>
                                 <option value="cancelled">Hủy</option>
                              </select>
                           </td>
                         </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             )}
          </div>

        </div>

      </div>
    </div>
  );
}
