import { useNavigate } from 'react-router-dom';
import Button from '../Button/Button';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.heroSection}>
    <div className={styles.overlay}></div>

    <div className={styles.hero}>

      <div className={styles.heroContent}>

    <h1>Salon Glamour</h1>
    <p>Zadbaj o swoje włosy z nami – rezerwuj wizytę już dziś!</p>
    <Button onClick={() => navigate('/reservation')}>Rezerwuj teraz</Button>
  </div>
</div>

</section>
  );
};

export default HeroSection;
