const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper to attach token
export function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default {
  // ================= AUTH =================
  auth: {
    login: (email, password) =>
      fetch(`${API}/auth/admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }).then((r) => r.json()),
  },

  // ================= PRODUCTS =================
  products: {
    list: () =>
      fetch(`${API}/products`, {
        headers: { ...authHeaders() },
      }).then((r) => r.json()),

  create: (formData) => {
  return fetch("http://localhost:5000/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, 
    },
    body: JSON.stringify(formData),
  }).then(r => r.json());
},


 update: (id, data) => {
      let headers = { ...authHeaders() };

      const isFormData = data instanceof FormData;
       if (isFormData) {
         headers = { ...authHeaders() };
       } else {
         headers = { "Content-Type": "application/json", ...authHeaders() };
       }

      return fetch(`${API}/products/${id}`, {
        method: "PUT",
        headers: headers,
        body: isFormData ? data : JSON.stringify(data),
      }).then((r) => {
        if (!r.ok) {
          throw new Error(`HTTP error! Status: ${r.status}`);
        }
        return r.json();
      });
    },
    remove: (id) =>
      fetch(`${API}/products/${id}`, {
        method: "DELETE",
        headers: { ...authHeaders() },
      }).then((r) => r.json()),

    addImage: (id, formData) =>
      fetch(`${API}/products/${id}/image/local`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      }).then((r) => r.json()),
  },


 // ================= ORDERS =================

  // Create a new order (used in Order.jsx)
orders: {
  list: () => fetch(`${API}/orders`).then(r => r.json()),

  create: (data) => fetch(`${API}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json()),
  
 updateStatus: (id, status) =>
    fetch(`${API}/orders/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ status }),
    }).then(r => r.json()),


  // Delete order (admin)
  delete: (id) =>
    fetch(`${API}/orders/${id}`, {
      method: "DELETE",
      headers: { ...authHeaders() },
    }).then((r) => r.json()),
},
}


