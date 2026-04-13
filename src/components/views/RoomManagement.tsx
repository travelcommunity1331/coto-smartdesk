"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { Plus, Import, Download, Menu, Search, Trash2, X, Loader2 } from 'lucide-react';
import { SettingsModal } from "@/components/SettingsModal";

export function RoomManagement() {
  const [activeTab, setActiveTab] = useState("ds"); // 'hang' | 'ds'
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  // Reuse old modal just for quick add, or build inline. Since the user wants deep refactor, let's keep the modal for adding but display tabular
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, [isSettingsOpen]); // Refetch when modal closes

  const fetchRooms = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUser(user);

    const { data } = await supabase
      .from('rooms')
      .select('*')
      .eq('user_id', user.id)
      .order('name');
    
    setRooms(data || []);
    setLoading(false);
  };

  const handleDeleteRoom = async (id: string, name: string) => {
    if (!confirm(`Chắc chắn xóa ${name}? Lịch sử booking có thể bị ảnh hưởng.`)) return;
    try {
      await supabase.from('rooms').delete().eq('id', id);
      fetchRooms();
    } catch (err: any) {
      alert("Lỗi xóa phòng: " + err.message);
    }
  };

  return (
    <div className="flex h-[calc(100vh-50px)] w-full">
       
       {/* CỘT TÌM KIẾM BÊN TRÁI (LEFT FILTER SIDEBAR) */}
       <div className="w-64 bg-[#f3f4f6] shrink-0 border-r border-slate-200 overflow-y-auto hidden md:block">
          
          <div className="p-4 bg-white m-2 rounded shadow-sm border border-slate-100">
             <h4 className="text-xs font-bold text-slate-700 mb-2">Tìm kiếm</h4>
             <input type="text" placeholder="Theo tên phòng" className="w-full text-xs border border-slate-200 p-2 rounded outline-none focus:border-[#0070f4]" />
          </div>

          <div className="p-4 bg-white m-2 rounded shadow-sm border border-slate-100 mt-0">
             <h4 className="text-xs font-bold text-slate-700 mb-2 flex justify-between">Chi nhánh</h4>
             <select className="w-full text-xs border border-slate-200 p-2 rounded outline-none focus:border-[#0070f4] text-[#0070f4] font-semibold bg-blue-50">
                <option>Chi nhánh trung tâm x</option>
             </select>
          </div>

          <div className="p-4 bg-white m-2 rounded shadow-sm border border-slate-100 mt-0">
             <h4 className="text-xs font-bold text-slate-700 mb-2">Hạng phòng</h4>
             <div className="relative mb-3">
               <Search size={14} className="absolute top-2 left-2 text-slate-400" />
               <input type="text" placeholder="Tìm kiếm hạng phòng" className="w-full pl-7 text-xs border border-slate-200 p-1.5 rounded outline-none focus:border-[#0070f4]" />
             </div>
             <div className="space-y-2 text-xs text-slate-600">
                <label className="flex items-center gap-2 cursor-pointer font-medium"><input type="checkbox"/> Tất cả</label>
                <label className="flex items-center gap-2 cursor-pointer ml-4"><input type="checkbox" checked readOnly className="accent-[#0070f4]"/> Bungalow</label>
                <label className="flex items-center gap-2 cursor-pointer ml-4"><input type="checkbox"/> Phòng đôi</label>
                <label className="flex items-center gap-2 cursor-pointer ml-4"><input type="checkbox"/> Phòng gia đình</label>
                <label className="flex items-center gap-2 cursor-pointer ml-4"><input type="checkbox" checked readOnly className="accent-[#0070f4]"/> Vip</label>
             </div>
          </div>
          
          <div className="p-4 bg-white m-2 rounded shadow-sm border border-slate-100 mt-0">
             <h4 className="text-xs font-bold text-slate-700 mb-2">Trạng thái</h4>
             <div className="space-y-2 text-xs text-slate-600">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-[#0070f4]">
                  <input type="radio" name="status" defaultChecked className="accent-[#0070f4]"/> Đang hoạt động
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="status"/> Ngừng hoạt động
                </label>
             </div>
          </div>

       </div>

       {/* NỘI DUNG BẢNG LỚN BÊN PHẢI */}
       <div className="flex-1 bg-white flex flex-col overflow-hidden">
          
          {/* Header Bảng */}
          <div className="p-4 flex items-center justify-between border-b border-slate-200">
             <h2 className="text-xl font-bold text-slate-800">Hạng phòng & Phòng</h2>
             
             <div className="flex gap-2">
                <button 
                  onClick={() => setIsSettingsOpen(true)}
                  className="bg-[#00a92f] text-white px-3 py-1.5 text-xs font-bold rounded shadow-sm flex items-center gap-1 hover:bg-[#009028]"
                >
                  <Plus size={14}/> Thêm mới
                </button>
                <button className="bg-[#00a92f] text-white px-3 py-1.5 text-xs font-bold rounded shadow-sm flex items-center gap-1 hover:bg-[#009028]">
                  <Import size={14}/> Import
                </button>
                <button className="bg-[#00a92f] text-white px-3 py-1.5 text-xs font-bold rounded shadow-sm flex items-center gap-1 hover:bg-[#009028]">
                  <Download size={14}/> Xuất file
                </button>
                <button className="bg-[#00a92f] text-white px-3 py-1.5 text-xs font-bold rounded shadow-sm flex items-center justify-center w-8">
                  <Menu size={14}/>
                </button>
             </div>
          </div>

          {/* TABS ngang bảng */}
          <div className="px-4 pt-3 flex gap-1 border-b border-slate-200">
             <button 
               onClick={() => setActiveTab('hang')} 
               className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition ${activeTab === 'hang' ? 'bg-[#0070f4] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
             >
               Hạng phòng
             </button>
             <button 
               onClick={() => setActiveTab('ds')} 
               className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition ${activeTab === 'ds' ? 'bg-[#0070f4] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
             >
               Danh sách phòng
             </button>
          </div>

          {/* BẢNG DỮ LIỆU CHÍNH */}
          <div className="flex-1 overflow-auto p-4 bg-slate-50">
             {loading ? (
                <div className="flex justify-center p-10"><Loader2 className="animate-spin text-[#0070f4]" /></div>
             ) : (
                <div className="bg-white border text-sm border-slate-200 shadow-sm rounded-sm overflow-x-auto">
                  <table className="w-full text-left whitespace-nowrap min-w-[800px]">
                     <thead>
                        <tr className="bg-[#f0f4f8] text-[#243a5e] font-semibold text-xs border-b border-slate-200">
                           <th className="p-3 w-10 text-center"><input type="checkbox" className="accent-[#0070f4]"/></th>
                           <th className="p-3 border-r border-[#e2e8f0]">Tên phòng</th>
                           <th className="p-3 border-r border-[#e2e8f0]">Hạng phòng</th>
                           <th className="p-3 border-r border-[#e2e8f0]">Khu vực</th>
                           <th className="p-3 border-r border-[#e2e8f0]">Giá giờ</th>
                           <th className="p-3 border-r border-[#e2e8f0]">Giá cả ngày</th>
                           <th className="p-3 border-r border-[#e2e8f0]">Giá buổi</th>
                           <th className="p-3 border-r border-[#e2e8f0]">Trạng thái</th>
                           <th className="p-3 w-16 text-center">Xóa</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {rooms.length === 0 ? (
                           <tr><td colSpan={9} className="p-8 text-center text-slate-400">Không có dữ liệu phòng. Nhấn "Thêm mới"</td></tr>
                        ) : rooms.map((r: any, i: number) => {
                           const formatMoney = (val: number) => new Intl.NumberFormat('vi-VN').format(val);
                           const isVip = String(r.type).toLowerCase().includes("vip");
                           const base = r.price_per_night || 0;

                           return (
                             <tr key={r.id} className={`text-[13px] text-slate-700 hover:bg-blue-50/50 transition cursor-pointer ${i % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}`}>
                               <td className="p-3 text-center"><input type="checkbox" className="accent-[#0070f4]"/></td>
                               <td className="p-3 font-medium border-r border-[#e2e8f0] text-slate-800">{r.name}</td>
                               <td className="p-3 border-r border-[#e2e8f0]">{r.type}</td>
                               <td className="p-3 border-r border-[#e2e8f0]">{isVip ? 'View hồ' : 'Khu vườn'}</td>
                               <td className="p-3 border-r border-[#e2e8f0]">{formatMoney(Math.round(base * 0.15))}</td>
                               <td className="p-3 border-r border-[#e2e8f0]">{formatMoney(base)}</td>
                               <td className="p-3 border-r border-[#e2e8f0]">{formatMoney(Math.round(base * 0.6))}</td>
                               <td className="p-3 border-r border-[#e2e8f0]">Đang hoạt động</td>
                               <td className="p-3 text-center">
                                 <button onClick={() => handleDeleteRoom(r.id, r.name)} className="text-slate-400 hover:text-rose-500">
                                   <Trash2 size={16}/>
                                 </button>
                               </td>
                             </tr>
                           )
                        })}
                     </tbody>
                  </table>
                </div>
             )}
          </div>
       </div>

       {/* Dùng SettingsModal để đóng vai trò nút Thêm Mới */}
       <SettingsModal 
         isOpen={isSettingsOpen} 
         onClose={() => setIsSettingsOpen(false)} 
         onSuccess={fetchRooms}
       />
    </div>
  );
}
