import React from 'react';

// Dữ liệu giả định để vẽ Bảng Grid
const MOCK_ROOMS = [
  { id: '101', name: 'Phòng 101', type: 'Phòng Đơn (2N)' },
  { id: '102', name: 'Phòng 102', type: 'Phòng Đôi (4N)' },
  { id: '201', name: 'Phòng 201', type: 'Phòng Đôi (4N)' },
  { id: '202', name: 'Phòng 202', type: 'Gia Đình (6N)' },
  { id: '301', name: 'Phòng 301', type: 'VIP Seaview' },
];

export function TapeChart() {
  return (
    <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl shadow-sm hide-scrollbar">
      <div className="min-w-[800px]">
        {/* THANH TIÊU ĐỀ THỜI GIAN (Trục Ngang) */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-slate-500 font-medium text-sm">
          <div className="w-48 shrink-0 p-3 bg-slate-50">Sơ Đồ Lưới (Tape Chart)</div>
          <div className="flex-1 flex">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex-1 min-w-[120px] p-3 border-l border-slate-200 text-center">
                Ngày {13 + i}/4
              </div>
            ))}
          </div>
        </div>

        {/* LƯỚI PHÒNG (Trục Dọc) */}
        <div className="flex flex-col">
          {MOCK_ROOMS.map((room) => (
            <div key={room.id} className="flex border-b border-slate-100 hover:bg-slate-50 group">
              
              {/* Cột Tên Phòng Khóa Chết (Sticky Left) */}
              <div className="w-48 shrink-0 p-3 bg-white group-hover:bg-slate-50 border-r border-slate-200 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                <span className="font-bold text-slate-800 block">{room.name}</span>
                <span className="text-xs text-slate-400">{room.type}</span>
              </div>

              {/* Ô kẻ các ngày */}
              <div className="flex-1 flex relative">
                {Array.from({ length: 7 }).map((_, idx) => (
                  <div key={idx} className="flex-1 min-w-[120px] h-16 border-l border-slate-100 relative">
                    
                    {/* Vẽ thanh Đặt phòng (Demo UI) */}
                    {room.id === '101' && idx === 1 && (
                       <div className="absolute top-2 left-2 right-[-110%] h-12 bg-coto-blue text-white rounded-md p-2 shadow flex flex-col justify-center z-20 cursor-pointer overflow-hidden leading-tight">
                         <span className="font-bold text-xs truncate">A. Hoàng Vĩ</span>
                         <span className="text-[10px] text-white/80 opacity-90 truncate">Booking.com • Đã cọc</span>
                       </div>
                    )}
                    
                    {room.id === '202' && idx === 4 && (
                       <div className="absolute top-2 left-2 right-[-10%] h-12 bg-amber-500 text-white rounded-md p-2 shadow flex flex-col justify-center z-20 cursor-pointer overflow-hidden leading-tight">
                         <span className="font-bold text-xs truncate">Chị Lan Tây</span>
                         <span className="text-[10px] text-white/80 opacity-90 truncate">Direct • Gửi xe</span>
                       </div>
                    )}

                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
