"use client";
import { useState, useEffect } from "react";
import { CalendarDays, LayoutDashboard, Settings, BedDouble, Key, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";
import { TapeChart } from "@/components/TapeChart";
import { MobileRoomList } from "@/components/MobileRoomList";
import { PosMenu } from "@/components/PosMenu";
import { DashboardMetrics } from "@/components/DashboardMetrics";
import { BookingModal } from "@/components/BookingModal";
import { SettingsModal } from "@/components/SettingsModal";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [licenseKey, setLicenseKey] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [message, setMessage] = useState("");
  
  const [user, setUser] = useState<any>(null);
  const [hasLicense, setHasLicense] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Modal States
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Trigger reload for child components

  const triggerReload = () => setRefreshKey(prev => prev + 1);

  // Khởi động trinh sát Session
  useEffect(() => {
    checkUserAndLicense();
  }, []);

  const checkUserAndLicense = async () => {
    setLoadingAuth(true);
    try {
      // 1. Kiểm tra lính gác: Khách đã đăng nhập chưa
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Chưa đăng nhập thì đá về trang chủ
        router.push('/');
        return;
      }
      setUser(user);

      // 2. Chó săn đánh hơi License của Khách
      const { data: activeLicense, error } = await supabase
        .from('licenses')
        .select('*')
        .eq('activated_by', user.id)
        .eq('status', 'used')
        .single();
      
      if (activeLicense) {
        setHasLicense(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAuth(false);
    }
  };

  const handleActivate = async () => {
    if (!licenseKey.trim() || !user) return;
    setStatus("loading");
    setMessage("");

    try {
      // 1. Kiểm tra key trong Database
      const { data, error } = await supabase
        .from('licenses')
        .select('*')
        .eq('key_code', licenseKey.trim().toUpperCase())
        .single();
        
      if (error || !data) {
        setStatus("error");
        setMessage("Mã không hợp lệ hoặc không tồn tại.");
        return;
      }

      // 2. Chặn key đã dùng
      // Đặc biệt nếu mã này có trạng thái 'revoked' (bị Cảnh sát trưởng cúp điện)
      if (data.status === 'used') {
        setStatus("error");
        setMessage("Mã bản quyền này đã được kích hoạt trước đó!");
        return;
      }
      if (data.status === 'revoked') {
        setStatus("error");
        setMessage("Mã này đã bị vô hiệu hóa bởi Hệ Thống Tổng!");
        return;
      }

      // 3. Đánh dấu Key đã sử dụng và Trói vào CCCD (User.id)
      const { error: updateError } = await supabase
        .from('licenses')
        .update({ 
          status: 'used',
          activated_by: user.id,
          activated_at: new Date().toISOString()
        })
        .eq('id', data.id);

      if (updateError) {
        setStatus("error");
        setMessage("Lỗi hệ thống khi kích hoạt: " + updateError.message);
        return;
      }

      // 4. Thành công -> Đợi 2s rồi cho ẩn cái bảng Đòi Tiền đi
      setStatus("success");
      setMessage(`Kích hoạt gói ${data.duration_days} ngày thành công! Hệ thống đang tải lại...`);
      
      setTimeout(() => {
        setHasLicense(true);
      }, 2000);
      
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("Lỗi kết nối hệ thống máy chủ.");
    }
  };

  if (loadingAuth) {
    return <div className="h-screen w-full bg-slate-50 flex items-center justify-center font-bold text-coto-blue">Đang kiểm tra An ninh Khu vực...</div>;
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-900">
      
      {/* SIDEBAR DÀNH CHO DESKTOP */}
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
          <button onClick={() => setIsSettingsOpen(true)} className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-slate-400 font-medium hover:bg-white/10 hover:text-white transition">
            <Settings size={20} /> Cài Đặt
          </button>
        </div>
      </aside>

      {/* KHU VỰC NỘI DUNG CHÍNH (MAIN CONTENT) */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto pb-20 md:pb-0 relative">
        
        {/* NẾU KHÁCH CHƯA MUA KEY THÌ PHỦ 1 LỚP BLUR TRÊN NỘI DUNG DASHBOARD */}
        {!hasLicense && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-30 pointer-events-none"></div>
        )}

        <header className="bg-white border-b border-slate-200 p-4 md:px-8 flex justify-between items-center shadow-sm z-10 sticky top-0 relative">
            <div className="md:hidden flex items-center gap-2">
              <div className="w-8 h-8 bg-coto-blue rounded-md flex items-center justify-center font-bold text-white">CT</div>
              <span className="font-bold">SmartDesk</span>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
               <h2 className="text-2xl font-bold">Bảng Điều Khiển</h2>
               {hasLicense && (
                 <span className="flex items-center gap-1.5 text-xs font-bold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full uppercase border border-emerald-200">
                    <ShieldCheck size={14}/> Tài Khoản VIP
                 </span>
               )}
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-coto-blue text-white flex items-center justify-center font-bold border-2 border-white shadow-sm uppercase">
                 {user?.user_metadata?.full_name ? user.user_metadata.full_name.charAt(0) : "KS"}
              </div>
              <span className="font-medium hidden sm:block">
                 {user?.user_metadata?.full_name || "Lễ Tân Tối Cao"}
              </span>
            </div>
        </header>

        <div className="p-4 md:p-8 space-y-6 relative">
           <DashboardMetrics />

           <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
             <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-6 min-h-[400px]">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="text-lg font-bold">Sơ đồ Lưu trú 7 ngày tới</h3>
                   <button onClick={() => setIsBookingOpen(true)} className="hidden md:block bg-coto-blue text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-coto-blue/90">
                      + Đặt phòng mới
                   </button>
                </div>
                
                <div className="hidden md:block">
                   <TapeChart key={refreshKey} />
                </div>
                
                <MobileRoomList />
             </div>
             
             {/* Component Bán dịch vụ bổ trợ bên phải */}
             <div className="xl:col-span-1 hidden xl:block">
                <PosMenu key={refreshKey} />
             </div>
           </div>

           {/* LICENSE KEY WIDGET ỊCH ĐÈ LÊN MÀN HÌNH NẾU CHƯA MUA KEY */}
           {!hasLicense && (
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-12 bg-coto-dark text-white rounded-2xl p-8 w-[95%] max-w-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-700 z-40">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-coto-blue/20 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                   <div className="flex-1 text-center md:text-left">
                      <div className="inline-flex items-center gap-2 bg-rose-500/20 px-3 py-1 rounded-full text-xs font-bold text-rose-400 mb-4 border border-rose-500/30">
                         <Key size={14} /> KHÓA CHỨC NĂNG VẬN HÀNH
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Hết Hạn Trải Nghiệm</h3>
                      <p className="text-slate-400 text-sm">
                        Cơ sở dữ liệu của bạn đã bị Đóng Băng Tạm Thời. Vui lòng nhập mã Bản Quyền do Giám Đốc cấp để mở lại quyền lực sử dụng hệ thống.
                      </p>
                   </div>
                   
                   <div className="w-full md:w-auto min-w-[300px]">
                      <div className="flex bg-white/5 rounded-lg border border-white/10 p-1 focus-within:border-coto-blue transition">
                         <input 
                           type="text" 
                           value={licenseKey}
                           onChange={(e) => setLicenseKey(e.target.value)}
                           placeholder="Mã VIP của Sếp..."
                           className="flex-1 bg-transparent px-4 py-2 text-white outline-none placeholder:text-slate-500 text-sm"
                         />
                         <button 
                           onClick={handleActivate}
                           disabled={status === "loading" || !licenseKey}
                           className="bg-coto-blue text-white px-4 py-2 rounded-md text-sm font-bold shadow-sm hover:bg-coto-blue/90 disabled:opacity-50 transition min-w-[100px]"
                         >
                           {status === "loading" ? "Xử lý..." : "Kích hoạt"}
                         </button>
                      </div>
                      
                      {status === "error" && (
                        <div className="mt-3 flex items-center gap-2 text-rose-400 text-sm">
                          <AlertCircle size={16} /> {message}
                        </div>
                      )}
                      {status === "success" && (
                        <div className="mt-3 flex items-center gap-2 text-emerald-400 text-sm">
                          <CheckCircle2 size={16} /> {message}
                        </div>
                      )}
                   </div>
                </div>
             </div>
           )}

        </div>
      </main>

      {/* CÁC POPUP MỞ RỘNG CỦA HỆ THỐNG */}
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        onSuccess={triggerReload}
      />
      
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        onSuccess={triggerReload}
      />

      {/* BOTTOM TAB NAV MẶC ĐỊNH BỊ BLUR NẾU KHÓA KEY */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-3 z-50 pb-safe ${!hasLicense ? 'opacity-50 pointer-events-none' : ''}`}>
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
