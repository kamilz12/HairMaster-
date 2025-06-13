import HeroSection from '../../components/HeroSection/HeroSection';
import ServiceCard from '../../components/ServiceCard/ServiceCard';
import Gallery from '../../components/Gallery/Gallery';
import styles from './Home.module.css';

const Home = () => {
  return (
    <div className={styles.home}>
      <HeroSection />

      <section className={styles.services}>
        <h2>Nasze Usługi</h2>
        <div className={styles.serviceGrid}>
          <ServiceCard title="Strzyżenie" description="Precyzyjne cięcia damskie i męskie." />
          <ServiceCard title="Koloryzacja" description="Balayage, sombre, tonowanie." />
          <ServiceCard title="Stylizacja" description="Fryzury okolicznościowe i ślubne." />
        </div>
      </section>

      <section className={styles.portfolio}>
        <h2>Nasze realizacje i opinie klientów</h2>
        <Gallery />
      </section>
    </div>
  );
};

export default Home;
