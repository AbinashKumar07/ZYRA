import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export function formatApiErrorDetail(detail) {
  if (detail == null) return "Something didn't go through. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map((e) => (e && typeof e.msg === "string" ? e.msg : "Invalid input")).join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

const auth = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

// ---------- public ----------
export const submitLead = (payload) => axios.post(`${API}/leads`, payload).then((r) => r.data);
export const fetchPublicContent = () => axios.get(`${API}/content`).then((r) => r.data);
export const fetchTailoringOptions = () => axios.get(`${API}/tailoring/options`).then((r) => r.data);
export const fetchSlots = (city, date) =>
  axios.get(`${API}/tailoring/slots`, { params: { city, date } }).then((r) => r.data);
export const requestBooking = (payload) => axios.post(`${API}/tailoring/bookings`, payload).then((r) => r.data);
export const trackBooking = (reference) => axios.get(`${API}/tailoring/bookings/${reference}`).then((r) => r.data);

// ---------- auth ----------
export const login = (email, password) => axios.post(`${API}/auth/login`, { email, password }).then((r) => r.data);
export const fetchMe = (token) => axios.get(`${API}/admin/me`, auth(token)).then((r) => r.data);

// ---------- admin ----------
export const adminStats = (token) => axios.get(`${API}/admin/stats`, auth(token)).then((r) => r.data);
export const adminLeads = (token, type) =>
  axios.get(`${API}/admin/leads${type ? `?type=${type}` : ""}`, auth(token)).then((r) => r.data);
export const updateLeadStatus = (token, id, status) =>
  axios.patch(`${API}/admin/leads/${id}`, { status }, auth(token)).then((r) => r.data);

export const adminContent = (token, type) =>
  axios.get(`${API}/admin/content${type ? `?type=${type}` : ""}`, auth(token)).then((r) => r.data);
export const createContent = (token, payload) => axios.post(`${API}/admin/content`, payload, auth(token)).then((r) => r.data);
export const bulkImportContent = (token, items) =>
  axios.post(`${API}/admin/content/bulk`, items, auth(token)).then((r) => r.data);
export const updateContent = (token, id, payload) =>
  axios.patch(`${API}/admin/content/${id}`, payload, auth(token)).then((r) => r.data);
export const reorderContent = (token, items) =>
  axios.post(`${API}/admin/content/reorder`, { items }, auth(token)).then((r) => r.data);
export const deleteContent = (token, id) => axios.delete(`${API}/admin/content/${id}`, auth(token)).then((r) => r.data);

export const adminBookings = (token, status) =>
  axios.get(`${API}/admin/bookings${status ? `?status=${status}` : ""}`, auth(token)).then((r) => r.data);
export const adminTailors = (token) => axios.get(`${API}/admin/tailors`, auth(token)).then((r) => r.data);
export const createTailor = (token, payload) => axios.post(`${API}/admin/tailors`, payload, auth(token)).then((r) => r.data);
export const toggleTailor = (token, id, active) =>
  axios.patch(`${API}/admin/tailors/${id}?active=${active}`, {}, auth(token)).then((r) => r.data);
export const adminPricing = (token) => axios.get(`${API}/admin/pricing`, auth(token)).then((r) => r.data);
export const upsertPricing = (token, payload) => axios.put(`${API}/admin/pricing`, payload, auth(token)).then((r) => r.data);
export const adminTeam = (token) => axios.get(`${API}/admin/team`, auth(token)).then((r) => r.data);
export const createTeamMember = (token, payload) => axios.post(`${API}/admin/team`, payload, auth(token)).then((r) => r.data);
export const setMemberActive = (token, id, active) =>
  axios.patch(`${API}/admin/team/${id}?active=${active}`, {}, auth(token)).then((r) => r.data);

// ---------- tailoring partner ----------
export const tailorBookings = (token) => axios.get(`${API}/tailor/bookings`, auth(token)).then((r) => r.data);
export const tailorRespond = (token, id, action) =>
  axios.post(`${API}/tailor/bookings/${id}/respond`, { action }, auth(token)).then((r) => r.data);
export const tailorAvailability = (token) => axios.get(`${API}/tailor/availability`, auth(token)).then((r) => r.data);
export const setTailorAvailability = (token, date, slots) =>
  axios.put(`${API}/tailor/availability`, { date, slots }, auth(token)).then((r) => r.data);
