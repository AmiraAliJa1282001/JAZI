const API_BASE_URL = "http://127.0.0.1:8000/api";


export async function getHeroSettings() {
  const response = await fetch(`${API_BASE_URL}/website/hero/`);

  if (!response.ok) {
    throw new Error("Failed to fetch hero settings");
  }

  return response.json();
}

export async function getBestSellers() {
  const response = await fetch(
    `${API_BASE_URL}/menu/best-sellers/`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch best sellers");
  }

  return response.json();
}

export async function getNewProducts() {
  const response = await fetch(
    `${API_BASE_URL}/menu/new/`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch new products");
  }

  return response.json();
}

export async function getOurStorySettings() {
  const response = await fetch(
    `${API_BASE_URL}/website/our-story/`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Our Story settings");
  }

  return response.json();
}

export async function getVisitSettings() {
  const response = await fetch(
    `${API_BASE_URL}/website/visit/`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Visit JAZI settings");
  }

  return response.json();
}

export async function getTalabatSettings() {
  const response = await fetch(
    `${API_BASE_URL}/website/talabat/`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Talabat settings");
  }

  return response.json();
}

export async function getInstagramSettings() {
  const response = await fetch(
    `${API_BASE_URL}/website/instagram/`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Instagram settings");
  }

  return response.json();
}

export async function createOrder(orderData) {
  const response = await fetch(
    `${API_BASE_URL}/orders/`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(orderData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function trackOrder(
  orderNumber,
  phone
) {
  const response = await fetch(
    `${API_BASE_URL}/orders/track/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_number:
          orderNumber.trim().toUpperCase(),
        phone: phone.trim(),
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}


export async function getEmployeeOrders() {
  const response = await fetch(
    `${API_BASE_URL}/orders/employee/`,
    {
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}


export async function updateEmployeeOrderStatus(
  orderNumber,
  newStatus
) {
  const csrfToken = await getEmployeeCSRF();

  const response = await fetch(
    `${API_BASE_URL}/orders/employee/${orderNumber}/status/`,
    {
      method: "PATCH",
      credentials: "include",

      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },

      body: JSON.stringify({
        status: newStatus,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function getEmployeeCSRF() {
  const response = await fetch(
    `${API_BASE_URL}/accounts/csrf/`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data.csrfToken;
}


export async function employeeLogin(
  username,
  password
) {
  const csrfToken = await getEmployeeCSRF();

  const response = await fetch(
    `${API_BASE_URL}/accounts/login/`,
    {
      method: "POST",
      credentials: "include",

      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },

      body: JSON.stringify({
        username,
        password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}


export async function getEmployeeSession() {
  const response = await fetch(
    `${API_BASE_URL}/accounts/session/`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}


export async function employeeLogout() {
  const csrfToken = await getEmployeeCSRF();

  const response = await fetch(
    `${API_BASE_URL}/accounts/logout/`,
    {
      method: "POST",
      credentials: "include",

      headers: {
        "X-CSRFToken": csrfToken,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

// ========================================
// EMPLOYEE MENU
// ========================================

export async function getEmployeeProducts() {
  const response = await fetch(
    `${API_BASE_URL}/menu/employee/products/`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}


export async function updateEmployeeProductAvailability(
  productId,
  isAvailable
) {
  const csrfToken = await getEmployeeCSRF();

  const response = await fetch(
    `${API_BASE_URL}/menu/employee/products/${productId}/availability/`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify({
        is_available: isAvailable,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function getEmployeeOrderHistory() {
  const response = await fetch(
    `${API_BASE_URL}/orders/employee/history/`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}


 // ========================================
 // ADMIN ANALYTICS
 // ========================================

export async function getAdminAnalytics(
  period = "today",
  signal
) {
  const allowedPeriods = [
    "today",
    "7days",
    "30days",
  ];

  if (!allowedPeriods.includes(period)) {
    throw new Error("Invalid analytics period.");
  }

  const response = await fetch(
    `${API_BASE_URL}/orders/admin/analytics/?period=${period}`,
    {
      method: "GET",
      credentials: "include",
      signal,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
      "Failed to load admin analytics."
    );
  }

  return data;
}


export async function getAdminOrders(params = {}, signal) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      query.set(key, String(value));
    }
  });

  const response = await fetch(
    `${API_BASE_URL}/orders/admin/orders/?${query.toString()}`,
    {
      credentials: "include",
      signal,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to load orders.");
  }

  return data;
}

export async function getAdminOrderDetail(orderNumber, signal) {
  const response = await fetch(
    `${API_BASE_URL}/orders/admin/orders/${encodeURIComponent(orderNumber)}/`,
    {
      credentials: "include",
      signal,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to load order details.");
  }

  return data;
}


export async function updateAdminOrderStatus(
  orderNumber,
  newStatus
) {
  const csrfToken = await getEmployeeCSRF();

  const response = await fetch(
    `${API_BASE_URL}/orders/admin/orders/${encodeURIComponent(orderNumber)}/status/`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify({
        status: newStatus,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to update order status."
    );
  }

  return data;
}


export async function getAdminSession(signal) {
  const response = await fetch(
    `${API_BASE_URL}/accounts/admin/session/`,
    {
      method: "GET",
      credentials: "include",
      signal,
    }
  );

  if (!response.ok) {
    return null;
  }

  return response.json();
}


async function adminMenuRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}/menu/${path}`, {
    credentials: "include",
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof data.detail === "string"
        ? data.detail
        : Object.entries(data)
            .map(([key, value]) =>
              `${key}: ${
                Array.isArray(value)
                  ? value.join(", ")
                  : value
              }`
            )
            .join(" | ");

    throw new Error(message || "Request failed.");
  }

  return data;
}

export function getAdminProducts(params = {}, signal) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== "" &&
      value !== null &&
      value !== undefined
    ) {
      query.set(key, String(value));
    }
  });

  return adminMenuRequest(
    `admin/products/?${query}`,
    { signal }
  );
}

