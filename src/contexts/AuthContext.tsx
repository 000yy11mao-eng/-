import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface User {
  role: 'admin' | 'teacher';
  id?: string;
  name?: string;
  code?: string;
}

interface AuthContextType {
  user: User | null;
  loginAdmin: (username: string, pass: string) => boolean;
  loginTeacher: (code: string) => Promise<boolean>;
  loginGuest: () => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('school_auth_session');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const loginAdmin = (username: string, pass: string) => {
    if (
      username === 'Mustafa_Kamel_Official_Language_School_Administration' &&
      pass === 'administration4321'
    ) {
      const u: User = { role: 'admin', name: 'Administration' };
      setUser(u);
      localStorage.setItem('school_auth_session', JSON.stringify(u));
      return true;
    }
    return false;
  };

  const loginTeacher = async (code: string) => {
    const q = query(collection(db, 'app_teachers'), where('code', '==', code));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const data = doc.data();
      const u: User = { role: 'teacher', id: doc.id, name: data.name, code: data.code };
      setUser(u);
      localStorage.setItem('school_auth_session', JSON.stringify(u));
      return true;
    }
    return false;
  };

  const loginGuest = () => {
    const u: User = { role: 'admin', name: 'عمر مصطفى الخواجة' };
    setUser(u);
    localStorage.setItem('school_auth_session', JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('school_auth_session');
  };

  return (
    <AuthContext.Provider value={{ user, loginAdmin, loginTeacher, loginGuest, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
