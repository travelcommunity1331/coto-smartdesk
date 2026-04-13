import { CalendarDays, LayoutDashboard, Settings, BedDouble } from "lucide-react";
import { TapeChart } from "../components/TapeChart";
import { MobileRoomList } from "../components/MobileRoomList";
import { PosMenu } from "../components/PosMenu";

export default function Home() {
  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-900">
      
      {/* SIDEBAR DÀNH CHO DESKTOP (ẨN TRÊN ĐIỆN THOẠI) */}
      <aside className="hidden md:flex flex-col w-64 bg-coto-dark text-white p-4 shadow-xl z-20">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-coto-blue rounded-lg flex items-center justify-center font-bold text-xl">
            CT
          </div>
          <h1 className="font-bold text-lg leading-tight uppercase tracking-wide">
            CoTo<br /><span className="text-coto-blue font-light">SmartDesk</span>
          </h1>
        </div>

        <nav className="flex-1 space-y-2">
          <a href="#" className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-md text-white font-medium hover:bg-white/20 transition">
            <LayoutDashboard size={20} /> Tổng Quan
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-md text-slate-400 font-medium hover:bg-white/10 hover:text-white transition">
            <CalendarDays size={20} /> Lưới Đặt Phòng
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-md text-slate-400 font-medium hover:bg-white/10 hover:text-white transition">
            <BedDouble size={20} /> Quản Lý Buồng
          </a>
        </nav>
        
        <div className="pt-4 border-t border-slate-700">
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-md text-slate-400 font-medium hover:bg-white/10 hover:text-white transition">
            <Settings size={20} /> Cài Đặt
          </a>
        </div>
      </aside>

      {/* KHU VỰC NỘI DUNG CHÍNH (MAIN CONTENT) */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto pb-20 md:pb-0">
        <header className="bg-white border-b border-slate-200 p-4 md:px-8 flex justify-between items-center shadow-sm z-10 sticky top-0">
            <div className="md:hidden flex items-center gap-2">
              <div className="w-8 h-8 bg-coto-blue rounded-md flex items-center justify-center font-bold text-white">CT</div>
              <span className="font-bold">SmartDesk</span>
            </div>
            <h2 className="hidden md:block text-2xl font-bold">Bảng Điều Khiển</h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm"></div>
              <span className="font-medium hidden sm:block">Lễ Tân Đảo</span>
            </div>
        </header>

        <div className="p-4 md:p-8 space-y-6">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                  <p className="text-sm font-medium text-slate-500 mb-1">Công suất phòng</p>
                  <h3 className="text-3xl font-bold text-coto-blue">85%</h3>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                  <p className="text-sm font-medium text-slate-500 mb-1">Cần check-in h.nay</p>
                  <h3 className="text-3xl font-bold text-emerald-500">12</h3>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                  <p className="text-sm font-medium text-slate-500 mb-1">Sắp trả phòng</p>
                  <h3 className="text-3xl font-bold text-amber-500">5</h3>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                  <p className="text-sm font-medium text-slate-500 mb-1">Phòng cần dọn</p>
                  <h3 className="text-3xl font-bold text-rose-500">3</h3>
              </div>
           </div>

           <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
             <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-6 min-h-[400px]">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="text-lg font-bold">Sơ đồ Lưu trú 7 ngày tới</h3>
                   <button className="hidden md:block bg-coto-blue text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-coto-blue/90">
                      + Đặt phòng mới
                   </button>
                </div>
                
                <div className="hidden md:block">
                   <TapeChart />
                </div>
                
                <MobileRoomList />
             </div>
             
             {/* Component Bán dịch vụ bổ trợ bên phải */}
             <div className="xl:col-span-1 hidden xl:block">
                <PosMenu />
             </div>
           </div>
        </div>
      </main>

      {/* BOTTOM TAB NAVIGATION DÀNH CHUYÊN CHO ĐIỆN THOẠI (ẨN TRÊN DESKTOP) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-3 z-50 pb-safe">
        <a href="#" className="flex flex-col items-center text-coto-blue">
          <LayoutDashboard size={24} />
          <span className="text-[10px] font-medium mt-1">Tổng quan</span>
        </a>
        <a href="#" className="flex flex-col items-center text-slate-400">
          <CalendarDays size={24} />
          <span className="text-[10px] font-medium mt-1">Sơ đồ</span>
        </a>
        <a href="#" className="flex flex-col items-center text-slate-400">
          <BedDouble size={24} />
          <span className="text-[10px] font-medium mt-1">Buồng</span>
        </a>
        <a href="#" className="flex flex-col items-center text-slate-400">
          <Settings size={24} />
          <span className="text-[10px] font-medium mt-1">Cài đặt</span>
        </a>
      </nav>

    </div>
  );
}
