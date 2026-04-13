import React from 'react';
import { Coffee, Bike, Sun, PlusCircle } from 'lucide-react';

export function PosMenu() {
  const categories = [
    { id: 'food_drink', name: 'Đồ Ăn & Uống', icon: <Coffee size={20}/>, items: [
      { name: 'Mì tô trứng', price: '30.000đ' },
      { name: 'Bia Hạ Long', price: '20.000đ' },
      { name: 'Nước suối', price: '10.000đ' }
    ]},
    { id: 'transport', name: 'Thuê Xe', icon: <Bike size={20}/>, items: [
      { name: 'Xe máy (Ngày)', price: '150.000đ' },
      { name: 'Xe máy (Nửa ngày)', price: '80.000đ' },
    ]},
    { id: 'tour', name: 'Tour Đảo', icon: <Sun size={20}/>, items: [
      { name: 'Đảo Cô Tô Con (Thuyền)', price: '800.000đ' },
      { name: 'Vé Bãi Biển (BBQ)', price: '250.000đ' },
    ]}
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 mt-6 lg:mt-0 p-6">
      <h3 className="text-lg font-bold mb-4">Giao diện POS (Bán Cross-sale)</h3>
      
      <div className="space-y-6">
        {categories.map((cat) => (
           <div key={cat.id}>
             <h4 className="flex items-center gap-2 font-bold text-slate-700 mb-3 border-b border-slate-100 pb-2">
               {cat.icon} {cat.name}
             </h4>
             <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
               {cat.items.map((item, idx) => (
                 <button key={idx} className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex flex-col items-start hover:border-coto-blue hover:bg-blue-50 transition group">
                   <span className="font-semibold text-sm line-clamp-1">{item.name}</span>
                   <div className="flex justify-between items-center w-full mt-2">
                      <span className="text-coto-blue font-bold text-sm">{item.price}</span>
                      <PlusCircle size={16} className="text-slate-300 group-hover:text-coto-blue" />
                   </div>
                 </button>
               ))}
             </div>
           </div>
        ))}
      </div>
      
      {/* Box Giỏ hàng hóa đơn khẩn */}
      <div className="mt-6 border-t-2 border-dashed border-slate-200 pt-4 bg-slate-50 p-4 rounded-xl">
         <div className="flex justify-between items-center mb-2">
           <span className="font-semibold">Thêm vào phòng: </span>
           <select className="bg-white border border-slate-200 rounded p-1 text-sm font-bold text-coto-blue">
             <option>Phòng 101 - A. Hoàng Vĩ</option>
             <option>Phòng 202 - C. Lan Tây</option>
           </select>
         </div>
         <div className="flex justify-between items-end mt-4">
            <div>
               <p className="text-xs text-slate-500">Tạm tính (0 món)</p>
               <h3 className="text-2xl font-bold">0đ</h3>
            </div>
            <button className="bg-coto-blue text-white px-6 py-2 rounded-lg font-bold shadow-sm opacity-50 cursor-not-allowed">
               Ghi Nợ Hóa Đơn
            </button>
         </div>
      </div>
    </div>
  );
}
