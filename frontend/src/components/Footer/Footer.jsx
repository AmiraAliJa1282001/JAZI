import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getInstagramSettings } from "../../services/websiteApi";

import "./Footer.css";


/* =========================
   INSTAGRAM ICON
   ========================= */

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
      />

      <circle
        cx="12"
        cy="12"
        r="4"
      />

      <circle
        cx="17.5"
        cy="6.5"
        r="1"
        className="footer-icon-dot"
      />
    </svg>
  );
}


function Footer() {
  const [instagramUrl, setInstagramUrl] =
    useState("");


  /* =========================
     LOAD SOCIAL SETTINGS
     ========================= */

  useEffect(() => {
    getInstagramSettings()
      .then((data) => {
        setInstagramUrl(
          data.instagram_url || ""
        );
      })
      .catch((error) => {
        console.error(
          "Footer Instagram API error:",
          error
        );
      });
  }, []);


  return (
    <footer className="footer">

      <div className="footer-container">

        {/* =========================
            BRAND
            ========================= */}

        <div className="footer-brand">

          <Link
            to="/"
            className="footer-logo"
          >
            JAZI
          </Link>

          <span className="footer-subtitle">
            PREMIUM TAKEAWAY CUISINE
          </span>

        </div>


        {/* =========================
            NAVIGATION
            ========================= */}

        <nav
          className="footer-nav"
          aria-label="Footer navigation"
        >

          <Link to="/">
            Home
          </Link>

          <Link to="/menu">
            Menu
          </Link>

          <Link to="/track-order">
            Track Order
          </Link>

          <a href="#location">
            Location
          </a>

        </nav>


        {/* =========================
            SOCIAL MEDIA
            ========================= */}

        <div className="footer-social">

          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="JAZI Instagram"
            >
              <InstagramIcon />
            </a>
          )}

        </div>


        {/* =========================
            DIVIDER
            ========================= */}

        <div className="footer-divider" />


        {/* =========================
            MESSAGE
            ========================= */}

        <div className="footer-message">

          <p>
            Fresh Food. Great Moments.
            <br />
            Only at JAZI.
          </p>

        </div>

      </div>


      {/* =========================
          COPYRIGHT
          ========================= */}

      <div className="footer-bottom">

        <span>
          © {new Date().getFullYear()} JAZI.
          {" "}All rights reserved.
        </span>

      </div>

    </footer>
  );
}


export default Footer;