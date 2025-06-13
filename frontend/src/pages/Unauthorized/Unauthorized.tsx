import Button from '../../components/Button/Button';
import styles from './Unauthorized.module.css';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <h1>🔒 Brak dostępu</h1>
      <p>Nie masz uprawnień do wyświetlenia tej strony. Zaloguj się, aby kontynuować.</p>
      <Button onClick={() => navigate('/login')}>Zaloguj się</Button>
    </div>
  );
};

export default Unauthorized;
