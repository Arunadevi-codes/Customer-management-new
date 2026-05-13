import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import API from "../../../services/api";
import { validateIFSC } from "./docValidators";

const isValidEmail = (val) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val).trim());

const useStaffForm = (staff) => {
  const isEdit = !!staff;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [errors, setErrors] = useState({});
  const [locationLoading, setLocationLoading] = useState({
    states: false,
    cities: false,
  });

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    emergencyContact: "",
    gender: "",
    dateOfBirth: "",
    profileImage: null,

    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    country: "",

    role: "",
    employeeId: "",
    dateOfJoining: "",
    status: "",

    loginEmail: "",
    password: "",
    confirmPassword: "",

    aadhar: "",
    pan: "",
    bankAccountNumber: "",
    ifscCode: "",
    aadharImage: null,
    panImage: null,
  });

  // ── PREFILL DATA ──────────────────────────────────────────
  useEffect(() => {
    if (!staff) return;

    setForm({
      fullName: staff.fullName || "",
      email: staff.email || "",
      phone: staff.phone || "",
      emergencyContact: staff.emergencyContact || "",
      gender: staff.gender || "",
      dateOfBirth: staff.dateOfBirth?.split("T")[0] || "",
      profileImage: staff.profileImage || null,

      addressLine: staff.addressLine || "",
      city: staff.city || "",
      state: staff.state || "",
      pincode: staff.pincode || "",
      country: staff.country || "",

      role: staff.role || "staff",
      employeeId: staff.employeeId || "",
      dateOfJoining: staff.dateOfJoining?.split("T")[0] || "",
      status: staff.status || "active",

      loginEmail: staff.loginEmail || "",
      password: "",
      confirmPassword: "",

      aadhar: staff.aadhar || "",
      pan: staff.pan || "",
      bankAccountNumber: staff.bankAccountNumber || "",
      ifscCode: staff.ifscCode || "",
      aadharImage: staff.aadharImage || null,
      panImage: staff.panImage || null,
    });
  }, [staff]);

  // ── LOAD CITIES ───────────────────────────────────────────
  useEffect(() => {
    if (form.state) fetchCities(form.state);
  }, [form.state]);

  // ── FETCH EMPLOYEE ID ─────────────────────────────────────
  useEffect(() => {
    if (staff) return;

    const fetchEmployeeId = async () => {
      try {
        const res = await API.get("/staff/next-employee-id");
        setForm((prev) => ({
          ...prev,
          employeeId: res.data.employeeId,
        }));
      } catch (err) {
        console.error("Failed to fetch employee ID:", err);
      }
    };

    fetchEmployeeId();
  }, [staff]);

  // ── FETCH STATES ──────────────────────────────────────────
  useEffect(() => {
    const fetchStates = async () => {
      try {
        setLocationLoading((prev) => ({ ...prev, states: true }));

        const res = await API.get("/states");
        setStates(res.data.states || []);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load states");
      } finally {
        setLocationLoading((prev) => ({ ...prev, states: false }));
      }
    };

    fetchStates();
  }, []);

  // ── FETCH CITIES ──────────────────────────────────────────
  const fetchCities = async (stateId) => {
    if (!stateId) return setCities([]);

    try {
      setLocationLoading((prev) => ({ ...prev, cities: true }));

      const res = await API.get(`/cities?stateId=${stateId}`);
      setCities(res.data.cities || []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load cities");
    } finally {
      setLocationLoading((prev) => ({ ...prev, cities: false }));
    }
  };

  // ── HANDLE INPUT ──────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value === "" ? null : value ?? null,
    }));

    setErrors((prev) => {
      if (!prev[name]) return prev;

      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  // ── HANDLE STATE CHANGE ───────────────────────────────────
  const handleStateChange = (e) => {
    const stateId = e.target.value;

    setForm((prev) => ({
      ...prev,
      state: stateId,
      city: "",
    }));

    fetchCities(stateId);

    setErrors((prev) => {
      const next = { ...prev };
      delete next.state;
      delete next.city;
      return next;
    });
  };

  // ── VALIDATION ────────────────────────────────────────────
  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!form.fullName)
        newErrors.fullName = "Full name is required";

      if (!form.email)
        newErrors.email = "Email is required";
      else if (!isValidEmail(form.email))
        newErrors.email = "Enter a valid email address";

      if (!form.phone)
        newErrors.phone = "Phone is required";

      if (!form.gender)
        newErrors.gender = "Gender is required";

      if (!form.dateOfBirth)
        newErrors.dateOfBirth = "Date of birth is required";

      if (!form.addressLine)
        newErrors.addressLine = "Address is required";

      if (!form.state)
        newErrors.state = "State is required";

      if (!form.city)
        newErrors.city = "City is required";

      if (!form.country)
        newErrors.country = "Country is required";
    }

    if (step === 2) {
      if (!form.role)
        newErrors.role = "Role is required";

      if (!form.dateOfJoining)
        newErrors.dateOfJoining = "Joining date is required";

      if (!form.status)
        newErrors.status = "Status is required";
    }

    if (step === 3 && !isEdit) {
      if (!form.loginEmail)
        newErrors.loginEmail = "Login email is required";
      else if (!isValidEmail(form.loginEmail))
        newErrors.loginEmail = "Enter a valid email address";

      if (!form.password)
        newErrors.password = "Password is required";

      if (!form.confirmPassword)
        newErrors.confirmPassword = "Please confirm your password";
      else if (form.password !== form.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }

    if (step === 3 && isEdit) {
      if (form.loginEmail && !isValidEmail(form.loginEmail))
        newErrors.loginEmail = "Enter a valid email address";

      if (
        form.password &&
        form.confirmPassword &&
        form.password !== form.confirmPassword
      ) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    if (step === 4) {
      const cleanAadhar = form.aadhar?.replace(/\D/g, "") || "";
      const cleanPAN = form.pan?.replace(/\s/g, "") || "";
      const cleanIFSC = form.ifscCode?.replace(/\s/g, "") || "";

      if (!cleanAadhar)
        newErrors.aadhar = "Aadhar number is required";
      else if (!/^\d{12}$/.test(cleanAadhar))
        newErrors.aadhar = "Must be exactly 12 digits";

      if (!cleanPAN)
        newErrors.pan = "PAN number is required";
      else if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(cleanPAN.toUpperCase()))
        newErrors.pan = "Format: ABCDE1234F";

      if (!form.bankAccountNumber)
        newErrors.bankAccountNumber = "Account number is required";

      if (!cleanIFSC)
        newErrors.ifscCode = "IFSC code is required";
      else if (!validateIFSC(cleanIFSC))
        newErrors.ifscCode = "Invalid IFSC — e.g. SBIN0001234";

      if (!form.aadharImage)
        newErrors.aadharImage = "Aadhar document is required";

      if (!form.panImage)
        newErrors.panImage = "PAN document is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return "validation_error";
    }

    setErrors({});
    return null;
  };

  const nextStep = () => {
    const error = validateStep();

    if (!error) {
      setStep((prev) => prev + 1);
    } else if (error !== "validation_error") {
      toast.error(error);
    }
  };

  const prevStep = () => {
    setErrors({});
    setStep((prev) => prev - 1);
  };

  return {
    isEdit,
    step,
    loading,
    setLoading,
    form,
    errors,
    states,
    cities,
    locationLoading,
    handleChange,
    handleStateChange,
    validateStep,
    nextStep,
    prevStep,
  };
};

export default useStaffForm;