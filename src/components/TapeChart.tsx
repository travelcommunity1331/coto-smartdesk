"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { Loader2, Plus, Calendar as CalendarIcon } from 'lucide-react';

export function TapeChart() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Sinh ra 7 ngày tới
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Đặt giờ về 0 để so khớp ngày
  const dateDates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return d;
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUser(user);

      // Lấy danh sách phòng
      const { data: roomsData } = await supabase
        .from('rooms')
        .select('*')
        .eq('user_id', user.id)
        .order('name');
      
      setRooms(roomsData || []);

      // Lấy danh sách booking trong khoảng 7 ngày này
      const endDate = new Date(today);
      endDate.setDate(endDate.getDate() + 7);

      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        // Chỉ lấy những booking giao với tuần hiện tại
        .lt('check_in', endDate.toISOString())
        .gte('check_out', today.toISOString());
        
      setBookings(bookingsData || []);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Hàm tạo ngày ảo vào DB nhanh nếu Sếp chưa có
  const createMockRoom = async () => {
    if (!user) return;
    try {
      await supabase.from('rooms').insert([
        { user_id: user.id, name: 'Phòng 101', type: 'Phòng Đơn', price_per_night: 500000 },
        { user_id: user.id, name: 'Phòng 102', type: 'Phòng Đơn', price_per_night: 500000 },
        { user_id: user.id, name: 'Phòng 201', type: 'Phòng Đôi', price_per_night: 800000 },
        { user_id: user.id, name: 'VIP 301', type: 'VIP', price_per_night: 1500000 },
      ]);
      fetchData(); // reload
    } catch(err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="min-h-[400px] flex flex-col items-center justify-center text-slate-400">
      <Loader2 size={30} className="animate-spin mb-4" /> Đang đồng bộ Lưới phòng...
    </div>;
  }

  return (
    <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl shadow-sm hide-scrollbar">
      <div className="min-w-[800px]">
        
        {/* THANH TIÊU ĐỀ THỜI GIAN (Trục Ngang) */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-slate-500 font-medium text-sm">
          <div className="w-48 shrink-0 p-3 bg-slate-50 flex items-center justify-between">
            Sơ Đồ Lưới 
            <CalendarIcon size={14} className="text-slate-400"/>
          </div>
          <div className="flex-1 flex">
            {dateDates.map((dateObj, i) => {
              const isToday = i === 0;
              return (
                 <div key={i} className={`flex-1 min-w-[120px] p-3 border-l border-slate-200 text-center ${isToday ? 'bg-coto-blue/10 text-coto-blue font-bold' : ''}`}>
                   {dateObj.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                 </div>
              );
            })}
          </div>
        </div>

        {/* LƯỚI PHÒNG (Trục Dọc) */}
        <div className="flex flex-col">
          {rooms.length === 0 ? (
            <div className="p-8 text-center bg-slate-50/50">
               <p className="text-slate-500 mb-4">Cơ sở lưu trú chưa có phòng nào trên hệ thống.</p>
               <button onClick={createMockRoom} className="bg-coto-blue text-white px-4 py-2 rounded shadow text-sm font-bold mx-auto flex items-center gap-2 hover:bg-coto-blue/80">
                 <Plus size={16}/> Khởi tạo phòng mẫu nhanh
               </button>
            </div>
          ) : (
            rooms.map((room) => (
              <div key={room.id} className="flex border-b border-slate-100 hover:bg-slate-50 group">
                
                {/* Cột Tên Phòng (Sticky Left) */}
                <div className="w-48 shrink-0 p-3 bg-white group-hover:bg-slate-50 border-r border-slate-200 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] relative">
                  <span className="font-bold text-slate-800 block">{room.name}</span>
                  <span className="text-xs text-slate-400">{room.type}</span>
                  {room.status === 'dirty' && <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500" title="Cần dọn"></span>}
                </div>

                {/* Ô kẻ các ngày */}
                <div className="flex-1 flex relative">
                  {dateDates.map((dateObj, idx) => {
                    // Logic tìm booking đè lên ô này (rất căn bản cho MVP)
                    // Check nếu check_in trùng ngày này
                    const dayBooking = bookings.find(b => 
                      b.room_id === room.id && 
                      new Date(b.check_in).setHours(0,0,0,0) === dateObj.getTime()
                    );

                    // Tính chiều dài của ribbon (số ngày ở)
                    let ribbonWidthStyle = {};
                    if (dayBooking) {
                      const chin = new Date(dayBooking.check_in).getTime();
                      const chout = new Date(dayBooking.check_out).getTime();
                      const stayDays = Math.ceil((chout - chin) / (1000 * 3600 * 24));
                      // Rộng bằng 100% * số đêm ở. Trừ đi khe hở xíu cho đẹp
                      ribbonWidthStyle = { width: `calc(${stayDays * 100}% - 4px)` };
                    }

                    return (
                      <div key={idx} className={`flex-1 min-w-[120px] h-16 border-l border-slate-100 relative ${idx === 0 ? 'bg-coto-blue/5' : ''}`}>
                        
                        {/* Biểu diễn Ribbon */}
                        {dayBooking && (
                          <div 
                            className={`absolute top-2 left-1 h-12 rounded-md p-2 shadow flex flex-col justify-center z-20 cursor-pointer overflow-hidden transition hover:ring-2 hover:ring-offset-1 hover:brightness-110
                              ${dayBooking.status === 'checked_in' ? 'bg-emerald-500' : 'bg-coto-blue'}`}
                             style={ribbonWidthStyle}
                             title={`${dayBooking.guest_name} | Vào: ${dayBooking.check_in} - Ra: ${dayBooking.check_out}`}
                          >
                            <span className="font-bold text-xs truncate text-white">{dayBooking.guest_name}</span>
                            <span className="text-[10px] text-white/80 opacity-90 truncate">{dayBooking.booking_source}</span>
                          </div>
                        )}

                        {/* Nút cộng ẩn để thêm booking khi hover */}
                        {!dayBooking && (
                           <div className="w-full h-full opacity-0 hover:opacity-100 flex items-center justify-center bg-coto-blue/5 cursor-pointer text-coto-blue transition">
                             <Plus size={16}/>
                           </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
