import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { getHeroSettings } from "../../services/websiteApi";
import heroLobster from "../../assets/images/hero-lobster.png";

import "./Hero.css";


function Hero() {
  const [hero, setHero] = useState({
    background_image: heroLobster,
    description:
      "Premium flavours, crafted with quality ingredients. Order your favourites and pick them up when they’re ready.",
    signature_name: "Lobster Roll",
    signature_label: "SIGNATURE DISH",
  });


  useEffect(() => {
    getHeroSettings()
      .then((data) => {
        setHero({
          background_image:
            data.background_image || heroLobster,

          description:
            data.description ||
            "Premium flavours, crafted with quality ingredients. Order your favourites and pick them up when they’re ready.",

          signature_name:
            data.signature_name || "Lobster Roll",

          signature_label:
            data.signature_label || "SIGNATURE DISH",
        });
      })
      .catch((error) => {
        console.error(
          "Hero API error:",
          error
        );
      });
  }, []);


  return (
    <section
      className="hero"
      style={{
        backgroundImage: `url(${hero.background_image})`,
      }}
    >
      <div className="hero-overlay" />


      <div className="hero-content">

        {/* =========================
            HERO COPY
            ========================= */}

        <div className="hero-copy">

          <div className="hero-eyebrow">
            <span>
              PREMIUM TAKEAWAY CUISINE
            </span>

            <span className="hero-line" />
          </div>


          <h1 className="hero-logo">
            JAZI
          </h1>


          <h2 className="hero-tagline">
            FRESH, FAST, READY FOR PICKUP.
          </h2>


          <p className="hero-description">
            {hero.description}
          </p>


          {/* =========================
              ACTIONS
              ========================= */}

          <div className="hero-actions">

            <Link
              to="/menu"
              className="hero-primary"
            >
              <span>ORDER NOW</span>

              <ArrowRight
                size={16}
                strokeWidth={1.7}
                aria-hidden="true"
              />
            </Link>


            <Link
              to="/menu"
              className="hero-secondary"
            >
              VIEW MENU
            </Link>

          </div>

        </div>


        {/* =========================
            SIGNATURE DISH
            ========================= */}

        <div className="hero-signature">

          <span className="signature-name">
            {hero.signature_name}
          </span>

          <span className="signature-label">
            {hero.signature_label}
          </span>

        </div>

      </div>
    </section>
  );
}


export default Hero;