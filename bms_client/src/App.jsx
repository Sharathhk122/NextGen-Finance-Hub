// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import RoleRoute from './components/common/RoleRoute';
import Loading from './components/common/Loading';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import './components/common/Footer.css';
import './index.css'
// Lazy load components
const Login = React.lazy(() => import('./pages/auth/Login'));
const Register = React.lazy(() => import('./pages/auth/Register'));
const CustomerDashboard = React.lazy(() => import('./pages/dashboard/CustomerDashboard'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const VerifyEmailPage = React.lazy(() => import('./pages/auth/VerifyEmailPage'));
const KYCSubmit = React.lazy(() => import('./pages/kyc/KYCSubmit'));
const KYCStatus = React.lazy(() => import('./pages/kyc/KYCStatus'));
const AdminKYCManagement = React.lazy(() => import('./pages/admin/AdminKYCManagement'));
const AccountListPage = React.lazy(() => import('./pages/account/AccountList'));
const NewAccount = React.lazy(() => import('./pages/account/NewAccount'));
const AccountDetailsPage = React.lazy(() => import('./pages/account/AccountDetails'));
const BeneficiaryListPage = React.lazy(() => import('./pages/account/BeneficiaryList'));
const NewBeneficiary = React.lazy(() => import('./pages/account/NewBeneficiary'));
const Deposit = React.lazy(() => import('./pages/transaction/Deposit'));
const Withdraw = React.lazy(() => import('./pages/transaction/Withdraw'));
const Transfer = React.lazy(() => import('./pages/transaction/Transfer'));
const TransactionHistory = React.lazy(() => import('./pages/transaction/TransactionHistory'));

// Loan components
const LoanApplication = React.lazy(() => import('./pages/loan/LoanApplication'));
const MyLoans = React.lazy(() => import('./pages/loan/MyLoans'));
const LoanDetails = React.lazy(() => import('./pages/loan/LoanDetails'));
const EMIPayment = React.lazy(() => import('./pages/loan/EMIPayment'));
const EMICalculatorPage = React.lazy(() => import('./pages/loan/EMICalculatorPage'));
const AdminLoanManagement = React.lazy(() => import('./pages/admin/AdminLoanManagement'));
const LoanSchedulePage = React.lazy(() => import('./pages/loan/LoanSchedulePage'));

// Admin components
const UserManagement = React.lazy(() => import('./pages/admin/UserManagement'));
const TransactionMonitoring = React.lazy(() => import('./pages/admin/Transactions'));
const Analytics = React.lazy(() => import('./pages/admin/Analytics'));
const Reports = React.lazy(() => import('./pages/admin/Reports'));
const Home = React.lazy(() => import('./pages/Home'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <React.Suspense fallback={<Loading />}>
            <Routes>
              {/* Auth Routes (using AuthLayout) */}
                 <Route element={<MainLayout />}>
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
           

              {/* Protected Routes (using MainLayout) */}
             
                {/* Customer Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute requiredRole="customer">
                      <CustomerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/kyc/submit"
                  element={
                    <ProtectedRoute requiredRole="customer">
                      <KYCSubmit />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/kyc/status"
                  element={
                    <ProtectedRoute requiredRole="customer">
                      <KYCStatus />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/accounts"
                  element={
                    <ProtectedRoute requiredRole="customer">
                      <AccountListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/accounts/new"
                  element={
                    <ProtectedRoute requiredRole="customer">
                      <NewAccount />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/accounts/:accountNumber"
                  element={
                    <ProtectedRoute requiredRole="customer">
                      <AccountDetailsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/beneficiaries"
                  element={
                    <ProtectedRoute requiredRole="customer">
                      <BeneficiaryListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/beneficiaries/new"
                  element={
                    <ProtectedRoute requiredRole="customer">
                      <NewBeneficiary />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transactions/deposit"
                  element={
                    <ProtectedRoute requiredRole="customer">
                      <Deposit />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transactions/withdraw"
                  element={
                    <ProtectedRoute requiredRole="customer">
                      <Withdraw />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transactions/transfer"
                  element={
                    <ProtectedRoute requiredRole="customer">
                      <Transfer />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transactions/history"
                  element={
                    <ProtectedRoute requiredRole="customer">
                      <TransactionHistory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transactions/history/:accountNumber"
                  element={
                    <ProtectedRoute requiredRole="customer">
                      <TransactionHistory />
                    </ProtectedRoute>
                  }
                />

                {/* Loan Routes */}
                <Route
                  path="/loans"
                  element={
                    <ProtectedRoute requiredRole="customer">
                      <MyLoans />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/loans/apply"
                  element={
                    <ProtectedRoute requiredRole="customer">
                      <LoanApplication />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/loans/:loanId"
                  element={
                    <ProtectedRoute requiredRole="customer">
                      <LoanDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/loans/:loanId/pay-emi"
                  element={
                    <ProtectedRoute requiredRole="customer">
                      <EMIPayment />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/loans/:loanId/schedule"
                  element={
                    <ProtectedRoute requiredRole="customer">
                      <LoanSchedulePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/emi-calculator"
                  element={
                    <ProtectedRoute requiredRole="customer">
                      <EMICalculatorPage />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/kyc"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminKYCManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/loans"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminLoanManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <UserManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/transactions"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <TransactionMonitoring />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/analytics"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Analytics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/reports"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Reports />
                    </ProtectedRoute>
                  }
                />

                {/* Default and Catch-all Routes */}
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="*" element={<RoleRoute />} />
              </Route>
            </Routes>
          </React.Suspense>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;