import { Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/auth/login";
import "bootstrap/dist/css/bootstrap.min.css";
import RegisterPage from "./pages/auth/register";
import DashboardPage from "./pages/dashboard";
import useAuthentication from "./hooks/useAuthentication";
import { useSelector } from "react-redux";
import Loader from "./components/Loader";
import CreateBillsPage from "./pages/dashboard/create_bills";
function App() {
  const login = useAuthentication();
  useSelector((state: any) => state.user.value);

  if (login === null) {
    return <Loader />;
  } else if (!login) {
    return (
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    );
  }
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/dashboard/bills" element={<CreateBillsPage />} />
    </Routes>
  );
}

export default App;
