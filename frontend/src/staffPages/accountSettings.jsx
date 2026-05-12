import React from "react";
import { Camera } from "lucide-react";
import { PwdInput } from "./accountSettingsUI";
import { PersonalSection, JobSection, DocumentsSection } from "./accountsettingsSection";
import useAccountSettings from "./useaccountSettings";

const AccountSettings = () => {
  const {
    fileRef, profile, loading, editing, setEditing, saving,
    states, cities, locationLoading,
    form, handleField, handleStateChange,
    handleImagePick, cancelEdit, handleSave,
    pwdForm, setPwdForm, pwdSaving, handlePasswordChange,
    getInitials, avatarSrc,
  } = useAccountSettings();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-3 sm:px-4 md:px-6 pb-10">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Account Settings</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage your staff profile and password</p>
      </div>

      <div className="bg-white dark:bg-[#111111] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm p-4 sm:p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative mx-auto sm:mx-0">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shadow-sm border border-gray-200 dark:border-gray-700">
                {avatarSrc
                  ? <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
                  : <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">{getInitials(profile?.fullName)}</span>
                }
              </div>
              {editing && (
                <>
                  <button type="button" onClick={() => fileRef.current?.click()}
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center shadow-lg transition">
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImagePick} />
                </>
              )}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{profile?.fullName}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{profile?.email}</p>
              <p className="text-xs mt-1 text-gray-500 dark:text-gray-500">Employee ID : {profile?.employeeId}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center lg:justify-end">
            {!editing ? (
              <button onClick={() => setEditing(true)}
                className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition">
                Edit Profile
              </button>
            ) : (
              <>
                <button onClick={handleSave} disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white text-sm font-semibold transition">
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button onClick={cancelEdit}
                  className="px-5 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-semibold transition">
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        <PersonalSection form={form} profile={profile} handleField={handleField}
          handleStateChange={handleStateChange} editing={editing}
          states={states} cities={cities} locationLoading={locationLoading} />
        <JobSection form={form} handleField={handleField} editing={editing} />
        <DocumentsSection form={form} profile={profile} handleField={handleField} editing={editing} />
      </div>

      <div className="bg-white dark:bg-[#111111] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm p-4 sm:p-6 md:p-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Password Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <PwdInput id="currentPassword" label="Current Password" value={pwdForm.currentPassword}
            onChange={(e) => setPwdForm((f) => ({ ...f, currentPassword: e.target.value }))} placeholder="Enter current password" />
          <PwdInput id="newPassword" label="New Password" value={pwdForm.newPassword}
            onChange={(e) => setPwdForm((f) => ({ ...f, newPassword: e.target.value }))} placeholder="Enter new password" />
          <PwdInput id="confirmPassword" label="Confirm Password" value={pwdForm.confirmPassword}
            onChange={(e) => setPwdForm((f) => ({ ...f, confirmPassword: e.target.value }))} placeholder="Confirm new password" />
        </div>
        <button onClick={handlePasswordChange} disabled={pwdSaving}
          className="mt-6 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-semibold transition">
          {pwdSaving ? "Changing..." : "Change Password"}
        </button>
      </div>
    </div>
  );
};

export default AccountSettings;