import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthContext from './Auth';

const ProtectedRoute = (WrappedComponent) => {
  return (props) => {
    const { user } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
      if (!user) {
        router.replace(`/login?redirect=${router.pathname}&message=Silahkan Login terlebih dahulu`);
      }
    }, [user, router]);

    return user ? <WrappedComponent {...props} /> : null;
  };
};

export default ProtectedRoute;
