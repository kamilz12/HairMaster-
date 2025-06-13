export const checkAuth = async (): Promise<boolean> => {
    try {
      const res = await fetch('http://localhost:3001/api/auth/me', {
        credentials: 'include',
      });
  
      if (!res.ok) return false;
  
      const data = await res.json();
      return !!data.userId;
    } catch {
      return false;
    }
  };
  