"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Hotel, KeyRound, Building, Mail, Phone, User, Lock, AlertCircle } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [facilityName, setFacilityName] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // ĐĂNG NHẬP
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        // Đăng nhập thành công -> Vào Bảng Điều Khiển
        router.push("/dashboard");
      } else {
        // ĐĂNG KÝ
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username,
              phone,
              facility_name: facilityName
            }
          }
        });

        if (error) throw error;
        
        // Tạo biến ảo cho người dùng cảm giác nhanh chóng (mô phỏng theo ý người dùng)
        // Trong thực tế cần setup trigger tự confirm hoặc yêu cầu click link email
        alert("Đăng ký thành công! Đang chuyển hướng vào Bảng Điều Khiển dùng thử.");
        
        // Cố tình đẩy thẳng vào dashboard cho trải nghiệm nhanh
        router.push("/dashboard");
      }
    } catch (err) {
      const errorStr = err instanceof Error ? err.message : String(err);
      // Dịch một số lỗi cơ bản
      if (errorStr.includes("Invalid login")) {
        setError("Sai email hoặc mật khẩu.");
      } else if (errorStr.includes("User already registered")) {
        setError("Email này đã được đăng ký.");
      } else {
        setError(errorStr || "Có lỗi xảy ra, vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      
      {/* LEFT SIDE - BRANDING (Hidden on very small screens) */}
      <div className="hidden lg:flex lg:w-1/2 bg-coto-dark relative flex-col justify-between p-12 overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-coto-blue/20 to-coto-dark/95 z-0"></div>
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-coto-blue/10 blur-[100px] z-0"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-coto-blue rounded-xl flex items-center justify-center font-bold text-2xl text-white shadow-lg">
              CT
            </div>
            <h1 className="font-bold text-2xl text-white uppercase tracking-widest">
              CoTo<br /><span className="text-coto-blue font-light">SmartDesk</span>
            </h1>
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Quản trị Vận hành<br/>Homestay <span className="text-coto-blue">Thông minh</span>
          </h2>
          <p className="text-slate-300 text-lg mb-8 leading-relaxed">
            Giải pháp PMS (Property Management System) toàn diện, tích hợp đặt phòng, quản lý buồng, POS và chuỗi tiện ích bổ trợ.
          </p>
          <div className="flex gap-4">
             <div className="flex items-center gap-2 text-sm text-slate-300 bg-white/5 py-2 px-4 rounded-full border border-white/10">
                <Hotel size={16} className="text-coto-blue"/> Quản lý buồng
             </div>
             <div className="flex items-center gap-2 text-sm text-slate-300 bg-white/5 py-2 px-4 rounded-full border border-white/10">
                <Building size={16} className="text-coto-blue"/> POS & Dịch vụ
             </div>
          </div>
        </div>
        
        <div className="relative z-10 text-slate-500 text-sm">
          © 2026 CoTo SmartDesk SaaS. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE - AUTH FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        <div className="absolute top-8 right-8 text-sm font-medium text-slate-500">
           {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
           <button 
             onClick={() => { setIsLogin(!isLogin); setError(null); }}
             className="text-coto-blue font-bold hover:underline"
           >
              {isLogin ? "Đăng ký dùng thử" : "Đăng nhập ngay"}
           </button>
        </div>

        <div className="w-full max-w-md">
           
           <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-10 h-10 bg-coto-blue rounded-lg flex items-center justify-center font-bold text-xl text-white">CT</div>
            <h1 className="font-bold text-xl text-slate-900 uppercase tracking-widest">
              CoTo<span className="text-coto-blue font-light">SmartDesk</span>
            </h1>
           </div>

           <div className="text-center md:text-left mb-10">
             <h2 className="text-3xl font-bold text-slate-900 mb-2">
               {isLogin ? "Chào mừng trở lại!" : "Khởi tạo không gian"}
             </h2>
             <p className="text-slate-500">
               {isLogin ? "Đăng nhập để vào Bảng điều khiển quản lý" : "Thiết lập hệ thống thông minh cho cơ sở lưu trú của bạn"}
             </p>
           </div>

           {error && (
             <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3 text-rose-600 text-sm">
               <AlertCircle size={20} className="shrink-0 mt-0.5" />
               <p>{error}</p>
             </div>
           )}

           <form onSubmit={handleAuth} className="space-y-4">
              
              {!isLogin && (
                <>
                  <div className="space-y-4 md:space-y-0 md:flex md:gap-4">
                    <div className="md:w-1/2 space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tên Đăng Nhập</label>
                      <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User size={18} className="text-slate-400" />
                         </div>
                         <input required={!isLogin} type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-coto-blue focus:border-transparent transition" placeholder="nguyenvana" />
                      </div>
                    </div>
                    
                    <div className="md:w-1/2 space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Số Điện Thoại</label>
                      <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone size={18} className="text-slate-400" />
                         </div>
                         <input required={!isLogin} type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-coto-blue focus:border-transparent transition" placeholder="09xxxxxxx" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tên Cơ Sở Lưu Trú</label>
                      <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Building size={18} className="text-slate-400" />
                         </div>
                         <input required={!isLogin} type="text" value={facilityName} onChange={e => setFacilityName(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-coto-blue focus:border-transparent transition" placeholder="Homestay Hoàng Hôn, CoTo Hotel..." />
                      </div>
                  </div>
                </>
              )}

              <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email liên hệ</label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={18} className="text-slate-400" />
                     </div>
                     <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-coto-blue focus:border-transparent transition" placeholder="hotro@coto.vn" />
                  </div>
              </div>

              <div className="space-y-1">
                  <div className="flex justify-between">
                     <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mật Khẩu</label>
                     {isLogin && <a href="#" className="text-xs font-semibold text-coto-blue hover:underline">Quên mật khẩu?</a>}
                  </div>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={18} className="text-slate-400" />
                     </div>
                     <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-coto-blue focus:border-transparent transition" placeholder="••••••••" />
                  </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-6 bg-coto-dark text-white rounded-xl py-3.5 font-bold shadow-lg shadow-coto-dark/20 hover:bg-slate-800 hover:-translate-y-0.5 hover:shadow-xl transition flex justify-center items-center gap-2 group disabled:opacity-70 disabled:hover:translate-y-0"
              >
                 {loading ? (
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                 ) : (
                   <>
                     <KeyRound size={20} className="group-hover:rotate-12 transition" /> 
                     {isLogin ? "Vào Bảng Điều Khiển" : "Tạo Không Gian & Dùng Thử"}
                   </>
                 )}
              </button>

           </form>
           
           <div className="mt-8 text-center text-xs text-slate-400 px-6">
              Bằng việc thao tác, bạn đồng ý với <a href="#" className="font-semibold text-slate-500 hover:text-coto-blue">Điều khoản dịch vụ</a> và <a href="#" className="font-semibold text-slate-500 hover:text-coto-blue">Chính sách bảo mật</a> của chúng tôi.
           </div>
        </div>
      </div>
    </div>
  );
}
