import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Login.module.css";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/Button/Button";

const Login = () => {
  const { setUser, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectMessage = location.state?.message || '';
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [loading, user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Błąd logowania");
        return;
      }

      const meRes = await fetch("http://localhost:3001/api/auth/me", {
        credentials: "include",
      });

      if (meRes.ok) {
        const meData = await meRes.json();
        setUser(meData);
        navigate("/dashboard");
      } else {
        setError("Nie udało się pobrać danych użytkownika");
      }
    } catch {
      setError("Wystąpił błąd");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2>Logowanie</h2>

      {/* ✅ Komunikat po wylogowaniu */}
      {redirectMessage && !user && <p className={styles.info}>{redirectMessage}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Nazwa użytkownika"
          autoComplete="username"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Hasło"
          autoComplete="current-password"
        />
        <Button type="submit">Zaloguj się</Button>
      </form>

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default Login;
