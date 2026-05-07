import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import API from "../../../services/api";
import { validateIFSC } from "./docValidators";

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
    // ── Step 1: Personal ──────────────────────────────────────
    fullName: "",           
    email: "",
    phone: "",
    emergencyContact: "",   
    gender: "",
    dateOfBirth: "",      
    profileImage: null,
    // ── Step 1: Address ───────────────────────────────────────
    addressLine: "",       
    city: "",
    state: "",
    pincode: "",
    country: "",
    // ── Step 2: Job Info ──────────────────────────────────────
    role: "",
    employeeId: "",
    dateOfJoining: "",     
    status: "active",
    // ── Step 3: Login ─────────────────────────────────────────
    password: "",
    confirmPassword: "",
    // ── Step 4: Documents ─────────────────────────────────────
    aadhar: "",
    pan: "",
    bankAccountNumber: "",  
    ifscCode: "",           
    aadharImage: null,
    panImage: null,
  });

  // ── PREFILL DATA (EDIT MODE) ───────────────────────────────
  useEffect(() => {
    if (staff) {
      setForm({
        fullName: staff.fullName || "",
        email: staff.email || "",
        phone: staff.phone || "",
        emergencyContact: staff.emergencyContact || "",
        gender: staff.gender || "",
        dateOfBirth: staff.dateOfBirth ? staff.dateOfBirth.split("T")[0] : "",
        profileImage: staff.profileImage || null,
        addressLine: staff.addressLine || "",
        city: staff.city || "",
        state: staff.state || "",
        pincode: staff.pincode || "",
        country: staff.country || "",
        role: staff.role || "staff",
        employeeId: staff.employeeId || "",
        dateOfJoining: staff.dateOfJoining ? staff.dateOfJoining.split("T")[0] : "",
        status: staff.status || "active",
        password: "",
        confirmPassword: "",
        aadhar: staff.aadhar || "",
        pan: staff.pan || "",
        bankAccountNumber: staff.bankAccountNumber || "",
        ifscCode: staff.ifscCode || "",
        aadharImage: staff.aadharImage || null,
        panImage: staff.panImage || null,
      });
    }
  }, [staff]);

  // ── LOAD CITIES IN EDIT MODE ──────────────────────────────
  useEffect(() => {
    if (form.state) fetchCities(form.state);
  }, [form.state]);

  // ── FETCH EMPLOYEE ID (CREATE MODE) ──────────────────────
  useEffect(() => {
    if (staff) return;
    const fetchEmployeeId = async () => {
      try {
        const res = await API.get("/staff/next-employee-id");
        setForm((prev) => ({ ...prev, employeeId: res.data.employeeId }));
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
    if (!stateId) { setCities([]); return; }
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
  if (files) {
    setForm((prev) => ({ ...prev, [name]: files[0] }));
  } else {
    // ✅ treat empty string as null (handles image removal)
    setForm((prev) => ({ ...prev, [name]: value === "" ? null : (value ?? null) }));
  }
};

  // ── HANDLE STATE CHANGE ───────────────────────────────────
  const handleStateChange = (e) => {
    const stateId = e.target.value;
    setForm((prev) => ({ ...prev, state: stateId, city: "" }));
    fetchCities(stateId);
  };

  // ── VALIDATION PER STEP ───────────────────────────────────
  const validateStep = () => {
    if (step === 1) {
      const newErrors = {};
      if (!form.fullName)      newErrors.fullName      = "Full name is required";
      if (!form.email)         newErrors.email         = "Email is required";
      if (!form.phone)         newErrors.phone         = "Phone is required";
      if (!form.gender)        newErrors.gender        = "Gender is required";
      if (!form.dateOfBirth)   newErrors.dateOfBirth   = "Date of birth is required";
      if (!form.addressLine)   newErrors.addressLine   = "Address is required";
      if (!form.state)         newErrors.state         = "State is required";
      if (!form.city)          newErrors.city          = "City is required";
      if (!form.country)       newErrors.country       = "Country is required";

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return "validation_error"; // sentinel — do NOT toast
      }
      setErrors({});
    }

    if (step === 2 && (!form.role || !form.dateOfJoining))
      return "Fill job details";

    if (step === 3 && !isEdit) {
      if (!form.email || !form.password || !form.confirmPassword)
        return "Fill login credentials";
      if (form.password !== form.confirmPassword)
        return "Passwords do not match";
    }

    // ── Step 4: block submit if IFSC is filled but invalid ──
    if (step === 4) {
      const cleanIFSC = form.ifscCode?.replace(/\s/g, "") || "";
      if (cleanIFSC && !validateIFSC(cleanIFSC)) {
        return "Invalid IFSC code — e.g. SBIN0001234";
      }
    }

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

  const prevStep = () => setStep((prev) => prev - 1);

  return {
    isEdit, step, loading, setLoading,
    form, errors, states, cities, locationLoading,
    handleChange, handleStateChange,
    validateStep, nextStep, prevStep,
  };
};

export default useStaffForm;