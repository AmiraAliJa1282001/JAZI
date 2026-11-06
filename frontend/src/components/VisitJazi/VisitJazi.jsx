import { useEffect, useState } from "react";
import {
  Clock,
  ExternalLink,
  MapPin,
  Phone,
} from "lucide-react";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import { getVisitSettings } from "../../services/websiteApi";

import "./VisitJazi.css";


/* =========================
   CUSTOM JAZI MAP MARKER
   ========================= */

const jaziIcon = L.divIcon({
  className: "jazi-marker-wrapper",

  html: `
    <div class="jazi-marker">
      <div class="jazi-marker-dot"></div>
    </div>

    <div class="jazi-marker-label">
      JAZI
    </div>
  `,

  iconSize: [70, 58],
  iconAnchor: [35, 42],
  popupAnchor: [0, -42],
});


function VisitJazi() {
  const [visit, setVisit] = useState({
    eyebrow: "FIND US",

    title: "Visit JAZI",

    description:
      "Find us easily and pick up your order. We're here to serve you with great food and fast service.",

    address: "",

    opening_hours_line_1: "",
    opening_hours_line_2: "",

    phone: "",

    google_maps_url: "",

    latitude: null,
    longitude: null,
  });


  /* =========================
     GET DATA FROM DJANGO
     ========================= */

  useEffect(() => {
    getVisitSettings()
      .then((data) => {
        setVisit({
          eyebrow:
            data.eyebrow || "FIND US",

          title:
            data.title || "Visit JAZI",

          description:
            data.description || "",

          address:
            data.address || "",

          opening_hours_line_1:
            data.opening_hours_line_1 || "",

          opening_hours_line_2:
            data.opening_hours_line_2 || "",

          phone:
            data.phone || "",

          google_maps_url:
            data.google_maps_url || "",

          latitude:
            data.latitude,

          longitude:
            data.longitude,
        });
      })
      .catch((error) => {
        console.error(
          "Visit JAZI API error:",
          error
        );
      });
  }, []);


  /* =========================
     LOCATION
     ========================= */

  const latitude = Number(visit.latitude);
  const longitude = Number(visit.longitude);

  const hasLocation =
    visit.latitude !== null &&
    visit.latitude !== "" &&
    visit.longitude !== null &&
    visit.longitude !== "" &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude);


  /* =========================
     GOOGLE MAPS LINK
     ========================= */

  const googleMapsLink =
    visit.google_maps_url ||
    (hasLocation
      ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
      : "");


  return (
    <section
      className="visit-jazi"
      id="location"
    >
      <div className="visit-jazi-container">

        {/* =========================
            LEFT CONTENT
            ========================= */}

        <div className="visit-jazi-content">

          <span className="visit-eyebrow">
            {visit.eyebrow}
          </span>

          <h2>
            {visit.title}
          </h2>


          {visit.description && (
            <p className="visit-description">
              {visit.description}
            </p>
          )}


          {/* =========================
              DETAILS
              ========================= */}

          <div className="visit-details">

            {/* ADDRESS */}

            {visit.address && (
              <div className="visit-detail">

                <div className="visit-icon">
                  <MapPin
                    size={22}
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                </div>

                <span>
                  {visit.address}
                </span>

              </div>
            )}


            {/* OPENING HOURS */}

            {(visit.opening_hours_line_1 ||
              visit.opening_hours_line_2) && (

              <div className="visit-detail">

                <div className="visit-icon">
                  <Clock
                    size={22}
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                </div>


                <div className="visit-hours">

                  {visit.opening_hours_line_1 && (
                    <span>
                      {visit.opening_hours_line_1}
                    </span>
                  )}

                  {visit.opening_hours_line_2 && (
                    <span>
                      {visit.opening_hours_line_2}
                    </span>
                  )}

                </div>

              </div>
            )}


            {/* PHONE */}

            {visit.phone && (
              <a
                href={`tel:${visit.phone}`}
                className="visit-detail visit-phone"
              >

                <div className="visit-icon">
                  <Phone
                    size={22}
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                </div>

                <span>
                  {visit.phone}
                </span>

              </a>
            )}

          </div>

        </div>


        {/* =========================
            MAP
            ========================= */}

        <div className="visit-map">

          {hasLocation ? (

            <MapContainer
              key={`${latitude}-${longitude}`}
              center={[
                latitude,
                longitude,
              ]}
              zoom={16}
              scrollWheelZoom={false}
              className="jazi-leaflet-map"
            >

              {/* OPENSTREETMAP */}

              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />


              {/* JAZI MARKER */}

              <Marker
                position={[
                  latitude,
                  longitude,
                ]}
                icon={jaziIcon}
              >

                <Popup>
                  <div className="jazi-popup">

                    <strong>
                      JAZI
                    </strong>

                    {visit.address && (
                      <span>
                        {visit.address}
                      </span>
                    )}

                  </div>
                </Popup>

              </Marker>

            </MapContainer>

          ) : (

            <div className="map-not-available">

              <span className="map-not-available-title">
                JAZI
              </span>

              <span>
                Location coordinates are not available.
              </span>

            </div>

          )}


          {/* =========================
              GOOGLE MAPS BUTTON
              ========================= */}

          {googleMapsLink && (
            <a
              href={googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="map-button"
            >

              <span>
                View on Google Maps
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


export default VisitJazi;