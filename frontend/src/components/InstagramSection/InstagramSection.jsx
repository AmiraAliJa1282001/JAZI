import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

import { getInstagramSettings } from "../../services/websiteApi";

import "./InstagramSection.css";


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
        className="instagram-dot"
      />
    </svg>
  );
}


function InstagramSection() {
  const [instagram, setInstagram] = useState({
    eyebrow: "FOLLOW US",
    username: "@jazihouse",
    instagram_url: "",
    image_1: null,
    image_2: null,
    image_3: null,
    image_4: null,
  });


  /* =========================
     LOAD INSTAGRAM SETTINGS
     ========================= */

  useEffect(() => {
    getInstagramSettings()
      .then((data) => {
        setInstagram({
          eyebrow:
            data.eyebrow || "FOLLOW US",

          username:
            data.username || "@jazihouse",

          instagram_url:
            data.instagram_url || "",

          image_1:
            data.image_1 || null,

          image_2:
            data.image_2 || null,

          image_3:
            data.image_3 || null,

          image_4:
            data.image_4 || null,
        });
      })
      .catch((error) => {
        console.error(
          "Instagram API error:",
          error
        );
      });
  }, []);


  /* =========================
     GALLERY IMAGES
     ========================= */

  const images = [
    instagram.image_1,
    instagram.image_2,
    instagram.image_3,
    instagram.image_4,
  ].filter(Boolean);


  return (
    <section className="instagram-section">

      <div className="instagram-container">

        {/* =========================
            PROFILE
            ========================= */}

        <div className="instagram-info">

          <span className="instagram-eyebrow">
            {instagram.eyebrow}
          </span>


          <a
            href={instagram.instagram_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="instagram-profile"
          >

            <span className="instagram-icon">
              <InstagramIcon />
            </span>

            <span>
              {instagram.username}
            </span>

          </a>

        </div>


        {/* =========================
            GALLERY
            ========================= */}

        <div className="instagram-gallery">

          {images.map((image, index) => (
            <a
              key={index}
              href={instagram.instagram_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="instagram-image"
              aria-label={`View JAZI Instagram post ${index + 1}`}
            >

              <img
                src={image}
                alt={`JAZI Instagram ${index + 1}`}
              />


              <div className="instagram-image-overlay">
                <InstagramIcon />
              </div>

            </a>
          ))}

        </div>


        {/* =========================
            INSTAGRAM LINK
            ========================= */}

        {instagram.instagram_url && (
          <a
            href={instagram.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="instagram-arrow"
            aria-label="Visit JAZI on Instagram"
          >

            <ArrowRight
              size={21}
              strokeWidth={1.6}
              aria-hidden="true"
            />

          </a>
        )}

      </div>

    </section>
  );
}


export default InstagramSection;