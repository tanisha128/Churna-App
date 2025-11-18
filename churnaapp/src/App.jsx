import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import SecondaryNav from './components/SecondaryNav';
import Home from './components/Home';
import Dashboard from './components/dashboard';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { CartProvider } from './components/CartContext';
import Cart from './components/Cart';
import Login from './components/Login';
import CategoryPage from './components/CategoryPage';
import Order from './components/order';
import OrderSuccess from './components/ordersucces';
import { SearchProvider } from './components/SearchContext';
import ProductDetail from './components/ProductDetails';
import AdminOrder from './components/adminOrder';
import Feedback from './components/Feedback';
import AdminFeedback from './components/adminfeedback';

function App() {
  return (
    <CartProvider>
      <Router>
        <SearchProvider>
          <Navbar />
          <SecondaryNav />

          <Routes>
            <Route path="/" element={<Home />} />           
            <Route path="/category/:name" element={<CategoryPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/cart" element={<Cart />} />
            <Route path='/admin' element={<Login />} />
            <Route path="/order" element={<Order />} />
            <Route path="/ordersuccess" element={<OrderSuccess />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/dashboard"
              element={ <PrivateRoute> <Dashboard />  </PrivateRoute> } />
              <Route path="/admin/feedback" element={<AdminFeedback />} />
            <Route path="/orders" element={<AdminOrder />} />
          </Routes>
          <Link to="/feedback" className="floating-feedback-btn">
  💬 Feedback
</Link>

          <Footer />
        </SearchProvider>
      </Router>
    </CartProvider>
  );
}

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}

export default App;
