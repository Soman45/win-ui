'use client'
import { useContext, useState, useEffect } from 'react';
import { fetchProducts, createProduct, updateProduct, deleteProduct, fetchUserProfile } from '../../utils/api';
import AuthContext from '../context/Auth';
import { formatRupiah } from '../../utils/currency';
import {Navbar, FloatingLabel, Button } from "flowbite-react";
import ProtectedPage from '../context/ProtectedPage';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const res = await fetchProducts();
    setProducts(res.data);
  };

  const onChange = (e) =>
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    const price = parseFloat(newProduct.price);
    const maxPrice = 999999999.99; 
    if (isNaN(price) || price > maxPrice) {
      setError(`Price cannot exceed ${formatRupiah(maxPrice)}`);
      return;
    }

    setError('');
    const productData = { ...newProduct, price };

    if (editingProduct) {
      await updateProduct(editingProduct.id, productData);
      setEditingProduct(null);
    } else {
      await createProduct(productData);
    }
    loadProducts();
    setNewProduct({ name: '', description: '', price: '' });
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setNewProduct({ name: product.name, description: product.description, price: product.price });
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    loadProducts();
  };

  const handleLogout = () => {
    logout();
  };

  const loadUserProfile = async () => {
    if (showProfile) {
      setShowProfile(false);
      setProfile(null);
      return;
    }

    try {
      const res = await fetchUserProfile(user.token);
      setProfile(res.data);
      setShowProfile(true);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to fetch user profile');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <Navbar fluid rounded className="bg-gray-600">
        <h1 className="self-center whitespace-nowrap text-xl font-semibold p-2">Products</h1>
        <div className="ml-auto flex items-center space-x-2 p-2">
          <Button onClick={handleLogout} className="p-2" color="blue">Logout</Button>
          <Button onClick={loadUserProfile} className="p-2" color="blue">Lihat Profile</Button>
        </div>
      </Navbar>

      {showProfile && profile && (
        <div className="m-4 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">User Profile</h2>
          <pre>{JSON.stringify(profile, null, 2)}</pre>
        </div>
      )}

      <form onSubmit={onSubmit} className="p-4 space-y-4">
        <h1 className="text-xl font-semibold">Add/Edit Product</h1>
        <div>
          <input
            type="text"
            name="name"
            value={newProduct.name}
            onChange={onChange}
            placeholder="Name"
            required
            className="w-full p-2 border rounded-lg mb-2"
          />
        </div>
        <div>
          <input
            type="text"
            name="description"
            value={newProduct.description}
            onChange={onChange}
            placeholder="Description"
            required
            className="w-full p-2 border rounded-lg mb-2"
          />
        </div>
        <div>
          <input
            type="number"
            name="price"
            value={newProduct.price}
            onChange={onChange}
            placeholder="Price"
            required
            min="0"
            max="999999999.99"
            step="0.01"
            className="w-full p-2 border rounded-lg mb-2"
          />
        </div>
        <Button type="submit" className='p-3'>{editingProduct ? 'Update Product' : 'Add Product'}</Button>
      </form>

      <div className="flex-grow flex p-4">
        <div className="w-full bg-gray-100 rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{product.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{formatRupiah(product.price)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    <div className="flex space-x-2">
                      <Button onClick={() => handleEdit(product)} color="blue">Edit</Button>
                      <Button onClick={() => handleDelete(product.id)} color="blue">Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

ProductsPage.auth = true;

export default ProtectedPage(ProductsPage);
