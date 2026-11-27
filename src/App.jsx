import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { AuthProvider } from './context/AuthContext.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import PublicLayout from './layouts/PublicLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import Spinner from './components/Spinner.jsx';

import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Services from './pages/Services.jsx';
import Destinations from './pages/Destinations.jsx';
import Track from './pages/Track.jsx';
import BookShipment from './pages/BookShipment.jsx';
import GetQuote from './pages/GetQuote.jsx';
import Locations from './pages/Locations.jsx';
import Contact from './pages/Contact.jsx';
import Faq from './pages/Faq.jsx';

// Service detail pages are code-split
const InternationalShipping = lazy(() => import('./pages/services/InternationalShipping.jsx'));
const ExpressShipping = lazy(() => import('./pages/services/ExpressShipping.jsx'));
const AirSeaCargo = lazy(() => import('./pages/services/AirSeaCargo.jsx'));
const SecureHandling = lazy(() => import('./pages/services/SecureHandling.jsx'));

// Auth + dashboard + admin views are code-split
const Login = lazy(() => import('./pages/auth/Login.jsx'));
const Register = lazy(() => import('./pages/auth/Register.jsx'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword.jsx'));

const DashboardOverview = lazy(() => import('./pages/dashboard/DashboardOverview.jsx'));
const MyShipments = lazy(() => import('./pages/dashboard/MyShipments.jsx'));
const ShipmentDetails = lazy(() => import('./pages/dashboard/ShipmentDetails.jsx'));
const DashboardTrack = lazy(() => import('./pages/dashboard/DashboardTrack.jsx'));
const DashboardBook = lazy(() => import('./pages/dashboard/DashboardBook.jsx'));
const Payments = lazy(() => import('./pages/dashboard/Payments.jsx'));
const MyQuotes = lazy(() => import('./pages/dashboard/MyQuotes.jsx'));
const Notifications = lazy(() => import('./pages/dashboard/Notifications.jsx'));
const Profile = lazy(() => import('./pages/dashboard/Profile.jsx'));
const AccountSettings = lazy(() => import('./pages/dashboard/AccountSettings.jsx'));

const AdminOverview = lazy(() => import('./pages/admin/AdminOverview.jsx'));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers.jsx'));
const AdminShipments = lazy(() => import('./pages/admin/AdminShipments.jsx'));
const AdminCreateShipment = lazy(() => import('./pages/admin/AdminCreateShipment.jsx'));
const AdminUpdateTracking = lazy(() => import('./pages/admin/AdminUpdateTracking.jsx'));
const AdminBookings = lazy(() => import('./pages/admin/AdminBookings.jsx'));
const AdminQuotes = lazy(() => import('./pages/admin/AdminQuotes.jsx'));
const AdminPayments = lazy(() => import('./pages/admin/AdminPayments.jsx'));
const AdminDestinations = lazy(() => import('./pages/admin/AdminDestinations.jsx'));
const AdminLocations = lazy(() => import('./pages/admin/AdminLocations.jsx'));
const AdminNotifications = lazy(() => import('./pages/admin/AdminNotifications.jsx'));
const AdminContent = lazy(() => import('./pages/admin/AdminContent.jsx'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings.jsx'));

const NotFound = lazy(() => import('./pages/NotFound.jsx'));

function FallbackScreen() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center bg-paper">
      <Spinner label="Loading" />
    </div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <ErrorBoundary>
      <AuthProvider>
        <ScrollToTop />
        <AnimatePresence mode="wait" initial={false}>
          <Suspense fallback={<FallbackScreen />}>
            <Routes location={location} key={location.pathname}>
              {/* Public website */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/international-shipping" element={<InternationalShipping />} />
                <Route path="/services/express-shipping" element={<ExpressShipping />} />
                <Route path="/services/air-sea-cargo" element={<AirSeaCargo />} />
                <Route path="/services/secure-handling" element={<SecureHandling />} />
                <Route path="/destinations" element={<Destinations />} />
                <Route path="/track" element={<Track />} />
                <Route path="/book-shipment" element={<BookShipment />} />
                <Route path="/get-a-quote" element={<GetQuote />} />
                <Route path="/locations" element={<Locations />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<Faq />} />
              </Route>

              {/* Authentication */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Route>

              {/* Customer dashboard */}
              <Route element={<DashboardLayout kind="customer" />}>
                <Route path="/dashboard" element={<DashboardOverview />} />
                <Route path="/dashboard/shipments" element={<MyShipments />} />
                <Route path="/dashboard/shipments/:id" element={<ShipmentDetails />} />
                <Route path="/dashboard/track" element={<DashboardTrack />} />
                <Route path="/dashboard/book" element={<DashboardBook />} />
                <Route path="/dashboard/payments" element={<Payments />} />
                <Route path="/dashboard/quotes" element={<MyQuotes />} />
                <Route path="/dashboard/notifications" element={<Notifications />} />
                <Route path="/dashboard/profile" element={<Profile />} />
                <Route path="/dashboard/settings" element={<AccountSettings />} />
              </Route>

              {/* Admin dashboard */}
              <Route element={<DashboardLayout kind="admin" />}>
                <Route path="/admin" element={<AdminOverview />} />
                <Route path="/admin/customers" element={<AdminCustomers />} />
                <Route path="/admin/shipments" element={<AdminShipments />} />
                <Route path="/admin/shipments/create" element={<AdminCreateShipment />} />
                <Route path="/admin/tracking" element={<AdminUpdateTracking />} />
                <Route path="/admin/bookings" element={<AdminBookings />} />
                <Route path="/admin/quotes" element={<AdminQuotes />} />
                <Route path="/admin/payments" element={<AdminPayments />} />
                <Route path="/admin/destinations" element={<AdminDestinations />} />
                <Route path="/admin/locations" element={<AdminLocations />} />
                <Route path="/admin/notifications" element={<AdminNotifications />} />
                <Route path="/admin/content" element={<AdminContent />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </AuthProvider>
    </ErrorBoundary>
  );
}
