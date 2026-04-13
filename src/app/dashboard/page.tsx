"use client";
import { useState, useEffect } from "react";
import { 
  Building2, 
  Key, 
  AlertCircle, 
  CheckCircle2, 
  Settings, 
  Users, 
  CreditCard, 
  FileText,
  UserSquare2,
  Phone,
  MessageCircle,
  Menu,
  ChevronDown 
} from "lucide-react";
import { DashboardOverview } from "@/components/views/DashboardOverview";
import { RoomManagement } from "@/components/views/RoomManagement";
import { ProductsManagement } from "@/components/views/ProductsManagement";
import { SettingsModal } from "@/components/SettingsModal";
import { RoomGrid } from "@/components/views/RoomGrid";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type TabType = 'overview' | 'rooms' | 'letan' | 'products';

export default function Dashboard() {
  const router = useRouter();
  const [licenseKey, setLicenseKey] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [message, setMessage] = useState("");
  
  const [user, setUser] = useState<any>(null);
  const [hasLicense, setHasLicense] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // View Routing State (Quản lý các tab của giao diện mới)
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    checkUserAndLicense();
  }, []);

  const checkUserAndLicense = async () => {
    setLoadingAuth(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/');
        return;
      }
      setUser(user);

      const { data: activeLicense } = await supabase
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

      if (data.status === 'used' || data.status === 'revoked') {
        setStatus("error");
        setMessage("Mã này không khả dụng!");
        return;
      }

      const { error: updateError } = await supabase
        .from('licenses')
        .update({ status: 'used', activated_at: new Date().toISOString(), activated_by: user.id })
        .eq('id', data.id);

      if (updateError) throw updateError;

      setStatus("success");
      setMessage("Khu vực Quản trị đã được Mở Khóa hoàn toàn!");
      setTimeout(() => {
        setHasLicense(true);
      }, 1500);

    } catch (error) {
      setStatus("error");
      setMessage("Bảo mật chặn. Hãy báo Giám Đốc Cấp Cao.");
    }
  };

  if (loadingAuth) {
    return <div className="h-screen flex items-center justify-center bg-slate-50 text-coto-blue font-bold">Đang tải Lõi Hệ Thống...</div>;
  }

  return (
    <div className="h-screen bg-[#f3f4f6] flex flex-col font-sans overflow-hidden">
      
      {/* KHÓA MÀN HÌNH NẾU CHƯA CÓ LICENSE */}
      {!hasLicense && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex justify-center items-center p-4">
           <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl relative">
              <div className="inline-flex items-center gap-2 bg-rose-500/20 px-3 py-1 rounded text-xs font-bold text-rose-500 mb-4 border border-rose-500/30 uppercase">
                 <Key size={14} /> Hệ thống bị đóng băng
              </div>
              <h3 className="text-2xl font-bold mb-2">Yêu cầu Mã Kích Hoạt</h3>
              <p className="text-slate-500 text-sm mb-6">
                Bạn cần phải có mã VIP KEY từ Đại Lý / Admin cung cấp để truy cập vào phân hệ Quản lý.
              </p>
              
              <div className="flex bg-slate-50 rounded-lg border border-slate-200 p-1 focus-within:border-blue-500 transition">
                 <input 
                   type="text" 
                   value={licenseKey}
                   onChange={(e) => setLicenseKey(e.target.value)}
                   placeholder="Nhập mã KEY..."
                   className="flex-1 bg-transparent px-4 py-2 outline-none font-medium text-slate-800"
                 />
                 <button 
                   onClick={handleActivate}
                   disabled={status === "loading" || !licenseKey}
                   className="bg-blue-600 text-white px-6 py-2 rounded-md font-bold shadow-sm hover:bg-blue-700 disabled:opacity-50 transition"
                 >
                   {status === "loading" ? "Đang xử lý..." : "Mở Khóa"}
                 </button>
              </div>
              
              {status === "error" && (
                <div className="mt-3 flex items-center gap-2 text-rose-500 text-sm font-medium">
                  <AlertCircle size={16} /> {message}
                </div>
              )}
              {status === "success" && (
                <div className="mt-3 flex items-center gap-2 text-emerald-500 text-sm font-bold">
                  <CheckCircle2 size={16} /> {message}
                </div>
              )}
           </div>
        </div>
      )}

      {/* KIOTVIET-STYLE TOP NAVIGATION */}
      <nav className="bg-[#0070f4] text-white flex items-center justify-between px-4 h-[50px] shrink-0 sticky top-0 z-40">
         <div className="flex items-center h-full gap-2">
            
            {/* Logo / Menu Toggler */}
            <div className="flex items-center justify-center w-10 h-full hover:bg-black/10 cursor-pointer mr-2">
               <Menu size={20} />
            </div>

            {/* Menu Items */}
            <div className="flex items-center h-full text-[13px] font-semibold">
               <button 
                 onClick={() => setActiveTab('overview')} 
                 className={`h-full px-4 border-b-2 transition flex items-center gap-1 ${activeTab === 'overview' ? 'border-white bg-black/5' : 'border-transparent hover:bg-black/10'}`}
               >
                 Tổng quan
               </button>
               
               <div className="relative group h-full">
                 <button 
                   onClick={() => setActiveTab('rooms')} 
                   className={`h-full px-4 border-b-2 transition flex items-center gap-1 ${activeTab === 'rooms' ? 'border-white bg-black/5' : 'border-transparent hover:bg-black/10'}`}
                 >
                   Phòng <ChevronDown size={14}/>
                 </button>
                 <div className="absolute top-full left-0 bg-white shadow-xl rounded-b min-w-[200px] hidden group-hover:flex flex-col py-2 border border-slate-200">
                    <button onClick={() => setActiveTab('rooms')} className="text-left px-4 py-2 hover:bg-slate-50 text-slate-700 w-full">Hạng phòng & Phòng</button>
                    <button onClick={() => setIsSettingsOpen(true)} className="text-left px-4 py-2 hover:bg-slate-50 text-slate-700 w-full">Thiết lập giá / Hạng</button>
                 </div>
               </div>

               <button 
                 onClick={() => setActiveTab('products')} 
                 className={`h-full px-4 border-b-2 transition whitespace-nowrap ${activeTab === 'products' ? 'border-white bg-black/5' : 'border-transparent hover:bg-black/10'}`}
               >
                 Hàng hóa
               </button>
               <button className="h-full px-4 border-b-2 border-transparent hover:bg-black/10 transition whitespace-nowrap">Giao dịch</button>
               <button className="h-full px-4 border-b-2 border-transparent hover:bg-black/10 transition whitespace-nowrap">Đối tác</button>
               <button className="h-full px-4 border-b-2 border-transparent hover:bg-black/10 transition whitespace-nowrap">Nhân viên</button>
               <button className="h-full px-4 border-b-2 border-transparent hover:bg-black/10 transition whitespace-nowrap">Kênh bán</button>
               <button className="h-full px-4 border-b-2 border-transparent hover:bg-black/10 transition whitespace-nowrap">Sổ quỹ</button>
               <button className="h-full px-4 border-b-2 border-transparent hover:bg-black/10 transition whitespace-nowrap">Báo cáo</button>
               <button className="h-full px-4 border-b-2 border-transparent hover:bg-black/10 transition whitespace-nowrap">Thuế & Kế toán</button>
            </div>
         </div>

         {/* Right Side Nav */}
         <div className="flex items-center gap-3">
            <span className="text-[13px] font-medium hidden sm:block">
              {user?.user_metadata?.full_name || "Admin"}
            </span>
            <button 
               onClick={() => setActiveTab('letan')}
               className={`bg-white text-[#0070f4] text-[13px] font-bold px-4 py-1.5 rounded flex items-center gap-2 transition shadow-sm ${activeTab === 'letan' ? 'ring-2 ring-blue-300' : 'hover:bg-blue-50'}`}
            >
               <UserSquare2 size={16}/> Lễ tân
            </button>
         </div>
      </nav>

      {/* NỘI DUNG HIỂN THỊ (ROUTING VIEW) */}
      <main className="flex-1 overflow-hidden bg-[#f3f4f6]">
         {activeTab === 'overview' && <DashboardOverview />}
         {activeTab === 'rooms' && <RoomManagement />}
         {activeTab === 'products' && <ProductsManagement />}
         {activeTab === 'letan' && (
           <div className="h-full flex flex-col p-4 bg-white overflow-hidden relative">
              <RoomGrid />
           </div>
         )}
      </main>
      
      <SettingsModal 
         isOpen={isSettingsOpen} 
         onClose={() => setIsSettingsOpen(false)} 
         onSuccess={() => {}}
      />
    </div>
  );
}
