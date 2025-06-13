import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { Appointment, Service } from '../../types';
import Unauthorized from '../Unauthorized/Unauthorized';
import styles from './Dashboard.module.css';
import AppointmentCard from '../../components/AppointmentCard/AppointmentCard';
import ReservationForm from '../../components/ReservationForm/ReservationForm';
import Button from '../../components/Button/Button';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [editedAppointment, setEditedAppointment] = useState<Appointment | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const cameFromLogout = location.state?.message ?? null;

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/config');
        if (!res.ok) throw new Error('Błąd konfiguracji');
        const data = await res.json();
        setServices(data.services || []);
      } catch (err) {
        console.error('Błąd pobierania usług:', err);
      }
    };
    fetchConfig();
  }, []);

  const fetchAppointments = async () => {
    try {
      const url =
        user?.role === 'admin'
          ? 'http://localhost:3001/api/appointments/all'
          : 'http://localhost:3001/api/appointments';
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error('Błąd pobierania rezerwacji');
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchAppointments();
  }, [user]);

  // 🆕 Odśwież z flagi po utworzeniu nowej rezerwacji
  useEffect(() => {
    if (location.state?.refresh) {
      fetchAppointments();
      navigate(location.pathname, { replace: true }); // wyczyść state
    }
  }, [location, navigate]);

  const handleEdit = (appointment: Appointment) => {
    setEditedAppointment(appointment);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        const error = await res.json();
        alert(`❌ Błąd usuwania: ${error.message || error.error}`);
        return;
      }

      setAppointments((prev) => prev.filter((a) => a._id !== id));
      alert('✅ Rezerwacja została usunięta.');
    } catch (err) {
      console.error('Błąd podczas usuwania rezerwacji:', err);
      alert('❌ Wystąpił błąd podczas usuwania.');
    }
  };

  const handleCancelEdit = () => {
    setEditedAppointment(null);
  };

  if (loading) return <div>Ładowanie...</div>;
  if (!user) return <Unauthorized />;

  const now = new Date();
  const upcomingAppointments = appointments.filter((a) => new Date(a.date) >= now);
  const pastAppointments = appointments.filter((a) => new Date(a.date) < now);

  return (
    <div className={styles.container}>
      {cameFromLogout && <p>{cameFromLogout}</p>}
      <h1>Twoje rezerwacje</h1>

      <div className={styles.centeredAction}>
        <Button
          className={styles.reservationButton}
          onClick={() => navigate('/reservation')}
        >
          Zarezerwuj wizytę
        </Button>
      </div>

      {editedAppointment ? (
        <ReservationForm
          appointment={editedAppointment}
          services={services}
          onCancel={handleCancelEdit}
          onSuccess={() => {
            setEditedAppointment(null);
            fetchAppointments(); // ✅ odśwież po edycji
          }}
          user={user}
        />
      ) : (
        <>
          <div className={styles.appointmentsWrapper}>
            {upcomingAppointments.length === 0 ? (
              <div className={styles.noAppointments}>
                <p>Nie masz jeszcze żadnych nadchodzących rezerwacji.</p>
              </div>
            ) : (
              upcomingAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment._id}
                  appointment={appointment}
                  editable={true}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onUpdate={() => {}}
                  services={services}
                />
              ))
            )}
          </div>

          {pastAppointments.length > 0 && (
            <div className={styles.historySection}>
              <div className={styles.historyToggle}>
                <Button onClick={() => setShowHistory((prev) => !prev)}>
                  {showHistory ? 'Ukryj historię wizyt' : 'Pokaż historię wizyt'}
                </Button>
              </div>

              {showHistory && (
                <div className={styles.appointmentsWrapper}>
                  {pastAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment._id}
                      appointment={appointment}
                      editable={false}
                      onEdit={() => {}}
                      onDelete={() => {}}
                      onUpdate={() => {}}
                      services={services}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
