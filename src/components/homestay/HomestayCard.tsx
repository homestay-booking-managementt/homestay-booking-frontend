// import { Link } from "react-router-dom";
// import type { Homestay } from "@/types/homestay";
// import "@/styles/HomestayCard.css";

// const formatCurrency = (value: number | undefined) =>
//   value
//     ? new Intl.NumberFormat("vi-VN", {
//         style: "currency",
//         currency: "VND",
//         maximumFractionDigits: 0,
//       }).format(value)
//     : "--";

// const HomestayCard: React.FC<{ homestay: Homestay }> = ({ homestay }) => {
//   return (
//     <Link
//       to={`/homestays/${homestay.id}`}
//       className="text-decoration-none text-dark"
//     >
//       <div className="card homestay-card h-100 shadow-sm">
//         {/* Ảnh */}
//         <div className="card-image-wrapper">
//           {homestay.images?.[0]?.url ? (
//             <img
//               src={homestay.images[0].url}
//               alt={homestay.name}
//               className="card-img-top homestay-img"
//               height={220}
//             />
//           ) : (
//             <div
//               className="bg-light d-flex align-items-center justify-content-center"
//               style={{ height: 220 }}
//             >
//               <span className="text-muted">Chưa có ảnh</span>
//             </div>
//           )}
//         </div>

//         {/* Nội dung */}
//         <div className="card-body d-flex flex-column">
//           <h5 className="card-title mb-2">{homestay.name}</h5>
//           <p className="text-muted mb-1">
//             <i className="bi bi-geo-alt me-1" />
//             {homestay.address || "Địa chỉ không xác định"}
//           </p>
//           <p className="mb-1">
//             <strong>Giá cơ bản:</strong> {formatCurrency(homestay.base_price)}
//           </p>
//           <p className="mb-1">
//             <strong>Sức chứa:</strong> {homestay.capacity} khách
//           </p>
//           <p className="mb-1">
//             <strong>Số phòng:</strong> {homestay.num_rooms || "--"}
//           </p>
//           <p className="mb-1">
//             <strong>Xếp hạng:</strong>{" "}
//             {homestay.rating ? `${homestay.rating} ★` : "Chưa có"}
//           </p>

//           {homestay.description && (
//             <p className="text-muted small mt-2 flex-grow-1">
//               {homestay.description.length > 140
//                 ? homestay.description.slice(0, 140) + "..."
//                 : homestay.description}
//             </p>
//           )}
//         </div>
//       </div>
//     </Link>
//   );
// };

// export default HomestayCard;
