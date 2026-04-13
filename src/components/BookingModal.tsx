"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { X, Calendar as CalendarIcon, User, MessageSquare, Tag, Loader2 } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function BookingModal({ isOpen, onClose, onSuccess }: BookingModalProps) {
  const [rooms, setRooms] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [guestName, setGuestName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [checkIn, setCheckIn] = useState(() => new Date().toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [source, setSource] = useState("Direct");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (isOpen) fetchRooms();
  }, [isOpen]);

  const fetchRooms = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUser(user);

    const { data } = await supabase
      .from('rooms')
      .select('*')
      .eq('user_id', user.id);
    
    setRooms(data || []);
    if (data && data.length > 0 && !roomId) {
      setRoomId(data[0].id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !roomId || !checkIn || !checkOut || !user) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('bookings').insert([{
        user_id: user.id,
        room_id: roomId,
        guest_name: guestName,
        check_in: checkIn,
        check_out: checkOut,
        booking_source: source,
        notes: notes,
        status: 'reserved'
      }]);

      if (error) throw error;
      
      onSuccess(); // Báo cho component cha reload dữ liệu
      onClose(); // Đóng popup
      
      // Reset form
      setGuestName("");
      setNotes("");
    } catch(err: any) {
      alert("Lỗi đặt phòng: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-coto-dark text-white p-5 pr-12 flex items-center justify-between">
           <h2 className="text-lg font-bold flex items-center gap-2">
             <CalendarIcon size={20} className="text-coto-blue"/> Đặt Phòng Mới
           </h2>
        </div>
        <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-rose-400 bg-white/10 rounded-full p-1 transition">
          <X size={20} />
        </button>

        {/* Body */}
        <div className="p-6 h-fit bg-slate-50">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1 mb-1">
                <User size={12}/> Tên khách hàng / Đoàn
              </label>
              <input 
                type="text" 
                required
                value={guestName}
                onChange={e => setGuestName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 focus:border-coto-blue focus:ring-1 focus:ring-coto-blue outline-none"
                placeholder="VD: Anh Tuấn (Gia đình)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1 mb-1">Chọn Buồng Phòng</label>
                  <select 
                    required
                    value={roomId}
                    onChange={e => setRoomId(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 focus:border-coto-blue outline-none"
                  >
                    {rooms.map(r => (
                      <option key={r.id} value={r.id}>{r.name} - {r.type}</option>
                    ))}
                  </select>
               </div>
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1 mb-1">
                    <Tag size={12}/> Kênh Nguồn
                  </label>
                  <select 
                    value={source}
                    onChange={e => setSource(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 focus:border-coto-blue outline-none"
                  >
                    <option value="Direct">Direct (Trực tiếp)</option>
                    <option value="Booking.com">Booking.com</option>
                    <option value="Agoda">Agoda</option>
                    <option value="Facebook">Facebook</option>
                  </select>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Ngày Check-in</label>
                  <input 
                    type="date"
                    required
                    value={checkIn}
                    onChange={e => setCheckIn(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 focus:border-coto-blue outline-none"
                  />
               </div>
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Ngày Check-out</label>
                  <input 
                    type="date" 
                    required
                    value={checkOut}
                    onChange={e => setCheckOut(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 focus:border-coto-blue outline-none"
                  />
               </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1 mb-1">
                <MessageSquare size={12}/> Ghi chú thêm
              </label>
              <textarea 
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 focus:border-coto-blue outline-none min-h-[80px]"
                placeholder="Khách yêu cầu ăn sáng, đón cảng..."
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-coto-blue hover:bg-coto-blue/90 text-white font-bold py-3.5 rounded-lg shadow-md transition mt-6 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Xác Nhận & Cập Nhật Lưới'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
