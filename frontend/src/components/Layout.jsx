import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Layers,
    Grid2X2,
    ChevronLeft,
    Menu,
    Bell,
    Search,
    LogOut,
    Smartphone,
    ExternalLink,
    Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';

const SidebarItem = ({ to, icon: Icon, label, collapsed }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`sidebar-link ${isActive ? 'active' : ''} flex items-center gap-3`}
        >
            <Icon size={20} className="shrink-0" />
            {!collapsed && (
                <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-medium whitespace-nowrap"
                >
                    {label}
                </motion.span>
            )}
        </Link>
    );
};

const Layout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const menuItems = [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/users', icon: Users, label: 'Users' },
        { to: '/categories', icon: Layers, label: 'Categories' },
        { to: '/subcategories', icon: Grid2X2, label: 'Subcategories' },
        { to: '/google-categories', icon: Smartphone, label: 'Google Categories' },
        { to: '/google-subcategories', icon: ExternalLink, label: 'Google Subcategories' },
        { to: '/settings', icon: Settings, label: 'App Settings' },
    ];

    const handleLogout = () => {
        Cookies.remove('token');
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar - Desktop */}
            <motion.aside
                animate={{ width: collapsed ? 80 : 260 }}
                className="hidden md:flex flex-col bg-white border-r border-slate-200 transition-all duration-300"
            >
                <div className="p-6 flex items-center justify-between">
                    {!collapsed && (
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent"
                        >
                            SnapGen
                        </motion.h1>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
                    >
                        <ChevronLeft className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} size={20} />
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {menuItems.map((item) => (
                        <SidebarItem key={item.to} {...item} collapsed={collapsed} />
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        className="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                    >
                        <LogOut size={20} />
                        {!collapsed && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Navbar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <Menu size={20} />
                        </button>
                        {/* <div className="relative group hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search anything..."
                                className="bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 w-64 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all outline-none text-sm"
                            />
                        </div> */}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm cursor-pointer">
                            AD
                        </div>
                    </div>
                </header>

                {/* Dynamic Content */}
                <main className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Mobile Drawer (Simplified) */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 md:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            className="fixed inset-y-0 left-0 w-72 bg-white z-50 p-6 md:hidden"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h1 className="text-2xl font-bold text-indigo-600">SnapGen</h1>
                                <button onClick={() => setMobileMenuOpen(false)}>
                                    <ChevronLeft size={24} />
                                </button>
                            </div>
                            <nav className="space-y-2">
                                {menuItems.map((item) => (
                                    <SidebarItem key={item.to} {...item} collapsed={false} />
                                ))}
                            </nav>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Layout;
