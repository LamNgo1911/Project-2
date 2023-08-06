import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Sibar from "./components/Sibar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Category from "./pages/Category";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CheckoutSibar from "./components/CheckoutSibar";
import Payment from "./pages/Payment";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Review from "./pages/Review";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgetPassword from "./pages/auth/ForgetPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ResetPassword from "./pages/auth/ResetPassword";
import Favorite from "./pages/Favorite";
import Deals from "./pages/Deals";
import Coupons from "./pages/Coupons";
import Contact from "./pages/Contact";
import SearchResults from "./pages/SearchResults";
// admin
import SibarAdmin from "./components/admin/SibarAdmin";
import Dashboard from "./pages/admin/Dashboard";
import Searchbar from "./components/admin/Searchbar";
import ProductsAdmin from "./pages/admin/ProductsAdmin";
import ProductAdmin from "./pages/admin/ProductAdmin";
import AddProductAdmin from "./pages/admin/AddProductAdmin";
import UpdateProductAdmin from "./pages/admin/UpdateProductAdmin";
import OrdersAdmin from "./pages/admin/OrdersAdmin";
import OrderAdmin from "./pages/admin/OrderAdmin";
import CategoriesAdmin from "./pages/admin/CategoriesAdmin";
import UpdateCategoryAdmin from "./pages/admin/UpdateCategoryAdmin";
import UsersAdmin from "./pages/admin/UsersAdmin";
import CouponsAdmin from "./pages/admin/CouponsAdmin";
import UpdateCouponAdmin from "./pages/admin/UpdateCouponAdmin";
import DealsAdmin from "./pages/admin/DealsAdmin";
import UpdateDealAdmin from "./pages/admin/UpdateDealAdmin";
import ContactAdmin from "./pages/admin/ContactAdmin";
import { useSelector } from "react-redux";
import FavoriteNoti from "./components/notification/FavoriteNoti";
import CartNoti from "./components/notification/CartNoti";
import Profile from "./pages/Profile";
import ProductModal from "./components/ProductModal";
import Orders from "./pages/Orders";
import Order from "./pages/Order";
import SearchResultAdmin from "./pages/admin/SearchResultAdmin";
import ConfirmReceived from "./components/notification/ConfirmReceived";
import OrderReview from "./pages/OrderReview";

const AdminRoute = ({ component }) => {
  return (
    <div className="flex bg-[#fff] admin">
      <SibarAdmin />
      <div className="w-full bg-[#f1edf8]">
        <Searchbar />
        {component}
      </div>
    </div>
  );
};

