import React from 'react';
import { Sparkles, CheckCircle, Wrench } from 'lucide-react';

export function MobileRoomList() {
  const rooms = [
    { id: '101', name: 'Phòng 101', status: 'dirty', guest: 'Khách vừa trả' },
    { id: '102', name: 'Phòng 102', status: 'clean', guest: 'Trống' },
    { id: '201', name: 'Phòng 201', status: 'maintenance', guest: 'Hỏng vòi sen' },
    { id: '202', name: 'Phòng 202', status: 'dirty', guest: 'Đang dọn...' },
  ];

  return (
    <div className="space-y-4 md:hidden">
      <h3 className="font-bold text-lg px-1">Danh sách phòng dọn (Tạp vụ)</h3>
      <div className="grid gap-3">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-lg">{room.name}</h4>
              <p className="text-xs text-slate-500 mt-1">{room.guest}</p>
            </div>
            
            {room.status === 'dirty' && (
              <button className="bg-rose-100 text-rose-600 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 active:bg-rose-200 transition">
                <Sparkles size={16} /> Chạm dọn xong
              </button>
            )}
            {room.status === 'clean' && (
              <span className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 border border-emerald-100">
                <CheckCircle size={16} /> Sẵn sàng
              </span>
            )}
            {room.status === 'maintenance' && (
              <span className="bg-amber-50 text-amber-600 px-4 py-2 rounded-lg font-bold text-sm border border-amber-100">
                <Wrench size={16} /> Đang Sửa
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
