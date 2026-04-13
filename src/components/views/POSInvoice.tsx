import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';

export function POSInvoice() {
  const [activeFilter, setActiveFilter] = useState('all');
  
  const products = [
    { id: 1, name: 'Đánh golf (Ngày)', price: 3000000, type: 'dich_vu', image: '⛳' },
    { id: 2, name: 'Câu cá (Lượt)', price: 200000, type: 'dich_vu', image: '🎣' },
    { id: 3, name: 'Trông trẻ (Ngày)', price: 500000, type: 'dich_vu', image: '👶' },
    { id: 4, name: 'Thuê oto (Ngày)', price: 2000000, type: 'dich_vu', image: '🚗' },
    { id: 5, name: 'Thuê xe máy (Ngày)', price: 150000, type: 'dich_vu', image: '🛵' },
    { id: 6, name: 'Bim Bim Lays (Gói)', price: 30000, type: 'do_an', image: '🥔' },
    { id: 7, name: 'Thịt bò khô (Gói)', price: 80000, type: 'do_an', image: '🥩' },
    { id: 8, name: 'Bia Heineken (Lon)', price: 35000, type: 'do_uong', image: '🍺' },
    { id: 9, name: 'Bia Hà Nội (Lon)', price: 25000, type: 'do_uong', image: '🍻' },
    { id: 10, name: 'Đưa đón sbay (Lượt)', price: 200000, type: 'dich_vu', image: '✈️' },
    { id: 11, name: 'Mỳ tôm (Hộp)', price: 15000, type: 'do_an', image: '🍜' },
    { id: 12, name: 'Nước khoáng (Chai)', price: 15000, type: 'do_uong', image: '💧' },
  ];

  const formatVND = (num: number) => new Intl.NumberFormat('vi-VN').format(num);

  const filteredProducts = products.filter(p => {
    if (activeFilter === 'all') return true;
    return p.type === activeFilter;
  });

  return (
    <div className="flex h-full w-full bg-[#f0f2f5] overflow-hidden">
      
      {/* Left Sidebar: Products/Services List */}
      <div className="w-[380px] bg-[#f5f7fa] border-r border-slate-200 flex flex-col h-full shrink-0">
         <div className="p-3 bg-white border-b border-slate-200">
            <div className="relative w-full">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
               <input 
                 type="text" 
                 placeholder="Tìm theo tên, mã hàng hóa (F3)" 
                 className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 focus:border-[#1b8655] rounded text-sm outline-none transition-all shadow-sm"
               />
            </div>
            
            <div className="flex gap-2 mt-3 overflow-x-auto px-1 pb-1 scrollbar-hide">
               <button 
                 onClick={() => setActiveFilter('all')}
                 className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${activeFilter === 'all' ? 'bg-[#1b8655] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>Tất cả</button>
               <button 
                 onClick={() => setActiveFilter('dich_vu')}
                 className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${activeFilter === 'dich_vu' ? 'bg-[#1b8655] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>Dịch vụ</button>
               <button 
                 onClick={() => setActiveFilter('do_an')}
                 className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${activeFilter === 'do_an' ? 'bg-[#1b8655] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>Đồ ăn</button>
               <button 
                 onClick={() => setActiveFilter('do_uong')}
                 className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${activeFilter === 'do_uong' ? 'bg-[#1b8655] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>Đồ uống</button>
            </div>
         </div>

         <div className="flex-1 overflow-y-auto p-3">
             <div className="grid grid-cols-2 gap-3">
                {filteredProducts.map(p => (
                   <div key={p.id} className="bg-white rounded border border-slate-200 hover:border-[#1b8655] cursor-pointer overflow-hidden transition-colors shadow-sm flex flex-col">
                      <div className="h-20 bg-slate-100 flex justify-center items-center text-4xl border-b border-slate-100">
                         {p.image}
                      </div>
                      <div className="p-2">
                         <div className="font-bold text-[#101828] text-sm leading-tight mb-1">{p.name}</div>
                         <div className="text-[13px] text-slate-500 font-medium">{formatVND(p.price)}</div>
                      </div>
                   </div>
                ))}
             </div>
         </div>
      </div>

      {/* Right Side: Cart / Context area */}
      <div className="flex-1 bg-white flex flex-col relative h-full">
         
         {/* Cart Header (Customer info) */}
         <div className="h-[60px] border-b border-slate-200 flex items-center px-4 bg-slate-50 gap-6 shrink-0">
            <div className="flex-1">
               <div className="text-[11px] text-slate-500 mb-0.5">Khách hàng</div>
               <div className="text-sm font-semibold text-slate-400">Nhập mã, tên, SĐT khách <Plus size={14} className="inline ml-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 cursor-pointer p-0.5 rounded-full bg-slate-100"/></div>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div className="w-48">
               <div className="text-[11px] text-slate-500 mb-0.5">Kênh bán</div>
               <div className="text-sm font-semibold text-slate-800 flex items-center gap-1">Khách đến trực tiếp</div>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div className="flex-1">
               <div className="text-[11px] text-slate-500 mb-0.5">Ghi chú</div>
               <input type="text" placeholder="Chưa có ghi chú" className="text-sm bg-transparent outline-none w-full" />
            </div>
         </div>

         {/* Empty Cart State */}
         <div className="flex-1 flex flex-col justify-center items-center text-slate-400">
            <div className="text-sm font-medium">Chưa có dịch vụ, sản phẩm</div>
         </div>

      </div>
    </div>
  );
}
