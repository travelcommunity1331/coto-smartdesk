import { NextResponse } from 'next/server';

// Hàm xử lý xuất file chuẩn iCal (.ics) cho Agoda / Booking.com
export async function GET(request: Request) {
  // 1. Phân tích tham số bảo mật từ URL, ví dụ: ?hotel_id=123&token=abc
  const { searchParams } = new URL(request.url);
  const roomId = searchParams.get('room_id') || 'UNKNOWN_ROOM';

  // 2. Giả lập gọi CSDL Supabase để lấy các Đơn Đặt Phòng đang Giữ (Confirmed)
  const mockBookings = [
    { start: '20260415T140000Z', end: '20260417T120000Z', id: 'BOOKING_001' },
    { start: '20260420T140000Z', end: '20260421T120000Z', id: 'BOOKING_002' },
  ];

  // 3. Quy cách dựng chuẩn iCalendar (Luôn tuân theo RFC 5545)
  // Nếu OTA đọc thấy lịch, họ sẽ Khóa ngày lại (Block Dates) không cho khách book chồng.
  let icalContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CoTo SmartDesk//PMS API//VI
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Coto_SmartDesk_Room_${roomId}
X-WR-TIMEZONE:Asia/Ho_Chi_Minh\n`;

  mockBookings.forEach((book) => {
    icalContent += `BEGIN:VEVENT
DTSTART:${book.start}
DTEND:${book.end}
UID:${book.id}@cotosmartdesk.vn
SUMMARY:Đã Đặt Phòng (CoTo PMS)
STATUS:CONFIRMED
END:VEVENT\n`;
  });

  icalContent += `END:VCALENDAR`;

  // 4. Trả về đúng định dạng text/calendar để AI của Booking.com phân tích được
  return new NextResponse(icalContent, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="room_${roomId}.ics"`,
    },
  });
}
