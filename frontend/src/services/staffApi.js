import API from "./api";

// ── GET MY PROFILE ─────────────────────────────────────────────
export const getMyProfile = async () => {
  const res = await API.get("/staff/profile/me");
  return res.data;
};

// ── UPDATE MY PROFILE ──────────────────────────────────────────
// Accepts FormData (handles profile image upload too)
export const updateMyProfile = async (formData) => {
  const res = await API.put("/staff/profile/me", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// ── CHANGE PASSWORD ────────────────────────────────────────────
export const changeMyPassword = async ({ currentPassword, newPassword }) => {
  const res = await API.put("/staff/profile/change-password", {
    currentPassword,
    newPassword,
  });
  return res.data;
};