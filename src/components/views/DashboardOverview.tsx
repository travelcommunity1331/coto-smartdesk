"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { RoomGrid } from "@/components/views/RoomGrid";
import { PosMenu } from "@/components/PosMenu";
import { FileText, CheckCircle, Clock, XCircle, ArrowUpRight, ArrowDownRight, DollarSign, Wallet, FileArchive } from 'lucide-react';
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

        {/* CÔNG SUẤT VÀ LƯỚI PHÒNG */}
        <div className="bg-white rounded shadow-sm border border-slate-200 mb-6 p-4">
           <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-sm text-slate-800 uppercase">Trạng thái buồng phòng</h3>
             <button onClick={() => setIsBookingOpen(true)} className="bg-[#0070f4] text-white px-4 py-1.5 rounded text-sm font-bold shadow-sm hover:opacity-90">
                + Đặt phòng mới
             </button>
           </div>
           {/* Sơ đồ phòng Lưới dạng KiotViet (Thay cho TapeChart cũ) */}
           <div className="w-full">
             <RoomGrid key={refreshKey} />
           </div>
        </div>
        
        {/* KHU VỰC BÁN CHÉO (POS MENU) NẰM KẾT HỢP DƯỚI CÙNG ĐỂ CHỐT ĐƠN */}
        <div className="w-full">
          <PosMenu key={refreshKey} />
        </div>

      </div>

      {/* CỘT BÊN PHẢI (SIDEBAR THAO TÁC + NHẬT KÝ) */}
      <div className="w-80 border-l border-slate-200 bg-white shadow-[-2px_0_5px_rgba(0,0,0,0.02)] hidden lg:flex flex-col">
        
        {/* Nút tác vụ nhanh */}
        <div className="p-4 grid grid-cols-2 gap-2 border-b border-slate-100 shrink-0">
          <button className="bg-slate-50 hover:bg-slate-100 border border-slate-200 p-3 rounded-lg flex flex-col items-center justify-center gap-1 transition">
             <Wallet size={20} className="text-[#0070f4]" />
             <span className="text-xs font-semibold text-slate-700">Vay vốn</span>
          </button>
          <button className="bg-slate-50 hover:bg-slate-100 border border-slate-200 p-3 rounded-lg flex flex-col items-center justify-center gap-1 transition">
             <DollarSign size={20} className="text-[#00a92f]" />
             <span className="text-xs font-semibold text-slate-700">Thanh toán</span>
          </button>
        </div>

        <div className="p-4 border-b border-slate-100 shrink-0">
          <div className="bg-gradient-to-r from-blue-50 to-[#eef2ff] p-3 rounded-lg border border-blue-100">
             <p className="text-xs font-bold text-slate-700 mb-1">Mã giảm giá Khách sạn?</p>
             <button className="bg-[#0070f4] text-white text-xs font-bold px-3 py-1.5 rounded shadow-sm w-full mt-2">
               Cài đặt chiết khấu
             </button>
          </div>
        </div>

        {/* Các hoạt động gần đây (Timeline) */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 pb-2 border-b border-slate-100 shrink-0 bg-slate-50">
             <h3 className="text-xs font-bold text-slate-700 uppercase">Các hoạt động gần đây</h3>
          </div>
          <div className="p-4 overflow-y-auto space-y-4">
            
            {history.length === 0 ? (
               <div className="text-xs text-slate-400 text-center">Chưa có giao dịch.</div>
            ) : (
               history.map((log) => (
                 <div key={log.id} className="flex gap-3 items-start group">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${getStatusIconColor(log.status)}`}>
                       <FileArchive size={14} />
                    </div>
                    <div className="text-sm">
                       <p className="text-slate-800 leading-snug">
                         <span className="font-bold text-[#0070f4]">Lễ tân</span> vừa thao tác đơn <span className="font-semibold">{log.guest_name}</span> 
                         {log.status === 'checked_in' ? ' (Nhận phòng xếp khách)' : ''}
                         {log.status === 'cancelled' ? ' (Hủy phòng/Hoàn tiền)' : ''}
                       </p>
                       <p className="text-[11px] text-slate-400 mt-1">{formatTimeAgo(log.created_at)}</p>
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
