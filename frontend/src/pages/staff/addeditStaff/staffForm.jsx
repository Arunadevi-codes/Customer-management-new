import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { createPortal } from "react-dom";

import useStaffForm from "./useStaffForm";
import StepIndicator from "./stepIndicator";
import Step1Personal from "./step1Personal";
import Step2Job from "./step2Job";
import Step3Login from "./step3Login";
import Step4Documents from "./step4Documents";
import StaffFormActions from "./staffFormActions";

const StaffForm = ({ staff, onClose, onSave }) => {

  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, []);

  const {
    isEdit, step, loading, setLoading,
    form, states, cities, errors, locationLoading,
    handleChange, handleStateChange,
    validateStep, nextStep, prevStep,
  } = useStaffForm(staff);

  const handleSubmit = async () => {
    const error = validateStep();
    if (error) return toast.error(error);

    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key] !== null && form[key] !== undefined && form[key] !== "") {
          data.append(key, form[key]);
        }
      });
      await onSave(data, staff?._id);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save staff");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 z-[999]">

      {/* Modal */}
      <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-2xl shadow-2xl shadow-black/20 dark:shadow-black/60 flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800">

        {/* Step Indicator */}
        <StepIndicator step={step} isEdit={isEdit} onClose={onClose} />

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto max-h-[65vh] sm:max-h-[70vh] px-4 sm:px-6 [&::-webkit-scrollbar]:hidden">
          {step === 1 && (
            <Step1Personal
              form={form}
              handleChange={handleChange}
              states={states}
              cities={cities}
              loading={locationLoading}
              handleStateChange={handleStateChange}
              errors={errors}
            />
          )}
          {step === 2 && <Step2Job form={form} handleChange={handleChange} />}
          {step === 3 && <Step3Login form={form} handleChange={handleChange} isEdit={isEdit} />}
          {step === 4 && <Step4Documents form={form} handleChange={handleChange} />}
        </div>

        {/* Actions */}
        <StaffFormActions
          step={step}
          nextStep={nextStep}
          prevStep={prevStep}
          submit={handleSubmit}
          loading={loading}
          isEdit={isEdit}
        />
      </div>
    </div>,
    document.body
  );
};

export default StaffForm;