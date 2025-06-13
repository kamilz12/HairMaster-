import styles from './ServiceCard.module.css';

type Props = {
  title: string;
  description: string;
};

const ServiceCard = ({ title, description }: Props) => (
  <div className={styles.card}>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

export default ServiceCard;
