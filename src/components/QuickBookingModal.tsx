"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { X, Search, Calendar, User, Clock, CheckCircle } from 'lucide-react';

export function QuickBookingModal({ isOpen, onClose, onSuccess, preselectedRoom }: any) {
  const [formData, setFormData] = useState({
    guest_name: "",
    check_in: new Date().toISOString().split('T')[0],
    check_out: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    room_id: preselectedRoom?.id || "",
    notes: ""
  });
  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (preselectedRoom) setFormData(prev => ({ ...prev, room_id: preselectedRoom.id }));
      fetchRooms();
    }
  }, [isOpen, preselectedRoom]);

  const fetchRooms = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('rooms').select('*').eq('user_id', user.id);
    setRooms(data || []);
  };

  const selectedRoomDetails = rooms.find(r => r.id === formData.room_id);

  const handleSubmit = async (e: any, status: string = 'checked_in') => {
    e.preventDefault();
    if (!formData.guest_name || !formData.room_id) return alert("Vui lòng nhập tên khách và chọn phòng.");
    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Chưa đăng nhập");

      // Insert logic
      const { error } = await supabase.from('bookings').insert({
        user_id: user.id,
        room_id: formData.room_id,
        guest_name: formData.guest_name,
        check_in: formData.check_in,
        check_out: formData.check_out,
        status: status, // 'checked_in' or 'reserved'
        booking_source: 'Lễ Tân',
        notes: formData.notes
      });
      if (error) throw error;
      
      onSuccess();
      onClose();
    } catch (err: any) {
      alert("Lỗi đặt phòng: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[100] backdrop-blur-[2px]">
      <div className="bg-white rounded-lg shadow-xl w-[900px] max-w-full overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-white border-b px-5 py-3 flex justify-between items-center">
           <h2 className="text-lg font-bold text-slate-800">Đặt/Nhận phòng nhanh</h2>
           <button onClick={onClose} className="text-slate-400 hover:bg-slate-100 p-1 rounded-full"><X size={20}/></button>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 overflow-y-auto">
           {/* Top Row: Khách hàng + Khách */}
           <div className="flex gap-4 mb-4">
              <div className="flex-1 relative">
                 <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                 <input 
                   autoFocus
                   type="text" 
                   placeholder="Nhập tên khách hàng lập phiếu (Vd: Anh Khoa)" 
                   className="w-full border border-slate-300 rounded focus:border-[#0070f4] py-2 pl-9 pr-3 text-sm outline-none"
                   value={formData.guest_name}
                   onChange={e => setFormData({...formData, guest_name: e.target.value})}
                 />
              </div>
              <div className="w-1/3 flex border border-slate-300 rounded overflow-hidden">
                 <div className="flex-1 flex items-center justify-center border-r font-medium text-sm gap-1 bg-slate-50"><User size={14}/> 1 <span className="text-slate-400">👤</span></div>
                 <div className="flex-1 flex items-center justify-center border-r font-medium text-sm gap-1 bg-slate-50">0 <span className="text-slate-400">👶</span></div>
              </div>
           </div>

           {/* Table Chọn Phòng */}
           <div className="bg-[#eaf5f5] p-2 rounded-t font-semibold text-xs text-[#1b8655] grid grid-cols-[1.5fr_1.5fr_1fr_2.5fr_2.5fr_1fr_1.5fr] gap-2 items-center">
              <div>Hạng phòng</div>
              <div>Phòng</div>
              <div>Hình thức</div>
              <div>Nhận (Hiện tại)</div>
              <div>Trả phòng</div>
              <div>Dự kiến</div>
              <div className="text-right">Thành tiền ⓘ</div>
           </div>
           
           <div className="border border-t-0 p-3 flex flex-col gap-3 rounded-b border-[#eaf5f5]">
              <div className="grid grid-cols-[1.5fr_1.5fr_1fr_2.5fr_2.5fr_1fr_1.5fr] gap-2 items-center text-sm">
                 <div className="font-semibold">{selectedRoomDetails?.type || '...'}</div>
                 <div>
                    <select 
                      value={formData.room_id} 
                      onChange={e => setFormData({...formData, room_id: e.target.value})}
                      className="border rounded px-2 py-1.5 w-full outline-none"
                    >
                       <option value="">Chọn phòng...</option>
                       {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                 </div>
                 <div><select className="border rounded px-2 py-1.5 w-full"><option>Ngày</option></select></div>
                 <div className="flex items-center gap-1 border border-slate-200 rounded px-2 py-1">
                    <input type="date" value={formData.check_in} onChange={e=>setFormData({...formData, check_in: e.target.value})} className="outline-none w-full text-xs" />
                 </div>
                 <div className="flex items-center gap-1 border border-slate-200 rounded px-2 py-1">
                    <input type="date" value={formData.check_out} onChange={e=>setFormData({...formData, check_out: e.target.value})} className="outline-none w-full text-xs" />
                 </div>
                 <div className="text-center font-medium">1 ngày</div>
                 <div className="text-right font-bold">{selectedRoomDetails ? new Intl.NumberFormat('vi-VN').format(selectedRoomDetails.price_per_night) : 0}</div>
              </div>
              <div className="flex text-[#0070f4] font-medium text-sm gap-4 mt-2">
                 <button className="flex items-center gap-1"><span className="text-lg">+</span> Chọn thêm phòng</button>
                 <button className="flex items-center gap-1"><span className="text-lg">+</span> Sản phẩm, dịch vụ</button>
              </div>
           </div>

           {/* Footer Summary */}
           <div className="mt-4 flex justify-between items-start">
             <div className="w-1/2">
                <input 
                  type="text" 
                  placeholder="Ghi chú   Nhập ghi chú..." 
                  className="w-full border-b border-slate-300 py-1 text-sm outline-none focus:border-[#0070f4]"
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                />
             </div>
             
             <div className="w-1/3 text-sm">
                <div className="flex justify-between py-1 font-bold">
                   <span>Khách cần trả</span>
                   <span className="text-[#1b8655]">{selectedRoomDetails ? new Intl.NumberFormat('vi-VN').format(selectedRoomDetails.price_per_night) : 0}</span>
                </div>
                <div className="flex justify-between py-1 font-bold mt-2">
                   <div>Khách thanh toán <br/><span className="text-slate-400 font-normal text-xs flex items-center gap-1 mt-1">Tiền mặt <span className="text-[10px]">▼</span></span></div>
                   <input type="text" className="w-24 border-b text-right font-bold outline-none" placeholder="0" />
                </div>
             </div>
           </div>
        </div>

        {/* Buttons */}
        <div className="bg-slate-50 border-t p-4 flex justify-end gap-3 items-center">
           <button className="text-sm font-semibold text-slate-500 hover:text-slate-800 mr-2">Thêm tùy chọn</button>
           <button 
             onClick={(e) => handleSubmit(e, 'checked_in')}
             disabled={isLoading}
             className="bg-[#1b8655] hover:bg-[#156e45] text-white px-6 py-2 rounded font-bold shadow-sm"
            >
             Nhận phòng
           </button>
           <button 
             onClick={(e) => handleSubmit(e, 'reserved')}
             disabled={isLoading}
             className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-bold shadow-sm"
            >
             Đặt trước
           </button>
        </div>

      </div>
    </div>
  );
}
