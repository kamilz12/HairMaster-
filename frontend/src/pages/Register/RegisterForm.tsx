import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RegisterForm.module.css';
import Button from '../../components/Button/Button';
import { useAuth } from '../../context/AuthContext'; // <--- jeśli masz kontekst autoryzacji

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  });
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setUser } = useAuth(); // <--- kontekst autoryzacji

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || 'Rejestracja nieudana');
        return;
      }

      const meRes = await fetch('http://localhost:3001/api/auth/me', {
        credentials: 'include',
      });

      if (meRes.ok) {
        const userData = await meRes.json();
        setUser(userData); // 🔐 zapisanie do kontekstu autoryzacji
        navigate('/dashboard'); // 🔁 przekierowanie po rejestracji
      } else {
        setMessage('Zarejestrowano, ale nie udało się pobrać danych użytkownika');
      }

    } catch (err) {
      setMessage('Błąd połączenia z serwerem');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.registerForm}>
      <h2>Rejestracja</h2>

      <input
        type="text"
        name="username"
        placeholder="Nazwa użytkownika"
        value={formData.username}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Hasło"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="firstName"
        placeholder="Imię"
        value={formData.firstName}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="lastName"
        placeholder="Nazwisko"
        value={formData.lastName}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="tel"
        name="phoneNumber"
        placeholder="Numer telefonu"
        value={formData.phoneNumber}
        onChange={handleChange}
        pattern="[0-9]{9,15}"
        title="Numer telefonu powinien mieć od 9 do 15 cyfr"
        required
      />

      <Button type="submit">Zarejestruj</Button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default RegisterForm;
