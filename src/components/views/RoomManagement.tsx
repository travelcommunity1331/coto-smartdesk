"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { Plus, Import, Download, Menu, Search, Trash2, X, Loader2 } from 'lucide-react';
import { SettingsModal } from "@/components/SettingsModal";

export function RoomManagement() {
  const [activeTab, setActiveTab] = useState<'hang'|'ds'>('ds');
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [expandedRoomId, setExpandedRoomId] = useState<string | null>(null);
  const [expandedRoomTab, setExpandedRoomTab] = useState<'info'|'booking'|'tx'|'clean'>('info');

  useEffect(() => {
    fetchRooms();
  }, [isSettingsOpen]);

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

  const categories = Object.values(rooms.reduce((acc, r: any) => {
    if (!acc[r.type]) {
       acc[r.type] = {
         name: r.type,
         count: 0,
         basePrice: r.price_per_night
       };
    }
    acc[r.type].count += 1;
    return acc;
  }, {}));

  return (
    <div className="flex h-[calc(100vh-50px)] w-full">
       
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
             <h4 className="text-xs font-bold text-slate-700 mb-2 flex justify-between items-center">
                Khu vực 
                <div className="flex gap-1 text-slate-400"><Plus size={12}/></div>
             </h4>
             <div className="relative mb-3">
               <Search size={14} className="absolute top-2 left-2 text-slate-400" />
               <input type="text" placeholder="Tìm kiếm khu vực" className="w-full pl-7 text-xs border border-slate-200 p-1.5 rounded outline-none focus:border-[#0070f4]" />
             </div>
             <div className="space-y-2 text-xs text-slate-600">
                <label className="flex items-center gap-2 cursor-pointer font-medium"><input type="checkbox"/> Tất cả</label>
                <label className="flex items-center gap-2 cursor-pointer ml-4"><input type="checkbox"/> Khu vườn</label>
                <label className="flex items-center gap-2 cursor-pointer ml-4"><input type="checkbox"/> Nhà chính</label>
                <label className="flex items-center gap-2 cursor-pointer ml-4"><input type="checkbox"/> Nhà phụ</label>
                <label className="flex items-center gap-2 cursor-pointer ml-4"><input type="checkbox"/> View hồ</label>
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
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="status"/> Tất cả
                </label>
             </div>
          </div>

       </div>

       <div className="flex-1 bg-white flex flex-col overflow-hidden">
          
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

          <div className="flex-1 overflow-auto p-4 bg-slate-50">
             {loading ? (
                <div className="flex justify-center p-10"><Loader2 className="animate-spin text-[#0070f4]" /></div>
             ) : (
                <div className="bg-white border text-sm border-slate-200 shadow-sm rounded-sm overflow-x-auto">
                  <table className="w-full text-left whitespace-nowrap min-w-[800px]">
                     {activeTab === 'ds' ? (
                     <>
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
                           <th className="p-3">Ghi chú</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {rooms.length === 0 ? (
                           <tr><td colSpan={9} className="p-8 text-center text-slate-400">Không có dữ liệu phòng. Nhấn "Thêm mới"</td></tr>
                        ) : rooms.map((r: any) => {
                           const formatMoney = (val: number) => new Intl.NumberFormat('vi-VN').format(val);
                           const base = r.price_per_night || 0;
                           const isVip = (r.type || '').includes("VIP");
                           const isExpanded = expandedRoomId === r.id;

                           return (
                             <React.Fragment key={r.id}>
                               <tr 
                                 className={`${isExpanded ? 'bg-blue-50/30' : 'hover:bg-[#f9fafc]'} transition-colors group cursor-pointer border-b ${isExpanded ? 'border-blue-400' : 'border-slate-100'}`}
                                 onClick={() => setExpandedRoomId(isExpanded ? null : r.id)}
                               >
                                 <td className="p-3 border-r border-[#e2e8f0]" onClick={e => e.stopPropagation()}>
                                   <input type="checkbox" className="accent-[#0070f4]" />
                                 </td>
                                 <td className="p-3 border-r border-[#e2e8f0] font-medium text-[#0070f4]">{r.name}</td>
                                 <td className="p-3 border-r border-[#e2e8f0] text-slate-700">{r.type}</td>
                                 <td className="p-3 border-r border-[#e2e8f0]">{isVip ? 'View hồ' : 'Khu vườn'}</td>
                                 <td className="p-3 border-r border-[#e2e8f0] font-medium">{formatMoney(Math.round(base * 0.15))}</td>
                                 <td className="p-3 border-r border-[#e2e8f0] font-medium text-slate-800">{formatMoney(base)}</td>
                                 <td className="p-3 border-r border-[#e2e8f0]">{formatMoney(Math.round(base * 0.7))}</td>
                                 <td className="p-3 border-r border-[#e2e8f0]">Đang hoạt động</td>
                                 <td className="p-3 text-slate-400 text-xs"></td>
                               </tr>
                               
                               {isExpanded && (
                                 <tr className="border-b-2 border-blue-400 bg-white shadow-inner">
                                   <td colSpan={9} className="p-0 border-x border-blue-400">
                                      <div className="flex border-b border-slate-200 px-4 pt-2">
                                        <button onClick={() => setExpandedRoomTab('info')} className={`px-4 py-2 text-[13px] font-semibold border-b-2 transition-colors ${expandedRoomTab === 'info' ? 'border-[#0070f4] text-[#0070f4]' : 'border-transparent text-slate-600 hover:text-slate-800'}`}>Thông tin</button>
                                        <button onClick={() => setExpandedRoomTab('booking')} className={`px-4 py-2 text-[13px] font-semibold border-b-2 transition-colors ${expandedRoomTab === 'booking' ? 'border-[#0070f4] text-[#0070f4]' : 'border-transparent text-slate-600 hover:text-slate-800'}`}>Lịch sử đặt phòng</button>
                                        <button onClick={() => setExpandedRoomTab('tx')} className={`px-4 py-2 text-[13px] font-semibold border-b-2 transition-colors ${expandedRoomTab === 'tx' ? 'border-[#0070f4] text-[#0070f4]' : 'border-transparent text-slate-600 hover:text-slate-800'}`}>Lịch sử giao dịch</button>
                                        <button onClick={() => setExpandedRoomTab('clean')} className={`px-4 py-2 text-[13px] font-semibold border-b-2 transition-colors ${expandedRoomTab === 'clean' ? 'border-[#0070f4] text-[#0070f4]' : 'border-transparent text-slate-600 hover:text-slate-800'}`}>Lịch sử dọn phòng</button>
                                      </div>

                                      <div className="p-5 h-[300px] overflow-y-auto w-full flex relative">
                                         {expandedRoomTab === 'info' && (
                                            <div className="flex w-full gap-8">
                                               <div className="w-[300px] h-[250px] shrink-0 bg-slate-100 flex items-center justify-center border border-slate-200">
                                                  <Image size={80} className="text-slate-300" />
                                               </div>
                                               <div className="flex-[1.5] space-y-4 text-sm mt-3">
                                                  <div className="flex"><span className="w-40 text-slate-600 font-medium">Tên phòng:</span> <span className="font-semibold text-slate-800">{r.name}</span></div>
                                                  <div className="flex"><span className="w-40 text-slate-600 font-medium">Hạng phòng:</span> <span className="text-slate-800">{r.type}</span></div>
                                                  <div className="flex"><span className="w-40 text-slate-600 font-medium">Giá giờ :</span> <span className="text-slate-800">{formatMoney(Math.round(base * 0.15))}</span></div>
                                                  <div className="flex"><span className="w-40 text-slate-600 font-medium">Giá cả ngày :</span> <span className="text-slate-800">{formatMoney(base)}</span></div>
                                                  <div className="flex"><span className="w-40 text-slate-600 font-medium">Giá buổi :</span> <span className="text-slate-800">{formatMoney(Math.round(base * 0.7))}</span></div>
                                                  <div className="flex"><span className="w-40 text-slate-600 font-medium">Phụ thu quá giờ:</span> <span className="text-slate-800">Tính tiền mỗi giờ</span></div>
                                               </div>
                                               <div className="flex-1 space-y-4 text-sm mt-3">
                                                  <div className="flex"><span className="w-32 text-slate-600 font-medium">Chi nhánh:</span> <span className="text-slate-800">Chi nhánh trung tâm</span></div>
                                                  <div className="flex"><span className="w-32 text-slate-600 font-medium">Khu vực:</span> <span className="text-slate-800">{isVip ? 'View hồ' : 'Khu vườn'}</span></div>
                                                  <div className="flex"><span className="w-32 text-slate-600 font-medium">Bắt đầu sử dụng:</span> <span className="text-slate-800">13/04/2026</span></div>
                                                  <div className="flex"><span className="w-32 text-slate-600 font-medium">Ghi chú:</span> <span className="text-slate-800"></span></div>
                                               </div>
                                            </div>
                                         )}

                                         {expandedRoomTab !== 'info' && (
                                           <div className="flex items-center justify-center w-full h-full text-slate-400">
                                              Không tìm thấy lịch sử nào phù hợp
                                           </div>
                                         )}
                                      </div>

                                      {expandedRoomTab === 'info' && (
                                         <div className="px-5 pb-5 flex justify-end gap-2 border-t pt-4 border-slate-100 bg-white w-full font-bold">
                                            <button className="bg-[#00a92f] text-white px-4 py-1.5 rounded flex items-center gap-1.5 text-sm hover:bg-[#009028]"><CheckCircle2 size={16}/> Cập nhật</button>
                                            <button className="bg-[#e53935] text-white px-4 py-1.5 rounded flex items-center gap-1.5 text-sm hover:bg-[#c62828]"><X size={16}/> Ngừng hoạt động</button>
                                            <button onClick={() => handleDeleteRoom(r.id, r.name)} className="bg-[#e53935] text-white px-4 py-1.5 rounded flex items-center gap-1.5 text-sm hover:bg-[#c62828]"><Trash2 size={16}/> Xóa</button>
                                         </div>
                                      )}
                                   </td>
                                 </tr>
                               )}
                             </React.Fragment>
                           )
                        })}
                     </tbody>
                     </>
                     ) : (
                     <>
                     <thead>
                        <tr className="bg-[#f0f4f8] text-[#243a5e] font-semibold text-xs border-b border-slate-200">
                           <th className="p-3 w-10 text-center"><input type="checkbox" className="accent-[#0070f4]"/></th>
                           <th className="p-3 border-r border-[#e2e8f0]">Tên hạng phòng</th>
                           <th className="p-3 border-r border-[#e2e8f0]">Số lượng phòng</th>
                           <th className="p-3 border-r border-[#e2e8f0]">Giá mặc định (Ngày)</th>
                           <th className="p-3 border-r border-[#e2e8f0]">Ghi chú</th>
                           <th className="p-3 w-16 text-center">Xóa</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {categories.length === 0 ? (
                           <tr><td colSpan={6} className="p-8 text-center text-slate-400">Không có dữ liệu hạng phòng.</td></tr>
                        ) : categories.map((c: any, i: number) => {
                           const formatMoney = (val: number) => new Intl.NumberFormat('vi-VN').format(val);

                           return (
                             <tr key={c.name} className={`text-[13px] text-slate-700 hover:bg-blue-50/50 transition cursor-pointer ${i % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}`}>
                               <td className="p-3 text-center"><input type="checkbox" className="accent-[#0070f4]"/></td>
                               <td className="p-3 font-bold border-r border-[#e2e8f0] text-[#0070f4]">{c.name}</td>
                               <td className="p-3 border-r border-[#e2e8f0]">{c.count} phòng</td>
                               <td className="p-3 border-r border-[#e2e8f0] font-medium text-slate-800">{formatMoney(c.basePrice)}</td>
                               <td className="p-3 border-r border-[#e2e8f0]">Bao gồm ăn sáng</td>
                               <td className="p-3 text-center">
                                 <button className="text-slate-400 hover:text-rose-500">
                                   <Trash2 size={16}/>
                                 </button>
                               </td>
                             </tr>
                           )
                        })}
                     </tbody>
                     </>
                     )}
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
         mode={activeTab === 'hang' ? 'class' : 'room'}
       />
    </div>
  );
}
