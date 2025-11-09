/* eslint-disable prettier/prettier */

import { useEffect, useMemo, useState } from "react";
import BookingFilterAdvanced from "@/components/booking/BookingFilterBar";
import BookingList from "@/components/booking/BookingList";
import {  BookingStatusPayload,Booking } from "@/types/booking";
import { showAlert } from "@/utils/showAlert";
import { fetchBookings } from "@/api/bookingApi";

const BookingHistoryPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [displayedBookings, setDisplayedBookings] = useState<Booking[]>([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Bộ lọc
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"" | BookingStatusPayload["status"]>("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [onlyUpcoming, setOnlyUpcoming] = useState(false);
  const [sortBy, setSortBy] = useState<"checkIn_desc" | "checkIn_asc">("checkIn_desc");

  const clearFilters = () => {
    setQ("");
    setStatus("");
    setFrom("");
    setTo("");
    setOnlyUpcoming(false);
    setSortBy("checkIn_desc");
  };

  const loadBookings = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      // await new Promise((r) => setTimeout(r, 400));
      // setBookings(bookingData as BookingHistoryItem[]);

      // Gọi API từ mock server
    const res = await fetchBookings();
    
    // const data = Array.isArray(res)
    //   ? res // trường hợp mock trả về mảng thuần
    //   : Array.isArray(res.items)
    //   ? res.items // trường hợp trả về dạng PaginatedResponse
    //   : [];
    const data = [
  {
    "id": 3,
    "user_id": 2,
    "homestay_id": 3,
    "check_in": "2025-04-10",
    "check_out": "2025-04-12",
    "nights": 2,
    "total_price": 2400000,
    "status": "confirmed",
    "created_at": "2025-03-28T09:30:00",
    "user": {
      "id": 2,
      "role_id": 1,
      "name": "Trần Văn Dũng",
      "email": "dung@example.com",
      "phone": "0987654321",
      "passwd": "123456",
      "status": 1,
      "is_deleted": false,
      "created_at": "2025-01-02T09:00:00"
    },
    "homestay": {
      "id": 3,
      "user_id": 4,
      "approved_by": 3,
      "name": "Green Garden Homestay",
      "description": "Không gian xanh giữa lòng thành phố",
      "address": "Đà Nẵng",
      "rating": 4.7,
      "capacity": 5,
      "num_rooms": 2,
      "bathroom_count": 1,
      "base_price": 1200000,
      "amenities": ["wifi", "garden"],
      "status": 1,
      "created_at": "2025-01-10T08:00:00",
      "approved_at": "2025-01-12T09:00:00",
      "is_deleted": false
    }
  }
];

    
      console.log(data)
    // Cắt ra số lượng hiển thị ban đầu
    setBookings(data as Booking[]);
      setDisplayedBookings((data as Booking[]).slice(0, visibleCount));
    } catch {
      showAlert("Không thể tải dữ liệu", "danger");
      setErrorMsg("Không thể tải dữ liệu JSON.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const filtered = useMemo(() => {
    const now = new Date();
    let list = [...bookings];
    if (q) list = list.filter((b) => b.homestay_id);//toLowerCase().includes(q.toLowerCase()));
    if (status) list = list.filter((b) => b.status === status);
    if (from) list = list.filter((b) => new Date(b.check_in) >= new Date(from));
    if (to) list = list.filter((b) => new Date(b.check_out) <= new Date(to));
    if (onlyUpcoming)
      list = list.filter((b) => new Date(b.check_in) >= new Date(now.toDateString()));
    list.sort((a, b) =>
      sortBy === "checkIn_desc"
        ? new Date(b.check_in).getTime() - new Date(a.check_in).getTime()
        : new Date(a.check_in).getTime() - new Date(b.check_in).getTime()
    );
    return list;
  }, [bookings, q, status, from, to, onlyUpcoming, sortBy]);

  useEffect(() => {
    setVisibleCount(5);
    setDisplayedBookings(filtered.slice(0, 5));
  }, [filtered]);

  return (
    <div className="container py-4">
      <BookingFilterAdvanced
        q={q}
        setQ={setQ}
        status={status}
        setStatus={setStatus}
        from={from}
        setFrom={setFrom}
        to={to}
        setTo={setTo}
        onlyUpcoming={onlyUpcoming}
        setOnlyUpcoming={setOnlyUpcoming}
        sortBy={sortBy}
        setSortBy={setSortBy}
        loading={loading}
        onClear={clearFilters}
        onReload={loadBookings}
      />

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : errorMsg ? (
        <div className="alert alert-danger">{errorMsg}</div>
      ) : displayedBookings.length === 0 ? (
        <div className="text-center py-5 text-muted">
          Chưa có đặt phòng nào phù hợp bộ lọc.
        </div>
      ) : (
        <BookingList
          bookings={filtered}
          displayedBookings={displayedBookings}
          fetchingMore={fetchingMore}
          setFetchingMore={setFetchingMore}
          visibleCount={visibleCount}
          setVisibleCount={setVisibleCount}
          setDisplayedBookings={setDisplayedBookings}
        />
      )}
    </div>
  );
};

export default BookingHistoryPage;
