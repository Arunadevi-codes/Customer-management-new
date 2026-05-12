import React from "react";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Customers from "./pages/customers/customers";
import Staff from "./pages/staff/staff";

import StaffDashboard   from "./staffPages/staffDashboard";
import AccountSettings  from "./staffPages/accountSettings";

import ProtectedRoute from "./components/protectedRoute";
import StaffProtectedRoute from "./components/staffprotectedRoute";
import MainLayout from "./layout/mainLayout";
import StaffMainLayout from "./staffPages/staffLayout/staffmainLayout";
import { AuthProvider } from "./contexts/authContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public */}
          <Route path="/" element={<Login />} />

          {/* ── Admin Protected Routes ── */}
          <Route element={<ProtectedRoute allowedRoles={["superadmin"]} />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard"  element={<Dashboard />} />
              <Route path="/customers"  element={<Customers />} />
              <Route path="/staff"      element={<Staff />} />
            </Route>
          </Route>

          {/* ── Staff Protected Routes (with StaffMainLayout) ── */}
          <Route element={<StaffProtectedRoute />}>
            <Route element={<StaffMainLayout />}>
              <Route path="/staff-dashboard" element={<StaffDashboard />} />
              <Route path="/staff-account"   element={<AccountSettings />} />
            </Route>
          </Route>

        </Routes>
      </BrowserRouter>

      <ToastContainer position="top-right" autoClose={2000} theme="colored" />
    </AuthProvider>
  );
}

export default App;