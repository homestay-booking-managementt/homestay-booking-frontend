/* eslint-disable prettier/prettier */
import { useEffect, useMemo, useState } from "react";
import BookingFilterAdvanced from "@/components/booking/BookingFilterBar";
import BookingList from "@/components/booking/BookingList";
import { BookingStatusPayload, Booking } from "@/types/booking";
import { showAlert } from "@/utils/showAlert";
import { fetchBookings } from "@/api/bookingApi";
import { fetchBookingsByUser } from "@/api/bookingApi";

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
      // const res = await fetchBookings();
      // console.log(fetchBookings())
      // const res = await fetchBookingsByUser(1);
      // console.log("Kết quả API (userId=2):", res);
      const res = [
                    {
                        "bookingId": 4,
                        "checkIn": "2025-10-01",
                        "checkOut": "2025-10-03",
                        "nights": 2,
                        "totalPrice": 1900000.00,
                        "status": "completed",
                        "createdAt": "2025-10-27T17:45:27",
                        "homestay": {
                            "id": 1,
                            "name": "Villa Biển Đà Nẵng",
                            "city": "Đà Nẵng",
                            "address": null,
                            "primaryImageUrl": "https://example.com/images/villa-danang-1.jpg"
                        }
                    },
                    {
                        "bookingId": 3,
                        "checkIn": "2025-11-20",
                        "checkOut": "2025-11-25",
                        "nights": 5,
                        "totalPrice": 6000000.00,
                        "status": "pending",
                        "createdAt": "2025-10-22T14:00:00",
                        "homestay": {
                            "id": 3,
                            "name": "Căn Hộ Phố Cổ Hà Nội",
                            "city": "Hà Nội",
                            "address": null,
                            "primaryImageUrl": "https://example.com/images/hanoi-apt-1.jpg"
                        }
                    }
                ];

      const data = Array.isArray(res)
        ? res // mock trả về mảng thuần
        : Array.isArray((res as any).items)
          ? (res as any).items // trường hợp backend trả về { items: [...], total: n }
          : [];
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
    if (q) list = list.filter((b) => b.homestay.id);//toLowerCase().includes(q.toLowerCase()));
    if (status) list = list.filter((b) => b.status === status);
    if (from) list = list.filter((b) => new Date(b.checkIn) >= new Date(from));
    if (to) list = list.filter((b) => new Date(b.checkOut) <= new Date(to));
    if (onlyUpcoming)
      list = list.filter((b) => new Date(b.checkIn) >= new Date(now.toDateString()));
    list.sort((a, b) =>
      sortBy === "checkIn_desc"
        ? new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime()
        : new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime()
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
