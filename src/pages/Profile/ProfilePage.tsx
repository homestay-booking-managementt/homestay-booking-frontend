/* eslint-disable prettier/prettier */
import { useState } from "react";
import { showAlert } from "@/utils/showAlert";

const ProfilePage = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: null as File | null,
  });

  const [saving, setSaving] = useState(false);
  const [deactivating, setDeactivating] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormState((prev) => ({ ...prev, avatar: file }));
    }
  };

  const handleSaveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      // TODO: Integrate with profile update API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showAlert("Profile updated successfully", "success");
    } catch (error) {
      showAlert("Failed to update profile", "danger");
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivateAccount = async () => {
    if (typeof window === "undefined" || !window.confirm("Are you sure you want to deactivate your account?")) {
      return;
    }

    setDeactivating(true);
    try {
      // TODO: Integrate with account deactivation API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showAlert("Account deactivated", "success");
    } catch (error) {
      showAlert("Failed to deactivate account", "danger");
    } finally {
      setDeactivating(false);
    }
  };

  return (
    <div className="container">
      <div className="mb-4">
        <h1 className="h3 mb-2">My Profile</h1>
        <p className="text-muted mb-0">Update your personal information and account settings.</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">Personal Information</h5>
              <form className="row g-3" onSubmit={handleSaveProfile}>
                <div className="col-12">
                  <label className="form-label" htmlFor="profile-name">
                    Full Name
                  </label>
                  <input
                    className="form-control"
                    id="profile-name"
                    name="name"
                    type="text"
                    value={formState.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="profile-email">
                    Email
                  </label>
                  <input
                    className="form-control"
                    id="profile-email"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="profile-phone">
                    Phone Number
                  </label>
                  <input
                    className="form-control"
                    id="profile-phone"
                    name="phone"
                    type="tel"
                    value={formState.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="profile-avatar">
                    Avatar
                  </label>
                  <input
                    className="form-control"
                    id="profile-avatar"
                    name="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                  {formState.avatar && (
                    <div className="mt-2 text-muted small">
                      Selected: {formState.avatar.name}
                    </div>
                  )}
                </div>
                <div className="col-12 text-end">
                  <button className="btn btn-primary" disabled={saving} type="submit">
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Account Settings</h5>
              <div className="d-grid gap-2">
                <button className="btn btn-outline-secondary" type="button">
                  Change Password
                </button>
                <button
                  className="btn btn-outline-danger"
                  disabled={deactivating}
                  onClick={handleDeactivateAccount}
                  type="button"
                >
                  {deactivating ? "Deactivating..." : "Deactivate Account"}
                </button>
              </div>
              <div className="alert alert-warning mt-3 mb-0">
                <small>
                  <strong>Note:</strong> Deactivating your account will temporarily disable access. You can reactivate
                  it anytime by logging in.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
