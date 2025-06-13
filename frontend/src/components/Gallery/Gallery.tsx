import styles from './Gallery.module.css';

const Gallery = () => (
  <div className={styles.gallery}>
    <div className={styles.galleryItem}>
      <img src="/images/style1.jpg" alt="Styl 1" />
      <p className={styles.styleName}>Super robota!</p>
    </div>
    <div className={styles.galleryItem}>
      <img src="/images/style2.jpg" alt="Styl 2" />
      <p className={styles.styleName}>+3 do bramek w tym sezonie, dziękuje!</p>
    </div>
    <div className={styles.galleryItem}>
      <img src="/images/style3.jpg" alt="Styl 3" />
      <p className={styles.styleName}>Dziękuje za wizytę!</p>
    </div>
  </div>
);
export default Gallery;