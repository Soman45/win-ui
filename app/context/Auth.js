'use client'
import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, registerUser } from '../../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ token });
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await loginUser({ email, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      setUser({ email }); 
      router.push('/product');
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Email/Password salah');
    }
  };

  const register = async (name, email, password, jenis_kelamin) => {
    try {
      await registerUser({ name, email, password, jenis_kelamin });
      router.push('/login');
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
