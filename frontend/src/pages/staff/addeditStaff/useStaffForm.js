import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import API from "../../../services/api";

const useStaffForm = (staff) => {
  const isEdit = !!staff;
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [locationLoading, setLocationLoading] = useState({
    states: false,
    cities: false,
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    emergencyPhone: "",
    gender: "",
    dob: "",
    profileImage: null,
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    role: "staff",
    employeeId: "",
    joiningDate: "",
    status: "active",
    password: "",
    confirmPassword: "",
    aadhar: "",
    pan: "",
    accountNumber: "",
    ifsc: "",
  });

  // PREFILL DATA (EDIT MODE)
  useEffect(() => {
    if (staff) {
      setForm({
        name: staff.fullName || "",
        email: staff.email || "",
        phone: staff.phone || "",
        emergencyPhone: staff.emergencyContact || "",
        gender: staff.gender || "",
        dob: staff.dateOfBirth ? staff.dateOfBirth.split("T")[0] : "",
        profileImage: null,
        address: staff.addressLine || "",
        city: staff.city || "",
        state: staff.state || "",
        pincode: staff.pincode || "",
        country: staff.country || "",
        role: staff.role || "staff",
        employeeId: staff.employeeId || "",
        joiningDate: staff.dateOfJoining ? staff.dateOfJoining.split("T")[0] : "",
        status: staff.status || "active",
        password: "",
        confirmPassword: "",
        aadhar: staff.aadhar || "",
        pan: staff.pan || "",
        accountNumber: staff.bankAccountNumber || "",
        ifsc: staff.ifscCode || "",
      });
    }
  }, [staff]);

  // LOAD CITIES IN EDIT MODE
  useEffect(() => {
    if (form.state) fetchCities(form.state);
  }, [form.state]);

  // FETCH EMPLOYEE ID (CREATE MODE)
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

  // FETCH STATES
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

  // FETCH CITIES
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

  // HANDLE INPUT
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // HANDLE STATE CHANGE
  const handleStateChange = (e) => {
    const stateId = e.target.value;
    setForm((prev) => ({ ...prev, state: stateId, city: "" }));
    fetchCities(stateId);
  };

  // VALIDATION PER STEP
  const validateStep = () => {
    if (step === 1 && (!form.name || !form.email || !form.phone))
      return "Fill all personal details";
    if (step === 2 && (!form.role || !form.joiningDate))
      return "Fill job details";
    if (step === 3 && !isEdit) {
      if (!form.email || !form.password || !form.confirmPassword)
        return "Fill login credentials";
      if (form.password !== form.confirmPassword)
        return "Passwords do not match";
    }
    return null;
  };

  const nextStep = () => {
    const error = validateStep();
    if (error) return toast.error(error);
    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  return {
    isEdit, step, loading, setLoading,
    form, states, cities, locationLoading,
    handleChange, handleStateChange,
    validateStep, nextStep, prevStep,
  };
};

export default useStaffForm;