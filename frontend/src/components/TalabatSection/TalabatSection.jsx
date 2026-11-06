import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";

import { getTalabatSettings } from "../../services/websiteApi";

import "./TalabatSection.css";


function TalabatSection() {
  const [talabat, setTalabat] = useState({
    eyebrow: "PREFER DELIVERY?",
    title: "Order JAZI through Talabat",
    description:
      "Get your favourite dishes delivered to your door via Talabat.",
    button_text: "Order on Talabat",
    talabat_url: "",
    background_image: null,
  });


  /* =========================
     LOAD TALABAT SETTINGS
     ========================= */

  useEffect(() => {
    getTalabatSettings()
      .then((data) => {
        setTalabat({
          eyebrow:
            data.eyebrow ||
            "PREFER DELIVERY?",

          title:
            data.title ||
            "Order JAZI through Talabat",

          description:
            data.description || "",

          button_text:
            data.button_text ||
            "Order on Talabat",

          talabat_url:
            data.talabat_url || "",

          background_image:
            data.background_image || null,
        });
      })
      .catch((error) => {
        console.error(
          "Talabat API error:",
          error
        );
      });
  }, []);


  return (
    <section
      className="talabat-section"
      style={
        talabat.background_image
          ? {
              backgroundImage:
                `url(${talabat.background_image})`,
            }
          : undefined
      }
    >

      <div className="talabat-overlay" />


      <div className="talabat-container">

        <div className="talabat-content">

          <span className="talabat-eyebrow">
            {talabat.eyebrow}
          </span>


          <h2>
            {talabat.title}
          </h2>


          {talabat.description && (
            <p>
              {talabat.description}
            </p>
          )}


          {talabat.talabat_url && (
            <a
              href={talabat.talabat_url}
              target="_blank"
              rel="noopener noreferrer"
              className="talabat-button"
            >
              <span>
                {talabat.button_text}
              </span>

              <ExternalLink
                size={16}
                strokeWidth={1.7}
                aria-hidden="true"
              />
            </a>
          )}

        </div>

      </div>

    </section>
  );
}


export default TalabatSection;