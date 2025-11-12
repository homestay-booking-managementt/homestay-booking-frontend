
// import React, { useEffect, useMemo, useState } from "react";
// import { Booking } from "@/types/booking";
// import { BookingFilter } from "@/components/booking/BookingFilterBar";
// import { BookingCard } from "@/components/booking/BookingCard";
// import "@/styles/BookingListPages.css";

// // ======================
// // Theme (tím pastel nhẹ)
// // ======================
// const Theme = () => (
//   <style>{`
//     .page-wrap {
//       background-color: #f8f5ff;
//       min-height: 100vh;
//     }
//   `}</style>
// );

// const BookingListPage: React.FC = () => {
//   const [all, setAll] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const [q, setQ] = useState("");
//   const [from, setFrom] = useState("");
//   const [to, setTo] = useState("");
//   const [sortBy, setSortBy] = useState<"createdAt_desc" | "createdAt_asc">(
//     "createdAt_desc"
//   );

//   // Convert ISO date -> timestamp
//   const toTime = (d: string | Date | undefined) => {
//     if (!d) return 0;
//     const dt = typeof d === "string" ? new Date(d) : d;
//     return dt.getTime();
//   };

//   // 🔹 GỌI API KHI COMPONENT MOUNT
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         // 👇 URL tùy backend của anh
//         const res = await fetch("http://localhost:8084/api/v1/bookings?userId=1");

//         if (!res.ok) throw new Error("Không thể tải dữ liệu booking!");
//         const data = await res.json();

//         setAll(data); // data phải dạng Booking[]
//       } catch (err: any) {
//         console.error(err);
//         setError(err.message || "Lỗi không xác định");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // 🔹 BỘ LỌC DỮ LIỆU
//   const filtered = useMemo(() => {
//     let rs = [...all];
//     if (q.trim()) {
//       const kw = q.trim().toLowerCase();
//       rs = rs.filter((b) => b.homestay.name.toLowerCase().includes(kw));
//     }
//     if (from) rs = rs.filter((b) => b.checkIn >= from);
//     if (to) rs = rs.filter((b) => b.checkOut <= to);

//     rs.sort((a, b) => {
//       const ta = toTime(a.createdAt);
//       const tb = toTime(b.createdAt);
//       return sortBy === "createdAt_desc" ? tb - ta : ta - tb;
//     });

//     return rs;
//   }, [all, q, from, to, sortBy]);

//   const onClear = () => {
//     setQ("");
//     setFrom("");
//     setTo("");
//     setSortBy("createdAt_desc");
//   };

//   return (
//     <div className="page-wrap">
//       <Theme />
//       <div className="container py-4">
//         <h3 className="page-title mb-3">Danh sách Booking</h3>

//         <BookingFilter
//           q={q}
//           setQ={setQ}
//           from={from}
//           setFrom={setFrom}
//           to={to}
//           setTo={setTo}
//           sortBy={sortBy}
//           setSortBy={setSortBy}
//           onClear={onClear}
//         />

//         {loading ? (
//           <div className="text-center text-secondary py-5">
//             <div className="spinner-border text-purple" role="status" />
//             <div className="mt-2">Đang tải dữ liệu...</div>
//           </div>
//         ) : error ? (
//           <div className="text-danger text-center py-5">
//             Lỗi: {error}
//           </div>
//         ) : filtered.length === 0 ? (
//           <div className="text-center text-muted py-5">
//             <i className="bi bi-inboxes" style={{ fontSize: 48 }} />
//             <div className="mt-2">Không có booking phù hợp</div>
//           </div>
//         ) : (
//           <div className="row g-3">
//             {filtered.map((b) => (
//               <div key={b.bookingId} className="col-12 col-md-6 col-xl-4">
//                 <BookingCard b={b} />
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BookingListPage;
// import React, { useEffect, useMemo, useState } from "react";
// import { useAppSelector } from "@/app/hooks";       // ✅ import hook redux
// import { Booking } from "@/types/booking";
// import { BookingFilter } from "@/components/booking/BookingFilterBar";
// import { BookingCard } from "@/components/booking/BookingCard";
// import "@/styles/BookingListPages.css";

// const Theme = () => (
//   <style>{`
//     .page-wrap {
//       background-color: #f8f5ff;
//       min-height: 100vh;
//     }
//   `}</style>
// );

// const BookingListPage: React.FC = () => {
//   // ✅ Lấy userId từ Redux
//   const userId = useAppSelector((state) => state.auth.currentUser.userId);
//   const idToken = localStorage.getItem("id_token");
//   console.log(userId);
//   const [all, setAll] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const [q, setQ] = useState("");
//   const [from, setFrom] = useState("");
//   const [to, setTo] = useState("");
//   const [sortBy, setSortBy] = useState<"createdAt_desc" | "createdAt_asc">(
//     "createdAt_desc"
//   );

//   const toTime = (d: string | Date | undefined) => {
//     if (!d) return 0;
//     const dt = typeof d === "string" ? new Date(d) : d;
//     return dt.getTime();
//   };

//   // 🟣 GỌI API khi có userId
//   useEffect(() => {
//     if (!userId) return; // chưa login thì không fetch

//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         // const res = await fetch(`http://localhost:8084/api/v1/bookings?userId=${userId}`, {
//         const res = await fetch(`http://localhost:8084/api/v1/bookings?userId=8`, {
//           headers: {
//             "Content-Type": "application/json",
//             ...(idToken && { Authorization: `Bearer ${idToken}` }),
//           },
//         });

