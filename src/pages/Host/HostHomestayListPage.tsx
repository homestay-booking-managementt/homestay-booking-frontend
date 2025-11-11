import { useEffect, useState } from "react";
import { fetchMyHomestays, createHomestay, updateHomestay, deleteHomestay } from "@/api/homestayApi";
import type { Homestay, HomestayPayload } from "@/types/homestay";
import { showAlert } from "@/utils/showAlert";
import { FaPlus, FaEdit, FaTrash, FaEye, FaTimes, FaHome, FaImage, FaCloudUploadAlt } from "react-icons/fa";
import { hostCommonStyles } from "./HostCommonStyles";

const HostHomestayListPage = () => {
  const [activeTab, setActiveTab] = useState<"approved" | "pending-create" | "pending-update">("approved");
  const [homestays, setHomestays] = useState<Homestay[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingHomestay, setEditingHomestay] = useState<Homestay | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState<HomestayPayload>({
    name: "",
    address: "",
    city: "",
    description: "",
    pricePerNight: 0,
    capacity: 1,
    numBedrooms: 1,
    numBathrooms: 1,
    amenities: [],
    images: [],
  });

  useEffect(() => {
    loadHomestays();
  }, []);

  const loadHomestays = async () => {
    setLoading(true);
    try {
      const data = await fetchMyHomestays();
      
      // TODO: Remove mock data when backend is ready
      // Mock data for demonstration
      const mockData: Homestay[] = [
        {
          id: 1,
          name: "Villa Seaview Đà Nẵng",
          address: "123 Võ Nguyên Giáp",
          city: "Đà Nẵng",
          description: "Villa sang trọng view biển",
          pricePerNight: 2500000,
          capacity: 6,
          numBedrooms: 3,
          numBathrooms: 2,
          amenities: ["WiFi", "Pool", "Kitchen"],
          images: [],
          status: "approved",
          isUpdate: false,
        },
        {
          id: 2,
          name: "Căn hộ Downtown Sài Gòn",
          address: "45 Lê Lợi, Quận 1",
          city: "Hồ Chí Minh",
          description: "Căn hộ hiện đại trung tâm thành phố",
          pricePerNight: 1800000,
          capacity: 4,
          numBedrooms: 2,
          numBathrooms: 1,
          amenities: ["WiFi", "Gym", "Parking"],
          images: [],
          status: "approved",
          isUpdate: false,
        },
        {
          id: 3,
          name: "Biệt thự Hội An Cổ Kính",
          address: "78 Nguyễn Phúc Chu",
          city: "Quảng Nam",
          description: "Biệt thự phong cách cổ điển gần phố cổ",
          pricePerNight: 3000000,
          capacity: 8,
          numBedrooms: 4,
          numBathrooms: 3,
          amenities: ["WiFi", "Garden", "BBQ"],
          images: [],
          status: "pending",
          isUpdate: false, // Pending create
        },
        {
          id: 4,
          name: "Nhà nghỉ Đà Lạt Romantic",
          address: "12 Trần Phú",
          city: "Lâm Đồng",
          description: "Nhà nghỉ ấm cúng view hồ",
          pricePerNight: 1200000,
          capacity: 2,
          numBedrooms: 1,
          numBathrooms: 1,
          amenities: ["WiFi", "Fireplace"],
          images: [],
          status: "pending",
          isUpdate: true, // Pending update
        },
      ];
      
      setHomestays(Array.isArray(data) && data.length > 0 ? data : mockData);
    } catch (error) {
      showAlert("Không thể tải danh sách homestay", "danger");
      
      // Fallback to mock data on error
      const mockData: Homestay[] = [
        {
          id: 1,
          name: "Villa Seaview Đà Nẵng",
          address: "123 Võ Nguyên Giáp",
          city: "Đà Nẵng",
          description: "Villa sang trọng view biển",
          pricePerNight: 2500000,
          capacity: 6,
          numBedrooms: 3,
          numBathrooms: 2,
          amenities: ["WiFi", "Pool", "Kitchen"],
          images: [],
          status: "approved",
          isUpdate: false,
        },
      ];
      setHomestays(mockData);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate minimum 10 images for new homestay
    if (!editingHomestay && imagePreviews.length < 10) {
      showAlert("Vui lòng chọn tối thiểu 10 ảnh cho homestay", "warning");
      return;
    }

    try {
      if (editingHomestay) {
        await updateHomestay(editingHomestay.id, formData);
        showAlert("Yêu cầu cập nhật homestay đã được gửi, đang chờ admin duyệt", "success");
      } else {
        // TODO: Upload images and create homestay_pending record
        await createHomestay(formData);
        showAlert("Yêu cầu tạo homestay đã được gửi, đang chờ admin duyệt", "success");
      }
      setShowModal(false);
      setEditingHomestay(null);
      resetForm();
      loadHomestays();
    } catch (error) {
      showAlert("Có lỗi xảy ra", "danger");
    }
  };

  const handleEdit = (homestay: Homestay) => {
    setEditingHomestay(homestay);
    setFormData({
      name: homestay.name,
      address: homestay.address,
      city: homestay.city,
      description: homestay.description,
      pricePerNight: homestay.pricePerNight,
      capacity: homestay.capacity,
      numBedrooms: homestay.numBedrooms,
      numBathrooms: homestay.numBathrooms,
      amenities: homestay.amenities,
      images: homestay.images,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa homestay này?")) return;
    try {
      await deleteHomestay(id);
      showAlert("Xóa homestay thành công", "success");
      loadHomestays();
    } catch (error) {
      showAlert("Không thể xóa homestay", "danger");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    setImageFiles(fileArray);

    // Create previews
    const previews = fileArray.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      city: "",
      description: "",
      pricePerNight: 0,
      capacity: 1,
      numBedrooms: 1,
      numBathrooms: 1,
      amenities: [],
      images: [],
    });
    // Reset image states
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setImageFiles([]);
    setImagePreviews([]);
  };

  const getStatusBadge = (status?: string) => {
    const statusMap: Record<string, string> = {
      approved: "completed",
      pending: "pending",
      rejected: "rejected",
    };
    return statusMap[status || "pending"] || "pending";
  };

  if (loading) {
    return (
      <>
        <style>{hostCommonStyles}</style>
        <div className="host-page">
          <div className="loading-state">
            <div className="spinner" />
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
      </>
    );
  }

  // Filter homestays by tab
  const filteredHomestays = homestays.filter((homestay) => {
    if (activeTab === "approved") {
      return homestay.status === "approved";
    } else if (activeTab === "pending-create") {
      return homestay.status === "pending" && !homestay.isUpdate;
    } else if (activeTab === "pending-update") {
      return homestay.status === "pending" && homestay.isUpdate;
    }
    return false;
  });

  return (
    <>
      <style>{hostCommonStyles}</style>
      <div className="host-page">
        <div className="page-header">
          <h1>Quản lý Homestay</h1>
          <p>Danh sách các homestay của bạn</p>
        </div>

        <div className="host-card">
          {/* Tabs */}
          <div
            style={{
              display: "flex",
              borderBottom: "2px solid #e5e7eb",
              marginBottom: "24px",
              gap: "8px",
            }}
          >
            <button
              onClick={() => setActiveTab("approved")}
              style={{
                padding: "12px 24px",
                border: "none",
                background: "transparent",
                color: activeTab === "approved" ? "#10b981" : "#6b7280",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer",
                borderBottom: activeTab === "approved" ? "3px solid #10b981" : "3px solid transparent",
                transition: "all 0.2s",
                marginBottom: "-2px",
              }}
            >
              Danh sách Homestay
            </button>
            <button
              onClick={() => setActiveTab("pending-create")}
              style={{
                padding: "12px 24px",
                border: "none",
                background: "transparent",
                color: activeTab === "pending-create" ? "#10b981" : "#6b7280",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer",
                borderBottom: activeTab === "pending-create" ? "3px solid #10b981" : "3px solid transparent",
                transition: "all 0.2s",
                marginBottom: "-2px",
              }}
            >
              Chờ duyệt (Tạo mới)
            </button>
            <button
              onClick={() => setActiveTab("pending-update")}
              style={{
                padding: "12px 24px",
                border: "none",
                background: "transparent",
                color: activeTab === "pending-update" ? "#10b981" : "#6b7280",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer",
                borderBottom: activeTab === "pending-update" ? "3px solid #10b981" : "3px solid transparent",
                transition: "all 0.2s",
                marginBottom: "-2px",
              }}
            >
              Chờ duyệt (Cập nhật)
            </button>
          </div>

          <div className="card-header">
            <h3 className="card-title">
              {activeTab === "approved" && "Homestay đã được duyệt"}
              {activeTab === "pending-create" && "Yêu cầu tạo mới đang chờ duyệt"}
              {activeTab === "pending-update" && "Yêu cầu cập nhật đang chờ duyệt"}
            </h3>
            {activeTab === "approved" && (
              <button className="btn-primary" onClick={() => setShowModal(true)}>
                <FaPlus /> Thêm Homestay
              </button>
            )}
          </div>

          {filteredHomestays.length === 0 ? (
            <div className="empty-state">
              <FaHome style={{ fontSize: "64px" }} />
              <h3>
                {activeTab === "approved" && "Chưa có homestay nào được duyệt"}
                {activeTab === "pending-create" && "Không có yêu cầu tạo mới nào đang chờ duyệt"}
                {activeTab === "pending-update" && "Không có yêu cầu cập nhật nào đang chờ duyệt"}
              </h3>
              <p>
                {activeTab === "approved" && "Bắt đầu bằng cách thêm homestay đầu tiên của bạn"}
                {activeTab === "pending-create" && "Các yêu cầu tạo mới sẽ hiển thị ở đây"}
                {activeTab === "pending-update" && "Các yêu cầu cập nhật sẽ hiển thị ở đây"}
              </p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>Địa chỉ</th>
                  <th>Thành phố</th>
                  <th>Giá/đêm</th>
                  <th>Sức chứa</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredHomestays.map((homestay) => (
                  <tr key={homestay.id}>
                    <td>{homestay.name}</td>
                    <td>{homestay.address}</td>
                    <td>{homestay.city}</td>
                    <td>{homestay.pricePerNight.toLocaleString("vi-VN")} ₫</td>
                    <td>{homestay.capacity} người</td>
                    <td>
                      <span className={`status-badge ${getStatusBadge(homestay.status)}`}>
                        {homestay.status === "approved" ? "Đã duyệt" : homestay.status === "pending" ? "Chờ duyệt" : "Từ chối"}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn action-btn-view" title="Xem chi tiết">
                          <FaEye />
                        </button>
                        <button className="action-btn action-btn-edit" onClick={() => handleEdit(homestay)} title="Chỉnh sửa">
                          <FaEdit />
                        </button>
                        <button className="action-btn action-btn-delete" onClick={() => handleDelete(homestay.id)} title="Xóa">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "20px",
            }}
            onClick={() => setShowModal(false)}
          >
            <div
              style={{
                background: "white",
                borderRadius: "16px",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                width: "100%",
                maxWidth: "900px",
                maxHeight: "90vh",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "24px 32px",
                  borderBottom: "2px solid #f3f4f6",
                  background: "linear-gradient(135deg, #f0fdf4 0%, #ccfbf1 100%)",
                }}
              >
                <h2
                  style={{
                    fontSize: "26px",
                    fontWeight: "700",
                    background: "linear-gradient(135deg, #10b981 0%, #14b8a6 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <FaHome style={{ color: "#10b981", fontSize: "24px" }} />
                  {editingHomestay ? "Chỉnh sửa Homestay" : "Thêm Homestay mới"}
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingHomestay(null);
                    resetForm();
                  }}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    border: "none",
                    background: "white",
                    color: "#6b7280",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: "20px",
                    transition: "all 0.2s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#ef4444";
                    e.currentTarget.style.color = "white";
                    e.currentTarget.style.transform = "rotate(90deg)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "white";
                    e.currentTarget.style.color = "#6b7280";
                    e.currentTarget.style.transform = "rotate(0deg)";
                  }}
                >
                  <FaTimes />
                </button>
              </div>

              {/* Form Content */}
              <div
                style={{
                  padding: "32px",
                  overflowY: "auto",
                  flex: 1,
                }}
              >
                <form onSubmit={handleSubmit}>
                  {/* Row 1: Tên & Địa chỉ */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                        Tên homestay <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="VD: Villa Biển Xanh"
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          border: "2px solid #e5e7eb",
                          borderRadius: "10px",
                          fontSize: "14px",
                          outline: "none",
                          transition: "all 0.2s",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#10b981";
                          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(16, 185, 129, 0.1)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "#e5e7eb";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                        Địa chỉ <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        required
                        placeholder="VD: 123 Đường Trần Hưng Đạo"
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          border: "2px solid #e5e7eb",
                          borderRadius: "10px",
                          fontSize: "14px",
                          outline: "none",
                          transition: "all 0.2s",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#10b981";
                          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(16, 185, 129, 0.1)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "#e5e7eb";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      />
                    </div>
                  </div>

                  {/* Row 2: Thành phố & Giá */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                        Thành phố <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                        placeholder="VD: Đà Nẵng"
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          border: "2px solid #e5e7eb",
                          borderRadius: "10px",
                          fontSize: "14px",
                          outline: "none",
                          transition: "all 0.2s",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#10b981";
                          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(16, 185, 129, 0.1)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "#e5e7eb";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                        Giá/đêm (VNĐ) <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.pricePerNight === 0 ? "" : formData.pricePerNight.toLocaleString("vi-VN")}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, "");
                          setFormData({ ...formData, pricePerNight: Number(value) });
                        }}
                        required
                        placeholder="VD: 1,500,000"
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          border: "2px solid #e5e7eb",
                          borderRadius: "10px",
                          fontSize: "14px",
                          outline: "none",
                          transition: "all 0.2s",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#10b981";
                          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(16, 185, 129, 0.1)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "#e5e7eb";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      />
                    </div>
                  </div>

                  {/* Row 5: Upload Ảnh */}
                  <div style={{ marginBottom: "24px" }}>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "12px" }}>
                      Hình ảnh Homestay <span style={{ color: "#ef4444" }}>* (Tối thiểu 10 ảnh)</span>
                    </label>
                    
                    {/* Upload Button */}
                    <div
                      style={{
                        border: "2px dashed #d1d5db",
                        borderRadius: "12px",
                        padding: "32px",
                        textAlign: "center",
                        background: "#f9fafb",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        marginBottom: "16px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#10b981";
                        e.currentTarget.style.background = "#f0fdf4";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#d1d5db";
                        e.currentTarget.style.background = "#f9fafb";
                      }}
                      onClick={() => document.getElementById("image-upload")?.click()}
                    >
                      <FaCloudUploadAlt style={{ fontSize: "48px", color: "#10b981", marginBottom: "12px" }} />
                      <p style={{ fontSize: "14px", color: "#374151", fontWeight: "600", marginBottom: "4px" }}>
                        Nhấp để chọn ảnh hoặc kéo thả tại đây
                      </p>
                      <p style={{ fontSize: "12px", color: "#9ca3af" }}>
                        PNG, JPG, JPEG (Max 5MB mỗi ảnh) - Tối thiểu 10 ảnh
                      </p>
                      <input
                        id="image-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                      />
                    </div>

                    {/* Image Previews */}
                    {imagePreviews.length > 0 && (
                      <div>
                        <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "12px", fontWeight: "600" }}>
                          {imagePreviews.length} ảnh đã chọn {imagePreviews.length < 10 && `(Cần thêm ${10 - imagePreviews.length} ảnh)`}
                        </p>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                            gap: "12px",
                          }}
                        >
                          {imagePreviews.map((preview, index) => (
                            <div
                              key={index}
                              style={{
                                position: "relative",
                                paddingBottom: "100%",
                                borderRadius: "8px",
                                overflow: "hidden",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                              }}
                            >
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                style={{
                                  position: "absolute",
                                  top: "4px",
                                  right: "4px",
                                  width: "24px",
                                  height: "24px",
                                  borderRadius: "50%",
                                  border: "none",
                                  background: "rgba(239, 68, 68, 0.9)",
                                  color: "white",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "12px",
                                  fontWeight: "bold",
                                }}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Row 3: Mô tả (full width) */}
                  <div style={{ marginBottom: "24px" }}>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                      Mô tả
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      placeholder="Nhập mô tả chi tiết về homestay..."
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #e5e7eb",
                        borderRadius: "10px",
                        fontSize: "14px",
                        outline: "none",
                        transition: "all 0.2s",
                        resize: "vertical",
                        fontFamily: "inherit",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#10b981";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(16, 185, 129, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#e5e7eb";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>

                  {/* Row 4: Sức chứa, Phòng ngủ, Phòng tắm (3 columns) */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "24px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                        Sức chứa (người) <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                        required
                        min="1"
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          border: "2px solid #e5e7eb",
                          borderRadius: "10px",
                          fontSize: "14px",
                          outline: "none",
                          transition: "all 0.2s",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#10b981";
                          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(16, 185, 129, 0.1)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "#e5e7eb";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                        Số phòng ngủ
                      </label>
                      <input
                        type="number"
                        value={formData.numBedrooms}
                        onChange={(e) => setFormData({ ...formData, numBedrooms: Number(e.target.value) })}
                        min="0"
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          border: "2px solid #e5e7eb",
                          borderRadius: "10px",
                          fontSize: "14px",
                          outline: "none",
                          transition: "all 0.2s",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#10b981";
                          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(16, 185, 129, 0.1)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "#e5e7eb";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                        Số phòng tắm
                      </label>
                      <input
                        type="number"
                        value={formData.numBathrooms}
                        onChange={(e) => setFormData({ ...formData, numBathrooms: Number(e.target.value) })}
                        min="0"
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          border: "2px solid #e5e7eb",
                          borderRadius: "10px",
                          fontSize: "14px",
                          outline: "none",
                          transition: "all 0.2s",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#10b981";
                          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(16, 185, 129, 0.1)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "#e5e7eb";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      />
                    </div>
                  </div>

                  {/* Footer Buttons */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "12px",
                      paddingTop: "24px",
                      borderTop: "2px solid #f3f4f6",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setEditingHomestay(null);
                        resetForm();
                      }}
                      style={{
                        padding: "12px 24px",
                        border: "2px solid #e5e7eb",
                        borderRadius: "10px",
                        background: "white",
                        color: "#6b7280",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#f3f4f6";
                        e.currentTarget.style.borderColor = "#d1d5db";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "white";
                        e.currentTarget.style.borderColor = "#e5e7eb";
                      }}
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      style={{
                        padding: "12px 32px",
                        border: "none",
                        borderRadius: "10px",
                        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        color: "white",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        boxShadow: "0 4px 6px rgba(16, 185, 129, 0.2)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 6px 12px rgba(16, 185, 129, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 6px rgba(16, 185, 129, 0.2)";
                      }}
                    >
                      {editingHomestay ? "Gửi yêu cầu cập nhật" : "Gửi yêu cầu tạo mới"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HostHomestayListPage;
