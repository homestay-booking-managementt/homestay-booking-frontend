import { createHomestay, fetchHomestayById, updateHomestay } from "@/api/homestayApi";
import { uploadHomestayImage } from "@/api/uploadApi";
import type { Homestay, HomestayPayload } from "@/types/homestay";
import { showAlert } from "@/utils/showAlert";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

interface HomestayFormValues {
  name: string;
  address: string;
  city: string;
  description: string;
  pricePerNight: string;
  capacity: string;
  numBedrooms: string;
  numBathrooms: string;
  amenities: string;
  images: string[];
}

const defaultValues: HomestayFormValues = {
  name: "",
  address: "",
  city: "",
  description: "",
  pricePerNight: "",
  capacity: "",
  numBedrooms: "",
  numBathrooms: "",
  amenities: "",
  images: [],
};

const HomestayFormPage = () => {
  const navigate = useNavigate();
  const { homestayId } = useParams<{ homestayId: string }>();
  const isEditing = Boolean(homestayId);
  const [formValues, setFormValues] = useState<HomestayFormValues>(defaultValues);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [manualImageUrl, setManualImageUrl] = useState("");

  useEffect(() => {
    if (!isEditing || !homestayId) {
      return;
    }

    const id = Number(homestayId);
    if (Number.isNaN(id)) {
      showAlert("Invalid homestay ID", "warning");
      navigate("/homestays");
      return;
    }

    const loadHomestay = async (targetId: number) => {
      setLoading(true);
      try {
        const data = await fetchHomestayById(targetId);
        populateForm(data);
      } catch (error) {
        showAlert("Unable to load homestay data", "danger");
        navigate("/homestays");
      } finally {
        setLoading(false);
      }
    };

    loadHomestay(id);
  }, [homestayId, isEditing, navigate]);

  const populateForm = (homestay: Homestay) => {
    setFormValues({
      name: homestay.name || "",
      address: homestay.address || "",
      city: homestay.city || "",
      description: homestay.description || "",
      pricePerNight: homestay.pricePerNight ? String(homestay.pricePerNight) : "",
      capacity: homestay.capacity ? String(homestay.capacity) : "",
      numBedrooms: homestay.numBedrooms !== undefined ? String(homestay.numBedrooms) : "",
      numBathrooms: homestay.numBathrooms !== undefined ? String(homestay.numBathrooms) : "",
      amenities: homestay.amenities?.join(", ") || "",
      images: homestay.images || [],
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    setUploading(true);
    const uploadedUrls: string[] = [];

    for (const file of Array.from(event.target.files)) {
      try {
        const url = await uploadHomestayImage(file);
        if (url) {
          uploadedUrls.push(url);
        }
      } catch (error) {
        showAlert(`Failed to upload image ${file.name}`, "danger");
      }
    }

    setFormValues((prev) => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
    setUploading(false);
    event.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setFormValues((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleAddImageUrl = () => {
    const url = manualImageUrl.trim();
    if (!url) {
      return;
    }

    setFormValues((prev) => ({ ...prev, images: [...prev.images, url] }));
    setManualImageUrl("");
  };

  const buildPayload = (): HomestayPayload | null => {
    if (!formValues.name.trim()) {
      showAlert("Please enter a homestay name", "warning");
      return null;
    }

    if (!formValues.address.trim()) {
      showAlert("Please enter an address", "warning");
      return null;
    }

    if (!formValues.city.trim()) {
      showAlert("Please enter a city", "warning");
      return null;
    }

    const price = Number(formValues.pricePerNight);
    if (Number.isNaN(price) || price <= 0) {
      showAlert("Nightly price is invalid", "warning");
      return null;
    }

    const capacity = Number(formValues.capacity);
    if (Number.isNaN(capacity) || capacity <= 0) {
      showAlert("Capacity is invalid", "warning");
      return null;
    }

    const amenitiesArray = formValues.amenities
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const payload: HomestayPayload = {
      name: formValues.name.trim(),
      address: formValues.address.trim(),
      city: formValues.city.trim(),
      description: formValues.description.trim() || undefined,
      pricePerNight: price,
      capacity: capacity,
      numBedrooms: formValues.numBedrooms ? Number(formValues.numBedrooms) : undefined,
      numBathrooms: formValues.numBathrooms ? Number(formValues.numBathrooms) : undefined,
      amenities: amenitiesArray.length > 0 ? amenitiesArray : undefined,
      images: formValues.images.length > 0 ? formValues.images : undefined,
    };

    return payload;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = buildPayload();
    if (!payload) {
      return;
    }

    setSubmitting(true);
    try {
      if (isEditing && homestayId) {
        const id = Number(homestayId);
        await updateHomestay(id, payload);
        showAlert("Homestay updated successfully", "success");
        navigate(`/homestays/${id}`);
      } else {
        await createHomestay(payload);
        showAlert("Homestay created successfully", "success");
        navigate("/homestays");
      }
    } catch (error) {
      showAlert("Failed to save homestay", "danger");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="text-center py-5">Loading data...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4">
        <div>
          <h1 className="h3 mb-1">{isEditing ? "Edit Homestay" : "Create New Homestay"}</h1>
          <p className="text-muted mb-0">
            {isEditing
              ? "Update the homestay information and submit it for approval."
              : "Provide all required details to publish a new homestay."}
          </p>
        </div>
        <Link className="btn btn-outline-secondary mt-3 mt-md-0" to="/homestays">
          Back to list
        </Link>
      </div>

      <form className="card shadow-sm" onSubmit={handleSubmit}>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label" htmlFor="name">
                Homestay Name*
              </label>
              <input
                className="form-control"
                id="name"
                name="name"
                value={formValues.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="city">
                City*
              </label>
              <input
                className="form-control"
                id="city"
                name="city"
                value={formValues.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-12">
              <label className="form-label" htmlFor="address">
                Address*
              </label>
              <input
                className="form-control"
                id="address"
                name="address"
                value={formValues.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-12">
              <label className="form-label" htmlFor="description">
                Description
              </label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                rows={4}
                value={formValues.description}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="pricePerNight">
                Nightly price (VND)*
              </label>
              <input
                className="form-control"
                id="pricePerNight"
                name="pricePerNight"
                type="number"
                min={0}
                value={formValues.pricePerNight}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="capacity">
                Capacity (guests)*
              </label>
              <input
                className="form-control"
                id="capacity"
                name="capacity"
                type="number"
                min={1}
                value={formValues.capacity}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-2">
              <label className="form-label" htmlFor="numBedrooms">
                Bedrooms
              </label>
              <input
                className="form-control"
                id="numBedrooms"
                name="numBedrooms"
                type="number"
                min={0}
                value={formValues.numBedrooms}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-2">
              <label className="form-label" htmlFor="numBathrooms">
                Bathrooms
              </label>
              <input
                className="form-control"
                id="numBathrooms"
                name="numBathrooms"
                type="number"
                min={0}
                value={formValues.numBathrooms}
                onChange={handleChange}
              />
            </div>
            <div className="col-12">
              <label className="form-label" htmlFor="amenities">
                Amenities (comma-separated)
              </label>
              <input
                className="form-control"
                id="amenities"
                name="amenities"
                placeholder="WiFi, Air conditioning, Kitchen"
                value={formValues.amenities}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="card-body border-top">
          <h5 className="card-title">Images</h5>
          <div className="mb-3">
            <label className="form-label" htmlFor="images">
              Upload images
            </label>
            <input
              className="form-control"
              id="images"
              name="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              disabled={uploading}
            />
            {uploading && <small className="text-muted d-block mt-1">Uploading images...</small>}
          </div>

          <div className="d-flex gap-2 align-items-end mb-3">
            <div className="flex-grow-1">
              <label className="form-label" htmlFor="manualImageUrl">
                Or add images via URL
              </label>
              <input
                className="form-control"
                id="manualImageUrl"
                placeholder="https://example.com/image.jpg"
                value={manualImageUrl}
                onChange={(event) => setManualImageUrl(event.target.value)}
              />
            </div>
            <button
              className="btn btn-outline-primary"
              type="button"
              onClick={handleAddImageUrl}
              disabled={!manualImageUrl.trim()}
            >
              Add URL
            </button>
          </div>

          {formValues.images.length > 0 ? (
            <div className="row g-3">
              {formValues.images.map((image, index) => (
                <div className="col-12 col-md-6 col-xl-4" key={`${image}-${index}`}>
                  <div className="card h-100 border">
                    <div className="ratio ratio-16x9">
                      <img alt={`Image ${index + 1}`} className="card-img-top" src={image} style={{ objectFit: "cover" }} />
                    </div>
                    <div className="card-body d-flex justify-content-between align-items-center">
                      <span className="text-truncate" title={image}>
                        {image}
                      </span>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">No images added yet.</p>
          )}
        </div>

        <div className="card-body border-top d-flex justify-content-end gap-2">
          <Link className="btn btn-outline-secondary" to="/homestays">
            Cancel
          </Link>
          <button className="btn btn-primary" disabled={submitting || uploading} type="submit">
            {submitting ? "Saving..." : isEditing ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HomestayFormPage;
