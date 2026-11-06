import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

import Home from "./pages/Home/Home";
import Menu from "./pages/Menu/Menu";
import TrackOrder from "./pages/TrackOrder/TrackOrder";
import Checkout from "./pages/Checkout/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation/OrderConfirmation";

import EmployeeOrders from "./pages/EmployeeOrders/EmployeeOrders";
import EmployeeLogin from "./pages/EmployeeLogin/EmployeeLogin";
import EmployeeMenu from "./pages/EmployeeMenu/EmployeeMenu";
import EmployeeHistory from "./pages/EmployeeHistory/EmployeeHistory";

import { EmployeeProvider } from "./context/EmployeeContext";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import AdminOrders from "./pages/AdminOrders/AdminOrders";

import { AdminProvider } from "./context/AdminContext";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import AdminProducts from "./pages/AdminProducts/AdminProducts";
import AdminCategories from "./pages/AdminCategories/AdminCategories";

import AdminEmployees from "./pages/AdminEmployees/AdminEmployees";

import AdminSettings from "./pages/AdminSettings/AdminSettings";




function AppRoutes() {
  return (
    <Routes>
      {/* =========================
          CUSTOMER ROUTES
          ========================= */}

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/menu"
        element={<Menu />}
      />

      <Route
        path="/track-order"
        element={<TrackOrder />}
      />

      <Route
        path="/checkout"
        element={<Checkout />}
      />

      <Route
        path="/order-confirmation/:orderNumber"
        element={<OrderConfirmation />}
      />


      {/* =========================
          EMPLOYEE ROUTES
          ========================= */}

      <Route
        path="/employee/login"
        element={<EmployeeLogin />}
      />

      <Route
        path="/employee/orders"
        element={<EmployeeOrders />}
      />

      <Route
        path="/employee/menu"
        element={<EmployeeMenu />}
      />

      <Route
        path="/employee/history"
        element={<EmployeeHistory />}
      />
      <Route
        path="/admin"
        element={
        <ProtectedAdminRoute>
          <AdminDashboard />
        </ProtectedAdminRoute>
      }
      />
      <Route
        path="/admin/orders"
        element={
        <ProtectedAdminRoute>
          <AdminOrders />
        </ProtectedAdminRoute>
      }
      />
      <Route
        path="/admin/products"
        element={
          <ProtectedAdminRoute>
            <AdminProducts />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <ProtectedAdminRoute>
            <AdminCategories />
          </ProtectedAdminRoute>
        }
      />

      
    <Route
      path="/admin/employees"
      element={
        <ProtectedAdminRoute>
          <AdminEmployees />
        </ProtectedAdminRoute>
      }
    />
    
  <Route
    path="/admin/settings"
    element={
      <ProtectedAdminRoute>
        <AdminSettings />
      </ProtectedAdminRoute>
    }
  />


    </Routes>
  );
}


function AppContent() {
  const location = useLocation();

  const isEmployeePage = location.pathname.startsWith("/employee");
  const isAdminPage = location.pathname.startsWith("/admin");

  const isDashboardPage = isEmployeePage || isAdminPage;

  return (
    <>
      {/* Customer Navbar */}
      {!isDashboardPage  && <Navbar />}


      {/* =========================
          PAGE CONTENT
          ========================= */}

      {isEmployeePage ? (
          <EmployeeProvider>
            <AppRoutes />
          </EmployeeProvider>
        ) : isAdminPage ? (
          <AdminProvider>
            <AppRoutes />
          </AdminProvider>
        ) : (
          <AppRoutes />
        )}


      {/* Customer Footer */}
      {!isDashboardPage  && <Footer />}
    </>
  );
}


function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}


export default App;