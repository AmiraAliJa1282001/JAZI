
import { Navigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

function ProtectedAdminRoute({ children }) {
  const { admin, loading } = useAdmin();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#faf6ef",
          color: "#650d17",
          fontSize: "15px",
        }}
      >
        Checking administrator access...
      </div>
    );
  }

  if (!admin) {
    return (
      <Navigate
        to="/employee/login"
        replace
      />
    );
  }

  return children;
}

export default ProtectedAdminRoute;
