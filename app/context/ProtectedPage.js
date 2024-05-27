import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthContext from './Auth';

const ProtectedPage = (WrappedComponent) => {
  const Wrapper = (props) => {
    const { user } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
      if (!user) {
        router.replace(`/login?redirect=${router.pathname}&message=Silahkan Login terlebih dahulu`);
      }
    }, [user, router]);

    return user ? <WrappedComponent {...props} /> : null;
  };

  Wrapper.displayName = `ProtectedPage(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return Wrapper;
};

export default ProtectedPage;
