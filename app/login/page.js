'use client'
import { useState, useContext } from 'react';
import Link from 'next/link';
import AuthContext from '../context/Auth';
import { Button } from 'flowbite-react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [userData, setUserData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const router = useRouter();
  const { message } = router.query || {};

  const handleLogin = async () => {
    setError('');

    // Check email/password apakah sudah diisi
    if (!userData.email || !userData.password) {
      setError('Semua kolom harus diisi');
      return;
    }
    setLoading(true);
    try {
      await login(userData.email, userData.password);
      // Redirect menuju login kalo memaksa masuk
      const redirectPath = router.query.redirect || '/'; 
      router.push(redirectPath);
    } catch (err) {
      setTimeout(() => {
        setError('Email/Password salah');
      }, 5000);
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-4 rounded-lg shadow-md" style={{ height: "60%" }}>
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
        {message && <p className="text-red-500">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Email"
            className="w-full p-2 border rounded-lg"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded-lg"
            value={userData.password}
            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
          />
        </div>
        <Button className="w-full" color="green" onClick={handleLogin} disabled={loading}>
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            "Login"
          )}
        </Button>
        <p className="mt-4 text-sm text-gray-600 text-center">
          Belum punya akun?{" "}
          <Link className="text-blue-500" href="/register">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
