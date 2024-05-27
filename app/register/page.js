'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '../../utils/api';
import { FloatingLabel, Button } from "flowbite-react";
import Link from 'next/link';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    jenis_kelamin: '',
  });

  const [error, setError] = useState('');
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      router.push('/login');
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
     <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-4 rounded-lg shadow-md" style={{ height: "60%" }}>
        <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="mb-6">
        <input
          type="text"
          name="name"
          className="w-full p-2 border rounded-lg"
          value={formData.name}
          onChange={onChange}
          placeholder="Name"
          required
        />
        </div>
        <div className="mb-6">
        <input
          type="email"
          name="email"
          className="w-full p-2 border rounded-lg"
          value={formData.email}
          onChange={onChange}
          placeholder="Email"
          required
        />
        </div>
        <div className="mb-6">
        <input
          type="password"
          name="password"
          className="w-full p-2 border rounded-lg"
          value={formData.password}
          onChange={onChange}
          placeholder="Password"
          required
        />
        </div>
        <div className="mb-6">
        <select
          name="jenis_kelamin"
          value={formData.jenis_kelamin}
          onChange={onChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="Pria">Pria</option>
          <option value="Wanita">Wanita</option>
        </select>
        </div>
      <Button className="w-full" color="green" onClick={onSubmit} disabled={loading}>
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            "Register"
          )}
        </Button>
        <p className="mt-4 text-sm text-gray-600 text-center">
          Sudah punya akun?{' '}
          <Link className="text-blue-500" href="/login">
            Login disini
          </Link>
        </p>
    </div>
    </div>
  );
};

export default RegisterPage;
