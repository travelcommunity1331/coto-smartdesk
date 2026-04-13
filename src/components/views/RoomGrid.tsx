"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { RoomDetailModal } from "@/components/RoomDetailModal";
import { QuickBookingModal } from "@/components/QuickBookingModal";
import { MoreVertical, Sparkles, Clock } from 'lucide-react';

export function RoomGrid() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Modal State
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch All Rooms
    const { data: rData } = await supabase
      .from('rooms')
      .select('*')
      .eq('user_id', user.id);

    // Fetch active bookings (check_in <= today, check_out >= today and status != cancelled)
    // For simplicity we just fetch checked_in or reserved today. (Actually fetching all and filtering in memory is fine for small scale).
    const { data: bData } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id)
      .in('status', ['reserved', 'checked_in']);

    setRooms(rData || []);
    setBookings(bData || []);
  };

  const triggerReload = () => setRefreshKey(prev => prev + 1);

  const handleCardClick = (room: any, activeBooking: any) => {
    if (activeBooking && activeBooking.status === 'checked_in') {
       setSelectedBooking(activeBooking);
       setSelectedRoom(room);
       setIsDetailOpen(true);
    } else {
       setSelectedRoom(room);
       setIsBookingOpen(true);
    }
  };

  const formatVND = (num: number) => new Intl.NumberFormat('vi-VN').format(num);

  // Group rooms by Type
  const groupedRooms = rooms.reduce((acc, room) => {
     const t = room.type || "Khác";
     if (!acc[t]) acc[t] = [];
     acc[t].push(room);
     return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="w-full bg-[#f3f4f6] min-h-[500px]">
       
       <div className="flex bg-white px-4 py-3 items-center justify-between border-b border-slate-200">
         <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-300"></span> Đang trống ({rooms.length - bookings.filter(b => b.status === 'checked_in').length})</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400"></span> Sắp nhận (0)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#1b8655]"></span> Đang sử dụng ({bookings.filter(b => b.status === 'checked_in').length})</span>
         </div>
         <button onClick={() => { setSelectedRoom(null); setIsBookingOpen(true); }} className="bg-[#1b8655] text-white px-3 py-1.5 rounded text-xs font-bold shadow-sm hover:bg-green-700">
            + Đặt phòng
         </button>
       </div>

       <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 120px)' }}>
          {Object.keys(groupedRooms).map((groupName: string) => (
            <div key={groupName} className="mb-6">
               <h3 className="text-sm font-bold text-slate-800 mb-3 bg-slate-200 px-3 py-1 inline-block rounded-sm">{groupName} ({groupedRooms[groupName].length})</h3>
               
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                 {groupedRooms[groupName].map((room: any) => {
                    const activeBooking = bookings.find(b => b.room_id === room.id && b.status === 'checked_in');
                    const isOccupied = !!activeBooking;

                    return (
                      <div 
                        key={room.id}
                        onClick={() => handleCardClick(room, activeBooking)}
                        className={`relative p-3 rounded-lg border-2 cursor-pointer transition shadow-sm h-32 flex flex-col justify-between 
                           ${isOccupied ? 'bg-[#1b8655] border-[#1b8655] text-white' : 'bg-white border-transparent hover:border-[#1b8655] text-slate-800'}
                        `}
                      >
                         <div className="flex justify-between items-start">
                            <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-1 ${isOccupied ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                              <Sparkles size={10} /> Sạch
                            </span>
                            <button className="opacity-70 hover:opacity-100"><MoreVertical size={16} /></button>
                         </div>
                         
                         <div>
                            <h4 className="font-bold text-sm leading-tight mt-1">{room.name}</h4>
                            <p className={`text-xs mt-0.5 ${isOccupied ? 'text-green-100' : 'text-slate-500'}`}>{isOccupied ? activeBooking.guest_name : room.type}</p>
                         </div>

                         <div className={`text-[11px] font-medium leading-tight mt-1 ${isOccupied ? 'text-white' : 'text-slate-400'}`}>
                            {isOccupied ? (
                              <div className="bg-white/20 px-2 py-1 rounded inline-block mt-2 font-bold flex items-center gap-1">
                                <Clock size={12}/> Đang có khách
                              </div>
                            ) : (
                              <>
                                <p>⏱ {formatVND(Math.round(room.price_per_night * 0.15))}</p>
                                <p>☀️ {formatVND(room.price_per_night)}</p>
                              </>
                            )}
                         </div>

                      </div>
                    )
                 })}
               </div>
            </div>
          ))}
       </div>

       {/* Modals placeholders */}
       {isBookingOpen && <QuickBookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} onSuccess={triggerReload} preselectedRoom={selectedRoom} />}
       {isDetailOpen && <RoomDetailModal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} onSuccess={triggerReload} booking={selectedBooking} room={selectedRoom} />}
    </div>
  );
}
