import CustomerApp from "./customer/CustomerApp";
import AdminApp from "./admin/AdminApp";

// /admin → panel admin, selain itu → apps customer
const isAdmin = window.location.pathname.startsWith("/admin");

export default function App() {
  return isAdmin ? <AdminApp /> : <CustomerApp />;
}