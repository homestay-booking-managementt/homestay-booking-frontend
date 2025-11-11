import type { Homestay } from "@/types/homestay";

interface Props {
  images: Homestay["images"];
}

const HomestayImageCarousel = ({ images }: Props) => {
  if (!images || images.length === 0) {
    return (
      <div className="text-center text-muted mb-4">
        <i className="bi bi-image me-1"></i>Chưa có hình ảnh cho homestay này.
      </div>
    );
  }

  return (
    <div id="homestayCarousel" className="carousel slide mb-4" data-bs-ride="carousel">
      <div className="carousel-inner rounded-4 shadow-sm">
        {images.map((img, index) => (
          <div
            key={img.id}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
          >
            <img
              src={img.url}
              alt={img.alt || `Ảnh ${img.id}`}
              className="d-block w-100"
              style={{ height: "400px", objectFit: "cover" }}
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#homestayCarousel"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#homestayCarousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </>
      )}
    </div>
  );
};

export default HomestayImageCarousel;
