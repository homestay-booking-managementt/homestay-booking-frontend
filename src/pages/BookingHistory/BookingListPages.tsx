import React, { useMemo, useState } from "react";
import { Booking } from "@/types/booking";
import { BookingFilter } from "@/components/booking/BookingFilterBar";
import { BookingCard } from "@/components/booking/BookingCard";
import "@/styles/BookingListPages.css"

const DEMO_BOOKINGS: Booking[] = [
  {
    bookingId: 4,
    checkIn: "2025-10-01",
    checkOut: "2025-10-03",
    nights: 2,
    totalPrice: 1900000.0,
    status: "completed",
    createdAt: "2025-10-27T17:45:27",
    homestay: {
      id: 1,
      name: "Villa Biển Đà Nẵng",
      city: "Đà Nẵng",
      address: null,
      primaryImageUrl: "https://example.com/images/villa-danang-1.jpg",
    },
  },
  {
    bookingId: 3,
    checkIn: "2025-11-20",
    checkOut: "2025-11-25",
    nights: 5,
    totalPrice: 6000000.0,
    status: "pending",
    createdAt: "2025-10-22T14:00:00",
    homestay: {
      id: 3,
      name: "Căn Hộ Phố Cổ Hà Nội",
      city: "Hà Nội",
      address: null,
      primaryImageUrl: "https://example.com/images/hanoi-apt-1.jpg",
    },
  },
];

const Theme = () => (
  <style>{`
    
  `}</style>
);
const BookingListPage: React.FC = () => {
  const [all] = useState<Booking[]>(DEMO_BOOKINGS);

  const [q, setQ] = useState("");
  const [from, setFrom] = useState(""); // yyyy-mm-dd
  const [to, setTo] = useState(""); // yyyy-mm-dd
  const [sortBy, setSortBy] = useState<"createdAt_desc" | "createdAt_asc">(
    "createdAt_desc"
  );
  
const toTime = (d: string | Date | undefined) => {
    if (!d) return 0;
    const dt = typeof d === "string" ? new Date(d) : d;
    return dt.getTime();
  };

  const filtered = useMemo(() => {
    let rs = [...all];

    // Search by homestay name
    if (q.trim()) {
      const kw = q.trim().toLowerCase();
      rs = rs.filter((b) => b.homestay.name.toLowerCase().includes(kw));
    }

    // Date range
    if (from) {
      rs = rs.filter((b) => b.checkIn >= from);
    }
    if (to) {
      rs = rs.filter((b) => b.checkOut <= to);
    }

    // Sort
    
rs.sort((a, b) => {
      const ta = toTime(a.createdAt);
      const tb = toTime(b.createdAt);
      if (sortBy === "createdAt_desc") {
        // Mới nhất trước
        return tb - ta;
      } else {
        // Cũ nhất trước
        return ta - tb;
      }
    });


    return rs;
  }, [all, q, from, to, sortBy]);

  const onClear = () => {
    setQ("");
    setFrom("");
    setTo("");
    setSortBy("createdAt_desc");
  };

  return (
    <div className="page-wrap">
      <Theme />
      <div className="container py-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h3 className="page-title mb-1">Danh sách Booking</h3>
          </div>
        </div>

        <BookingFilter
          q={q}
          setQ={setQ}
          from={from}
          setFrom={setFrom}
          to={to}
          setTo={setTo}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onClear={onClear}
        />

        {filtered.length === 0 ? (
          <div className="text-center text-muted py-5">
            <i className="bi bi-inboxes" style={{ fontSize: 48 }} />
            <div className="mt-2">Không có booking phù hợp bộ lọc</div>
          </div>
        ) : (
          <div className="row g-3">
            {filtered.map((b) => (
              <div key={b.bookingId} className="col-12 col-md-6 col-xl-4">
                <BookingCard b={b} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingListPage;
