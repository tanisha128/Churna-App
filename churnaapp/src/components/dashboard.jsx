import API from './api';
import { useState, useEffect } from 'react';
import './adminDash.css';
import {Link} from "react-router-dom";


export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', stock:'', image_url:'' });
  const [editingProduct, setEditingProduct] = useState(null);
  const [editData, setEditData] = useState({ name: '', price: '', category: '' , stock:'', image_url:'' });
 
  const [stock, setStock] = useState(0);

  // fetch products + orders on mount
  useEffect(() => {
    fetchProducts();
  }, [editingProduct]);

 

  //-----------------------------------------------------------
  // Products Section
  //-----------------------------------------------------------
   const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

const handleAddProduct = async () => {
  try {
    const token = localStorage.getItem("token"); //check admin

    const productData = {
      name: newProduct.name,
      price: Number(newProduct.price),
      category: newProduct.category || "",
      stock: Number(newProduct.stock) || 0,
      image_url: newProduct.image_url || "",
      description: newProduct.description
      
    };

    const res = await fetch("http://localhost:5000/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // include token!
      },
      body: JSON.stringify(productData),
    });

    const data = await res.json();

    if (res.ok) {
      setProducts([...products, data]);
      setNewProduct({ name: "", price: "", category: "", stock: "", image_url: ""});
    } else {
      alert(data.message || "Failed to add product");
    }
  } catch (err) {
    console.error("Error adding product:", err);
  }
};


const handleUpdateProduct = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const updateData = {
      name: editData.name,
      price: Number(editData.price) || 0,
      category: editData.category,
      stock: Number(editData.stock) || 0,
      description: editData.description
    };

    let formData;
    if (editData.image) {
      formData = new FormData();
      formData.append("name", updateData.name);
      formData.append("price", updateData.price);
      formData.append("category", updateData.category);
      formData.append("stock", updateData.stock);
      formData.append("image", editData.image);
      formData.append("description",updateData.description);
    } else {
      formData = JSON.stringify(updateData);
    }

    const res = await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": formData instanceof FormData ? "" : "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      await fetchProducts();
      setEditingProduct(null);
      setEditData({ name: "", price: "", category: "", stock: "", image_url: "" , description:""});
    } else {
      console.error("Update failed:", data.message);
    }
  } catch (err) {
    console.error("Error updating product:", err);
  }
};

 const handleDeleteProduct = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setProducts(products.filter(p => p._id !== id));
    } else {
      const data = await res.json();
      alert(data.message || "Failed to delete product");
    }
  } catch (error) {
    console.error("Error deleting product:", error);
  }
};


const handleEditProduct = (product) => {
  setEditingProduct(product._id);
  setEditData({
    name: product.name || "",
    price: product.price || 0,
    category: product.category || "",
    stock: Number(product.stock) || 0,
    description: product.description,
    
  });
};

const handleUpdateImage = async (id, file) => {
  try {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`http://localhost:5000/api/products/${id}/image/local`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` }, 
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      await fetchProducts();
    } else {
      console.error("Image update failed:", data.message);
    }
  } catch (err) {
    console.error("Error updating image:", err);
  }
};


  return (
    <div className='admin-dashboard' >
      <h1>Admin Dashboard</h1>
<div className="dashboard-buttons">
        <Link to="/orders" className="btn">View Orders</Link>
      </div>

      <div className='product-management' >
        <h2>Product Management</h2>
        <div className='add-product' >
          <input
            type='text'
            placeholder='Enter product name'
            value={newProduct.name}
            onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
            style={{ marginRight: '10px', padding: '5px' }}
          />
          <input
            type='number'
            placeholder='Enter product price'
            value={newProduct.price}
            onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
            style={{ marginRight: '10px', padding: '5px' }}
          />
          <input
            type='text'
            placeholder='Enter product category'
            value={newProduct.category}
            onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
            style={{ marginRight: '10px', padding: '5px' }}
          />
          <input
           type='number'
           placeholder='Enter stock quantity'
           value={newProduct.stock}
          onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
           style={{ marginRight: '10px', padding: '5px' }}/>

           <input
  type='text'
  placeholder='Enter description'
  value={newProduct.description}
  onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
  style={{ marginRight: '10px', padding: '5px', width: '200px' }}
/>



<input
  type='file'
  onChange={e => setNewProduct({ ...newProduct, image: e.target.files[0] })}
/>


          <button onClick={handleAddProduct} style={{ padding: '5px 10px' }}>Add Product</button>
        </div>
      </div>


     <table className='product-table'>
  <thead>
    <tr>
      <th>Name</th>
      <th>Description</th>
      <th>Price</th>
      <th>Category</th>
      <th>Image</th>
      <th>Stock</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {products.map(product => (
      <tr key={product._id}>
        {/* Name */}
        <td>
          {editingProduct === product._id ? (
            <input
              type="text"
              value={editData.name}
              onChange={e => setEditData({ ...editData, name: e.target.value })}
            />
          ) : (
            product.name
          )}
        </td>

        {/* Description */}
<td>
  {editingProduct === product._id ? (
    <input
      type="text"
      value={editData.description}
      onChange={e => setEditData({ ...editData, description: e.target.value })}
    />
  ) : (
    product.description
  )}
</td>


        {/* Price */}
        <td>
          {editingProduct === product._id ? (
            <input
              type="number"
              value={editData.price}
              onChange={e =>
                setEditData({ ...editData, price: Number(e.target.value) })
              }
            />
          ) : (
            product.price
          )}
        </td>

        {/* Category */}
        <td>
          {editingProduct === product._id ? (
            <input
              type="text"
              value={editData.category}
              onChange={e => setEditData({ ...editData, category: e.target.value })}
            />
          ) : (
            product.category
          )}
        </td>

        {/* Image */}
        <td>
          {product.image_url ? (
            <img
              src={`http://localhost:5000${product.image_url || product.image || product.img}`}
              alt={product.name}
              width="80"
            />
          ) : (
            "No image"
          )}

          {editingProduct === product._id && (
            <input
              type="file"
              onChange={(e) =>
                setEditData({ ...editData, image: e.target.files[0] })
              }
            />
          )}
        </td>

      {/* Stock */}
<td>
  {editingProduct === product._id ? (
    <input
      type="number"
      value={editData.stock}
      onChange={e =>
        setEditData({ ...editData, stock: Number(e.target.value) })
      }
    />
  ) : (
    product.stock
  )}
</td>


        {/* Actions */}
        <td>
          {editingProduct === product._id ? (
            <>
              <button onClick={() => handleUpdateProduct(product._id)}>Save</button>
              <button onClick={() => setEditingProduct(null)} style={{ marginLeft: "10px" }}>
                Cancel
              </button>
            </>
          ) : (
            <button onClick={() => handleEditProduct(product)}>Edit</button>
          )}

           <button
    onClick={() => document.getElementById(`file-${product._id}`).click()}
    style={{ marginLeft: "10px" }}
  >
    Change Image
  </button>
  <input
    id={`file-${product._id}`}
    type="file"
    style={{ display: "none" }}
    onChange={(e) => handleUpdateImage(product._id, e.target.files[0])}
  />
          <button
            onClick={() => handleDeleteProduct(product._id)}
            style={{ marginLeft: "10px" }}
          >
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
</div>
  )}


