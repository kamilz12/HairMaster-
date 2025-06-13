import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


import styles from "./UserSettings.module.css";
import Button from "../../components/Button/Button";
import { useAuth } from "../../context/AuthContext";


const UserSettings = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "Imię jest wymagane.";
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Nazwisko jest wymagane.";
    }

    const phone = formData.phoneNumber.replace(/\s/g, "");
    if (!phone) {
      errors.phoneNumber = "Numer telefonu jest wymagany.";
    } else if (!/^\d{7,15}$/.test(phone)) {
      errors.phoneNumber = "Numer telefonu musi mieć od 7 do 15 cyfr.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
  
      if (!res.ok) throw new Error("Błąd aktualizacji danych.");
  
      const data = await res.json();
      setUser(data.user); // <- aktualizacja kontekstu z danymi z backendu
  
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert("❌ Nie udało się zapisać zmian.");
    }
  };
  

  if (!user) {
    return (
      <div className={styles.wrapper}>
        <h2>Musisz być zalogowany</h2>
        <button onClick={() => navigate("/login")}>Zaloguj się</button>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <h2>Ustawienia użytkownika</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label>Imię</label>
        <input
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />
        {formErrors.firstName && <p className={styles.error}>{formErrors.firstName}</p>}

        <label>Nazwisko</label>
        <input
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />
        {formErrors.lastName && <p className={styles.error}>{formErrors.lastName}</p>}

        <label>Telefon</label>
        <input
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
        />
        {formErrors.phoneNumber && <p className={styles.error}>{formErrors.phoneNumber}</p>}

<Button type="submit">Zapisz zmiany</Button>        {success && <p className={styles.success}>✅ Dane zapisane!</p>}
      </form>
    </div>
  );
};

export default UserSettings;