function App() {
  const stripePromise = loadStripe(
    "pk_test_51MJsP5KH2yzWbNLa477iwDtwOcwH6ZPsv4AjCJ0dcO0CbRN6PrPdX540JwI8XuKiSirYCm0usOoKdPy0vl2i2nTO00oGAmXqS9"
  );
  const {
    isFavoriteAdded,
    isFavoriteRemoved,
    isCartAdded,
    isCartRemoved,
    openProductModal,
    receivedOrder,
  } = useSelector((state) => state.shopping);
  const { product } = useSelector((state) => state.info);

  useEffect(() => {
    if (openProductModal) {
      document.body.style.overflow = "hidden"; // Disable scroll
    } else {
      document.body.style.overflow = "auto"; // Enable scroll
    }
  }, [openProductModal]);

  return (
    <div className="relative flex flex-col text-text-primary max-w-[1280px] mx-auto">
      <Routes>
        {/* auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* admin */}
        <Route
          path="/admin"
          element={<AdminRoute component={<Dashboard />} />}
        />
        <Route
          path="/admin/search/:search"
          element={<AdminRoute component={<SearchResultAdmin />} />}
        />
        <Route
          path="/admin/categories"
          element={<AdminRoute component={<CategoriesAdmin />} />}
        />
        <Route
          path="/admin/categories/:id/update"
          element={<AdminRoute component={<UpdateCategoryAdmin />} />}
        />
        <Route
          path="/admin/products"
          element={<AdminRoute component={<ProductsAdmin />} />}
        />
        <Route
          path="/admin/products/:id"
          element={<AdminRoute component={<ProductAdmin />} />}
        />
        <Route
          path="/admin/products/add"
          element={<AdminRoute component={<AddProductAdmin />} />}
        />
        <Route
          path="/admin/products/:id/update"
          element={<AdminRoute component={<UpdateProductAdmin />} />}
        />
        <Route
          path="/admin/orders"
          element={<AdminRoute component={<OrdersAdmin />} />}
        />
        <Route
          path="/admin/orders/:id"
          element={<AdminRoute component={<OrderAdmin />} />}
        />
        <Route
          path="/admin/users"
          element={<AdminRoute component={<UsersAdmin />} />}
        />
        <Route
          path="/admin/coupons"
          element={<AdminRoute component={<CouponsAdmin />} />}
        />
        <Route
          path="/admin/coupons/:id/update"
          element={<AdminRoute component={<UpdateCouponAdmin />} />}
        />
        <Route
          path="/admin/deals"
          element={<AdminRoute component={<DealsAdmin />} />}
        />
        <Route
          path="/admin/deals/:id/update"
          element={<AdminRoute component={<UpdateDealAdmin />} />}
        />
        <Route
          path="/admin/contact"
          element={<AdminRoute component={<ContactAdmin />} />}
        />
        <Route
          path="/admin/reviews"
          element={<AdminRoute component={<div key="reviews">Reviews</div>} />}
        />
        <Route
          path="/admin/settings"
          element={
            <AdminRoute component={<div key="settings">Settings</div>} />
          }
        />
        {/* content */}
        <Route
          path="/"
          element={[
            <Sibar key="sibar" />,
            <Home key="home" />,
            <Footer key="footer" />,
          ]}
        />
        <Route
          path="/cart"
          element={[
            <Sibar key="sibar" />,
            <Cart key="cart" />,
            <Footer key="footer" />,
          ]}
        />
        <Route
          path="/checkout"
          element={[
            <CheckoutSibar key="checkoutSibar" />,
            <Checkout key="checkout" />,
          ]}
        />
        <Route
          path="/favorite"
          element={[
            <Sibar key="sibar" />,
            <Favorite key="favorite" />,
            <Footer key="footer" />,
          ]}
        />
        <Route
          path="/payment"
          element={[
            <CheckoutSibar key="checkoutSibar" />,
            <Elements key="elements" stripe={stripePromise}>
              <Payment key="payment" />,
            </Elements>,
          ]}
        />
        <Route
          path="/review"
          element={[
            <CheckoutSibar key="checkoutSibar" />,
            <Review key="review" />,
          ]}
        />
        <Route
          path="/category/:categoryName"
          element={[
            <Sibar key="sibar" />,
            <Category key="category" category="All products" />,
            <Footer key="footer" />,
          ]}
        />
        <Route
          path="/category/:categoryName/:productId"
          element={[
            <Sibar key="sibar" />,
            <Product key="product" />,
            <Footer key="footer" />,
          ]}
        />
        <Route
          path="/search/:search"
          element={[
            <Sibar key="sibar" />,
            <SearchResults key="searchResults" />,
            <Footer key="footer" />,
          ]}
        />
        <Route
          path="/search/:search/:product"
          element={[
            <Sibar key="sibar" />,
            <Product key="product" />,
            <Footer key="footer" />,
          ]}
        />
        <Route
          path="/deals"
          element={[
            <Sibar key="sibar" />,
            <Deals key="deals" />,
            <Footer key="footer" />,
          ]}
        />
        <Route
          path="/coupons"
          element={[
            <Sibar key="sibar" />,
            <Coupons key="coupons" />,
            <Footer key="footer" />,
          ]}
        />
        <Route
          path="/contact"
          element={[
            <Sibar key="sibar" />,
            <Contact key="contact" />,
            <Footer key="footer" />,
          ]}
        />
        <Route
          path="/profile"
          element={[
            <Sibar key="sibar" />,
            <Profile key="profile" />,
            <Footer key="footer" />,
          ]}
        />
        <Route
          path="/orders"
          element={[
            <Sibar key="sibar" />,
            <Orders key="orders" />,
            <Footer key="footer" />,
          ]}
        />
        <Route
          path="/orders/:id"
          element={[
            <Sibar key="sibar" />,
            <Order key="order" />,
            <Footer key="footer" />,
          ]}
        />
        <Route
          path="/orders/:id/orderReview"
          element={[
            <Sibar key="sibar" />,
            <OrderReview key="orderReview" />,
            <Footer key="footer" />,
          ]}
        />
      </Routes>
      {(isFavoriteAdded || isFavoriteRemoved) && <FavoriteNoti />}
      {(isCartAdded || isCartRemoved) && <CartNoti />}
      {receivedOrder && <ConfirmReceived />}
      {/* choose product size and color */}
      {openProductModal && (
        <div
          className="fixed z-[9999] w-full max-w-[1280px] h-full border bg-black bg-opacity-50 flex items-center justify-center
      "
        >
          <ProductModal product={product} />
        </div>
      )}
    </div>
  );
}

export default App;
