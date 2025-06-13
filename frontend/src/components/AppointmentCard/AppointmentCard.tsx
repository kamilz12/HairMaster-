import type { Appointment, Service } from '../../types';
import Button from '../Button/Button';
import styles from './AppointmentCard.module.css';

interface Props {
  appointment: Appointment;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updated: { date?: string; serviceId?: string }) => void;
  editable?: boolean;
  services?: Service[];
  onEdit?: (appointment: Appointment) => void;
}

const AppointmentCard = ({
  appointment,
  onDelete,
  onEdit,
  editable = false,
}: Props) => {
  const { serviceId, date, _id, userName } = appointment;

  // 🌟 Dane usługi
  const serviceName =
    typeof serviceId === 'object' && 'name' in serviceId
      ? serviceId.name
      : 'Nieznana usługa';

  const servicePrice =
    typeof serviceId === 'object' && 'price' in serviceId
      ? serviceId.price
      : '?';

  // 🌟 Dane klienta (z rezerwacji)
  const clientName = userName || 'Nieznany klient';

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span>{serviceName}</span>
        <span>{new Date(date).toLocaleDateString()}</span>
      </div>

      <div className={styles.content}>
        <div className={styles.item}>
          <span className={styles.label}>Godzina:</span>
          {new Date(date).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
        <div className={styles.item}>
          <span className={styles.label}>Cena:</span>
          {servicePrice} zł
        </div>
        <div className={styles.item}>
          <span className={styles.label}>Klient:</span>
          {clientName}
        </div>
      </div>

      {editable && (
        <div className={styles.actions}>
          <Button onClick={() => onEdit?.(appointment)}>Edytuj</Button>
          <Button onClick={() => onDelete(_id)}>Usuń</Button>
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;
