'use client'
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import AuthContext from '../context/Auth';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
