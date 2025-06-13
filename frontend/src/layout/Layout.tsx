import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Layout.module.css';
import { useAuth } from '../context/AuthContext';

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login', {
      replace: true,
      state: { message: 'Zostałeś wylogowany pomyślnie' },
    });
    setIsOpen(false); // zamknij menu po wylogowaniu
  };

  const toggleMenu = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className={styles.layout}>
      <nav className={styles.navbar}>
        <Link to="/" className={styles.logo}>Salon Glamour</Link>

        <button
          className={styles.hamburger}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`${styles.navLinks} ${isOpen ? styles.showMenu : ''}`}>
          <Link to="/" onClick={() => setIsOpen(false)}>Strona główna</Link>

          {user && (
            <>
              <Link to="/dashboard" onClick={() => setIsOpen(false)}>Panel</Link>
              <Link to="/ustawienia" onClick={() => setIsOpen(false)}>Ustawienia</Link>
              <button onClick={handleLogout}>Wyloguj</button>
            </>
          )}

          {!user && (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)}>Zaloguj</Link>
              <Link to="/register" onClick={() => setIsOpen(false)}>Rejestracja</Link>
            </>
          )}
        </div>
      </nav>

      <main className={styles.content}>{children}</main>

      <footer className={styles.footer}>
  <div className={styles.footerContent}>
    <p>&copy; 2025 Salon Glamour. Wszelkie prawa zastrzeżone.</p>
    <ul className={styles.footerLinks}>
      <li><a href="/privacy">Polityka prywatności</a></li>
      <li><a href="/terms">Regulamin</a></li>
      <li><a href="/contact">Kontakt</a></li>
    </ul>
  </div>
</footer>
    </div>
  );
};

export default Layout;
