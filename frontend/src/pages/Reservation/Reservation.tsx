import { useEffect, useState } from "react";
import ReservationForm from "../../components/ReservationForm/ReservationForm";
import { useAuth } from "../../context/AuthContext";
import type { Service } from "../../types";

const Reservation = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/config");
        const data = await res.json();
        setServices(data.services || []);
      } catch (err) {
        console.error("Błąd pobierania usług:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) return <p>Ładowanie formularza...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <ReservationForm services={services} user={user} />
    </div>
  );
};

export default Reservation;
