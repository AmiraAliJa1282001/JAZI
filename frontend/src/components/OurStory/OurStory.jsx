import { useEffect, useState } from "react";

import { getOurStorySettings } from "../../services/websiteApi";

import "./OurStory.css";


function OurStory() {
  const [story, setStory] = useState({
    eyebrow: "OUR SOUL AT JAZI",
    title: "A Love Letter to the Sea",
    first_paragraph:
      "JAZI was born from a simple belief: that the finest ingredients deserve more than a stage — they deserve to be part of your everyday moments.",
    second_paragraph:
      "We bring together the bold flavours of the sea with the warmth of cafe culture, crafting signature dishes, refreshing drinks, and indulgent desserts — all made for takeaway, and all served with heart.",
    image: null,
  });


  useEffect(() => {
    getOurStorySettings()
      .then((data) => {
        setStory({
          eyebrow:
            data.eyebrow ||
            "OUR SOUL AT JAZI",

          title:
            data.title ||
            "A Love Letter to the Sea",

          first_paragraph:
            data.first_paragraph || "",

          second_paragraph:
            data.second_paragraph || "",

          image:
            data.image || null,
        });
      })
      .catch((error) => {
        console.error(
          "Our Story API error:",
          error
        );
      });
  }, []);


  return (
    <section
      className="our-story"
      id="our-story"
    >
      <div className="our-story-container">

        {/* =========================
            CONTENT
            ========================= */}

        <div className="our-story-content">

          <div className="our-story-top-line" />

          <span className="our-story-eyebrow">
            {story.eyebrow}
          </span>

          <h2>
            {story.title}
          </h2>

          <div className="our-story-accent" />

          <p>
            {story.first_paragraph}
          </p>

          <p>
            {story.second_paragraph}
          </p>

        </div>


        {/* =========================
            VISUAL
            ========================= */}

        <div className="our-story-visual">

          <div className="our-story-image">
            {story.image && (
              <img
                src={story.image}
                alt="JAZI"
              />
            )}
          </div>


          <div className="signature-count">

            <strong>
              25
            </strong>

            <span>
              SIGNATURE
              <br />
              ITEMS
            </span>

          </div>

        </div>

      </div>
    </section>
  );
}


export default OurStory;