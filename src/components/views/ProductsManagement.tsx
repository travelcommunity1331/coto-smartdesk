"use client";
import React, { useState } from 'react';
import { 
  Search, Plus, Download, Upload, LayoutGrid, ChevronDown, 
  ChevronRight, ArrowRight, Star, Copy, Trash2, Edit
} from 'lucide-react';

const mockProducts = [
  { id: 'SP000019', barcode: '', name: 'Câu cá (Lượt)', price: 200000, cost: 0, stock: null, type: 'Dịch vụ' },
  { id: 'SP000020', barcode: '', name: 'Đánh golf (Ngày)', price: 3000000, cost: 0, stock: null, type: 'Dịch vụ' },
  { id: 'SP000015', barcode: '', name: 'Massage (Lần)', price: 700000, cost: 0, stock: null, type: 'Dịch vụ' },
  { id: 'SP000016', barcode: '', name: 'Thuê xe máy (Ngày)', price: 150000, cost: 0, stock: null, type: 'Dịch vụ' },
  { id: 'SP000017', barcode: '', name: 'Thuê oto (Ngày)', price: 2000000, cost: 0, stock: null, type: 'Dịch vụ' },
  { id: 'SP000018', barcode: '', name: 'Trông trẻ (Ngày)', price: 500000, cost: 0, stock: null, type: 'Dịch vụ' },
  { id: 'SP000014', barcode: '', name: 'Xông hơi (Lần)', price: 400000, cost: 0, stock: null, type: 'Dịch vụ' },
  { id: 'SP000009', barcode: '', name: 'Bia Hà Nội (Lon)', price: 25000, cost: 20000, stock: 100013, type: 'Hàng hóa' },
  { id: 'SP000010', barcode: '', name: 'Bia Heneiken (Lon)', price: 35000, cost: 25000, stock: 100013, type: 'Hàng hóa' },
  { id: 'SP000011', barcode: '', name: 'Thịt bò khô (Gói)', price: 80000, cost: 30000, stock: 100015, type: 'Hàng hóa' },
  { id: 'SP000012', barcode: '', name: 'Bim Bim Lays (Gói)', price: 30000, cost: 10000, stock: 100009, type: 'Hàng hóa' },
  { id: 'SP000013', barcode: '', name: 'Cắt tóc (Lần)', price: 100000, cost: 0, stock: null, type: 'Dịch vụ' },
  { id: 'SP000007', barcode: '', name: 'Giặt khô là hơi (Lần)', price: 50000, cost: 48000, stock: null, type: 'Dịch vụ' },
  { id: 'SP000008', barcode: '', name: 'Đưa đón tại sân bay (Lượt)', price: 200000, cost: 191000, stock: null, type: 'Dịch vụ' },
  { id: 'SP000005', barcode: '', name: 'Bánh bông lan (Chiếc)', price: 15000, cost: 14000, stock: 100015, type: 'Hàng hóa' },
];

