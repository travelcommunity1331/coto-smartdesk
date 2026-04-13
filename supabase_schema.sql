-- 1. BẢNG TENANTS (Quản lý các Chi nhánh/Khách sạn riêng biệt)
CREATE TABLE public.tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, -- Ví dụ: "Homestay Hoàng Hôn"
  domain text UNIQUE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bật Chặn Truy Cập Phân Luồng Khách (Row Level Security)
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- 2. BẢNG CHARACTERS/PROFILES (Nhân sự)
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  tenant_id uuid REFERENCES public.tenants(id) NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('owner', 'receptionist', 'housekeeper', 'admin')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. BẢNG ROOM TYPES (Loại phòng: Đơn, Đôi, Gia Đình)
CREATE TABLE public.room_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES public.tenants(id) NOT NULL,
  name text NOT NULL,
  base_price numeric NOT NULL, -- Giá ngày thường
  weekend_price numeric NOT NULL, -- Giá cuối tuần
  capacity int NOT NULL DEFAULT 2,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.room_types ENABLE ROW LEVEL SECURITY;

-- 4. BẢNG ROOMS (Danh sách phòng vật lý cố định)
CREATE TABLE public.rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES public.tenants(id) NOT NULL,
  room_type_id uuid REFERENCES public.room_types(id) NOT NULL,
  room_number text NOT NULL,
  status text NOT NULL DEFAULT 'clean' CHECK (status IN ('clean', 'dirty', 'maintenance')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- 5. BẢNG BOOKINGS (Đơn đặt phòng)
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES public.tenants(id) NOT NULL,
  room_id uuid REFERENCES public.rooms(id) NOT NULL,
  guest_name text NOT NULL,
  guest_phone text,
  check_in_date date NOT NULL,
  check_out_date date NOT NULL,
  total_price numeric NOT NULL,
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled')),
  source text NOT NULL DEFAULT 'direct' CHECK (source IN ('direct', 'agoda', 'booking_com', 'airbnb')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- QUY TẮC RLS (CHỐNG LỘ DỮ LIỆU ĐÁP ỨNG B2B SAAS)
-- Nhân viên rạp nào chỉ thấy dữ liệu rạp nấy. Homestay A không nhìn thấy doanh thu Homestay B.
CREATE POLICY "Tenant_Isolation_Profiles" ON public.profiles FOR ALL USING (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Tenant_Isolation_RoomTypes" ON public.room_types FOR ALL USING (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Tenant_Isolation_Rooms" ON public.rooms FOR ALL USING (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Tenant_Isolation_Bookings" ON public.bookings FOR ALL USING (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()));

-- 6. BẢNG DỊCH VỤ POS (Menu Đồ ăn, Thuê xe, Tour)
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES public.tenants(id) NOT NULL,
  name text NOT NULL, -- Ví dụ: "Mì tôm trứng", "Thuê xe máy 1 ngày"
  category text NOT NULL CHECK (category IN ('food', 'drink', 'transport', 'tour', 'other')),
  price numeric NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- 7. BẢNG POS ORDERS (Hóa đơn dịch vụ đính chung với Đặt phòng)
CREATE TABLE public.pos_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES public.tenants(id) NOT NULL,
  booking_id uuid REFERENCES public.bookings(id) NOT NULL,
  service_id uuid REFERENCES public.services(id) NOT NULL,
  quantity int NOT NULL DEFAULT 1,
  total_price numeric NOT NULL, -- quantity * services.price (Có thể giảm giá tay)
  recorded_by uuid REFERENCES public.profiles(id) NOT NULL, -- Lễ tân nào thu tiền
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.pos_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant_Isolation_Services" ON public.services FOR ALL USING (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Tenant_Isolation_PosOrders" ON public.pos_orders FOR ALL USING (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()));

-- 8. [GIAI ĐOẠN 5] BẢNG QUẢN LÝ LICENSE KEY BÁN HÀNG SAAS (Chỉ Sếp xem được)
CREATE TABLE public.saas_licenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  license_key text UNIQUE NOT NULL, -- Định dạng: COTO-XXXX-XXXX
  duration_days int NOT NULL, -- Số ngày custom tuỳ chọn
  custom_note text, -- Ghi chú phân biệt Key này cho Khách sạn nào
  status text NOT NULL DEFAULT 'unused' CHECK (status IN ('unused', 'active', 'expired', 'revoked')),
  activated_by_tenant uuid REFERENCES public.tenants(id),
  activated_at timestamp with time zone,
  expires_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Không bật RLS cho saas_licenses trên API Public, hoặc nếu bật thì chỉ có SUPER_ADMIN (được gán tay vào CSDL) mới thấy.
-- Để Demo nhanh, Giả lập Admin là người nắm Key cấp cao.
ALTER TABLE public.saas_licenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Super_Admin_Only" ON public.saas_licenses FOR ALL USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'super_admin'));

