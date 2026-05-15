import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/authContext";
import { getMyProfile, updateMyProfile, changeMyPassword } from "../../services/staffApi";
import API from "../../services/api";
import { toast } from "react-toastify";

const useAccountSettings = () => {
  const { user, login } = useAuth();
  const fileRef = useRef();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [locationLoading, setLocationLoading] = useState({ states: false, cities: false });

  // ✅ Added email to form state
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", emergencyContact: "", gender: "", dateOfBirth: "",
    addressLine: "", city: "", state: "", pincode: "", country: "",
    role: "", employeeId: "", dateOfJoining: "", status: "", loginEmail: "",
    aadhar: "", pan: "", bankAccountNumber: "", ifscCode: "",
  });

  const [previewImg, setPreviewImg]     = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);
  const [removeImage, setRemoveImage]   = useState(false);

  const [pwdForm, setPwdForm]     = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwdSaving, setPwdSaving] = useState(false);

  // ── Fetch profile ──────────────────────────────────────────
  useEffect(() => { fetchProfile(); }, []);

  // ── Fetch states ───────────────────────────────────────────
  useEffect(() => {
    const fetchStates = async () => {
      try {
        setLocationLoading((prev) => ({ ...prev, states: true }));
        const res = await API.get("/states");
        setStates(res.data.states || []);
      } catch { toast.error("Failed to load states"); }
      finally { setLocationLoading((prev) => ({ ...prev, states: false })); }
    };
    fetchStates();
  }, []);

  // ── Fetch cities when state changes ───────────────────────
  useEffect(() => {
    if (!form.state) { setCities([]); return; }
    const fetchCities = async () => {
      try {
        setLocationLoading((prev) => ({ ...prev, cities: true }));
        const res = await API.get(`/cities?stateId=${form.state}`);
        setCities(res.data.cities || []);
      } catch { toast.error("Failed to load cities"); }
      finally { setLocationLoading((prev) => ({ ...prev, cities: false })); }
    };
    fetchCities();
  }, [form.state]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getMyProfile();
      setProfile(data);
      // ✅ Added email to setForm
      setForm({
        fullName: data.fullName || "", email: data.email || "",
        phone: data.phone || "", emergencyContact: data.emergencyContact || "",
        gender: data.gender || "",
        dateOfBirth: data.dateOfBirth?.split("T")[0] || "",
        addressLine: data.addressLine || "", city: data.city || "",
        state: data.state || "", pincode: data.pincode || "", country: data.country || "",
        role: data.role || "", employeeId: data.employeeId || "",
        dateOfJoining: data.dateOfJoining?.split("T")[0] || "",
        status: data.status || "", loginEmail: data.loginEmail || "",
        aadhar: data.aadhar || "", pan: data.pan || "",
        bankAccountNumber: data.bankAccountNumber || "", ifscCode: data.ifscCode || "",
      });
    } catch (err) { toast.error(err.message || "Failed to load profile"); }
    finally { setLoading(false); }
  };

  const handleField       = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleStateChange = (e) => setForm((prev) => ({ ...prev, state: e.target.value, city: "" }));

  const handleImagePick = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewImageFile(file);
    setPreviewImg(URL.createObjectURL(file));
    setRemoveImage(false);
  };

  const handleRemoveImage = () => {
    setPreviewImg(null);
    setNewImageFile(null);
    setRemoveImage(true);
    if (fileRef.current) fileRef.current.value = "";
  };

  const cancelEdit = () => {
    setEditing(false);
    setPreviewImg(null);
    setNewImageFile(null);
    setRemoveImage(false);
    fetchProfile();
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { fd.append(k, v); });

      if (newImageFile) {
        fd.append("profileImage", newImageFile);
      } else if (removeImage) {
        fd.append("removeProfileImage", "true");
      }

      const res = await updateMyProfile(fd);

      // ✅ Fixed: read token from sessionStorage (not localStorage)
      const currentToken = sessionStorage.getItem("token");

      login(
        {
          ...user,
          name: res.staff.fullName,
          profileImage: res.staff.profileImage
            ? res.staff.profileImage.replace(/\\/g, "/")
            : null,
        },
        currentToken
      );

      setProfile(res.staff);
      setEditing(false);
      setPreviewImg(null);
      setNewImageFile(null);
      setRemoveImage(false);
      toast.success("Profile updated successfully");
    } catch (err) { toast.error(err.message || "Update failed"); }
    finally { setSaving(false); }
  };

  const handlePasswordChange = async () => {
    const { currentPassword, newPassword, confirmPassword } = pwdForm;
    if (!currentPassword || !newPassword || !confirmPassword) return toast.error("All password fields are required");
    if (newPassword.length < 6) return toast.error("Password must be at least 6 characters");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");
    try {
      setPwdSaving(true);
      const res = await changeMyPassword({ currentPassword, newPassword });
      toast.success(res.message || "Password changed successfully");
      setPwdForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) { toast.error(err.message || "Failed to change password"); }
    finally { setPwdSaving(false); }
  };

  const getInitials = (name = "") =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const avatarSrc =
    previewImg ||
    (removeImage
      ? null
      : profile?.profileImage
        ? `http://localhost:5000/${profile.profileImage.replace(/\\/g, "/")}`
        : null);

  return {
    fileRef, profile, loading, editing, setEditing, saving,
    states, cities, locationLoading,
    form, handleField, handleStateChange,
    previewImg, removeImage, handleImagePick, handleRemoveImage, cancelEdit, handleSave,
    pwdForm, setPwdForm, pwdSaving, handlePasswordChange,
    getInitials, avatarSrc,
  };
};

export default useAccountSettings;