const BASE = "http://127.0.0.1:8000/api";
async function request(path, method="GET", data, isFile=false) {
  const headers = {};
  if (method !== "GET") {
    const response = await fetch(`${BASE}/accounts/csrf/`, { credentials: "include" });
    if (!response.ok) throw new Error("Could not obtain CSRF token.");
    const csrf = await response.json();
    headers["X-CSRFToken"] = csrf.csrfToken;
    if (!isFile) headers["Content-Type"] = "application/json";
  }
  const response = await fetch(`${BASE}${path}`, { method, credentials:"include", headers, ...(data === undefined ? {} : { body: isFile ? data : JSON.stringify(data) }) });
  if (!response.ok) {
    const error = await response.json().catch(()=>({}));
    throw new Error(error.detail || Object.entries(error).map(([k,v])=>`${k}: ${v}`).join(" | ") || `HTTP ${response.status}`);
  }
  return response.json();
}
export const getOperations = () => request("/website/admin/settings/operations/");
export const saveOperations = (data) => request("/website/admin/settings/operations/", "PATCH", data, data instanceof FormData);
export const getHours = () => request("/website/admin/settings/business-hours/");
export const saveHours = (data) => request("/website/admin/settings/business-hours/", "PUT", data);
export const changePassword = (data) => request("/website/admin/security/password/", "POST", data);
export const logoutOtherSessions = (data) => request("/website/admin/security/logout-others/", "POST", data);
export const getReports = (period) => request(`/orders/admin/reports/?period=${encodeURIComponent(period)}`);
export const downloadReportsCSV = async (period) => {
  const response = await fetch(`${BASE}/orders/admin/reports/csv/?period=${encodeURIComponent(period)}`, {credentials:"include"});
  if (!response.ok) throw new Error("Unable to export CSV.");
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a"); link.href = url; link.download = `jazi-report-${period}.csv`; link.click();
  setTimeout(()=>URL.revokeObjectURL(url), 1000);
};
