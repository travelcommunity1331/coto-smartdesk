"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { Coffee, Bike, Sun, PlusCircle, MinusCircle, Loader2 } from 'lucide-react';

export function PosMenu() {
  const [categories, setCategories] = useState<any[]>([]);
  const [activeBookings, setActiveBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [selectedBookingId, setSelectedBookingId] = useState("");
  
  // Rổ hàng (Cart)
  const [cart, setCart] = useState<{item: any, qty: number}[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUser(user);

      // Lấy danh sách mặt hàng
      const { data: itemsData } = await supabase
        .from('pos_items')
        .select('*')
        .eq('user_id', user.id);
      
      // Xử lý gom nhóm danh sách items thành Categories
      if (itemsData) {
        const grouped = itemsData.reduce((acc: any, item) => {
          if (!acc[item.category]) acc[item.category] = [];
          acc[item.category].push(item);
          return acc;
        }, {});

        const catArray = Object.keys(grouped).map(k => ({
          id: k,
          name: k === 'Food' ? 'Đồ Ăn & Uống' : k === 'Transport' ? 'Thuê Xe' : k === 'Tour' ? 'Tour Đảo' : k,
          icon: k === 'Food' ? <Coffee size={20}/> : k === 'Transport' ? <Bike size={20}/> : <Sun size={20}/>,
          items: grouped[k]
        }));
        setCategories(catArray);
      }

      // Lấy danh sách booking ĐANG active (Đã Check-in hoặc Cọc)
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*, rooms(name)')
        .eq('user_id', user.id)
        .in('status', ['reserved', 'checked_in'])
        .order('check_in', { ascending: true });
        
      setActiveBookings(bookingsData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createMockPosItems = async () => {
    if (!user) return;
    try {
      await supabase.from('pos_items').insert([
        { user_id: user.id, name: 'Mì tô trứng', category: 'Food', default_price: 30000 },
        { user_id: user.id, name: 'Bia Hạ Long', category: 'Food', default_price: 20000 },
        { user_id: user.id, name: 'Xe máy (Ngày)', category: 'Transport', default_price: 150000 },
        { user_id: user.id, name: 'Đảo Cô Tô Con', category: 'Tour', default_price: 800000 },
      ]);
      fetchData();
    } catch(err) {
      console.error(err);
    }
  };

  const addToCart = (item: any) => {
    setCart(prev => {
      const exist = prev.find(i => i.item.id === item.id);
      if (exist) {
        return prev.map(i => i.item.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { item, qty: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.item.id !== itemId));
  };

  const totalPrice = cart.reduce((sum, current) => sum + (current.item.default_price * current.qty), 0);

  const handleCheckout = async () => {
    if (!selectedBookingId || cart.length === 0 || !user) return;
    setIsSubmitting(true);
    
    try {
      // Build batch insert payload
      const payload = cart.map(c => ({
        user_id: user.id,
        booking_id: selectedBookingId,
        item_id: c.item.id,
        quantity: c.qty,
        total_price: c.item.default_price * c.qty
      }));

      const { error } = await supabase.from('pos_orders').insert(payload);
      if (error) throw error;
      
      alert("Ghi nợ thành công vào hóa đơn phòng!");
      setCart([]); // Clear cart
      
    } catch(err: any) {
      alert("Lỗi ghi nợ: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="bg-white rounded-xl shadow-sm border border-slate-100 mt-6 lg:mt-0 p-6 flex items-center justify-center h-64 text-slate-400">
      <Loader2 className="animate-spin" />
    </div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 mt-6 lg:mt-0 p-6 flex flex-col h-full">
      <h3 className="text-lg font-bold mb-4">Giao diện POS (Bán Cross-sale)</h3>
      
      {categories.length === 0 ? (
         <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
           <p className="mb-4 text-sm mt-4">Chưa có danh mục Hàng bán nào.</p>
           <button onClick={createMockPosItems} className="bg-coto-blue text-white px-4 py-2 rounded shadow text-sm font-bold mb-4">
             Tạo Menu Demo
           </button>
         </div>
      ) : (
        <div className="space-y-6 flex-1 overflow-y-auto pr-2 pb-4 hide-scrollbar">
          {categories.map((cat) => (
             <div key={cat.id}>
               <h4 className="flex items-center gap-2 font-bold text-slate-700 mb-3 border-b border-slate-100 pb-2">
                 {cat.icon} {cat.name}
               </h4>
               <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                 {cat.items.map((item: any) => (
                   <button 
                     key={item.id} 
                     onClick={() => addToCart(item)}
                     className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col items-start hover:border-coto-blue hover:bg-blue-50 transition group"
                   >
                     <span className="font-semibold text-sm line-clamp-1 text-left">{item.name}</span>
                     <div className="flex justify-between items-center w-full mt-2">
                        <span className="text-coto-blue font-bold text-sm">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.default_price)}
                        </span>
                        <PlusCircle size={16} className="text-slate-300 group-hover:text-coto-blue" />
                     </div>
                   </button>
                 ))}
               </div>
             </div>
          ))}
        </div>
      )}
      
      {/* Box Giỏ hàng hóa đơn khẩn */}
      <div className="mt-4 border-t-2 border-dashed border-slate-200 pt-4 bg-slate-50 p-4 rounded-xl shrink-0">
         <div className="flex justify-between items-center mb-3 gap-2">
           <span className="font-semibold whitespace-nowrap text-sm">Thêm vào: </span>
           {activeBookings.length === 0 ? (
             <span className="text-xs text-rose-500 font-bold bg-rose-100 px-2 py-1 rounded">Chưa có khách lưu trú</span>
           ) : (
             <select 
               className="bg-white border border-slate-200 rounded p-1 text-sm font-bold text-coto-blue w-full truncate"
               value={selectedBookingId}
               onChange={e => setSelectedBookingId(e.target.value)}
             >
               <option value="">-- Chọn khách / phòng --</option>
               {activeBookings.map(b => (
                 <option key={b.id} value={b.id}>
                   {(b.rooms as any)?.name} - {b.guest_name}
                 </option>
               ))}
             </select>
           )}
         </div>

         {/* Danh sách nháp đồ đang chọn (nếu có) */}
         {cart.length > 0 && (
           <div className="mb-3 space-y-2 max-h-32 overflow-y-auto pr-1 text-sm bg-white p-2 rounded border border-slate-200">
             {cart.map((c) => (
               <div key={c.item.id} className="flex justify-between items-center border-b border-slate-50 pb-1">
                 <div className="truncate pr-2 font-medium">x{c.qty} {c.item.name}</div>
                 <button onClick={() => removeFromCart(c.item.id)} className="text-rose-400 hover:text-rose-600 bg-rose-50 rounded p-0.5"><MinusCircle size={14}/></button>
               </div>
             ))}
           </div>
         )}

         <div className="flex justify-between items-end mt-2">
            <div>
               <p className="text-xs text-slate-500">Tạm tính ({cart.length} món)</p>
               <h3 className="text-xl font-bold text-slate-800">
                 {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
               </h3>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={cart.length === 0 || !selectedBookingId || isSubmitting}
              className={`px-5 py-2 rounded-lg font-bold shadow-sm transition ${cart.length === 0 || !selectedBookingId ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-coto-blue text-white hover:bg-coto-blue/90'}`}
            >
               {isSubmitting ? <Loader2 size={16} className="animate-spin mx-auto"/> : 'Ghi Nợ'}
            </button>
         </div>
      </div>
    </div>
  );
}
