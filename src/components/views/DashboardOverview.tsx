"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { FileText, CheckCircle, Clock, XCircle, ArrowUpRight, ArrowDownRight, DollarSign, Wallet, FileArchive, Settings } from 'lucide-react';
import { BookingModal } from "@/components/BookingModal";

export function DashboardOverview() {
  const [metrics, setMetrics] = useState({
    occupancy: 0,
    checkIns: 0,
    checkOuts: 0,
    dirtyRooms: 0,
    revenue: 0,
    soldRooms: 0
  });
  const [history, setHistory] = useState<any[]>([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerReload = () => setRefreshKey(prev => prev + 1);

  useEffect(() => {
    fetchData();
    fetchHistory();
  }, [refreshKey]);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Lấy rooms
    const { data: rooms } = await supabase.from('rooms').select('*').eq('user_id', user.id);
    const totalRooms = rooms ? rooms.length : 0;
    const dirtyRooms = rooms ? rooms.filter(r => r.status === 'dirty').length : 0;

    // Lấy bookings hôm nay
    const todayString = new Date().toISOString().split('T')[0];
    const { data: bookings } = await supabase.from('bookings').select('*').eq('user_id', user.id);

    let checkIns = 0;
    let checkOuts = 0;
    let occupiedCount = 0;
    let soldRooms = 0;

    if (bookings) {
      bookings.forEach(b => {
        const bIn = b.check_in.split('T')[0];
        const bOut = b.check_out.split('T')[0];
        if (bIn === todayString) checkIns++;
        if (bOut === todayString) checkOuts++;
        if (b.status === 'checked_in') occupiedCount++;
        if (bIn === todayString && b.status !== 'cancelled') soldRooms++;
      });
    }

    // Doanh thu (Pos Orders tổng hợp nháp)
    const { data: posOrders } = await supabase.from('pos_orders').select('total_price').eq('user_id', user.id);
    const revenue = posOrders ? posOrders.reduce((acc, curr) => acc + Number(curr.total_price), 0) : 0;

    setMetrics({
      occupancy: totalRooms > 0 ? Math.round((occupiedCount / totalRooms) * 100) : 0,
      checkIns,
      checkOuts,
      dirtyRooms,
      revenue,
      soldRooms
    });
  };

  const fetchHistory = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from('bookings')
      .select('*, rooms(name)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);
    setHistory(data || []);
  };

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  const getStatusIconColor = (status: string) => {
    if (status === 'checked_in') return "bg-[#0070f4] text-white";
    if (status === 'cancelled') return "bg-rose-500 text-white";
    return "bg-slate-200 text-slate-600";
  }

  const formatTimeAgo = (isoString: string) => {
    const diffMin = Math.floor((new Date().getTime() - new Date(isoString).getTime()) / 60000);
    if (diffMin < 60) return `${diffMin} phút trước`;
    if (diffMin < 1440) return `${Math.floor(diffMin / 60)} giờ trước`;
    return `${Math.floor(diffMin / 1440)} ngày trước`;
  }

  return (
    <div className="flex h-[calc(100vh-50px)] overflow-hidden">
      
      {/* CỘT TỔNG QUAN CHÍNH */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20">
        
        {/* KPI BOARD MÔ PHỎNG KIOTVIET */}
        <div className="bg-white rounded shadow-sm border border-slate-200 mb-6">
           <div className="flex items-center gap-2 p-3 border-b border-slate-100">
             <h2 className="font-bold text-sm text-slate-800 uppercase pl-2">Kinh doanh hôm nay</h2>
             <span className="bg-[#00a92f] text-white text-[11px] px-2 py-0.5 rounded font-bold">
               Tổng doanh thu: {formatVND(metrics.revenue)}
             </span>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              
              {/* Doanh thu */}
              <div className="p-4 flex flex-col justify-between">
                <span className="text-slate-500 text-xs font-semibold">Doanh thu</span>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{formatVND(metrics.revenue)}</h3>
                <div className="flex items-center gap-1 mt-2 mb-4 text-xs">
                  <ArrowUpRight size={14} className="text-[#00a92f]" />
                  <span className="text-[#00a92f] font-bold">Lãi nháp tạm tính</span>
                </div>
                <div className="grid grid-cols-2 text-xs text-slate-600 bg-slate-50 p-2 rounded">
                   <div>Khách Check-in <br/><span className="font-bold text-slate-800">{metrics.checkIns} đoàn</span></div>
                   <div>Sắp Check-out <br/><span className="font-bold text-amber-600">{metrics.checkOuts} đoàn</span></div>
                </div>
              </div>

              {/* Công suất */}
              <div className="p-4 flex flex-col justify-between">
                <span className="text-slate-500 text-xs font-semibold">Công suất phòng</span>
                <div className="flex justify-between items-start mt-1">
                  <h3 className="text-2xl font-bold text-slate-800">{metrics.occupancy}%</h3>
                  {/* Fake donut chart visual */}
                  <div className="w-12 h-12 rounded-full border-[6px] border-slate-100 border-l-[#0070f4] flex items-center justify-center"></div>
                </div>
                <div className="flex items-center gap-1 mt-2 mb-4 text-xs">
                  <span className="text-slate-400">Trạng thái lấp đầy</span>
                </div>
                <div className="grid grid-cols-2 text-xs text-slate-600 bg-slate-50 p-2 rounded">
                   <div>Đang lưu trú <br/><span className="font-bold text-slate-800">{metrics.occupancy > 0 ? 1 : 0} phòng</span></div>
                   <div>Phòng trống <br/><span className="font-bold text-emerald-600">{metrics.occupancy === 0 ? 4 : 3} phòng</span></div>
                </div>
              </div>

              {/* Thu Chi */}
              <div className="p-4 flex flex-col justify-between">
                <span className="text-slate-500 text-xs font-semibold">Thu - Chi (Ước tính)</span>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{formatVND(metrics.revenue)}</h3>
                <div className="flex items-center gap-1 mt-2 mb-4 text-xs">
                   <div className="h-6 w-full flex items-end gap-1">
                      <div className="w-1/3 bg-[#0070f4] h-full rounded-sm"></div>
                      <div className="w-1/3 bg-rose-500 h-1/4 rounded-sm"></div>
                   </div>
                </div>
                <div className="grid grid-cols-2 text-xs text-slate-600 bg-slate-50 p-2 rounded">
                   <div>Tổng thu <br/><span className="font-bold text-[#0070f4]">{formatVND(metrics.revenue)}</span></div>
                   <div>Tổng chi <br/><span className="font-bold text-rose-500">0</span></div>
                </div>
              </div>

           </div>

           {/* Row Phụ */}
           <div className="border-t border-slate-100 flex p-3 text-sm text-slate-700 divide-x divide-slate-100">
             <div className="flex-1 px-4 cursor-pointer hover:text-[#0070f4]">Phòng bán hôm nay <br/><span className="text-lg font-bold">{metrics.soldRooms} phòng</span></div>
             <div className="flex-1 px-4 cursor-pointer hover:text-[#0070f4]">Phòng đã nhận <br/><span className="text-lg font-bold">{metrics.checkIns} phòng</span></div>
             <div className="flex-1 px-4 cursor-pointer hover:text-[#0070f4]">Phòng dự trả <br/><span className="text-lg font-bold">{metrics.checkOuts} phòng</span></div>
             <div className="flex-1 px-4 cursor-pointer hover:text-[#0070f4]">Cần dọn <br/><span className="text-lg font-bold text-rose-500">{metrics.dirtyRooms} phòng</span></div>
           </div>
        </div>

        {/* CÔNG SUẤT SỬ DỤNG PHÒNG THÁNG NÀY */}
        <div className="bg-white rounded shadow-sm border border-slate-200 mb-6 p-4 h-[400px] flex flex-col">
           <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-[13px] text-slate-800 uppercase">Công suất sử dụng phòng tháng này</h3>
             <span className="text-[13px] text-slate-500 cursor-pointer">Tháng này ▾</span>
           </div>
           <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#0070f4] text-white flex items-center justify-center font-bold text-xs">%</div>
              <div>
                <div className="text-xs text-slate-500">Trung bình</div>
                <div className="font-bold text-lg">{metrics.occupancy}%</div>
              </div>
           </div>
           
           {/* Chart Fake area */}
           <div className="flex-1 border-t border-b border-l border-slate-200 relative mt-2 text-[11px] text-slate-500">
              <div className="absolute left-[-35px] bottom-[10%] w-8 text-right">0%</div>
              <div className="absolute left-[-35px] bottom-[30%] w-8 text-right">20%</div>
              <div className="absolute left-[-35px] bottom-[50%] w-8 text-right">50%</div>
              <div className="absolute left-[-35px] bottom-[70%] w-8 text-right">80%</div>
              <div className="absolute left-[-35px] bottom-[90%] w-8 text-right">100%</div>
              
              {/* Lines */}
              <div className="absolute w-full h-[1px] bg-slate-100 bottom-[10%]"></div>
              <div className="absolute w-full h-[1px] bg-slate-100 bottom-[30%]"></div>
              <div className="absolute w-full h-[1px] bg-slate-100 bottom-[50%]"></div>
              <div className="absolute w-full h-[1px] bg-slate-100 bottom-[70%]"></div>
              <div className="absolute w-full h-[1px] bg-slate-100 bottom-[90%]"></div>
              
              <div className="absolute bottom-[-20px] left-10">06</div>
              <div className="absolute bottom-[-20px] left-20">07</div>
              <div className="absolute bottom-[-20px] left-30">08</div>
              <div className="absolute bottom-[-20px] left-40">09</div>
              <div className="absolute bottom-[-20px] left-50">10</div>
              
              <svg className="absolute w-full h-full" preserveAspectRatio="none">
                 <polyline points="0,200 40,200 80,200 120,200 160,200 200,160 220,180 250,160" fill="none" stroke="#0070f4" strokeWidth="2" />
                 <circle cx="200" cy="160" r="4" fill="#0070f4" />
                 <circle cx="220" cy="180" r="4" fill="#0070f4" />
                 <circle cx="250" cy="160" r="4" fill="#0070f4" />
              </svg>
              
              <div className="absolute bottom-[-40px] left-0 w-full flex justify-center items-center gap-2 text-slate-800">
                 <div className="w-2 h-2 bg-[#0070f4]"></div> Chi nhánh trung tâm
              </div>
           </div>
        </div>

      </div>

      {/* CỘT BÊN PHẢI (SIDEBAR THAO TÁC + NHẬT KÝ) */}
      <div className="w-80 border-l border-slate-200 bg-slate-50 hidden lg:flex flex-col p-4 space-y-4">
        
        {/* Vay vốn / Thanh toán */}
        <div className="bg-white rounded mb-2 flex justify-around p-3 shadow-sm border border-slate-200">
           <div className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80">
              <DollarSign size={20} className="text-[#0070f4]" />
              <span className="text-[13px] font-medium text-slate-700">Vay vốn</span>
           </div>
           <div className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80">
              <Wallet size={20} className="text-[#00a92f]" />
              <span className="text-[13px] font-medium text-slate-700">Thanh toán</span>
           </div>
        </div>

        {/* Hóa đơn điện tử */}
        <div className="bg-blue-50/50 p-4 rounded border border-blue-200 shadow-sm relative overflow-hidden">
           <h3 className="text-[13px] font-bold text-slate-800 leading-snug pr-4">Phát hành hóa đơn điện tử khởi tạo từ máy tính tiền</h3>
           <div className="flex gap-2 mt-4 text-[13px] font-semibold">
              <button className="bg-[#0070f4] text-white px-4 py-1.5 rounded hover:bg-blue-600 transition">Cài đặt ngay</button>
              <button className="text-[#0070f4] px-2 hover:bg-blue-50 rounded">Không hiển thị lại</button>
           </div>
        </div>

        {/* Các hoạt động gần đây (Timeline) */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white rounded border border-slate-200 shadow-sm">
          <div className="p-4 py-3 border-b border-slate-100 shrink-0">
             <h3 className="text-xs font-bold text-slate-800 uppercase">Các hoạt động gần đây</h3>
          </div>
          <div className="p-4 overflow-y-auto space-y-6">
            
            {history.length === 0 ? (
               <div className="text-xs text-slate-400 text-center">Chưa có giao dịch.</div>
            ) : (
               history.map((log: any) => (
                 <div key={log.id} className="flex gap-3 items-start group">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-sm bg-[#0070f4] text-white`}>
                       <FileText size={12} />
                    </div>
                    <div className="text-[13px] leading-snug">
                       <p className="text-slate-800">
                         <span className="font-bold text-[#0070f4]">Lễ tân</span> vừa <span className="text-[#0070f4]">nhận đặt phòng</span> với giá trị <span className="font-bold text-slate-800">{formatVND(log.total_price || 0)}</span>
                       </p>
                       <p className="text-[11px] text-slate-500 mt-1">{formatTimeAgo(log.created_at)}</p>
                    </div>
                 </div>
               ))
            )}

          </div>
        </div>

      </div>
      
      {/* GỌI POPUP ĐẶT PHÒNG Ở ĐÂY NẾU CẦN */}
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        onSuccess={triggerReload}
      />
    </div>
  );
}