//         if (!res.ok) throw new Error(`Không thể tải dữ liệu booking! (${res.status})`);
//         const data = await res.json();
//         setAll(data);
//       } catch (err: any) {
//         console.error(err);
//         setError(err.message || "Lỗi không xác định");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [userId]);

//   const filtered = useMemo(() => {
//     let rs = [...all];
//     if (q.trim()) {
//       const kw = q.trim().toLowerCase();
//       rs = rs.filter((b) => b.homestay.name.toLowerCase().includes(kw));
//     }
//     if (from) rs = rs.filter((b) => b.checkIn >= from);
//     if (to) rs = rs.filter((b) => b.checkOut <= to);

//     rs.sort((a, b) => {
//       const ta = toTime(a.createdAt);
//       const tb = toTime(b.createdAt);
//       return sortBy === "createdAt_desc" ? tb - ta : ta - tb;
//     });

//     return rs;
//   }, [all, q, from, to, sortBy]);

//   const onClear = () => {
//     setQ("");
//     setFrom("");
//     setTo("");
//     setSortBy("createdAt_desc");
//   };

//   return (
//     <div className="page-wrap">
//       <Theme />
//       <div className="container py-4">
//         <h3 className="page-title mb-3">Danh sách Booking</h3>

//         {!userId ? (
//           <div className="text-center text-muted py-5">
//             Vui lòng đăng nhập để xem danh sách đặt phòng.
//           </div>
//         ) : loading ? (
//           <div className="text-center text-secondary py-5">
//             <div className="spinner-border text-purple" role="status" />
//             <div className="mt-2">Đang tải dữ liệu...</div>
//           </div>
//         ) : error ? (
//           <div className="text-danger text-center py-5">Không có booking phù hợp</div>
//         ) : filtered.length === 0 ? (
//           <div className="text-center text-muted py-5">
//             <i className="bi bi-inboxes" style={{ fontSize: 48 }} />
//             <div className="mt-2">Không có booking phù hợp</div>
//           </div>
//         ) : (
//           <div className="row g-3">
//             {filtered.map((b) => (
//               <div key={b.bookingId} className="col-12 col-md-6 col-xl-4">
//                 <BookingCard b={b} />
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BookingListPage;

import React, { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/app/hooks";
import { Booking } from "@/types/booking";
import { BookingFilter } from "@/components/booking/BookingFilterBar";
import { BookingCard } from "@/components/booking/BookingCard";
import "@/styles/BookingListPages.css";

const Theme = () => (
  <style>{`
    .page-wrap {
      background-color: #f8f5ff;
      min-height: 100vh;
    }
  `}</style>
);

const BookingListPage: React.FC = () => {
  const userId = useAppSelector((state) => state.auth.currentUser.userId);
  const idToken = localStorage.getItem("id_token");

  const [all, setAll] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Các biến lọc
  const [q, setQ] = useState(""); // tên homestay
  const [from, setFrom] = useState(""); // check-in từ ngày
  const [to, setTo] = useState(""); // check-out đến ngày
  const [sortBy, setSortBy] = useState<"createdAt_desc" | "createdAt_asc">(
    "createdAt_desc"
  );

  // Convert ISO date → timestamp
  const toTime = (d: string | Date | undefined) => {
    if (!d) return 0;
    const dt = typeof d === "string" ? new Date(d) : d;
    return dt.getTime();
  };

  // 🟣 GỌI API khi có userId
  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          // `http://localhost:8084/api/v1/bookings?userId=${userId}`,
          `http://localhost:8084/api/v1/bookings?userId=1`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(idToken && { Authorization: `Bearer ${idToken}` }),
            },
          }
        );

        if (!res.ok)
          throw new Error(`Không thể tải dữ liệu booking! (${res.status})`);
        const data = await res.json();
        setAll(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Lỗi không xác định");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // 🧠 Lọc và sắp xếp danh sách
  const filtered = useMemo(() => {
    let rs = [...all];
    if (q.trim()) {
      const kw = q.trim().toLowerCase();
      rs = rs.filter((b) => b.homestay.name.toLowerCase().includes(kw));
    }
    if (from) rs = rs.filter((b) => b.checkIn >= from);
    if (to) rs = rs.filter((b) => b.checkOut <= to);

    rs.sort((a, b) => {
      const ta = toTime(a.createdAt);
      const tb = toTime(b.createdAt);
      return sortBy === "createdAt_desc" ? tb - ta : ta - tb;
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
        <h3 className="page-title mb-3 text-purple fw-bold">
          Danh sách Booking
        </h3>

        {/* 🟢 Thanh bộ lọc */}
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

        {/* Nội dung hiển thị */}
        {!userId ? (
          <div className="text-center text-muted py-5">
            Vui lòng đăng nhập để xem danh sách đặt phòng.
          </div>
        ) : loading ? (
          <div className="text-center text-secondary py-5">
            <div className="spinner-border text-purple" role="status" />
            <div className="mt-2">Đang tải dữ liệu...</div>
          </div>
        ) : error ? (
          <div className="text-danger text-center py-5">
            Lỗi: {error}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-muted py-5">
            <i className="bi bi-inboxes" style={{ fontSize: 48 }} />
            <div className="mt-2">Không có booking phù hợp</div>
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
