"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";

export function DashboardMetrics() {
  const [metrics, setMetrics] = useState({
    occupancy: 0,
    checkIns: 0,
    checkOuts: 0,
    dirtyRooms: 0
  });

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Phân tích phòng
      const { data: rooms } = await supabase
        .from('rooms')
        .select('*')
        .eq('user_id', user.id);
      
      const totalRooms = rooms ? rooms.length : 0;
      const dirtyRooms = rooms ? rooms.filter(r => r.status === 'dirty').length : 0;

      // 2. Phân tích Booking ngày mốc (Hôm nay)
      const todayString = new Date().toISOString().split('T')[0];

      const { data: bookings } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id);

      let checkIns = 0;
      let checkOuts = 0;
      let occupiedCount = 0;

      if (bookings) {
        bookings.forEach(b => {
          const bIn = b.check_in.split('T')[0];
          const bOut = b.check_out.split('T')[0];
          
          if (bIn === todayString) checkIns++;
          if (bOut === todayString) checkOuts++;
          if (b.status === 'checked_in') occupiedCount++;
        });
      }

      const occupancy = totalRooms > 0 ? Math.round((occupiedCount / totalRooms) * 100) : 0;

      setMetrics({
        occupancy,
        checkIns,
        checkOuts,
        dirtyRooms
      });

    } catch (err) {
      console.error("Lỗi fetch metrics", err);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-slate-500 mb-1">Công suất phòng</p>
          <h3 className="text-3xl font-bold text-coto-blue">{metrics.occupancy}%</h3>
      </div>
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-slate-500 mb-1">Cần check-in h.nay</p>
          <h3 className="text-3xl font-bold text-emerald-500">{metrics.checkIns}</h3>
      </div>
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-slate-500 mb-1">Sắp trả phòng</p>
          <h3 className="text-3xl font-bold text-amber-500">{metrics.checkOuts}</h3>
      </div>
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-slate-500 mb-1">Phòng cần dọn</p>
          <h3 className="text-3xl font-bold text-rose-500">{metrics.dirtyRooms}</h3>
      </div>
    </div>
  );
}
