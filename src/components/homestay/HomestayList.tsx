import HomestayCard from "./HomestayCard";
import type { Homestay } from "@/types/homestay";

const HomestayList: React.FC<{ loading: boolean; homestays: Homestay[] }> = ({
  loading,
  homestays,
}) => {
  if (loading) {
    return <div className="text-center py-5">Đang tải dữ liệu...</div>;
  }

  if (homestays.length === 0) {
    return (
      <div className="alert alert-info">
        Không có homestay nào phù hợp với điều kiện tìm kiếm.
      </div>
    );
  }

  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4 mt-4">
      {homestays.map((homestay) => (
        <div className="col" key={homestay.id}>
          <HomestayCard homestay={homestay} />
        </div>
      ))}
    </div>
  );
};

export default HomestayList;
