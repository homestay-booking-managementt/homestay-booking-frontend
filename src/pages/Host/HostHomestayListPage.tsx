import { useEffect, useState } from "react";
import { fetchMyHomestays, createHomestay, requestUpdateHomestay, toggleHomestayStatus, fetchHomestayById } from "@/api/homestayApi";
import type { Homestay, HomestayPayload } from "@/types/homestay";
import { showAlert } from "@/utils/showAlert";
import { FaPlus, FaEdit, FaEye, FaEyeSlash, FaTimes, FaHome, FaImage, FaCloudUploadAlt, FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import { hostCommonStyles } from "./HostCommonStyles";
import { uploadImages, revokePreviewUrls, validateAndPreviewFiles } from "@/services/imageUploadService";

const HostHomestayListPage = () => {
  const [homestays, setHomestays] = useState<Homestay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedHomestay, setSelectedHomestay] = useState<Homestay | null>(null);
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
    
    // Cleanup preview URLs on unmount
    return () => {
      revokePreviewUrls(imagePreviews);
    };
  }, []);

  const loadHomestays = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMyHomestays();
      setHomestays(data);
    } catch (error: any) {
      const errorMessage = error?.message || "Không thể tải danh sách homestay";
      setError(errorMessage);
      showAlert(errorMessage, "danger");
      setHomestays([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      
      console.log("Starting homestay creation/update...");
      
      // Prepare payload - only include non-empty fields when editing
      const payload: any = {};
      
      if (editingHomestay) {
        // For update: only include fields that have values
        if (formData.name.trim()) payload.name = formData.name;
        if (formData.description.trim()) payload.description = formData.description;
        if (formData.address.trim()) payload.address = formData.address;
        if (formData.city.trim()) payload.city = formData.city;
        if (formData.capacity > 0) payload.capacity = formData.capacity;
        if (formData.numBedrooms > 0) payload.numRooms = formData.numBedrooms;
        if (formData.numBathrooms > 0) payload.bathroomCount = formData.numBathrooms;
        if (formData.pricePerNight > 0) payload.basePrice = formData.pricePerNight;
        if (formData.amenities.length > 0) payload.amenities = JSON.stringify(formData.amenities);
        
        // For update: try to upload images if any selected
        if (imageFiles.length > 0) {
          try {
            console.log("Uploading images...", imageFiles.length, "files");
            const uploadedImages = await uploadImages(imageFiles, 0);
            console.log("Images uploaded successfully:", uploadedImages);
            payload.images = uploadedImages;
          } catch (uploadError: any) {
            console.warn("Image upload failed, continuing without images:", uploadError);
            showAlert("Không thể upload ảnh, nhưng thông tin khác sẽ được cập nhật", "warning");
          }
        }
      } else {
        // For create: include all required fields
        payload.name = formData.name;
        payload.description = formData.description;
        payload.address = formData.address;
        payload.city = formData.city;
        payload.capacity = formData.capacity;
        payload.numRooms = formData.numBedrooms;
        payload.bathroomCount = formData.numBathrooms;
        payload.basePrice = formData.pricePerNight;
        payload.amenities = JSON.stringify(formData.amenities);
        
        // For create: try to upload images if any selected, otherwise use empty array
        if (imageFiles.length > 0) {
          try {
            console.log("Uploading images...", imageFiles.length, "files");
            const uploadedImages = await uploadImages(imageFiles, 0);
            console.log("Images uploaded successfully:", uploadedImages);
            payload.images = uploadedImages;
          } catch (uploadError: any) {
            console.warn("Image upload failed, creating homestay without images:", uploadError);
            showAlert("Không thể upload ảnh. Homestay sẽ được tạo không có ảnh, bạn có thể thêm ảnh sau.", "warning");
            payload.images = [];
          }
        } else {
          payload.images = [];
        }
      }
      
      console.log("Payload to send:", payload);
      
      if (editingHomestay) {
        // Call requestUpdateHomestay for update
        await requestUpdateHomestay(editingHomestay.id, payload);
        showAlert("Yêu cầu cập nhật homestay đã được gửi, đang chờ admin duyệt", "success");
      } else {
        // Call createHomestay for new homestay
        console.log("Calling createHomestay API...");
        await createHomestay(payload);
        showAlert("Yêu cầu tạo homestay đã được gửi, đang chờ admin duyệt", "success");
      }
      
      setShowModal(false);
      setEditingHomestay(null);
      resetForm();
      await loadHomestays();
    } catch (error: any) {
      console.error("Error creating homestay:", error);
      const errorMessage = error?.message || "Có lỗi xảy ra";
      showAlert(errorMessage, "danger");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (homestay: Homestay) => {
    // Check if homestay is pending - don't allow edit
    if (homestay.status === "pending") {
      showAlert("Không thể chỉnh sửa homestay đang chờ duyệt", "warning");
      return;
    }
    
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

  const handleToggleHidden = async (homestay: Homestay) => {
    const action = homestay.status === "approved" ? "ẩn" : "hiện";
    if (!window.confirm(`Bạn có chắc muốn ${action} homestay này?`)) return;
    
    try {
      await toggleHomestayStatus(homestay.id, homestay.status);
      showAlert(`${action === "ẩn" ? "Ẩn" : "Hiện"} homestay thành công`, "success");
      loadHomestays();
    } catch (error: any) {
      showAlert(error?.message || `Không thể ${action} homestay`, "danger");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    
    try {
      // Validate files and create previews
      const previews = validateAndPreviewFiles(fileArray);
      
      // Cleanup old previews
      revokePreviewUrls(imagePreviews);
      
      setImageFiles(fileArray);
      setImagePreviews(previews);
    } catch (error: any) {
      showAlert(error?.message || "File không hợp lệ", "danger");
    }
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      // Revoke the URL being removed
      if (prev[index].startsWith("blob:")) {
        URL.revokeObjectURL(prev[index]);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleViewDetail = async (homestay: Homestay) => {
    try {
      setLoading(true);
      const detailData = await fetchHomestayById(homestay.id);
      setSelectedHomestay(detailData);
      setShowDetailModal(true);
    } catch (error: any) {
      showAlert(error?.message || "Không thể tải chi tiết homestay", "danger");
    } finally {
      setLoading(false);
    }
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
    // Cleanup preview URLs
    revokePreviewUrls(imagePreviews);
    setImageFiles([]);
    setImagePreviews([]);
  };

  const getStatusBadge = (status?: string) => {
    const statusMap: Record<string, string> = {
      approved: "completed",
      pending: "pending",
      hidden: "pending",
      locked: "rejected",
    };
    return statusMap[status || "pending"] || "pending";
  };

  const getStatusLabel = (status?: string) => {
    const labelMap: Record<string, string> = {
      approved: "Công khai",
      pending: "Chờ duyệt",
      hidden: "Tạm ẩn",
      locked: "Bị khóa",
    };
    return labelMap[status || "pending"] || "Chờ duyệt";
  };

  if (loading && homestays.length === 0) {
    return (
      <>
        <style>{hostCommonStyles}</style>
        <div className="host-page">
          <div className="loading-state">
            <FaSpinner style={{ fontSize: "48px", animation: "spin 1s linear infinite" }} />
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
      </>
    );
  }

  if (error && homestays.length === 0) {
    return (
      <>
        <style>{hostCommonStyles}</style>
        <div className="host-page">
          <div className="empty-state">
            <FaExclamationTriangle style={{ fontSize: "64px", color: "#ef4444" }} />
            <h3>Không thể tải danh sách homestay</h3>
            <p>{error}</p>
            <button className="btn-primary" onClick={loadHomestays}>
              Thử lại
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{hostCommonStyles}</style>
      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
      <div className="host-page">
        <div className="page-header">
          <h1>Quản lý Homestay</h1>
          <p>Danh sách các homestay của bạn</p>
        </div>

        <div className="host-card">
          <div className="card-header">
            <h3 className="card-title">Tất cả Homestay</h3>
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              <FaPlus /> Thêm Homestay
            </button>
          </div>

          {homestays.length === 0 ? (
            <div className="empty-state">
              <FaHome style={{ fontSize: "64px" }} />
              <h3>Chưa có homestay nào</h3>
              <p>Bắt đầu bằng cách thêm homestay đầu tiên của bạn</p>
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
                {homestays.map((homestay) => (
                  <tr key={homestay.id}>
                    <td>{homestay.name}</td>
                    <td>{homestay.address}</td>
                    <td>{homestay.city}</td>
                    <td>{homestay.pricePerNight.toLocaleString("vi-VN")} ₫</td>
                    <td>{homestay.capacity} người</td>
                    <td>
                      <span className={`status-badge ${getStatusBadge(homestay.status)}`}>
                        {getStatusLabel(homestay.status)}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="action-btn action-btn-view" 
                          onClick={() => handleViewDetail(homestay)}
                          title="Xem chi tiết"
                        >
                          <FaEye />
                        </button>
                        <button 
                          className="action-btn action-btn-edit" 
                          onClick={() => handleEdit(homestay)} 
                          title={homestay.status === "pending" ? "Không thể chỉnh sửa homestay đang chờ duyệt" : "Chỉnh sửa"}
                          disabled={homestay.status === "pending"}
                          style={{
                            opacity: homestay.status === "pending" ? 0.5 : 1,
                            cursor: homestay.status === "pending" ? "not-allowed" : "pointer",
                          }}
                        >
                          <FaEdit />
                        </button>
                        {/* Chỉ hiển thị nút ẩn/hiện cho homestay đã được duyệt hoặc đang ẩn */}
                        {(homestay.status === "approved" || homestay.status === "hidden") && (
                          <button 
                            className={`action-btn ${homestay.status === "approved" ? "action-btn-delete" : "action-btn-edit"}`}
                            onClick={() => handleToggleHidden(homestay)} 
                            title={homestay.status === "approved" ? "Tạm ẩn" : "Hiện lại"}
                          >
                            {homestay.status === "approved" ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        )}
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
                        Tên homestay {!editingHomestay && <span style={{ color: "#ef4444" }}>*</span>}
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required={!editingHomestay}
                        placeholder={editingHomestay ? "Để trống nếu không thay đổi" : "VD: Villa Biển Xanh"}
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
                        Địa chỉ {!editingHomestay && <span style={{ color: "#ef4444" }}>*</span>}
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        required={!editingHomestay}
                        placeholder={editingHomestay ? "Để trống nếu không thay đổi" : "VD: 123 Đường Trần Hưng Đạo"}
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
                        Thành phố {!editingHomestay && <span style={{ color: "#ef4444" }}>*</span>}
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required={!editingHomestay}
                        placeholder={editingHomestay ? "Để trống nếu không thay đổi" : "VD: Đà Nẵng"}
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
                        Giá/đêm (VNĐ) {!editingHomestay && <span style={{ color: "#ef4444" }}>*</span>}
                      </label>
                      <input
                        type="text"
                        value={formData.pricePerNight === 0 ? "" : formData.pricePerNight.toLocaleString("vi-VN")}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, "");
                          setFormData({ ...formData, pricePerNight: Number(value) });
                        }}
                        required={!editingHomestay}
                        placeholder={editingHomestay ? "Để trống nếu không thay đổi" : "VD: 1,500,000"}
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
                      Hình ảnh Homestay <span style={{ color: "#6b7280", fontSize: "13px" }}>(Tùy chọn - có thể thêm sau)</span>
                      {editingHomestay && <span style={{ color: "#6b7280", fontSize: "13px" }}> (Để trống nếu không thay đổi)</span>}
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
                        PNG, JPG, JPEG (Max 5MB mỗi ảnh) - Tùy chọn
                      </p>
                      <p style={{ fontSize: "12px", color: "#f59e0b", marginTop: "4px" }}>
                        ⚠️ Lưu ý: Chức năng upload ảnh đang tạm thời không khả dụng. Bạn có thể tạo homestay trước và thêm ảnh sau.
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
                          {imagePreviews.length} ảnh đã chọn
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
                        Sức chứa (người) {!editingHomestay && <span style={{ color: "#ef4444" }}>*</span>}
                      </label>
                      <input
                        type="number"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                        required={!editingHomestay}
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
                      disabled={submitting}
                      style={{
                        padding: "12px 32px",
                        border: "none",
                        borderRadius: "10px",
                        background: submitting ? "#9ca3af" : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        color: "white",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: submitting ? "not-allowed" : "pointer",
                        transition: "all 0.2s",
                        boxShadow: "0 4px 6px rgba(16, 185, 129, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                      onMouseEnter={(e) => {
                        if (!submitting) {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 6px 12px rgba(16, 185, 129, 0.3)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!submitting) {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 4px 6px rgba(16, 185, 129, 0.2)";
                        }
                      }}
                    >
                      {submitting && <FaSpinner style={{ animation: "spin 1s linear infinite" }} />}
                      {submitting ? "Đang xử lý..." : editingHomestay ? "Gửi yêu cầu cập nhật" : "Gửi yêu cầu tạo mới"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedHomestay && (
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
            onClick={() => setShowDetailModal(false)}
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
                  Chi tiết Homestay
                </h2>
                <button
                  type="button"
                  onClick={() => setShowDetailModal(false)}
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

              {/* Content */}
              <div
                style={{
                  padding: "32px",
                  overflowY: "auto",
                  flex: 1,
                }}
              >
                <h3 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "16px" }}>
                  {selectedHomestay.name}
                </h3>

                {/* Images */}
                {selectedHomestay.images && selectedHomestay.images.length > 0 && (
                  <div style={{ marginBottom: "24px" }}>
                    <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px" }}>Hình ảnh</h4>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                        gap: "12px",
                      }}
                    >
                      {selectedHomestay.images.map((img, index) => (
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
                            src={img}
                            alt={`${selectedHomestay.name} - ${index + 1}`}
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Info Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                  <div>
                    <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>Địa chỉ</p>
                    <p style={{ fontSize: "16px", fontWeight: "600" }}>{selectedHomestay.address}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>Thành phố</p>
                    <p style={{ fontSize: "16px", fontWeight: "600" }}>{selectedHomestay.city}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>Giá/đêm</p>
                    <p style={{ fontSize: "16px", fontWeight: "600", color: "#10b981" }}>
                      {selectedHomestay.pricePerNight.toLocaleString("vi-VN")} ₫
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>Sức chứa</p>
                    <p style={{ fontSize: "16px", fontWeight: "600" }}>{selectedHomestay.capacity} người</p>
                  </div>
                  <div>
                    <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>Phòng ngủ</p>
                    <p style={{ fontSize: "16px", fontWeight: "600" }}>{selectedHomestay.numBedrooms} phòng</p>
                  </div>
                  <div>
                    <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>Phòng tắm</p>
                    <p style={{ fontSize: "16px", fontWeight: "600" }}>{selectedHomestay.numBathrooms} phòng</p>
                  </div>
                </div>

                {/* Description */}
                <div style={{ marginBottom: "24px" }}>
                  <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>Mô tả</p>
                  <p style={{ fontSize: "15px", lineHeight: "1.6" }}>{selectedHomestay.description}</p>
                </div>

                {/* Amenities */}
                {selectedHomestay.amenities && selectedHomestay.amenities.length > 0 && (
                  <div>
                    <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>Tiện nghi</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {selectedHomestay.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          style={{
                            padding: "6px 12px",
                            background: "#f0fdf4",
                            color: "#10b981",
                            borderRadius: "6px",
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status */}
                <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "2px solid #f3f4f6" }}>
                  <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>Trạng thái</p>
                  <span className={`status-badge ${getStatusBadge(selectedHomestay.status)}`}>
                    {getStatusLabel(selectedHomestay.status)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HostHomestayListPage;