export function ProductsManagement() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  return (
    <div className="flex h-[calc(100vh-50px)] overflow-hidden bg-slate-50 relative text-[13px] text-slate-800">
      
      {/* CỘT BỘ LỌC TÌM KIẾM (TRÁI) */}
      <div className="w-[240px] bg-slate-50 border-r border-slate-200 shrink-0 overflow-y-auto flex flex-col p-3 gap-3">
        
        {/* Tìm kiếm */}
        <div className="bg-white rounded border border-slate-200 p-3 shadow-sm">
           <h3 className="font-semibold text-slate-800 mb-2">Tìm kiếm</h3>
           <div className="relative">
             <input type="text" placeholder="Theo mã, tên hàng" className="w-full border border-slate-300 rounded px-2 py-1.5 focus:border-[#0070f4] focus:outline-none placeholder:text-slate-400" />
           </div>
        </div>

        {/* Loại hàng */}
        <div className="bg-white rounded border border-slate-200 p-3 shadow-sm">
           <div className="flex justify-between items-center cursor-pointer font-semibold text-slate-800">
             <h3>Loại hàng</h3> <ChevronDown size={14}/>
           </div>
           <div className="mt-3 space-y-2">
             <label className="flex items-center gap-2 cursor-pointer text-slate-600">
               <input type="checkbox" className="w-3.5 h-3.5 text-[#0070f4] rounded-sm" /> Hàng hóa
             </label>
             <label className="flex items-center gap-2 cursor-pointer text-slate-600">
               <input type="checkbox" className="w-3.5 h-3.5 text-[#0070f4] rounded-sm" /> Dịch vụ
             </label>
             <label className="flex items-center gap-2 cursor-pointer text-slate-600">
               <input type="checkbox" className="w-3.5 h-3.5 text-[#0070f4] rounded-sm" /> Combo-Đóng gói
             </label>
           </div>
        </div>

        {/* Nhóm hàng */}
        <div className="bg-white rounded border border-slate-200 p-3 shadow-sm">
           <div className="flex justify-between items-center cursor-pointer font-semibold text-slate-800 mb-2">
             <h3>Nhóm hàng</h3> 
             <div className="flex gap-1">
               <Plus size={14} className="text-slate-400 hover:text-[#0070f4]" />
               <ChevronDown size={14}/>
             </div>
           </div>
           <div className="relative mb-2">
             <Search size={14} className="absolute left-2 top-2 text-slate-400" />
             <input type="text" placeholder="Tìm kiếm nhóm hàng" className="w-full border border-slate-300 rounded pl-7 pr-2 py-1 focus:border-[#0070f4] focus:outline-none placeholder:text-slate-400" />
           </div>
           <div className="space-y-1 font-medium text-slate-700">
             <div className="py-1 px-2 font-bold cursor-pointer hover:bg-slate-50">Tất cả</div>
             <div className="py-1 px-2 cursor-pointer flex items-center hover:bg-slate-50 gap-2"><LayoutGrid size={12} className="text-slate-400"/> Dịch vụ</div>
             <div className="py-1 px-2 cursor-pointer flex items-center hover:bg-slate-50 gap-2"><LayoutGrid size={12} className="text-slate-400"/> Đồ ăn</div>
             <div className="py-1 px-2 cursor-pointer flex items-center hover:bg-slate-50 gap-2"><LayoutGrid size={12} className="text-slate-400"/> Đồ uống</div>
           </div>
        </div>

        {/* Tồn kho */}
        <div className="bg-white rounded border border-slate-200 p-3 shadow-sm">
           <div className="flex justify-between items-center cursor-pointer font-semibold text-slate-800">
             <h3>Tồn kho</h3> <ChevronDown size={14}/>
           </div>
           <div className="mt-3 space-y-2">
             <label className="flex items-center gap-2 cursor-pointer text-slate-600">
               <input type="radio" name="stock" defaultChecked className="w-3.5 h-3.5 text-[#0070f4] accent-[#0070f4]" /> Tất cả
             </label>
             <label className="flex items-center gap-2 cursor-pointer text-slate-600">
               <input type="radio" name="stock" className="w-3.5 h-3.5 text-[#0070f4] accent-[#0070f4]" /> Dưới định mức tồn
             </label>
             <label className="flex items-center gap-2 cursor-pointer text-slate-600">
               <input type="radio" name="stock" className="w-3.5 h-3.5 text-[#0070f4] accent-[#0070f4]" /> Vượt định mức tồn
             </label>
             <label className="flex items-center gap-2 cursor-pointer text-slate-600">
               <input type="radio" name="stock" className="w-3.5 h-3.5 text-[#0070f4] accent-[#0070f4]" /> Còn hàng trong kho
             </label>
             <label className="flex items-center gap-2 cursor-pointer text-slate-600">
               <input type="radio" name="stock" className="w-3.5 h-3.5 text-[#0070f4] accent-[#0070f4]" /> Hết hàng trong kho
             </label>
           </div>
        </div>
        
        {/* Lựa chọn hiển thị (Fake) */}
        <div className="bg-white rounded border border-slate-200 p-3 shadow-sm">
           <div className="flex justify-between items-center cursor-pointer font-semibold text-slate-800">
             <h3>Lựa chọn hiển thị</h3> <ChevronDown size={14}/>
           </div>
        </div>

      </div>

      {/* CỘT DANH SÁCH (PHẢI) */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        
        {/* Header Hành động */}
        <div className="h-[60px] border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0">
          <h1 className="text-xl font-bold text-slate-800">Hàng hóa</h1>
          <div className="flex items-center gap-2 font-semibold">
             <button className="bg-[#00a92f] hover:bg-green-600 text-white px-3 py-1.5 rounded flex items-center gap-1 shadow-sm transition">
               <Plus size={16} /> Thêm mới
             </button>
             <button className="bg-[#00a92f] hover:bg-green-600 text-white px-3 py-1.5 rounded flex items-center gap-1 shadow-sm transition">
               <Download size={16} /> Import
             </button>
             <button className="bg-[#00a92f] hover:bg-green-600 text-white px-3 py-1.5 rounded flex items-center gap-1 shadow-sm transition">
               <Upload size={16} /> Xuất file
             </button>
             <button className="bg-[#00a92f] hover:bg-green-600 text-white px-3 py-1.5 rounded flex items-center gap-1 shadow-sm transition ml-2">
               <LayoutGrid size={16} /> <ChevronDown size={14} />
             </button>
          </div>
        </div>

        {/* Bảng Dữ Liệu */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-[#f2f9ff] text-slate-700 sticky top-0 z-10 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4 font-bold border-r border-slate-200 w-10 text-center">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded-sm accent-[#0070f4]" />
                </th>
                <th className="py-2.5 px-2 font-bold border-r border-slate-200 w-10"></th>
                <th className="py-2.5 px-4 font-bold border-r border-slate-200 w-32 cursor-pointer hover:bg-[#e6f3ff]">Mã hàng hóa</th>
                <th className="py-2.5 px-4 font-bold border-r border-slate-200 w-32 cursor-pointer hover:bg-[#e6f3ff]">Mã vạch</th>
                <th className="py-2.5 px-4 font-bold border-r border-slate-200 cursor-pointer hover:bg-[#e6f3ff]">Tên hàng</th>
                <th className="py-2.5 px-4 font-bold border-r border-slate-200 w-32 cursor-pointer hover:bg-[#e6f3ff] text-right">Giá bán</th>
                <th className="py-2.5 px-4 font-bold border-r border-slate-200 w-32 cursor-pointer hover:bg-[#e6f3ff] text-right">Giá vốn</th>
                <th className="py-2.5 px-4 font-bold w-32 cursor-pointer hover:bg-[#e6f3ff] text-right">Tồn kho</th>
              </tr>
            </thead>
            <tbody>
              {/* Fake Tổng Cộng */}
              <tr className="border-b border-slate-200 bg-[#fffae6] font-bold text-slate-800">
                <td colSpan={5} className="py-2 px-4 text-right"></td>
                <td className="py-2 px-4 text-right"></td>
                <td className="py-2 px-4 text-right"></td>
                <td className="py-2 px-4 text-right text-rose-600">2,000,118</td>
              </tr>
              {/* Data Rows */}
              {mockProducts.map((p, index) => (
                <tr key={index} className="border-b border-slate-100 hover:bg-[#f6f9fc] cursor-pointer group">
                  <td className="py-2.5 px-4 text-center border-r border-transparent group-hover:border-slate-200 transition-colors">
                    <input type="checkbox" className="w-3 h-3 rounded-sm accent-[#0070f4]" />
                  </td>
                  <td className="py-2.5 px-2 border-r border-transparent group-hover:border-slate-200 text-center">
                     <Star size={14} className="text-slate-300 hover:text-amber-400" />
                  </td>
                  <td className="py-2.5 px-4 border-r border-transparent group-hover:border-slate-200 text-[#0070f4]">{p.id}</td>
                  <td className="py-2.5 px-4 border-r border-transparent group-hover:border-slate-200">{p.barcode}</td>
                  <td className="py-2.5 px-4 border-r border-transparent group-hover:border-slate-200 font-medium">{p.name}</td>
                  <td className="py-2.5 px-4 border-r border-transparent group-hover:border-slate-200 text-right">{formatVND(p.price)}</td>
                  <td className="py-2.5 px-4 border-r border-transparent group-hover:border-slate-200 text-right">{p.cost > 0 ? formatVND(p.cost) : '0'}</td>
                  <td className="py-2.5 px-4 text-right font-medium">{p.stock !== null ? formatVND(p.stock) : '---'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="flex items-center gap-4 text-slate-500 py-3 px-4 border-t border-slate-200 bg-white sticky bottom-0">
             <div className="flex items-center gap-1 font-mono text-sm">
                <button className="px-2 py-1 hover:bg-slate-100 rounded">I◄</button>
                <button className="px-2 py-1 hover:bg-slate-100 rounded">◄</button>
                <button className="px-3 py-1 bg-[#0070f4] text-white rounded">1</button>
                <button className="px-3 py-1 hover:bg-slate-100 rounded">2</button>
                <button className="px-2 py-1 hover:bg-slate-100 rounded">►</button>
                <button className="px-2 py-1 hover:bg-slate-100 rounded">►I</button>
             </div>
             <div>Hiển thị 1 - 15 trên tổng số 20 hàng hóa</div>
          </div>
        </div>

      </div>
    </div>
  );
}
