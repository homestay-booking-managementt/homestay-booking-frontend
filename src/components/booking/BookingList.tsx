import { useEffect } from "react";
import BookingCard from "./BookingCard";
import { Booking } from "@/types/booking";

interface BookingListProps {
  bookings: Booking[];
  displayedBookings: Booking[];
  fetchingMore: boolean;
  setFetchingMore: (v: boolean) => void;
  visibleCount: number;
  setVisibleCount: (v: number) => void;
  setDisplayedBookings: (v: Booking[]) => void;
}

const BookingList = ({
  bookings,
  displayedBookings,
  fetchingMore,
  setFetchingMore,
  visibleCount,
  setVisibleCount,
  setDisplayedBookings,
}: BookingListProps) => {
  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 &&
        !fetchingMore &&
        displayedBookings.length < bookings.length
      ) {
        setFetchingMore(true);
        setTimeout(() => {
          const next = visibleCount + 5;
          setVisibleCount(next);
          setDisplayedBookings(bookings.slice(0, next));
          setFetchingMore(false);
        }, 500);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchingMore, bookings, displayedBookings.length, visibleCount]);

  return (
    <>
      <div className="row g-4">
        {displayedBookings.map((b) => (
          <BookingCard key={b.id} booking={b} />
        ))}
      </div>

      {fetchingMore && <div className="text-center py-3 text-muted">Đang tải thêm...</div>}
      {!fetchingMore && displayedBookings.length >= bookings.length && (
        <div className="text-center py-4 text-secondary">
          🎉 Đã hiển thị toàn bộ {bookings.length} đặt phòng.
        </div>
      )}
    </>
  );
};

export default BookingList;
