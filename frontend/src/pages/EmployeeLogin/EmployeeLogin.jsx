import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  ArrowRight,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

import {
  employeeLogin,
  getEmployeeSession,
} from "../../services/websiteApi";

import {
  useEmployee,
} from "../../context/EmployeeContext";

import "./EmployeeLogin.css";


function EmployeeLogin() {
  const navigate = useNavigate();

  const {
    loadEmployee,
  } = useEmployee();


  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [
    checkingSession,
    setCheckingSession,
  ] = useState(true);

  const [error, setError] =
    useState("");


  /* =========================
     CHECK EXISTING SESSION
     ========================= */

  useEffect(() => {
    let active = true;

    async function checkSession() {
      try {
        const session = await getEmployeeSession();

        if (active && session?.authenticated) {
          navigate(
            session.user?.is_admin ? "/admin" : "/employee/orders",
            { replace: true }
          );
        }
      } catch {
        // No active employee session.
      } finally {
        if (active) {
          setCheckingSession(false);
        }
      }
    }

    checkSession();

    return () => {
      active = false;
    };
  }, [navigate]);


  /* =========================
     LOGIN
     ========================= */

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    if (
      !username.trim() ||
      !password
    ) {
      setError(
        "Please enter your username and password."
      );

      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await employeeLogin(
        username.trim(),
        password
      );

      if (result.user?.is_admin) {
        navigate("/admin", { replace: true });
      } else {
        await loadEmployee();
        navigate("/employee/orders", { replace: true });
      }
    } catch (error) {
      console.error(
        "Employee login failed:",
        error
      );

      setError(
        error?.detail ||
          "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }


  /* =========================
     SESSION LOADING
     ========================= */

  if (checkingSession) {
    return (
      <main className="employee-login-loading">

        <div className="employee-login-loading-brand">
          JAZI
        </div>

        <div className="employee-login-loading-status">

          <RefreshCw
            className="employee-login-spinner"
            size={17}
            strokeWidth={1.7}
            aria-hidden="true"
          />

          <span>
            Checking session...
          </span>

        </div>

      </main>
    );
  }


  return (
    <main className="employee-login-page">

      {/* =========================
          BRAND PANEL
          ========================= */}

      <section className="employee-login-brand-panel">

        <div className="employee-login-brand-content">

          <span className="employee-login-eyebrow">
            JAZI LOBSTER CAFETERIA
          </span>

          <h1>
            Orders,
            <br />
            beautifully
            <br />
            managed.
          </h1>

          <div
            className="employee-login-rule"
            aria-hidden="true"
          />

          <p>
            Employee workspace for managing
            pickup orders from confirmation
            through collection.
          </p>

        </div>


        <span className="employee-login-brand-mark">
          JAZI
        </span>

      </section>


      {/* =========================
          FORM PANEL
          ========================= */}

      <section className="employee-login-form-panel">

        <div className="employee-login-box">

          <div className="employee-login-mobile-brand">
            JAZI
          </div>

          <span className="employee-login-label">
            EMPLOYEE PORTAL
          </span>

          <h2>
            Welcome back.
          </h2>

          <p className="employee-login-intro">
            Sign in to access the JAZI order
            management dashboard.
          </p>


          {/* =========================
              FORM
              ========================= */}

          <form
            className="employee-login-form"
            onSubmit={handleSubmit}
          >

            <label>

              <span>
                USERNAME
              </span>

              <input
                type="text"
                value={username}
                onChange={(event) =>
                  setUsername(
                    event.target.value
                  )
                }
                placeholder="Enter your username"
                autoComplete="username"
                autoFocus
                disabled={loading}
              />

            </label>


            <label>

              <span>
                PASSWORD
              </span>

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={loading}
              />

            </label>


            {/* =========================
                ERROR
                ========================= */}

            {error && (
              <div
                className="employee-login-error"
                role="alert"
              >
                {error}
              </div>
            )}


            {/* =========================
                SUBMIT
                ========================= */}

            <button
              type="submit"
              className="employee-login-submit"
              disabled={loading}
            >

              <span>
                {loading
                  ? "Signing in..."
                  : "Sign In"}
              </span>


              {loading ? (
                <RefreshCw
                  className="employee-login-spinner"
                  size={18}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              ) : (
                <ArrowRight
                  size={18}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              )}

            </button>

          </form>


          {/* =========================
              SECURITY
              ========================= */}

          <div className="employee-login-security">

            <CheckCircle2
              size={15}
              strokeWidth={1.7}
              aria-hidden="true"
            />

            <p>
              Authorized JAZI employees only.
            </p>

          </div>

        </div>

      </section>

    </main>
  );
}


export default EmployeeLogin;