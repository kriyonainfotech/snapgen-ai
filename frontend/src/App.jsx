import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Categories from './pages/Categories';
import Subcategories from './pages/Subcategories';
import GoogleCategories from './pages/GoogleCategories';
import GoogleSubcategories from './pages/GoogleSubcategories';
import Login from './pages/Login';
import AppSettings from './pages/AppSettings';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="categories" element={<Categories />} />
            <Route path="subcategories" element={<Subcategories />} />
            <Route path="google-categories" element={<GoogleCategories />} />
            <Route path="google-subcategories" element={<GoogleSubcategories />} />
            <Route path="settings" element={<AppSettings />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
