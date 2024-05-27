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
    return <p>Silahkan Login terlebih dahulu</p>;
  }

  return children;
};

ProtectedRoute.displayName = 'ProtectedRoute';

export default ProtectedRoute;
