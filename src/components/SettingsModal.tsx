"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { X, BedDouble, Plus, Trash2, Loader2, Save } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // Trigger reload on parent
}

export function SettingsModal({ isOpen, onClose, onSuccess }: SettingsModalProps) {
  const [rooms, setRooms] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Create Room State
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomType, setNewRoomType] = useState("Phòng Đơn");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (isOpen) fetchRooms();
  }, [isOpen]);

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

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName || !user) return;
    
    setIsAdding(true);
    try {
      const { error } = await supabase.from('rooms').insert([{
        user_id: user.id,
        name: newRoomName,
        type: newRoomType,
        price_per_night: newRoomType.includes("Đơn") ? 500000 : 800000
      }]);

      if (error) throw error;
      
      setNewRoomName("");
      fetchRooms();
      onSuccess();
    } catch(err: any) {
      alert("Lỗi thêm phòng: " + err.message);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteRoom = async (id: string) => {
    if (!confirm("Xóa buồng phòng này? Các booking liên quan có thể bị ảnh hưởng.")) return;
    try {
      const { error } = await supabase.from('rooms').delete().eq('id', id);
      if (error) throw error;
      fetchRooms();
      onSuccess();
    } catch (err: any) {
      alert("Lỗi xóa phòng: " + err.message);
    }
  };

  const handleChangeStatus = async (id: string, newStatus: string) => {
    try {
      await supabase.from('rooms').update({ status: newStatus }).eq('id', id);
      fetchRooms();
      onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-coto-dark text-white p-5 pr-12 flex items-center justify-between shrink-0">
           <h2 className="text-lg font-bold flex items-center gap-2">
             <BedDouble size={20} className="text-coto-blue"/> Thiết Lập Kho Phòng
           </h2>
        </div>
        <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-rose-400 bg-white/10 rounded-full p-1 transition">
          <X size={20} />
        </button>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
           
           {/* Add Room Form */}
           <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-6">
              <h3 className="font-bold text-slate-800 mb-3 text-sm uppercase">Cấp mới buồng phòng</h3>
              <form onSubmit={handleAddRoom} className="flex gap-3 items-end">
                <div className="flex-1">
                   <label className="text-xs text-slate-500 mb-1 block">Tên phòng (VD: Phòng 101)</label>
                   <input required type="text" value={newRoomName} onChange={e => setNewRoomName(e.target.value)} className="w-full border border-slate-200 rounded px-3 py-2 outline-none focus:border-coto-blue h-10" />
                </div>
                <div className="flex-1">
                   <label className="text-xs text-slate-500 mb-1 block">Hạng phòng</label>
                   <select value={newRoomType} onChange={e => setNewRoomType(e.target.value)} className="w-full border border-slate-200 rounded px-3 py-2 outline-none focus:border-coto-blue h-10">
                     <option>Phòng Đơn</option>
                     <option>Phòng Đôi</option>
                     <option>Phòng Gia Đình</option>
                     <option>Dorm (Tập thể)</option>
                     <option>VIP</option>
                   </select>
                </div>
                <button type="submit" disabled={isAdding} className="bg-coto-blue text-white h-10 px-6 rounded font-bold flex items-center justify-center gap-2 hover:bg-coto-blue/90 disabled:opacity-50">
                  {isAdding ? <Loader2 size={16} className="animate-spin" /> : <><Plus size={16} /> Thêm</>}
                </button>
              </form>
           </div>

           {/* Room List grid */}
           <div>
             <h3 className="font-bold text-slate-800 mb-3 text-sm uppercase">Danh sách Buồng phòng hiện tại ({rooms.length})</h3>
             {loading ? (
               <div className="flex justify-center p-8"><Loader2 className="animate-spin text-coto-blue" /></div>
             ) : rooms.length === 0 ? (
               <div className="text-center p-8 text-slate-500 border-2 border-dashed border-slate-200 rounded-xl bg-white">Chưa có buồng phòng nào.</div>
             ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                 {rooms.map(r => (
                   <div key={r.id} className="bg-white border border-slate-200 p-4 rounded-xl flex items-start justify-between group shadow-sm">
                      <div>
                        <div className="font-bold flex items-center gap-2">
                          {r.name} 
                          {r.status === 'dirty' && <span className="bg-rose-100 text-rose-600 text-[10px] px-1.5 py-0.5 rounded uppercase">Cần dọn</span>}
                          {r.status === 'maintenance' && <span className="bg-amber-100 text-amber-600 text-[10px] px-1.5 py-0.5 rounded uppercase">Sửa chữa</span>}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">{r.type}</div>
                        
                        <div className="mt-3 flex gap-2">
                           <button 
                             onClick={() => handleChangeStatus(r.id, r.status === 'dirty' ? 'clean' : 'dirty')}
                             className={`text-[10px] px-2 py-1 rounded border transition ${r.status === 'dirty' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}`}
                           >
                             {r.status === 'dirty' ? 'Đã dọn xong' : 'Báo bẩn'}
                           </button>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteRoom(r.id)} className="text-slate-300 hover:text-rose-500 transition opacity-0 group-hover:opacity-100 p-1">
                        <Trash2 size={16} />
                      </button>
                   </div>
                 ))}
               </div>
             )}
           </div>

        </div>

      </div>
    </div>
  );
}
