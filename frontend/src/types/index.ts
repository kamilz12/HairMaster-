// Typ użytkownika
export interface User {
    userId: string;
    username: string;
    role: 'client' | 'admin';
    firstName: string;
    lastName: string;
    phoneNumber: string;
  }
  
  // Typ usługi
  export interface Service {
    _id: string;
    name: string;
    price: number;
    duration: number;
  }
  
  export interface Appointment {
    _id: string;
    // This type definition assumes userId can either be just a string (ID)
    // or a populated object with the user's details.
    // Make sure your backend populates these fields when fetching appointments.
    userId: string | {
      _id: string;
      username: string;
      firstName: string; // Add this
      lastName: string;  // Add this
      phoneNumber: string; // Add this
      // Add any other user properties you expect to be populated
    };
    serviceId: string | {
      _id: string;
      name: string;
      duration: number;
      price: number;
    };
    date: string; // Or Date, depending on how you handle it
    notes?: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    userName: string;
    userPhone: string;
  }