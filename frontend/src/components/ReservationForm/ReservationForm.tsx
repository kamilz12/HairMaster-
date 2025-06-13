import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import styles from "./ReservationForm.module.css";
import { useNavigate } from "react-router-dom";

import type { Appointment, User } from "../../types";
import Button from "../Button/Button";

interface Service {
  _id: string;
  name: string;
  duration: number;
  price: number;
}

interface Props {
  showTitle?: boolean;
  appointment?: Appointment;
  services: Service[];
  onCancel?: () => void;
  onSuccess?: (data: any) => void;
  user: User | null;
}

const contactNumber = "123 456 789";

const ReservationForm = ({
  showTitle = true,
  appointment,
  services,
  onCancel,
  onSuccess,
  user,
}: Props) => {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [availableHours, setAvailableHours] = useState<string[]>([]);
  const [occupiedHours, setOccupiedHours] = useState<string[]>([]);
  const [fullyBookedDates, setFullyBookedDates] = useState<string[]>([]);
  const [isLoadingHours, setIsLoadingHours] = useState(false);
  const [preserveHour, setPreserveHour] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    notes: "",
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch("/api/config");
        const data = await res.json();
        setAvailableHours(data.hours || []);
      } catch (err) {
        console.error("Błąd pobierania konfiguracji:", err);
      }
    };

    const fetchFullyBooked = async () => {
      try {
        const now = new Date();
        const month = now.toLocaleDateString("sv-SE").slice(0, 7);
        const res = await fetch(`/api/appointments/fully-booked?month=${month}`);
        const data = await res.json();
        setFullyBookedDates(data.dates || []);
      } catch (err) {
        console.error("Błąd pobierania zajętych dni:", err);
      }
    };

    fetchConfig();
    fetchFullyBooked();
  }, []);

  useEffect(() => {
    if (!appointment) return;
    console.log("🧪 USTAWIAM FORM DATA Z:", {
      userName: appointment.userName,
      userId: appointment.userId,
      notes: appointment.notes,
      userPhone: appointment.userPhone,
    });

    const dateObj = new Date(appointment.date);
    const hour = dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  
    setSelectedDate(dateObj);
    setSelectedHour(hour);
    setPreserveHour(hour);
  
    // Ustal dane użytkownika
    const userObj =
      typeof appointment.userId === "object" ? appointment.userId : null;
  
    const fallbackName = appointment.userName ||
      userObj?.username ||
      `${userObj?.firstName ?? ""} ${userObj?.lastName ?? ""}`.trim();
  
    setFormData({
      name: fallbackName || "",
      phone: appointment.userPhone || userObj?.phoneNumber || "",
      service:
        typeof appointment.serviceId === "string"
          ? appointment.serviceId
          : appointment.serviceId._id,
      notes: appointment.notes || "",
    });
  
    fetchOccupiedHours(dateObj);
  }, [appointment]);
  
  

  useEffect(() => {
    if (!appointment && user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
        phone: prev.phone || user.phoneNumber || "",
      }));
    }
  }, [user, appointment]);

  const fetchOccupiedHours = async (date: Date) => {
    const iso = date.toLocaleDateString("sv-SE").split("T")[0];
    setIsLoadingHours(true);

    try {
      const res = await fetch(`/api/appointments/occupied?date=${iso}`, {
        credentials: "include",
      });

      const data = await res.json();
      let hours = data.occupiedHours || [];

      if (preserveHour && date.toDateString() === selectedDate?.toDateString()) {
        if (!hours.includes(preserveHour)) {
          hours.push(preserveHour);
        }
      }

      setOccupiedHours(hours);
    } catch (err) {
      console.error("Błąd ładowania zajętych godzin:", err);
      setOccupiedHours([]);
    } finally {
      setIsLoadingHours(false);
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      errors.name = "Imię i nazwisko jest wymagane.";
    }

    const phone = formData.phone.replace(/\s/g, "");
    if (!phone) {
      errors.phone = "Numer telefonu jest wymagany.";
    } else if (!/^\d{7,15}$/.test(phone)) {
      errors.phone = "Numer telefonu musi zawierać od 7 do 15 cyfr.";
    }

    if (!formData.service) {
      errors.service = "Wybierz usługę.";
    }

    if (!selectedDate) {
      errors.date = "Wybierz datę.";
    }

    if (!selectedHour) {
      errors.hour = "Wybierz godzinę.";
    }

    if (formData.notes.length > 300) {
      errors.notes = "Notatka nie może przekraczać 300 znaków.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("Musisz być zalogowany, aby zarezerwować wizytę.");
      navigate("/login");
      return;
    }

    if (!validateForm()) return;

    const appointmentDate = new Date(selectedDate!.toDateString() + " " + selectedHour);

    try {
      const response = await fetch(
        appointment ? `/api/appointments/${appointment._id}` : "/api/appointments",
        {
          method: appointment ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            date: appointmentDate,
            serviceId: formData.service,
            notes: formData.notes,
            userName: formData.name,
            userPhone: formData.phone,
          }),
        }
      );

      const data = await response.json();
      const updatedDate = data?.appointment?.date;

      if (!updatedDate) {
        throw new Error("No data in response.");
      }

      alert(
        `✅ ${
          appointment ? "Zmieniono rezerwację na" : "Rezerwacja potwierdzona na"
        } ${new Date(updatedDate).toLocaleString()}`
      );

      setSelectedDate(null);
      setSelectedHour(null);
      setFormData({ name: "", phone: "", service: "", notes: "" });
      setPreserveHour(null);
      setFormErrors({});

      if (onSuccess) onSuccess(data);
      navigate("/dashboard");
    } catch (err) {
      alert("❌ Wystąpił błąd przy rezerwacji.");
      console.error(err);
    }
  };

  const renderError = (field: string) =>
    formErrors[field] && <div className={styles.error}>{formErrors[field]}</div>;

  return (
    <div className={styles.wrapper}>
      {showTitle && (
        <h2 className={styles.heading}>
          {appointment ? "Edytuj wizytę" : "Zarezerwuj wizytę"}
        </h2>
      )}

      <div className={styles.calendarBox}>
        <Calendar
          className="react-calendar"
          onChange={(value) => {
            if (value instanceof Date) {
              setSelectedDate(value);
              setSelectedHour(null);
              fetchOccupiedHours(value);
            }
          }}
          value={selectedDate}
          minDate={new Date()}
          tileDisabled={({ date }) => {
            const iso = date.toLocaleDateString("sv-SE");
            const day = date.getDay();
            return fullyBookedDates.includes(iso) || day === 0 || day === 6;
          }}
        />
        {renderError("date")}
      </div>

      {selectedDate && (
        <div className={styles.hourBox}>
          <h3>Wybierz godzinę – {selectedDate.toLocaleDateString()}</h3>
          {isLoadingHours ? (
            <p>Ładowanie godzin...</p>
          ) : (
            <div className={styles.slots}>
              {availableHours
                .filter((hour) => {
                  const isOccupied = occupiedHours.includes(hour);
                  const isSelected = hour === selectedHour || hour === preserveHour;

                  if (selectedDate) {
                    const now = new Date();
                    const isToday = selectedDate.toDateString() === now.toDateString();

                    if (isToday) {
                      const [h, m] = hour.split(":").map(Number);
                      const hourTime = new Date(selectedDate);
                      hourTime.setHours(h, m, 0, 0);
                      if (hourTime <= now) return false;
                    }
                  }

                  return !isOccupied || isSelected;
                })
                .map((hour) => (
                  <Button
                    key={hour}
                    className={`${styles.hourButton} ${
                      selectedHour === hour ? styles.active : ""
                    }`}
                    onClick={() => {
                      setSelectedHour(hour);
                      setFormErrors((prev) => ({ ...prev, hour: "" }));
                    }}
                  >
                    {hour}
                  </Button>
                ))}
            </div>
          )}
          {renderError("hour")}
        </div>
      )}

      {user && (appointment || selectedHour) ? (
        <form className={styles.form} onSubmit={handleSubmit}>
          <h3>{appointment ? "Zmień dane rezerwacji" : "Wprowadź dane"}</h3>

          <input
            type="text"
            name="name"
            placeholder="Imię i nazwisko"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {renderError("name")}

          <input
            type="tel"
            name="phone"
            placeholder="Numer telefonu"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          {renderError("phone")}

          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            required
          >
            <option value="">-- Wybierz usługę --</option>
            {services.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} — {s.price} zł / {s.duration} min
              </option>
            ))}
          </select>
          {renderError("service")}

          <textarea
            name="notes"
            placeholder="Opis / dodatkowe uwagi"
            rows={4}
            value={formData.notes}
            onChange={handleChange}
            maxLength={300}
          />
          {renderError("notes")}

          <div className={styles.buttons}>
            <Button
              type="submit"
              style={{ backgroundColor: "green", marginRight: "10px" }}
            >
              {appointment ? "Zapisz zmiany" : "Potwierdź rezerwację"}
            </Button>

            {appointment && onCancel && (
              <Button
                type="button"
                onClick={onCancel}
                style={{ backgroundColor: "red" }}
              >
                Anuluj edycję
              </Button>
            )}
          </div>
        </form>
      ) : (
        !user && (
          <div className={styles.form}>
            <h3>Aby zarezerwować wizytę online:</h3>
            <p>
              <strong>
                Musisz się <a href="/login">zalogować</a>
              </strong>{" "}
              lub zadzwoń: <br />
              <a href={`tel:${contactNumber}`} className={styles.phone}>
                {contactNumber}
              </a>
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default ReservationForm;
