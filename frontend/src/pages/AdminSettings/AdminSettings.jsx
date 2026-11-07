import OperationsPanel from "./OperationsPanel";


import { useCallback, useEffect, useRef, useState } from "react";

import {

  Settings,

  Store,

  Image as ImageIcon,

  BookOpen,

  Truck,

Camera,
  Pencil,

  X,

  Save,

  RefreshCw,

  AlertCircle,

  CheckCircle2,

  Upload,

  MapPin,

  ExternalLink,

} from "lucide-react";



import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";



import {

  getAdminWebsiteSettings,

  updateAdminWebsiteSettings,

} from "../../services/websiteApi";



import "./AdminSettings.css";



/* ========================================

   SETTINGS CONFIGURATION

======================================== */



const SECTIONS = [

  {

    key: "visit",

    title: "General & Contact",

    description: "Business details, location and opening hours.",

    icon: Store,

    fields: [

      {

        name: "eyebrow",

        label: "Section Label",

        type: "text",

        required: true,

      },

      {

        name: "title",

        label: "Section Title",

        type: "text",

        required: true,

      },

      {

        name: "description",

        label: "Description",

        type: "textarea",

        required: true,

        full: true,

      },

      {

        name: "address",

        label: "Business Address",

        type: "text",

        required: true,

        full: true,

      },

      {

        name: "phone",

        label: "Phone Number",

        type: "tel",

      },

      {

        name: "google_maps_url",

        label: "Google Maps URL",

        type: "url",

        full: true,

      },

      {

        name: "opening_hours_line_1",

        label: "Opening Hours - Line 1",

        type: "text",

        required: true,

      },

      {

        name: "opening_hours_line_2",

        label: "Opening Hours - Line 2",

        type: "text",

        required: true,

      },

      {

        name: "latitude",

        label: "Latitude",

        type: "number",

      },

      {

        name: "longitude",

        label: "Longitude",

        type: "number",

      },

    ],

  },



  {

    key: "hero",

    title: "Hero Section",

    description: "Homepage banner and signature dish.",

    icon: ImageIcon,

    fields: [

      {

        name: "background_image",

        label: "Background Image",

        type: "image",

        full: true,

      },

      {

        name: "description",

        label: "Hero Description",

        type: "textarea",

        required: true,

        full: true,

      },

      {

        name: "signature_name",

        label: "Signature Dish Name",

        type: "text",

        required: true,

      },

      {

        name: "signature_label",

        label: "Signature Label",

        type: "text",

        required: true,

      },

    ],

  },



  {

    key: "our-story",

    title: "Our Story",

    description: "Brand story, content and image.",

    icon: BookOpen,

    fields: [

      {

        name: "eyebrow",

        label: "Section Label",

        type: "text",

        required: true,

      },

      {

        name: "title",

        label: "Section Title",

        type: "text",

        required: true,

      },

      {

        name: "first_paragraph",

        label: "First Paragraph",

        type: "textarea",

        required: true,

        full: true,

      },

      {

        name: "second_paragraph",

        label: "Second Paragraph",

        type: "textarea",

        required: true,

        full: true,

      },

      {

        name: "image",

        label: "Story Image",

        type: "image",

        full: true,

      },

    ],

  },



  {

    key: "talabat",

    title: "Talabat",

    description: "Delivery link and promotional content.",

    icon: Truck,

    fields: [

      {

        name: "eyebrow",

        label: "Section Label",

        type: "text",

        required: true,

      },

      {

        name: "title",

        label: "Section Title",

        type: "text",

        required: true,

      },

      {

        name: "description",

        label: "Description",

        type: "textarea",

        required: true,

        full: true,

      },

      {

        name: "button_text",

        label: "Button Text",

        type: "text",

        required: true,

      },

      {

        name: "talabat_url",

        label: "Talabat URL",

        type: "url",

        required: true,

        full: true,

      },

      {

        name: "background_image",

        label: "Background Image",

        type: "image",

        full: true,

      },

    ],

  },



  {

    key: "instagram",

    title: "Instagram",

    description: "Social profile and gallery images.",

    icon: Camera,

    fields: [

      {

        name: "eyebrow",

        label: "Section Label",

        type: "text",

        required: true,

      },

      {

        name: "username",

        label: "Instagram Username",

        type: "text",

        required: true,

      },

      {

        name: "instagram_url",

        label: "Instagram URL",

        type: "url",

        required: true,

        full: true,

      },

      ...[1, 2, 3, 4].map((number) => ({

        name: `image\_${number}`,

        label: `Gallery Image ${number}`,

        type: "image",

        full: true,

      })),

    ],

  },

];



