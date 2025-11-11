import React from "react";
import type { BookingUser } from "@/types/booking";

interface Props {
  user: BookingUser;
}

const BookingCustomerInfo: React.FC<Props> = ({ user }) => (
  <section className="mb-5">
    <h5 className="fw-semibold text-primary mb-3">Thông tin khách hàng</h5>
    <div className="p-4 bg-white rounded-4 shadow-sm border">
      <ul className="list-unstyled mb-0 text-secondary lh-lg">
        <li><strong>Họ tên:</strong> {user.name}</li>
        <li><strong>Email:</strong> {user.email}</li>
        <li><strong>Số điện thoại:</strong> {user.phone}</li>
      </ul>
    </div>
  </section>
);

export default BookingCustomerInfo;
