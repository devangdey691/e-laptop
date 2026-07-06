import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';
import ProductList from './pages/admin/products/ProductList';
import Dashboard from './pages/admin/Dashboard';
import Home from './pages/user/Home';
import About from './pages/user/About';
import AddProducts from './pages/admin/products/AddProducts';
import ViewProduct from './pages/admin/products/ViewProduct';
import EditProduct from './pages/admin/products/EditProduct';
import Product from './pages/user/Product';
import ProductDetail from './pages/user/ProductDetail';
import NotFound from './components/NotFound';
import Cart from './pages/user/cart';
import Category from './pages/admin/Category';
import CreateCategory from './pages/admin/CreateCategory';
import EditCategory from './pages/admin/EditCategory';
import Contact from './pages/user/Contact';
import Customers from './pages/admin/customers/Customers';
import CustomersOrders from './pages/admin/customerorders/CustomersOrders';
import Users from './pages/admin/user/Users';
import { useEffect } from "react";
import { getSessionId } from "./utils/session";
import Login from './pages/user/Login';
import Signup from './pages/user/signup';
import Profile from './pages/user/Profile';




function App() {

  useEffect(() => {
    getSessionId();
  }, []);

  return (
    <div className="App">
      <Router>
        <Routes>


          <Route path='/admin' element={<AdminLayout />}>
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='ProductList' element={<ProductList />} />
            <Route path='add-product' element={<AddProducts />} />

            <Route path='category' element={<Category />} />
            <Route path='category/create' element={<CreateCategory />} />
            <Route path='category/edit/:id' element={<EditCategory />} />


            <Route path='customers' element={<Customers />} />
            <Route path='orders' element={<CustomersOrders />} />
            <Route path='users' element={<Users />} />



            <Route path='product/:id' element={<ViewProduct />} />
            <Route path='edit-product/:id' element={<EditProduct />} />
          </Route>

          <Route element={<UserLayout />}>
            <Route path='/' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />

            <Route path='/product-list' element={<Product />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />

            <Route path="/login" element={<Login />} />
            {/* Added the Signup Route here */}
            <Route path="/signup" element={<Signup />} />

            <Route path="/profile" element={<Profile />} />




          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div >
  );
}

export default App;