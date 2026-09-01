import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./components/Layout/MainLayout";

import Dashboard from "./pages/Dashboard";
import BankCases from "./pages/NonLitigation/BankCases";
import TSRGenerator from "./pages/NonLitigation/TSRGenerator";

import CaseCreate from "./pages/Cases/CaseCreate";
import CaseDetail from "./pages/Cases/CaseDetail";
import CaseList from "./pages/Cases/CaseList";

import Approvals from "./pages/Approvals";
import SearchPage from "./pages/SearchPage";
import Reports from "./pages/Reports";
import Login from "./pages/Login";

import TSRInitiation from "./pages/NonLitigation/BusinessLegal/TSRInitiation";
import TSRDrafting from "./pages/NonLitigation/BusinessLegal/TSRDrafting";

import MasterDB from "./pages/MasterDB";
import Litigation from "./pages/Litigation/Litigation";
import LandingPage from "./features/landing-page/LandingPage";


function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            PUBLIC LANDING PAGE
        ========================= */}

        <Route path="/" element={<LandingPage />} />


        {/* =========================
            LOGIN
        ========================= */}

        <Route path="/login" element={<Login />} />


        {/* =========================
            DASHBOARD
        ========================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* /dashboard */}
          <Route index element={<Dashboard />} />

          {/* /dashboard/cases */}
          <Route path="cases" element={<CaseList />} />

          {/* /dashboard/cases/new */}
          <Route path="cases/new" element={<CaseCreate />} />

          {/* /dashboard/cases/:id */}
          <Route path="cases/:id" element={<CaseDetail />} />

          {/* /dashboard/non-litigation/:bank */}
          <Route
            path="non-litigation/:bank"
            element={<BankCases />}
          />

          {/* /dashboard/tsr/:caseId */}
          <Route
            path="tsr/:caseId"
            element={<TSRGenerator />}
          />

          {/* /dashboard/approvals */}
          <Route path="approvals" element={<Approvals />} />

          {/* /dashboard/search */}
          <Route path="search" element={<SearchPage />} />

          {/* /dashboard/reports */}
          <Route path="reports" element={<Reports />} />

          {/* /dashboard/masterDB */}
          <Route path="masterDB" element={<MasterDB />} />

          {/* /dashboard/litigation */}
          <Route path="litigation" element={<Litigation />} />

          {/* /dashboard/non-litigation/business-legal/tsr-initiation */}
          <Route
            path="non-litigation/business-legal/tsr-initiation"
            element={<TSRInitiation />}
          />

          {/* /dashboard/non-litigation/business-legal/tsr-drafting */}
          <Route
            path="non-litigation/business-legal/tsr-drafting"
            element={<TSRDrafting />}
          />
        </Route>


        {/* =========================
            FALLBACK
        ========================= */}

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;