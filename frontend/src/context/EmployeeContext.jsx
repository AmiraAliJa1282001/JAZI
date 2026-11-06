import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  employeeLogout,
  getEmployeeSession,
} from "../services/websiteApi";

const EmployeeContext = createContext(null);

export function EmployeeProvider({ children }) {
  const [employee, setEmployee] = useState(null);
  const [employeeLoading, setEmployeeLoading] =
    useState(true);

  const [loggingOut, setLoggingOut] =
    useState(false);

  const [employeeError, setEmployeeError] =
    useState("");

  async function loadEmployee() {
    try {
      setEmployeeError("");

      const data = await getEmployeeSession();

      setEmployee(data.user);

      return data.user;
    } catch (error) {
      setEmployee(null);
      throw error;
    } finally {
      setEmployeeLoading(false);
    }
  }

  async function logoutEmployee() {
    if (loggingOut) return;

    try {
      setLoggingOut(true);
      setEmployeeError("");

      await employeeLogout();

      setEmployee(null);

      return true;
    } catch (error) {
      setEmployeeError(
        error?.detail || "Unable to sign out."
      );

      throw error;
    } finally {
      setLoggingOut(false);
    }
  }

  useEffect(() => {
    loadEmployee().catch(() => {
      // Each protected employee page
      // handles redirecting to login.
    });
  }, []);

  const value = {
    employee,
    employeeLoading,
    loggingOut,
    employeeError,
    loadEmployee,
    logoutEmployee,
  };

  return (
    <EmployeeContext.Provider value={value}>
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployee() {
  const context = useContext(EmployeeContext);

  if (!context) {
    throw new Error(
      "useEmployee must be used inside EmployeeProvider."
    );
  }

  return context;
}