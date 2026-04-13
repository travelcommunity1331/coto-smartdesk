import React from 'react';
import { Search, BookOpen, Monitor, Phone, FileText, ChevronRight } from 'lucide-react';

export default function HelpCenter() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 font-sans">
      {/* Header Hỗ trợ */}
      <header className="bg-[#0284c7] text-white py-16 px-6 text-center">
         <h1 className="text-4xl font-bold mb-4 drop-shadow-sm">Trung Tâm Hỗ Trợ CoTo SmartDesk</h1>
         <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
            Hệ thống quản lý không sổ sách - Thao tác 1 chạm dành cho người mới bắt đầu.
         </p>
         
         <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-4 text-slate-400" size={24} />
            <input 
              type="text" 
              placeholder="Ví dụ: Cách dọn phòng, Cách ghi nợ..." 
              className="w-full pl-14 pr-4 py-4 rounded-xl text-slate-800 font-medium text-lg focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-xl transition-all"
            />
         </div>
      </header>

      {/* Main Content: Sidebar + Article */}
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col md:flex-row p-6 gap-8 mt-4">
         
         {/* Sidebar Navigation */}
         <aside className="w-full md:w-80 shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sticky top-6">
               <h3 className="font-bold text-lg mb-4 text-slate-800 border-b pb-2">Danh mục hướng dẫn</h3>
               <ul className="space-y-1">
                  <li>
                     <button className="w-full flex items-center justify-between text-left p-3 rounded-lg bg-blue-50 text-[#0284c7] font-bold">
                        <span className="flex items-center gap-2"><Monitor size={18}/> Dành cho Lễ Tân</span>
                     </button>
                  </li>
                  <li>
                     <button className="w-full flex items-center justify-between text-left p-3 rounded-lg hover:bg-slate-50 text-slate-600 font-medium transition">
                        <span className="flex items-center gap-2"><BookOpen size={18}/> Dành cho Tạp Vụ</span>
                     </button>
                  </li>
                  <li>
                     <button className="w-full flex items-center justify-between text-left p-3 rounded-lg hover:bg-slate-50 text-slate-600 font-medium transition">
                        <span className="flex items-center gap-2"><FileText size={18}/> Báo cáo & Chủ nhà</span>
                     </button>
                  </li>
                  <li className="pt-4 mt-2 border-t border-slate-100">
                     <button className="w-full flex items-center justify-between text-left p-3 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 transition shadow-sm">
                        <span className="flex items-center gap-2"><Phone size={18}/> Gọi tổng đài trợ giúp</span>
                     </button>
                  </li>
               </ul>
            </div>
         </aside>

         {/* Article Content */}
         <main className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-10">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
               <span>Trung tâm Hỗ trợ</span> <ChevronRight size={14}/> 
               <span className="text-[#0284c7] font-semibold">Dành cho Lễ Tân</span>
            </div>

            <h2 className="text-3xl font-bold mb-6 text-slate-900 leading-tight">Hướng dẫn: Đọc Sơ Đồ Lưới & Thu Tiền Mì Tôm, Nước Uống</h2>
            
            <div className="prose max-w-none text-slate-600 leading-relaxed space-y-6">
               <p className="text-lg">
                  Xin chào các cô chú Lễ tân! Sơ đồ lưới của CoTo SmartDesk được thiết kế y hệt như <strong>quyển sổ kẻ ngang</strong> truyền thống nhưng thông minh hơn. Hệ thống tự động tính toán tổng tiền và không bao giờ làm mất dữ liệu của khách.
               </p>

               <div className="bg-blue-50 border-l-4 border-[#0284c7] p-4 rounded-r-lg text-slate-800">
                  <strong>⭐ Mẹo nhỏ:</strong> Màu <strong>Xanh</strong> là phòng có khách đang ở, Màu <strong>Cam</strong> là khách đã cọc tiền sắp tới.
               </div>

               <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">1. Thao tác Xem Lịch Trống & Xếp Phòng</h3>
               <p>
                  Trên Sơ đồ lưới màn hình chính, cột dọc bên trái liệt kê Danh sách tên phòng (101, 102...). Trục ngang phía trên là các ngày trong tuần.
                  Tương tự như gióng hàng trên sổ xé: Khi khách hỏi đặt phòng thứ Tư, cô chú chỉ cần nhìn dọc cột <strong>Thứ Tư</strong> xuống, thấy ô nào màu <strong>Trắng (Trống)</strong> là có thể chốt khách ngay!
               </p>

               <div className="border-2 border-dashed border-slate-200 rounded-lg p-10 bg-slate-50 flex items-center justify-center my-6">
                  <span className="text-slate-400 font-medium">Bấm "Trang Chủ" để thực hành xem sơ đồ lưới thực tế</span>
               </div>

               <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">2. Bán Mì Tôm, Nước Ngọt, Cho Thuê Xe (Hệ thống POS)</h3>
               <p>
                  Khi khách đang ở chạy xuống bảo <em>"Cô ơi cho cháu 1 thùng bia và thuê xe máy nửa ngày"</em>. Thay vì đi luống cuống tìm bút ghi nháp để nhớ, hãy làm theo 2 bước cực kỳ nhàn hạ:
               </p>
               <ul className="list-disc pl-6 space-y-3 mt-4 text-slate-700 bg-slate-50 p-6 rounded-lg border border-slate-100">
                  <li><strong>Bước 1:</strong> Ở góc bên phải màn hình (Khu Vực Bán Dịch Vụ), cô chú bấm vào <strong>Biểu tượng Cốc Cà phê</strong> hoặc <strong>Chiếc xe đạp</strong>.</li>
                  <li><strong>Bước 2:</strong> Bấm vào nút <strong>[+]</strong> cạnh chữ Mì Tôm, Bia Hạ Long. Hệ thống tự cộng tiền.</li>
                  <li><strong>Bước 3:</strong> Cuối cùng, ở mục <em>Thêm vào phòng</em>, bấm trỏ vào đúng cái phòng mà khách đang thuê (VD: Phòng 202).</li>
                  <li><strong>Bước 4:</strong> Bấm phím xanh <strong>GHI NỢ HÓA ĐƠN</strong>. </li>
               </ul>
               <p className="mt-4 text-emerald-600 font-medium">
                  🎉 Xong! Đến ngày mai lúc khách trả phòng, hệ thống tự động cộng dồn cả tiền phòng 3 ngày 2 đêm + Tiền Mì Tôm vào làm 1 tờ Phơi khép kín, khách chỉ việc Quét mã QR chuyển khoản tròn tiền!
               </p>
            </div>
         </main>
      </div>
    </div>
  );
}
