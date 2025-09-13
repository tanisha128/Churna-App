import { API_URL } from "./config";

// ================= AUTH HEADERS =================
export function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default {
  // ================= AUTH =================
  auth: {
    login: (email, password) =>
      fetch(`${API_URL}/auth/admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }).then((r) => r.json()),
  },

  // ================= PRODUCTS =================
  products: {
    list: () =>
      fetch(`${API_URL}/products`, {
        headers: { ...authHeaders() },
      }).then((r) => r.json()),

    create: (formData) =>
      fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify(formData),
      }).then((r) => r.json()),

    update: (id, data) => {
      let headers = { ...authHeaders() };
      const isFormData = data instanceof FormData;

      if (!isFormData) {
        headers = { "Content-Type": "application/json", ...headers };
      }

      return fetch(`${API_URL}/products/${id}`, {
        method: "PUT",
        headers,
        body: isFormData ? data : JSON.stringify(data),
      }).then((r) => {
        if (!r.ok) {
          throw new Error(`HTTP error! Status: ${r.status}`);
        }
        return r.json();
      });
    },

    remove: (id) =>
      fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: { ...authHeaders() },
      }).then((r) => r.json()),

    addImage: (id, formData) =>
      fetch(`${API_URL}/products/${id}/image/local`, {
        method: "PUT",
        headers: { ...authHeaders() },
        body: formData,
      }).then((r) => r.json()),
  },

  // ================= ORDERS =================
  orders: {
    list: () =>
      fetch(`${API_URL}/orders`, {
        headers: { ...authHeaders() },
      }).then((r) => r.json()),

    create: (data) =>
      fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),

    updateStatus: (id, status) =>
      fetch(`${API_URL}/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ status }),
      }).then((r) => r.json()),

    delete: (id) =>
      fetch(`${API_URL}/orders/${id}`, {
        method: "DELETE",
        headers: { ...authHeaders() },
      }).then((r) => r.json()),
  },
};


