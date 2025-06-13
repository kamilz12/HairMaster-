import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/RegisterForm";
import Dashboard from "./pages/Dashboard/Dashboard";
import Layout from "./layout/Layout";
import Reservation from "./pages/Reservation/Reservation";
import RedirectIfLoggedIn from "./components/Auth/RedirectIfLoggedIn";
import Contact from "./pages/Contact/Contact";
import UserSettings from "./pages/UserSettings/UserSettings";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user } = useAuth();
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <RedirectIfLoggedIn>
                <Login />
              </RedirectIfLoggedIn>
            }
          />
          <Route
            path="/register"
            element={
              <RedirectIfLoggedIn>
                <Register />
              </RedirectIfLoggedIn>
            }
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/ustawienia" element={<UserSettings />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
