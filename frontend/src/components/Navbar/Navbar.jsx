import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import CartButton from "../CartButton/CartButton";
import "./Navbar.css";
import CartDrawer from "../CartDrawer/CartDrawer";
import FloatingOrder from "../FloatingOrder/FloatingOrder";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const location = useLocation();


  /* =========================
     CLOSE MOBILE MENU
     WHEN ROUTE CHANGES
  ========================= */

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);


  /* =========================
     LOCK BODY SCROLL
  ========================= */

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);


  /* =========================
     ACTIVE LINK
  ========================= */

  const isActive = (path) => {
    return location.pathname === path;
  };


  /* =========================
     LOCATION LINK
  ========================= */

  const handleLocationClick = () => {
    setMenuOpen(false);

    if (location.pathname === "/") {
      setTimeout(() => {
        document
          .getElementById("location")
          ?.scrollIntoView({
            behavior: "smooth",
          });
      }, 50);
    }
  };


  return (
    <>
      <header className="navbar">
        <div className="navbar-container">

          {/* =========================
              LOGO
          ========================= */}

          <Link
            to="/"
            className="navbar-logo"
            aria-label="JAZI Home"
          >
            JAZI
          </Link>


          {/* =========================
              DESKTOP NAVIGATION
          ========================= */}

          <nav className="navbar-links">
            <Link
              to="/"
              className={isActive("/") ? "active" : ""}
            >
              Home
            </Link>

            <Link
              to="/menu"
              className={
                isActive("/menu") ? "active" : ""
              }
            >
              Menu
            </Link>

            <Link
              to="/track-order"
              className={
                isActive("/track-order")
                  ? "active"
                  : ""
              }
            >
              Track Order
            </Link>

            <Link
              to="/#location"
              onClick={handleLocationClick}
            >
              Location
            </Link>
          </nav>


          {/* =========================
              DESKTOP ACTIONS
          ========================= */}

          <div className="navbar-actions">

            <button
              type="button"
              className="navbar-language"
              aria-label="Change language"
            >
              AR / EN
            </button>


            {/* SAME CART COMPONENT */}

            <CartButton
              onClick={() => setCartOpen(true)}
            />


            <Link
                to="/menu"
                className="navbar-order-button"
              >
                <span>ORDER NOW</span>

                <ArrowRight
                  size={16}
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              </Link>

          </div>


          {/* =========================
              MOBILE ACTIONS
          ========================= */}

          <div className="navbar-mobile-actions">

            <button
              type="button"
              className="navbar-mobile-language"
              aria-label="Change language"
            >
              EN
            </button>


            {/* SAME CART COMPONENT */}

            <CartButton
                onClick={() => setCartOpen(true)}
              />


            {/* HAMBURGER */}

            <button
              type="button"
              className={`navbar-toggle ${
                menuOpen ? "open" : ""
              }`}
              onClick={() =>
                setMenuOpen((current) => !current)
              }
              aria-label={
                menuOpen
                  ? "Close menu"
                  : "Open menu"
              }
              aria-expanded={menuOpen}
            >
              <span></span>
              <span></span>
            </button>

          </div>

        </div>
      </header>


      {/* =========================
          MOBILE FULL SCREEN MENU
      ========================= */}

      <div
        className={`mobile-menu ${
          menuOpen ? "open" : ""
        }`}
      >
        <nav className="mobile-menu-links">

          <Link to="/">
            <span>01</span>
            Home
          </Link>

          <Link to="/menu">
            <span>02</span>
            Menu
          </Link>

          <Link to="/track-order">
            <span>03</span>
            Track Order
          </Link>

          <Link
            to="/#location"
            onClick={handleLocationClick}
          >
            <span>04</span>
            Location
          </Link>

        </nav>


        {/* MOBILE ORDER BUTTON */}

        <Link
            to="/menu"
            className="mobile-order-button"
          >
            <span>ORDER NOW</span>

            <ArrowRight
              size={18}
              strokeWidth={1.7}
              aria-hidden="true"
            />
          </Link>

      </div>
      <FloatingOrder
          onClick={() => setCartOpen(true)}
        />
        
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </>
  );
}


export default Navbar;