export function getAdminCategories(signal) {
  return adminMenuRequest(
    "admin/categories/",
    { signal }
  );
}

export async function createAdminProduct(formData) {
  const csrfToken = await getEmployeeCSRF();

  return adminMenuRequest("admin/products/", {
    method: "POST",
    headers: {
      "X-CSRFToken": csrfToken,
    },
    body: formData,
  });
}

export async function updateAdminProduct(
  productId,
  formData
) {
  const csrfToken = await getEmployeeCSRF();

  return adminMenuRequest(
    `admin/products/${encodeURIComponent(productId)}/`,
    {
      method: "PATCH",
      headers: {
        "X-CSRFToken": csrfToken,
      },
      body: formData,
    }
  );
}



export async function createAdminCategory(payload) {
  const csrfToken = await getEmployeeCSRF();

  return adminMenuRequest("admin/categories/", {
    method: "POST",
    headers: {
      "X-CSRFToken": csrfToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function updateAdminCategory(categoryId, payload) {
  const csrfToken = await getEmployeeCSRF();

  return adminMenuRequest(
    `admin/categories/${encodeURIComponent(categoryId)}/`,
    {
      method: "PATCH",
      headers: {
        "X-CSRFToken": csrfToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );
}
export async function deleteAdminCategory(categoryId) {
  const csrfToken = await getEmployeeCSRF();

  return adminMenuRequest(
    `admin/categories/${encodeURIComponent(categoryId)}/`,
    {
      method: "DELETE",
      headers: {
        "X-CSRFToken": csrfToken,
      },
    }
  );
}


/* ========================================
   ADMIN EMPLOYEE MANAGEMENT
======================================== */

async function adminEmployeeRequest(path, options = {}) {
  const response = await fetch(
    `${API_BASE_URL}/accounts/admin/employees/${path}`,
    {
      credentials: "include",
      ...options,
    }
  );

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof data.detail === "string"
        ? data.detail
        : Object.entries(data)
            .map(([field, errors]) => {
              const value = Array.isArray(errors)
                ? errors.join(", ")
                : typeof errors === "object" && errors !== null
                  ? JSON.stringify(errors)
                  : String(errors);

              return `${field}: ${value}`;
            })
            .join(" | ");

    throw new Error(
      message || "Employee request failed."
    );
  }

  return data;
}

export function getAdminEmployees(signal) {
  return adminEmployeeRequest("", { signal });
}

export async function createAdminEmployee(payload) {
  const csrfToken = await getEmployeeCSRF();

  return adminEmployeeRequest("", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
    },
    body: JSON.stringify(payload),
  });
}

export async function updateAdminEmployee(employeeId, payload) {
  const csrfToken = await getEmployeeCSRF();

  return adminEmployeeRequest(
    `${encodeURIComponent(employeeId)}/`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify(payload),
    }
  );
}

export async function deleteAdminEmployee(employeeId) {
  const csrfToken = await getEmployeeCSRF();

  return adminEmployeeRequest(
    `${encodeURIComponent(employeeId)}/`,
    {
      method: "DELETE",
      headers: {
        "X-CSRFToken": csrfToken,
      },
    }
  );
}

/* ========================================
   ADMIN WEBSITE SETTINGS
======================================== */

const ADMIN_SETTINGS_BASE = `${API_BASE_URL}/website/admin/settings/`;

async function adminSettingsRequest(section, options = {}) {
  const response = await fetch(
    `${ADMIN_SETTINGS_BASE}${section}/`,
    {
      credentials: "include",
      ...options,
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof data.detail === "string"
        ? data.detail
        : Object.entries(data)
            .map(([field, errors]) => {
              const value = Array.isArray(errors)
                ? errors.join(", ")
                : String(errors);

              return `${field}: ${value}`;
            })
            .join(" | ");

    throw new Error(
      message || "Failed to process website settings."
    );
  }

  return data;
}

// Get settings for one section
export function getAdminWebsiteSettings(section, signal) {
  const allowedSections = [
    "hero",
    "our-story",
    "visit",
    "talabat",
    "instagram",
  ];

  if (!allowedSections.includes(section)) {
    throw new Error("Invalid settings section.");
  }

  return adminSettingsRequest(section, { signal });
}

// Update settings for one section
export async function updateAdminWebsiteSettings(
  section,
  payload
) {
  const allowedSections = [
    "hero",
    "our-story",
    "visit",
    "talabat",
    "instagram",
  ];

  if (!allowedSections.includes(section)) {
    throw new Error("Invalid settings section.");
  }

  const csrfToken = await getEmployeeCSRF();

  const isFormData = payload instanceof FormData;

  return adminSettingsRequest(section, {
    method: "PATCH",
    headers: {
      "X-CSRFToken": csrfToken,
      ...(!isFormData
        ? { "Content-Type": "application/json" }
        : {}),
    },
    body: isFormData ? payload : JSON.stringify(payload),
  });
}
