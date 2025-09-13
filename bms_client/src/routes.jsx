// src/routes.jsx
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';

// Dashboards
import CustomerDashboard from './pages/dashboard/CustomerDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';

// Account Pages
import AccountListPage from './pages/account/AccountList';
import AccountDetailsPage from './pages/account/AccountDetails';
import NewAccountPage from './pages/account/NewAccount';
import KYCUpdatePage from './pages/account/KYCUpdate';
import BeneficiaryListPage from './pages/account/BeneficiaryList';
import NewBeneficiaryPage from './pages/account/NewBeneficiary';
import BeneficiaryDetailsPage from './pages/account/BeneficiaryDetailsPage';

// Transaction Pages
import DepositPage from './pages/transaction/Deposit';
import WithdrawPage from './pages/transaction/Withdraw';
import TransferPage from './pages/transaction/Transfer';
import TransactionHistoryPage from './pages/transaction/TransactionHistory';

// Error Pages
import NotFound from './pages/errors/NotFound';
import Unauthorized from './pages/errors/Unauthorized';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Customer Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin Dashboard */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Accounts */}
      <Route
        path="/accounts"
        element={
          <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
            <AccountListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accounts/new"
        element={
          <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
            <NewAccountPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accounts/:accountNumber"
        element={
          <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
            <AccountDetailsPage />
          </ProtectedRoute>
        }
      />

      {/* KYC */}
      <Route
        path="/kyc"
        element={
          <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
            <KYCUpdatePage />
          </ProtectedRoute>
        }
      />

      {/* Beneficiaries */}
      <Route
        path="/beneficiaries"
        element={
          <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
            <BeneficiaryListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/beneficiaries/new"
        element={
          <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
            <NewBeneficiaryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/beneficiaries/:id"
        element={
          <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
            <BeneficiaryDetailsPage />
          </ProtectedRoute>
        }
      />

      {/* Transactions */}
      <Route
        path="/accounts/:accountNumber/deposit"
        element={
          <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
            <DepositPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accounts/:accountNumber/withdraw"
        element={
          <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
            <WithdrawPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transfer"
        element={
          <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
            <TransferPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accounts/:accountNumber/history"
        element={
          <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
            <TransactionHistoryPage />
          </ProtectedRoute>
        }
      />

      {/* Error Pages */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;