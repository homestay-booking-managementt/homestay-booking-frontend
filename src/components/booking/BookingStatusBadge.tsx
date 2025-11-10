import React from "react";

interface Props {
  status: string;
}

const BookingStatusBadge: React.FC<Props> = ({ status }) => {
  const map: Record<string, string> = {
    pending: "bg-warning text-dark",
    confirmed: "bg-info text-white",
    paid: "bg-primary text-white",
    checked_in: "bg-success text-white",
    checked_out: "bg-secondary text-white",
    completed: "bg-gradient bg-success text-light fw-semibold",
    canceled: "bg-danger text-white",
    refunded: "bg-dark text-white",
  };

  return (
    <span className={`badge ${map[status] || "bg-light text-dark"} px-3 py-2`}>
      {status.replace("_", " ")}
    </span>
  );
};

export default BookingStatusBadge;
