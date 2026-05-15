import React from "react";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Customers from "./pages/customers/customers";
import Staff from "./pages/staff/staff";
import AccountSettings from "./pages/accountProfile/accountSettings";
import ProtectedRoute from "./components/protectedRoute";
import MainLayout     from "./layout/mainLayout";

import { AuthProvider } from "./contexts/authContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public */}
          <Route path="/" element={<Login />} />

          {/* ── Admin routes — superadmin only ── */}
          <Route element={<ProtectedRoute allowedRoles={["superadmin"]} />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard"  element={<Dashboard />} />
              <Route path="/customers"  element={<Customers />} />
              <Route path="/staff"      element={<Staff />} />
            </Route>
          </Route>

          {/* ── Staff routes — non-superadmin ── */}
          <Route element={<ProtectedRoute allowedRoles={["staff", "admin", "manager"]} />}>
            <Route element={<MainLayout />}>
              <Route path="/staff-dashboard" element={<Dashboard />} />
              <Route path="/staff-customers" element={<Customers />} /> 
              <Route path="/staff-directory" element={<Staff />} />
              <Route path="/staff-account" element={<AccountSettings />} />
            </Route>
          </Route>

        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />
    </AuthProvider>
  );
}

export default App;