/* ========================================

   HELPERS

======================================== */



function getErrorMessage(error) {

  return error?.message || "Something went wrong.";

}



function getSectionSummary(section, data) {

  if (!data) return "Unable to load settings.";



  switch (section.key) {

    case "visit":

      return data.address || "Business information";



    case "hero":

      return data.signature_name || "Homepage banner";



    case "our-story":

      return data.title || "Brand story";



    case "talabat":

      return data.title || "Delivery section";



    case "instagram":

      return data.username || "Instagram profile";



    default:

      return section.description;

  }

}



function getImageUrl(value) {

  if (!value || typeof value !== "string") return "";



  if (value.startsWith("http\://") ||

      value.startsWith("https\://")) {

    return value;

  }



  if (value.startsWith("/")) {

    return `http\://127.0.0.1:8000${value}`;

  }



  return "";

}



/* ========================================

   IMAGE FIELD

======================================== */



function ImageField({

  field,

  currentValue,

  selectedFile,

  onChange,

  disabled,

}) {

  const [preview, setPreview] = useState("");



  useEffect(() => {

    if (!selectedFile) {

      setPreview(getImageUrl(currentValue));

      return;

    }



    const objectUrl = URL.createObjectURL(selectedFile);

    setPreview(objectUrl);



    return () => URL.revokeObjectURL(objectUrl);

  }, [currentValue, selectedFile]);



  return (

    <div className="as-field as-field-full">

      <label className="as-label">{field.label}</label>



      <div className="as-image-box">

        {preview ? (

          <img

            src={preview}

            alt={field.label}

            className="as-image-preview"

          />

        ) : (

          <div className="as-image-empty">

            <ImageIcon size={30} />

            <span>No image uploaded</span>

          </div>

        )}



        <label className="as-upload-button">

          <Upload size={16} />

          {selectedFile ? "Change Image" : "Upload Image"}



          <input

            type="file"

            accept="image/*"

            disabled={disabled}

            onChange={(event) => {

              const file = event.target.files?.[0];



              if (file) {

                onChange(field.name, file);

              }



              event.target.value = "";

            }}

          />

        </label>



        {selectedFile && (

          <span className="as-file-name">

            {selectedFile.name}

          </span>

        )}

      </div>

    </div>

  );

}



/* ========================================

   MAIN COMPONENT

======================================== */



