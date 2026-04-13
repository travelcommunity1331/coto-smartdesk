import React, { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { X, Save, Image, Search, ChevronDown, CheckCircle2, FileText, Camera } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode?: 'room' | 'class'; // defaults to room
}

export function SettingsModal({ isOpen, onClose, onSuccess, mode = 'room' }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'info'|'img'|'rooms'>('info');
  const [isAdding, setIsAdding] = useState(false);
  
  // Room State
  const [roomName, setRoomName] = useState("");
  const [roomType, setRoomType] = useState("Phòng Đôi");
  const [roomArea, setRoomArea] = useState("Nhà chính");
  const [roomNote, setRoomNote] = useState("");
  
  // Class State
  const [className, setClassName] = useState("");
  const [priceHourly, setPriceHourly] = useState("");
  const [priceDaily, setPriceDaily] = useState("");
  const [priceSession, setPriceSession] = useState("");

  useEffect(() => {
    if (isOpen) {
       setActiveTab('info');
       setRoomName("");
       setClassName("");
    }
  }, [isOpen, mode]);

  const handleSave = async () => {
    setIsAdding(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      if (mode === 'room') {
         if (!roomName) throw new Error("Chưa nhập Tên phòng");
         const basePrice = roomType.includes("VIP") ? 2000000 : 800000;
         await supabase.from('rooms').insert([{
           user_id: user.id,
           name: roomName,
           type: roomType,     // In real app, associate with class
           price_per_night: basePrice,
         }]);
      } else {
         if (!className) throw new Error("Chưa nhập Tên hạng phòng");
         // Normally we save category to meta or classes table. Mocking for UI sync.
      }
      onSuccess();
      onClose();
    } catch(err: any) {
      alert("Lỗi: " + err.message);
    } finally {
      setIsAdding(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className={`bg-white rounded shadow-xl overflow-hidden flex flex-col ${mode === 'class' ? 'w-[750px] h-[550px]' : 'w-[750px] h-[500px]'}`}>
        
        {/* HEADER */}
        <div className="flex justify-between items-center px-4 py-3 bg-[#0070f4] text-white border-b border-blue-600 shrink-0">
           <h2 className="text-[15px] font-bold tracking-tight">
             {mode === 'class' ? 'Thêm hạng phòng mới' : 'Phòng'}
           </h2>
           <button onClick={onClose} className="text-white hover:text-rose-200 transition-colors">
              <X size={18} />
           </button>
        </div>

        {/* MODAL TABS (Only for Class) */}
        {mode === 'class' && (
           <div className="flex px-4 pt-0 border-b border-slate-200 shrink-0 bg-white">
             <button onClick={() => setActiveTab('info')} className={`px-4 py-3 text-[13px] font-bold border-b-2 transition-colors ${activeTab === 'info' ? 'border-[#0070f4] text-[#0070f4]' : 'border-transparent text-slate-800 hover:text-[#0070f4]'}`}>Thông tin</button>
             <button onClick={() => setActiveTab('img')} className={`px-4 py-3 text-[13px] font-bold border-b-2 transition-colors ${activeTab === 'img' ? 'border-[#0070f4] text-[#0070f4]' : 'border-transparent text-slate-800 hover:text-[#0070f4]'}`}>Hình ảnh, mô tả</button>
             <button onClick={() => setActiveTab('rooms')} className={`px-4 py-3 text-[13px] font-bold border-b-2 transition-colors ${activeTab === 'rooms' ? 'border-[#0070f4] text-[#0070f4]' : 'border-transparent text-slate-800 hover:text-[#0070f4]'}`}>Danh sách phòng</button>
           </div>
        )}

        {/* BODY */}
        <div className="flex-1 overflow-y-auto bg-[#f0f2f5] p-4 text-slate-800">
           {mode === 'room' ? (
              // THÊM PHÒNG (Room Modal)
              <div className="flex flex-col md:flex-row gap-6">
                 {/* Left Column */}
                 <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-2">
                       <label className="w-1/3 text-xs font-semibold text-slate-700">Tên phòng <span className="text-rose-500">*</span></label>
                       <input value={roomName} onChange={e=>setRoomName(e.target.value)} type="text" className="w-2/3 text-sm border border-slate-300 rounded p-[5px] focus:border-[#0070f4] outline-none bg-white" />
                    </div>
                    <div className="flex items-center gap-2">
                       <label className="w-1/3 text-xs font-semibold text-slate-700">Khu vực</label>
                       <select value={roomArea} onChange={e=>setRoomArea(e.target.value)} className="w-2/3 text-sm border border-slate-300 rounded p-[5px] focus:border-[#0070f4] outline-none bg-white">
                          <option>---Lựa chọn---</option>
                          <option>Khu vườn</option>
                          <option>Nhà chính</option>
                          <option>Nhà phụ</option>
                          <option>View hồ</option>
                       </select>
                    </div>
                    <div className="flex items-center gap-2">
                       <label className="w-1/3 text-xs font-semibold text-slate-700">Hạng phòng <span className="text-rose-500">*</span></label>
                       <select value={roomType} onChange={e=>setRoomType(e.target.value)} className="w-2/3 text-sm border border-slate-300 rounded p-[5px] focus:border-[#0070f4] outline-none bg-white">
                          <option>---Lựa chọn---</option>
                          <option>Bungalow</option>
                          <option>Phòng đôi</option>
                          <option>Phòng gia đình</option>
                          <option>Phòng VIP</option>
                       </select>
                    </div>
                    <div className="flex items-center gap-2">
                       <label className="w-1/3 text-xs font-semibold text-slate-700">Bắt đầu sử dụng</label>
                       <input type="date" className="w-2/3 text-sm border border-slate-300 rounded p-[5px] focus:border-[#0070f4] outline-none bg-white" defaultValue={new Date().toISOString().split('T')[0]} />
                    </div>
                    <div className="flex items-start gap-2">
                       <label className="w-1/3 text-xs font-semibold text-slate-700 mt-2">Ghi chú</label>
                       <textarea rows={2} className="w-2/3 text-sm border border-slate-300 rounded p-[5px] focus:border-[#0070f4] outline-none bg-white"></textarea>
                    </div>

                    <div className="flex items-center gap-2 mt-4 overflow-x-auto select-none pt-4">
                       {[1,2,3,4,5].map(i => (
                         <div key={i} className="w-[100px] h-[100px] shrink-0 border border-dashed border-slate-300 rounded flex items-center justify-center bg-white cursor-pointer hover:bg-slate-50 text-slate-200 shadow-sm relative">
                           <Image size={24}/>
                         </div>
                       ))}
                    </div>
                 </div>

                 {/* Right Column */}
                 <div className="w-[280px]">
                    <div className="bg-[#f5f7fa] border border-slate-200 rounded p-4 shadow-sm h-[180px]">
                       <h4 className="text-[13px] text-slate-800 mb-4">Phòng sẽ được áp dụng theo giá của hạng phòng:</h4>
                       <ul className="text-[13px] text-slate-800 space-y-2 list-disc pl-5 font-semibold">
                         <li>Giá giờ :</li>
                         <li>Giá cả ngày :</li>
                         <li>Giá buổi :</li>
                         <li>Phụ thu quá giờ:</li>
                       </ul>
                    </div>
                 </div>
              </div>
           ) : (
              // THÊM HẠNG PHÒNG MỚI (Class Modal)
              <div className="h-full">
                 {activeTab === 'info' && (
                    <div className="space-y-4">
                       <div className="flex gap-4">
                          {/* Left Details */}
                          <div className="w-1/2 space-y-3">
                             <div className="flex items-center gap-2">
                               <label className="w-1/3 text-xs font-semibold text-slate-700">Mã hạng phòng</label>
                               <input disabled type="text" placeholder="Mã hạng phòng tự động" className="flex-1 text-sm border border-slate-300 rounded p-1.5 outline-none bg-slate-50 shadow-sm" />
                             </div>
                             <div className="flex items-center gap-2">
                               <label className="w-1/3 text-xs font-semibold text-slate-700">Tên hạng phòng <span className="text-rose-500">*</span></label>
                               <input value={className} onChange={e=>setClassName(e.target.value)} type="text" className="flex-1 text-sm border border-blue-500 rounded p-1.5 outline-none bg-white shadow-sm" />
                             </div>
                             <div className="flex items-center gap-2">
                               <label className="w-1/3 text-xs font-semibold text-slate-700">Giá giờ</label>
                               <input type="text" placeholder="0" className="flex-1 text-sm border border-slate-300 rounded p-1.5 outline-none text-right bg-white shadow-sm" />
                             </div>
                             <div className="flex items-center gap-2">
                               <label className="w-1/3 text-xs font-semibold text-slate-700">Giá cả ngày</label>
                               <input type="text" placeholder="0" className="flex-1 text-sm border border-slate-300 rounded p-1.5 outline-none text-right bg-white shadow-sm" />
                             </div>
                             <div className="flex items-center gap-2">
                               <label className="w-1/3 text-xs font-semibold text-slate-700">Giá buổi</label>
                               <input type="text" placeholder="0" className="flex-1 text-sm border border-slate-300 rounded p-1.5 outline-none text-right bg-white shadow-sm" />
                             </div>
                          </div>

                          {/* Right Config */}
                          <div className="w-1/2 bg-[#f5f7fa] rounded border border-slate-200 p-3 shadow-sm h-[130px]">
                             <h4 className="text-[13px] font-bold text-slate-700 mb-2 flex justify-between items-center">Thời gian nhận - trả quy định <span className="cursor-pointer text-slate-400 hover:text-slate-600">✏️</span></h4>
                             <ul className="text-[13px] text-slate-800 space-y-1.5 list-disc pl-5 font-semibold">
                               <li>Cả ngày tính từ 14:00 đến 12:00</li>
                               <li>1 buổi tính từ 12:00 đến 21:00</li>
                             </ul>
                          </div>
                       </div>

                       {/* Phụ thu */}
                       <div className="border border-slate-300 rounded bg-white shadow-sm">
                          <div className="bg-[#f5f7fa] px-3 py-2 text-[13px] font-bold text-slate-800 border-b border-slate-200 rounded-t">
                             Phụ thu quá giờ (Khi quá thời gian quy định)
                          </div>
                          <div className="p-3">
                             <div className="flex gap-4 items-center mb-3">
                               <div className="flex-1">
                                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hình thức</label>
                                  <select className="w-full text-[13px] border border-slate-300 rounded p-[5px] outline-none">
                                    <option>Tính tiền mỗi giờ</option>
                                  </select>
                               </div>
                               <div className="flex-1">
                                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">Nhận sớm</label>
                                  <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-700">
                                     <input type="text" placeholder="0" className="w-[120px] border border-slate-300 rounded p-[5px] outline-none text-right font-normal" /> /giờ
                                  </div>
                               </div>
                               <div className="flex-1">
                                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">Trả muộn</label>
                                  <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-700">
                                     <input type="text" placeholder="0" className="w-[120px] border border-slate-300 rounded p-[5px] outline-none text-right font-normal" /> /giờ
                                  </div>
                               </div>
                             </div>
                             
                             <div className="space-y-1 text-[13px] text-slate-800">
                                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="accent-[#0070f4]" /> Mặc định tính phụ thu cho hạng phòng</label>
                                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="accent-[#0070f4]" /> Áp dụng cho tất cả hạng phòng</label>
                             </div>
                          </div>
                       </div>

                       {/* Sức chứa */}
                       <div className="border border-slate-300 rounded bg-white shadow-sm">
                          <div className="bg-[#f5f7fa] px-3 py-2 text-[13px] font-bold text-slate-800 border-b border-slate-200 rounded-t">Sức chứa</div>
                          <div className="p-3 grid grid-cols-2 gap-4">
                             <div className="flex items-center justify-between text-[13px] font-medium text-slate-700 bg-white border border-slate-200 p-1.5 rounded">
                                <span className="font-semibold w-20">Tiêu chuẩn</span>
                                <input type="number" defaultValue={2} className="w-10 text-center border border-transparent focus:border-slate-300 hover:border-slate-300 rounded outline-none"/> Người lớn và 
                                <input type="number" defaultValue={1} className="w-10 text-center border border-transparent focus:border-slate-300 hover:border-slate-300 rounded outline-none"/> Trẻ em
                             </div>
                             <div className="flex items-center justify-between text-[13px] font-medium text-slate-700 bg-white border border-slate-200 p-1.5 rounded">
                                <span className="font-semibold w-20">Tối đa</span>
                                <input type="number" defaultValue={2} className="w-10 text-center border border-transparent focus:border-slate-300 hover:border-slate-300 rounded outline-none"/> Người lớn và 
                                <input type="number" defaultValue={1} className="w-10 text-center border border-transparent focus:border-slate-300 hover:border-slate-300 rounded outline-none"/> Trẻ em
                             </div>
                          </div>
                       </div>
                    </div>
                 )}

                 {activeTab === 'img' && (
                    <div className="flex flex-col h-full bg-white border border-slate-200 p-4 rounded shadow-sm">
                       <h3 className="text-[13px] font-bold text-slate-800 mb-2">Ảnh phòng</h3>
                       <div className="border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center p-10 rounded text-slate-400 font-medium cursor-pointer hover:bg-slate-100">
                          <div className="flex flex-col items-center gap-2">
                             <Camera size={32}/>
                             <span className="text-[13px]">Nhấn để Upload ảnh</span>
                          </div>
                       </div>
                       
                       <h3 className="text-[13px] font-bold text-slate-800 mt-4 mb-2">Mô tả</h3>
                       <textarea className="w-full flex-1 border border-slate-300 rounded p-2 outline-none text-[13px]" placeholder="Nhập mô tả cho hạng phòng này..."></textarea>
                    </div>
                 )}

                 {activeTab === 'rooms' && (
                    <div className="h-full bg-white border border-slate-200 rounded shadow-sm flex items-center justify-center p-8 text-slate-500 font-medium text-sm flex-col gap-3">
                       <Search size={48} className="text-slate-200"/>
                       Tìm kiếm phòng hiện có trên hệ thống để gán vào Hạng phòng này.
                    </div>
                 )}
              </div>
           )}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="px-5 py-[10px] bg-white border-t border-slate-200 shrink-0 flex justify-end gap-2 items-center">
            <button 
               onClick={handleSave} 
               disabled={isAdding}
               className="bg-[#00a92f] text-white px-5 py-[7px] rounded text-[13px] font-bold shadow-sm hover:bg-[#009028] transition-colors"
            >
               <div className="flex items-center gap-1.5"> <Save size={15} /> Lưu </div>
            </button>
            <button 
               onClick={handleSave} 
               disabled={isAdding}
               className="bg-[#00a92f] text-white px-5 py-[7px] rounded text-[13px] font-bold shadow-sm hover:bg-[#009028] transition-colors"
            >
               <div className="flex items-center gap-1.5"> <Save size={15} /> Lưu & Thêm mới </div>
            </button>
            <button 
               onClick={onClose} 
               className="bg-[#e4e6eb] text-slate-700 px-5 py-[7px] rounded text-[13px] font-bold shadow-sm hover:bg-[#d8dadf] transition-colors"
            >
               <div className="flex items-center gap-1.5"><X size={15} /> Bỏ qua</div>
            </button>
        </div>

      </div>
    </div>
  );
}
