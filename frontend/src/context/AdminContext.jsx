
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getAdminSession,
  employeeLogout,
} from "../services/websiteApi";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function checkSession() {
      try {
        const data = await getAdminSession(
          controller.signal
        );

        if (!controller.signal.aborted) {
          setAdmin(
            data?.authenticated && data?.user?.is_admin
              ? data.user
              : null
          );
        }
      } catch {
        if (!controller.signal.aborted) {
          setAdmin(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    checkSession();

    return () => controller.abort();
  }, []);

  async function logout() {
    await employeeLogout();
    setAdmin(null);
  }

  return (
    <AdminContext.Provider
      value={{ admin, loading, logout }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error(
      "useAdmin must be used inside AdminProvider."
    );
  }

  return context;
}
