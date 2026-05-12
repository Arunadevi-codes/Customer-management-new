import React from "react";
import { SectionTitle, Field, TextInput, SelectInput } from "./accountSettingsUI";

export const PersonalSection = ({ form, profile, handleField, handleStateChange, editing, states, cities, locationLoading }) => (
  <>
    <SectionTitle title="Personal Details" />
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

      <Field label="Full Name">
        <TextInput name="fullName" value={form.fullName} onChange={handleField} disabled={!editing} />
      </Field>
      <Field label="Email">
        <TextInput value={profile?.email || ""} disabled />
      </Field>
      <Field label="Login Email">
        <TextInput value={form.loginEmail} disabled />
      </Field>
      <Field label="Phone">
        <TextInput name="phone" value={form.phone} onChange={handleField} disabled={!editing} />
      </Field>
      <Field label="Emergency Contact">
        <TextInput name="emergencyContact" value={form.emergencyContact} onChange={handleField} disabled={!editing} />
      </Field>
      <Field label="Gender">
        <SelectInput name="gender" value={form.gender} onChange={handleField} disabled={!editing}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </SelectInput>
      </Field>
      <Field label="Date Of Birth">
        <TextInput type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleField} disabled={!editing} />
      </Field>
      <Field label="Address">
        <TextInput name="addressLine" value={form.addressLine} onChange={handleField} disabled={!editing} />
      </Field>

      <Field label="State">
        <SelectInput name="state" value={form.state} onChange={handleStateChange} disabled={!editing || locationLoading.states}>
          <option value="">{locationLoading.states ? "Loading states..." : "Select State"}</option>
          {states.map((s) => (
            <option key={s._id || s.id} value={s._id || s.id}>{s.name}</option>
          ))}
        </SelectInput>
      </Field>

      <Field label="City">
        <SelectInput name="city" value={form.city} onChange={handleField} disabled={!editing || locationLoading.cities || !form.state}>
          <option value="">
            {!form.state ? "Select state first" : locationLoading.cities ? "Loading cities..." : "Select City"}
          </option>
          {cities.map((c) => (
            <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>
          ))}
        </SelectInput>
      </Field>

      <Field label="Pincode">
        <TextInput name="pincode" value={form.pincode} onChange={handleField} disabled={!editing} />
      </Field>
      <Field label="Country">
        <TextInput name="country" value={form.country} onChange={handleField} disabled={!editing} />
      </Field>
    </div>
  </>
);

export const JobSection = ({ form, handleField, editing }) => (
  <>
    <SectionTitle title="Job Details" />
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <Field label="Role"><TextInput value={form.role} disabled /></Field>
      <Field label="Employee ID"><TextInput value={form.employeeId} disabled /></Field>
      <Field label="Joining Date">
        <TextInput type="date" name="dateOfJoining" value={form.dateOfJoining} onChange={handleField} disabled={!editing} />
      </Field>
    </div>
  </>
);

export const DocumentsSection = ({ form, profile, handleField, editing }) => (
  <>
    <SectionTitle title="Documents" />
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

      <div className="space-y-4 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-[#171717]">
        <Field label="Aadhar Number">
          <TextInput name="aadhar" value={form.aadhar} onChange={handleField} disabled={!editing} />
        </Field>
        {profile?.aadharImage && (
          <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 h-52">
            <img src={`http://localhost:5000/${profile.aadharImage.replace(/\\/g, "/")}`} alt="Aadhar" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      <div className="space-y-4 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-[#171717]">
        <Field label="PAN Number">
          <TextInput name="pan" value={form.pan} onChange={handleField} disabled={!editing} />
        </Field>
        {profile?.panImage && (
          <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 h-52">
            <img src={`http://localhost:5000/${profile.panImage.replace(/\\/g, "/")}`} alt="PAN" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      <Field label="Account Number">
        <TextInput name="bankAccountNumber" value={form.bankAccountNumber} onChange={handleField} disabled={!editing} />
      </Field>
      <Field label="IFSC Code">
        <TextInput name="ifscCode" value={form.ifscCode} onChange={handleField} disabled={!editing} />
      </Field>
    </div>
  </>
);