export default function AdminSettings() {

  const [settings, setSettings] = useState({});

  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState("");



  const [activeSection, setActiveSection] = useState(null);

  const [form, setForm] = useState({});

  const [imageFiles, setImageFiles] = useState({});



  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [notice, setNotice] = useState("");



  const [refreshKey, setRefreshKey] = useState(0);

  const drawerRef = useRef(null);

  const editButtonRef = useRef(null);



  /* ========================================

     FETCH SETTINGS

  ======================================== */



  useEffect(() => {

    const controller = new AbortController();



    async function loadSettings() {

      setLoading(true);

      setLoadError("");



      const results = await Promise.allSettled(

        SECTIONS.map((section) =>

          getAdminWebsiteSettings(

            section.key,

            controller.signal

          )

        )

      );



      if (controller.signal.aborted) return;



      const nextSettings = {};

      let failed = false;



      results.forEach((result, index) => {

        if (result.status === "fulfilled") {

          nextSettings[SECTIONS[index].key] = result.value;

        } else {

          failed = true;

        }

      });



      setSettings(nextSettings);



      if (failed) {

        setLoadError(

          "Some settings could not be loaded. Please refresh."

        );

      }



      setLoading(false);

    }



    loadSettings();



    return () => controller.abort();

  }, [refreshKey]);



  /* ========================================

     OPEN / CLOSE DRAWER

  ======================================== */



  const closeDrawer = useCallback(() => {

    setActiveSection(null);

    setForm({});

    setImageFiles({});

    setError("");



    requestAnimationFrame(() => {

      editButtonRef.current?.focus();

    });

  }, []);



  function openDrawer(section, event) {

    const currentData = settings[section.key];



    if (!currentData) return;



    editButtonRef.current = event.currentTarget;



    const initialForm = {};



    section.fields.forEach((field) => {

      if (field.type !== "image") {

        initialForm[field.name] =

          currentData[field.name] ?? "";

      }

    });



    setForm(initialForm);

    setImageFiles({});

    setError("");

    setNotice("");

    setActiveSection(section);

  }



  useEffect(() => {

    if (!activeSection) return;



    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";



    const focusTimer = setTimeout(() => {

      drawerRef.current

        ?.querySelector("input:not([type='file']), textarea")

        ?.focus();

    }, 0);



    function handleKeyDown(event) {

      if (event.key === "Escape" && !saving) {

        closeDrawer();

      }



      if (event.key !== "Tab") return;



      const focusable = drawerRef.current?.querySelectorAll(

        'button:not(:disabled), input:not(:disabled), textarea:not(:disabled), a[href]'

      );



      if (!focusable?.length) return;



      const first = focusable[0];

      const last = focusable[focusable.length - 1];



      if (event.shiftKey && document.activeElement === first) {

        event.preventDefault();

        last.focus();

      } else if (

        !event.shiftKey &&

        document.activeElement === last

      ) {

        event.preventDefault();

        first.focus();

      }

    }



    document.addEventListener("keydown", handleKeyDown);



    return () => {

      clearTimeout(focusTimer);

      document.body.style.overflow = previousOverflow;

      document.removeEventListener(

        "keydown",

        handleKeyDown

      );

    };

  }, [activeSection, saving, closeDrawer]);



  /* ========================================

     FORM HANDLERS

  ======================================== */



  function handleFieldChange(name, value) {

    setForm((current) => ({

      ...current,

      [name]: value,

    }));

  }



  function handleImageChange(name, file) {

    setImageFiles((current) => ({

      ...current,

      [name]: file,

    }));

  }



  /* ========================================

     SAVE SETTINGS

  ======================================== */



  async function handleSave(event) {

    event.preventDefault();



    if (!activeSection || saving) return;



    setSaving(true);

    setError("");

    setNotice("");



    try {

      const payload = new FormData();



      activeSection.fields.forEach((field) => {

        if (field.type === "image") {

          const file = imageFiles[field.name];



          if (file instanceof File) {

            payload.append(field.name, file);

          }



          return;

        }



        let value = form[field.name] ?? "";



        if (

          (field.name === "latitude" ||

            field.name === "longitude") &&

          value === ""

        ) {

          value = "";

        }



        payload.append(field.name, value);

      });



      const updated = await updateAdminWebsiteSettings(

        activeSection.key,

        payload

      );



      setSettings((current) => ({

        ...current,

        [activeSection.key]: updated,

      }));



      const savedSection = activeSection.title;



      closeDrawer();



      setNotice(

        `${savedSection} settings saved successfully.`

      );

    } catch (err) {

      setError(getErrorMessage(err));

    } finally {

      setSaving(false);

    }

  }



  /* ========================================

     RENDER FIELD

  ======================================== */



  function renderField(field) {

    if (!activeSection) return null;



    if (field.type === "image") {

      return (

        <ImageField

          key={field.name}

          field={field}

          currentValue={

            settings[activeSection.key]?.[field.name]

          }

          selectedFile={imageFiles[field.name]}

          onChange={handleImageChange}

          disabled={saving}

        />

      );

    }



    const value = form[field.name] ?? "";



    return (

      <div

        key={field.name}

        className={`as-field ${

          field.full ? "as-field-full" : ""

        }`}

      >

        <label

          className="as-label"

          htmlFor={`as-${field.name}`}

        >

          {field.label}

        </label>



        {field.type === "textarea" ? (

          <textarea

            id={`as-${field.name}`}

            value={value}

            required={field.required}

            disabled={saving}

            rows={4}

            onChange={(event) =>

              handleFieldChange(

                field.name,

                event.target.value

              )

            }

          />

        ) : (

          <input

            id={`as-${field.name}`}

            type={field.type}

            value={value}

            required={field.required}

            disabled={saving}

            step={

              field.type === "number" ? "any" : undefined

            }

            min={

              field.name === "latitude"

                ? -90

                : field.name === "longitude"

                ? -180

                : undefined

            }

            max={

              field.name === "latitude"

                ? 90

                : field.name === "longitude"

                ? 180

                : undefined

            }

            onChange={(event) =>

              handleFieldChange(

                field.name,

                event.target.value

              )

            }

          />

        )}

      </div>

    );

  }



  /* ========================================

     PAGE

  ======================================== */



  return (

    <div className="as-page">

      <AdminSidebar />



      <main className="as-main">

        <header className="as-header">

          <div>

            <span className="as-eyebrow">

              JAZI ADMIN PANEL

            </span>



            <h1>Settings</h1>



            <p>

              Manage your business and website preferences.

            </p>

          </div>



          <button

            type="button"

            className="as-refresh"

            disabled={loading || saving}

            onClick={() => {

              setNotice("");

              setRefreshKey((value) => value + 1);

            }}

          >

            <RefreshCw size={16} />

            Refresh

          </button>

        </header>



        {loadError && (

          <div className="as-alert as-alert-error">

            <AlertCircle size={18} />

            {loadError}

          </div>

        )}



        {notice && (

          <div className="as-alert as-alert-success">

            <CheckCircle2 size={18} />

            {notice}

          </div>

        )}



        <div className="as-content-heading">

          <div>

            <h2>Website Settings</h2>

            <p>

              Select a section to view and edit its content.

            </p>

          </div>



          <span className="as-count">

            {SECTIONS.length} Sections

          </span>

        </div>



        {loading ? (

          <div className="as-loading">

            <RefreshCw className="as-spin" size={23} />

            Loading website settings...

          </div>

        ) : (

          <div className="as-cards">

            {SECTIONS.map((section) => {

              const Icon = section.icon;

              const data = settings[section.key];



              return (

                <article

                  key={section.key}

                  className="as-card"

                >

                  <div className="as-card-top">

                    <div className="as-card-icon">

                      <Icon size={23} />

                    </div>



                    <span

                      className={`as-status ${

                        data

                          ? "as-status-active"

                          : "as-status-error"

                      }`}

                    >

                      <span className="as-status-dot" />

                      {data ? "Configured" : "Unavailable"}

                    </span>

                  </div>



                  <div className="as-card-content">

                    <h3>{section.title}</h3>

                    <p>{section.description}</p>



                    <div className="as-card-summary">

                      {section.key === "visit" && (

                        <MapPin size={15} />

                      )}



                      <span>

                        {getSectionSummary(section, data)}

                      </span>

                    </div>

                  </div>



                  <div className="as-card-footer">

                    <span>Website Content</span>



                    <button

                      type="button"

                      className="as-edit-button"

                      disabled={!data}

                      onClick={(event) =>

                        openDrawer(section, event)

                      }

                    >

                      <Pencil size={15} />

                      Edit

                    </button>

                  </div>

                </article>

              );

            })}

          </div>

        )}

        <OperationsPanel />
      </main>



      {/* ====================================

          EDIT DRAWER

      ==================================== */}



      {activeSection && (

        <div className="as-drawer-layer">

          <div

            className="as-overlay"

            onClick={() => {

              if (!saving) closeDrawer();

            }}

          />



          <aside

            ref={drawerRef}

            className="as-drawer"

            role="dialog"

            aria-modal="true"

            aria-labelledby="as-drawer-title"

          >

            <div className="as-drawer-header">

              <div>

                <span className="as-eyebrow">

                  EDIT WEBSITE SETTINGS

                </span>



                <h2 id="as-drawer-title">

                  {activeSection.title}

                </h2>



                <p>{activeSection.description}</p>

              </div>



              <button

                type="button"

                className="as-close"

                disabled={saving}

                onClick={closeDrawer}

                aria-label="Close editor"

              >

                <X size={21} />

              </button>

            </div>



            <form

              id="as-settings-form"

              onSubmit={handleSave}

              className="as-drawer-form"

            >

              <div className="as-drawer-body">

                {error && (

                  <div className="as-alert as-alert-error">

                    <AlertCircle size={17} />

                    {error}

                  </div>

                )}



                <div className="as-form-grid">

                  {activeSection.fields.map(renderField)}

                </div>



                {activeSection.key === "visit" &&

                  form.google_maps_url &&

                  /^https?:\/\//i.test(

                    form.google_maps_url

                  ) && (

                    <a

                      className="as-map-link"

                      href={form.google_maps_url}

                      target="_blank"

                      rel="noopener noreferrer"

                    >

                      <ExternalLink size={15} />

                      Open Google Maps

                    </a>

                  )}

              </div>



              <div className="as-drawer-footer">

                <button

                  type="button"

                  className="as-cancel"

                  disabled={saving}

                  onClick={closeDrawer}

                >

                  Cancel

                </button>



                <button

                  type="submit"

                  className="as-save"

                  disabled={saving}

                >

                  {saving ? (

                    <RefreshCw

                      size={16}

                      className="as-spin"

                    />

                  ) : (

                    <Save size={16} />

                  )}



                  {saving

                    ? "Saving..."

                    : "Save Changes"}

                </button>

              </div>

            </form>

          </aside>

        </div>

      )}

    </div>

  );

}
