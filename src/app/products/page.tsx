'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/dashboard/Navbar';
import Sidebar from '@/components/dashboard/Sidebar';
import { ProductData } from '@/lib/types';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { createProduct, deleteProduct, fetchProductData, updateProduct } from '@/lib/api/dashboardService';
import Link from 'next/link';

export default function Products() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<ProductData | null>(null);
  const [editedProduct, setEditedProduct] = useState({
    name: '',
    category: '',
    price: 0,
    stock: 0
  });
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: 0,
    stock: 0
  });

  const categories = ['All', 'Electronics', 'Clothing', 'Food', 'Home Goods'];

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        const productData = await fetchProductData();
        setProducts(productData);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        
        // Fallback to mock data for demo purposes
        const mockProductData: ProductData[] = Array.from({ length: 20 }, (_, i) => ({
          id: i + 1,
          name: `Product ${String.fromCharCode(65 + i % 26)}`,
          category: ['Electronics', 'Clothing', 'Food', 'Home Goods'][Math.floor(Math.random() * 4)],
          price: Math.floor(Math.random() * 500) + 50,
          stock: Math.floor(Math.random() * 100) + 10,
          sales_count: Math.floor(Math.random() * 1000) + 100,
        }));
        
        setProducts(mockProductData);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    try {
      setIsSubmitting(true);
      
      // Submit to Supabase via API
      const productToAdd = {
        ...newProduct,
        sales_count: 0
      };
      
      const createdProduct = await createProduct(productToAdd);
      
      if (createdProduct) {
        // Add to local state if successful
        setProducts([...products, createdProduct]);
        setNewProduct({ name: '', category: '', price: 0, stock: 0 });
        setShowAddModal(false);
      } else {
        throw new Error('Failed to create product');
      }
    } catch (err) {
      console.error('Error adding product:', err);
      alert('Failed to add product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEditModal = (product: ProductData) => {
    setCurrentProduct(product);
    setEditedProduct({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock
    });
    setShowEditModal(true);
  };

  const handleUpdateProduct = async () => {
    if (!currentProduct) return;
    
    try {
      setIsSubmitting(true);
      
      const updatedProduct = await updateProduct(currentProduct.id, editedProduct);
      
      if (updatedProduct) {
        // Update local state if successful
        setProducts(products.map(p => 
          p.id === updatedProduct.id ? updatedProduct : p
        ));
        setShowEditModal(false);
        setCurrentProduct(null);
      } else {
        throw new Error('Failed to update product');
      }
    } catch (err) {
      console.error('Error updating product:', err);
      alert('Failed to update product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      const success = await deleteProduct(id);
      
      if (success) {
        // Remove from local state if successful
        setProducts(products.filter(product => product.id !== id));
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product. Please try again.');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar activeItem="Products" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">Products</h1>
                <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg
                      className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <select
                    className="border rounded-lg px-4 py-2"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    onClick={() => setShowAddModal(true)}
                  >
                    Add Product
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  {error}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Stock
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Sales
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProducts.map((product) => (
                          <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Link href={`/products/${product.id}`} className="text-blue-600 hover:text-blue-900">
                                <div className="text-sm font-medium">{product.name}</div>
                              </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {product.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`text-sm ${product.stock < 10 ? 'text-red-500 font-medium' : 'text-gray-900'}`}>
                                {product.stock}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{product.sales_count}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button 
                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                                onClick={() => handleOpenEditModal(product)}
                              >
                                Edit
                              </button>
                              <button 
                                className="text-red-600 hover:text-red-900"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="category"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                >
                  <option value="">Select a category</option>
                  {categories.filter(c => c !== 'All').map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price ($)
                </label>
                <input
                  type="number"
                  id="price"
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                  Stock
                </label>
                <input
                  type="number"
                  id="stock"
                  min="0"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                onClick={() => setShowAddModal(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                onClick={handleAddProduct}
                disabled={!newProduct.name || !newProduct.category || isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && currentProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">
                  Product Name
                </label>
                <input
                  type="text"
                  id="edit-name"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={editedProduct.name}
                  onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="edit-category"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={editedProduct.category}
                  onChange={(e) => setEditedProduct({ ...editedProduct, category: e.target.value })}
                >
                  <option value="">Select a category</option>
                  {categories.filter(c => c !== 'All').map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700">
                  Price ($)
                </label>
                <input
                  type="number"
                  id="edit-price"
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={editedProduct.price}
                  onChange={(e) => setEditedProduct({ ...editedProduct, price: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <label htmlFor="edit-stock" className="block text-sm font-medium text-gray-700">
                  Stock
                </label>
                <input
                  type="number"
                  id="edit-stock"
                  min="0"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={editedProduct.stock}
                  onChange={(e) => setEditedProduct({ ...editedProduct, stock: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                onClick={() => {
                  setShowEditModal(false);
                  setCurrentProduct(null);
                }}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                onClick={handleUpdateProduct}
                disabled={!editedProduct.name || !editedProduct.category || isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
} 