import React, { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { RoomDetailModal } from "@/components/RoomDetailModal";
import { QuickBookingModal } from "@/components/QuickBookingModal";
import { POSInvoice } from '@/components/views/POSInvoice';
import { MoreVertical, Sparkles, Clock, Sun, User, Search, Filter, RotateCw, Plus, LayoutGrid, List, ListFilter, Calendar, X, Printer, Bell } from 'lucide-react';

export function RoomGrid() {
  const [posTab, setPosTab] = useState<'grid' | 'invoice1'>('grid');
  const [rooms, setRooms] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

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

    const { data: rData } = await supabase.from('rooms').select('*').eq('user_id', user.id);
    const { data: bData } = await supabase.from('bookings').select('*').eq('user_id', user.id).in('status', ['reserved', 'checked_in']);

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

  const groupedRooms = rooms.reduce((acc, room) => {
     const t = room.type || "Khác";
     if (!acc[t]) acc[t] = [];
     acc[t].push(room);
     return acc;
  }, {} as Record<string, any[]>);

  const occupiedCount = bookings.filter(b => b.status === 'checked_in').length;
  const vacantCount = rooms.length - occupiedCount;

  return (
    <div className="w-full h-full bg-[#f0f2f5] flex flex-col font-sans overflow-hidden">
       {/* POS Top Navigation (Green Bar) */}
       <div className="bg-[#1b8655] px-2 h-10 flex items-end gap-1 shrink-0 overflow-x-auto">
          <button 
            onClick={() => setPosTab('grid')}
            className={`px-4 py-2 rounded-t font-bold text-[13px] flex items-center gap-1.5 transition-colors ${posTab === 'grid' ? 'bg-white text-[#1b8655]' : 'text-emerald-100 hover:bg-emerald-700/50'}`}>
            <Calendar size={14} /> Lịch đặt phòng
          </button>
          <button 
            onClick={() => setPosTab('invoice1')}
            className={`px-4 py-2 rounded-t font-bold text-[13px] flex items-center gap-1.5 transition-colors ${posTab === 'invoice1' ? 'bg-[#f0f2f5] text-[#1b8655]' : 'text-emerald-100 hover:bg-emerald-700/50'}`}>
            Hóa đơn 1 
            <div className={`p-0.5 rounded-full hover:bg-black/10 ${posTab === 'invoice1' ? 'text-slate-400' : 'text-emerald-200'}`}>
               <X size={12} />
            </div>
          </button>
          <button className="p-1.5 mb-1 text-emerald-100 hover:bg-emerald-700/50 rounded"><Plus size={16}/></button>

          <div className="ml-auto mb-1 flex items-center gap-4 text-emerald-100 text-[13px] mr-2">
             <button className="hover:text-white transition-colors"><Printer size={16}/></button>
             <button className="hover:text-white transition-colors"><Bell size={16}/></button>
          </div>
       </div>

       {/* MAIN CONTENT AREA */}
       <div className="flex-1 overflow-hidden relative">
         
         {posTab === 'grid' && (
           <div className="absolute inset-0 flex flex-col">

       {/* TOOLBAR KIOTVIET REPLICA */}
       <div className="bg-white border-b border-slate-200">
           {/* Top bar filter */}
           <div className="px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 {/* View toggles */}
                 <div className="flex bg-slate-100 rounded border border-slate-200 p-0.5">
                    <button className="p-1.5 text-slate-500 hover:bg-white rounded"><List size={16} /></button>
                    <button className="p-1.5 text-slate-500 hover:bg-white rounded"><ListFilter size={16} /></button>
                    <button className="p-1.5 text-blue-600 bg-white rounded shadow-sm"><LayoutGrid size={16} /></button>
                 </div>
                 
                 {/* Search */}
                 <div className="relative w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input type="text" placeholder="Tìm kiếm khách hàng, mã đặt phòng,..." className="w-full pl-9 pr-3 py-1.5 bg-[#f5f7fa] border border-transparent focus:bg-white focus:border-blue-500 rounded text-sm outline-none transition-all" />
                 </div>

                 {/* Extra icons */}
                 <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded border border-slate-200"><Filter size={16}/></button>
              </div>

              <div className="flex items-center gap-2">
                 <button className="bg-[#0070f4] hover:bg-blue-700 text-white px-4 py-1.5 rounded text-[13px] font-bold flex items-center gap-1.5 shadow-sm transition-colors">
                    <Plus size={16}/> Đặt phòng
                 </button>
              </div>
           </div>

           {/* Second bar filters */}
           <div className="px-4 py-2 flex items-center text-sm gap-4 border-t border-slate-100 overflow-x-auto">
              <button className="flex items-center gap-1.5 font-medium text-slate-700 hover:text-slate-900"><span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span> Đang trống ({vacantCount})</button>
              <button className="flex items-center gap-1.5 font-medium text-slate-700 hover:text-slate-900"><span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Sắp nhận (0)</button>
              <button className="flex items-center gap-1.5 font-medium text-slate-700 hover:text-slate-900"><span className="w-2.5 h-2.5 rounded-full bg-[#1b8655]"></span> Đang sử dụng ({occupiedCount})</button>
              <button className="flex items-center gap-1.5 font-medium text-slate-700 hover:text-slate-900"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Sắp trả (0)</button>
              <button className="flex items-center gap-1.5 font-medium text-slate-700 hover:text-slate-900"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Quá giờ trả (0)</button>

              <div className="ml-auto flex items-center gap-4 text-slate-500 font-medium">
                 <button className="flex items-center gap-1.5 hover:text-slate-800"><RotateCw size={14}/> Đồng bộ</button>
              </div>
           </div>
       </div>

       {/* MAIN GRID */}
       <div className="p-4 overflow-y-auto w-full">
          {Object.keys(groupedRooms).map((groupName: string) => (
            <div key={groupName} className="mb-6">
               
               {/* HT-Divider styling */}
               <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-sm font-bold text-slate-800 flex items-center m-0">
                     {groupName} <span className="font-semibold text-slate-400 ml-1 text-xs">({groupedRooms[groupName].length})</span>
                  </h2>
                  <div className="h-[1px] bg-slate-200 flex-1"></div>
               </div>
               
               <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                 {groupedRooms[groupName].map((room: any) => {
                    const activeBooking = bookings.find(b => b.room_id === room.id && b.status === 'checked_in');
                    const isOccupied = !!activeBooking;

                    return (
                      <div 
                        key={room.id}
                        onClick={() => handleCardClick(room, activeBooking)}
                        className={`relative rounded border bg-white cursor-pointer hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden
                           ${isOccupied ? 'border-l-4 border-l-[#1b8655] border-y-slate-200 border-r-slate-200' : 'border-slate-200'}
                        `}
                      >
                         {/* Card Header */}
                         <div className="px-3 pt-3 flex justify-between items-start">
                            <span className="bg-[#f3f4f6] text-slate-600 text-[11px] font-semibold px-2 py-[3px] rounded flex items-center gap-1">
                              <Sparkles size={11} className="text-slate-500" /> Sạch
                            </span>
                            <button className="text-slate-400 hover:bg-slate-100 p-1 rounded-full outline-none"><MoreVertical size={16} /></button>
                         </div>
                         
                         {/* Card Body */}
                         <div className="px-3 py-2 flex-grow">
                            <h4 className="font-bold text-[#101828] text-base mb-1">{room.name}</h4>
                            
                            {isOccupied ? (
                               <div className="flex items-center text-[13px] font-bold text-slate-800 mb-2">
                                  <User size={12} className="mr-1 text-slate-500" /> {activeBooking.guest_name || 'Khách lẻ'}
                               </div>
                            ) : (
                               <div className="text-[13px] font-semibold text-slate-500 mb-2 truncate">
                                  {room.type}
                               </div>
                            )}

                            {!isOccupied && (
                               <div className="flex flex-col gap-1 text-[12px] font-medium text-slate-600 mt-2">
                                  <div className="flex items-center gap-1.5"><Clock size={12} className="text-slate-400" /> {formatVND(Math.round(room.price_per_night * 0.15))}</div>
                                  <div className="flex items-center gap-1.5"><Sun size={12} className="text-slate-400" /> {formatVND(room.price_per_night)}</div>
                               </div>
                            )}
                         </div>

                         {/* Card Footer (Only for occupied) */}
                         {isOccupied && (
                            <div className="bg-[#f9fafb] border-t border-slate-100 px-3 py-2 text-[11px] font-semibold text-slate-500 flex flex-wrap gap-x-3 items-center">
                               <div className="flex items-center gap-1 text-[#0070f4]">
                                 <Clock size={11} className="text-[#0070f4]" /> 
                                 <span>Đang lưu trú</span>
                               </div>
                            </div>
                         )}
                      </div>
                    )
                 })}
               </div>
               </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {posTab === 'invoice1' && (
         <div className="absolute inset-0">
            <POSInvoice />
         </div>
      )}

      </div>{/* End Main Content Area */}

       {isBookingOpen && <QuickBookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} onSuccess={triggerReload} preselectedRoom={selectedRoom} />}
       {isDetailOpen && <RoomDetailModal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} onSuccess={triggerReload} booking={selectedBooking} room={selectedRoom} />}
    </div>
  );
}
