import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Plus, Search, Loader2, Download, Filter, XCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import locationData from '../data/locations.json';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        deviceId: '',
        coins: 0,
        isp: '',
        org: '',
        utm: '',
        country: '',
        city: '',
        region: '',
        appVersion: '',
        isActive: true
    });

    const [filters, setFilters] = useState({
        country: '',
        region: '',
        city: '',
        utm: '',
        dateRange: '' // today, yesterday, week, month, year
    });

    const [searchTerm, setSearchTerm] = useState('');

    const columns = [
        { key: "sr.no", label: "Sr.No", render: (val, user, index) => <span className="text-slate-400">{index + 1}</span> },
        { key: 'deviceId', label: 'Device ID' },
        { key: 'country', label: 'Country' },
        { key: 'city', label: 'City' },
        { key: 'region', label: 'Region' },
        { key: 'coins', label: 'Coins' },
        { key: 'isp', label: 'ISP' },
        { key: 'org', label: 'Org' },
        { key: 'utm', label: 'Utm' },
        { key: 'appVersion', label: 'App Ver' },
        {
            key: 'isActive',
            label: 'isActive',
            render: (val, user) => (
                <button
                    onClick={() => handleToggleStatus(user)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${val ? 'bg-indigo-600' : 'bg-slate-200'}`}
                >
                    <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${val ? 'translate-x-[18px]' : 'translate-x-1'}`}
                    />
                </button>
            )
        },
    ];

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get('/users/all');
            setUsers(res.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const uniqueUtmValues = [...new Set(users.map(user => user.utm).filter(Boolean))].sort();

    const filteredUsers = users.filter(user => {
        // Location Filters
        if (filters.country && user.country !== filters.country) return false;
        if (filters.region && user.region !== filters.region) return false;
        if (filters.city && user.city !== filters.city) return false;
        if (filters.utm && user.utm !== filters.utm) return false;

        // Date Range Filter
        if (filters.dateRange) {
            const now = new Date();
            const createdDate = new Date(user.createdAt);
            const diffDays = (now - createdDate) / (1000 * 60 * 60 * 24);

            if (filters.dateRange === 'today') {
                if (createdDate.toDateString() !== now.toDateString()) return false;
            } else if (filters.dateRange === 'yesterday') {
                const yesterday = new Date();
                yesterday.setDate(now.getDate() - 1);
                if (createdDate.toDateString() !== yesterday.toDateString()) return false;
            } else if (filters.dateRange === 'week' && diffDays > 7) return false;
            else if (filters.dateRange === 'month' && diffDays > 30) return false;
            else if (filters.dateRange === 'year' && diffDays > 365) return false;
        }

        // Search Filter
        const searchStr = searchTerm.toLowerCase();
        return (
            (user.deviceId?.toLowerCase().includes(searchStr)) ||
            (user.email?.toLowerCase().includes(searchStr)) ||
            (user.name?.toLowerCase().includes(searchStr)) ||
            (user.isp?.toLowerCase().includes(searchStr)) ||
            (user.org?.toLowerCase().includes(searchStr))
        );
    });

    const handleExportExcel = () => {
        if (filteredUsers.length === 0) {
            alert('No data to export');
            return;
        }

        const exportData = filteredUsers.map((user, index) => ({
            'Sr.No': index + 1,
            'Device ID': user.deviceId,
            'Country': user.country,
            'City': user.city,
            'Region': user.region,
            'Coins': user.coins,
            'ISP': user.isp,
            'Org': user.org,
            'App Version': user.appVersion,
            'Status': user.isActive ? 'Active' : 'Inactive',
            'Joined Date': new Date(user.createdAt).toLocaleString()
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
        XLSX.writeFile(workbook, `Users_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const handleToggleStatus = async (user) => {
        try {
            await api.put(`/users/update/${user._id}`, { ...user, isActive: !user.isActive });
            fetchUsers();
        } catch (error) {
            console.error('Error toggling status:', error);
            alert('Failed to update status');
        }
    };

    const handleOpenModal = (user = null) => {
        if (user) {
            setCurrentUser(user);
            setFormData(user);
        } else {
            setCurrentUser(null);
            setFormData({
                deviceId: '',
                coins: 0,
                isp: '',
                org: '',
                country: '',
                city: '',
                region: '',
                appVersion: '',
                isActive: true
            });
        }
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentUser) {
                await api.put(`/users/update/${currentUser._id}`, formData);
            } else {
                await api.post('/users/create', formData);
            }
            setModalOpen(false);
            fetchUsers();
        } catch (error) {
            console.error('Error saving user:', error);
            alert(error.response?.data?.message || 'Error saving user');
        }
    };

    const handleView = (user) => {
        setCurrentUser(user);
        setViewModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/users/delete/${id}`);
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-3xl font-bold text-slate-800">User Management</h2>
                            <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-sm font-bold border border-indigo-100">
                                {filteredUsers.length} Users
                            </span>
                        </div>
                        <p className="text-slate-500 mt-1 text-sm">Manage app users and their balances.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExportExcel}
                        className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-100 active:scale-95"
                    >
                        <Download size={20} />
                        Export Excel
                    </button>
                    {/* <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-100 active:scale-95"
                    >
                        <Plus size={20} />
                        Create User
                    </button> */}
                </div>
            </div>

            <div className="glass p-4 rounded-2xl space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                    {/* Search bar */}
                    <div className="flex items-center gap-4 bg-slate-50/50 p-2 rounded-xl flex-1 min-w-[200px] border border-slate-100">
                        <Search className="text-slate-400 ml-2" size={18} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none focus:ring-0 w-full text-xs py-1"
                        />
                    </div>

                    {/* Filters Row */}
                    <div className="flex flex-wrap items-center gap-2">
                        <select
                            value={filters.country}
                            onChange={(e) => setFilters({ ...filters, country: e.target.value, region: '', city: '' })}
                            className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="">Country</option>
                            {locationData.countries.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                        </select>

                        <select
                            value={filters.region}
                            onChange={(e) => setFilters({ ...filters, region: e.target.value, city: '' })}
                            className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-indigo-100"
                            disabled={!filters.country}
                        >
                            <option value="">Region</option>
                            {filters.country && locationData.countries.find(c => c.name === filters.country)?.regions.map(r => (
                                <option key={r.name} value={r.name}>{r.name}</option>
                            ))}
                        </select>

                        <select
                            value={filters.city}
                            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                            className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-indigo-100"
                            disabled={!filters.region}
                        >
                            <option value="">City</option>
                            {filters.region && locationData.countries.find(c => c.name === filters.country)?.regions.find(r => r.name === filters.region)?.cities.map(ct => (
                                <option key={ct} value={ct}>{ct}</option>
                            ))}
                        </select>

                        <select
                            value={filters.utm}
                            onChange={(e) => setFilters({ ...filters, utm: e.target.value })}
                            className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="">UTM Source</option>
                            {uniqueUtmValues.map(val => (
                                <option key={val} value={val}>{val}</option>
                            ))}
                        </select>

                        <select
                            value={filters.dateRange}
                            onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                            className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-indigo-100"
                        >
                            <option value="">Select Date Range</option>
                            <option value="today">Today</option>
                            <option value="yesterday">Yesterday</option>
                            <option value="week">One Week</option>
                            <option value="month">One Month</option>
                            <option value="year">One Year</option>
                        </select>

                        {(filters.country || filters.region || filters.city || filters.utm || filters.dateRange || searchTerm) && (
                            <button
                                onClick={() => {
                                    setFilters({ country: '', region: '', city: '', utm: '', dateRange: '' });
                                    setSearchTerm('');
                                }}
                                className="flex items-center gap-1 text-red-500 hover:text-red-600 font-bold text-[10px] uppercase px-2"
                            >
                                <XCircle size={14} />
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <Loader2 className="animate-spin mb-4" size={40} />
                        <p className="font-medium">Loading users...</p>
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={filteredUsers}
                        onView={handleView}
                    />
                )}
            </div>

            {/* View Modal */}
            <Modal
                isOpen={viewModalOpen}
                onClose={() => setViewModalOpen(false)}
                title="User Details"
            >
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { label: 'Device ID', value: currentUser?.deviceId },
                            { label: 'Country', value: currentUser?.country },
                            { label: 'City', value: currentUser?.city },
                            { label: 'Region', value: currentUser?.region },
                            { label: 'Coins', value: currentUser?.coins },
                            { label: 'ISP', value: currentUser?.isp },
                            { label: 'Org', value: currentUser?.org },
                            { label: 'App Version', value: currentUser?.appVersion },
                            { label: 'Status', value: currentUser?.isActive ? 'Active' : 'Inactive' },
                            { label: 'Created At', value: currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleString() : 'N/A' },
                        ].map((item, idx) => (
                            <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{item.label}</label>
                                <p className="text-sm font-bold text-slate-700 break-all">{item.value || 'N/A'}</p>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => setViewModalOpen(false)}
                        className="w-full py-3 rounded-xl font-bold bg-slate-800 text-white hover:bg-slate-900 transition-all shadow-lg"
                    >
                        Close Details
                    </button>
                </div>
            </Modal>

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={currentUser ? 'Edit User' : 'Create User'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Device ID</label>
                            <input
                                type="text" required
                                value={formData.deviceId}
                                onChange={(e) => setFormData({ ...formData, deviceId: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-100 focus:bg-white outline-none transition-all"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Country</label>
                                <input
                                    type="text"
                                    value={formData.country || ''}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-100 focus:bg-white outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">City</label>
                                <input
                                    type="text"
                                    value={formData.city || ''}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-100 focus:bg-white outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Region</label>
                                <input
                                    type="text"
                                    value={formData.region || ''}
                                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-100 focus:bg-white outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">App Version</label>
                                <input
                                    type="text"
                                    value={formData.appVersion || ''}
                                    onChange={(e) => setFormData({ ...formData, appVersion: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-100 focus:bg-white outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">ISP</label>
                                <input
                                    type="text"
                                    value={formData.isp || ''}
                                    onChange={(e) => setFormData({ ...formData, isp: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-100 focus:bg-white outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Org</label>
                                <input
                                    type="text"
                                    value={formData.org || ''}
                                    onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-100 focus:bg-white outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Coins</label>
                                <input
                                    type="number"
                                    value={formData.coins}
                                    onChange={(e) => setFormData({ ...formData, coins: Number(e.target.value) })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-100 focus:bg-white outline-none transition-all"
                                />
                            </div>
                            <div className="flex items-end">
                                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-slate-50 transition-colors w-full border border-slate-200">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="w-5 h-5 accent-indigo-600"
                                    />
                                    <span className="text-sm font-bold text-slate-600">Active</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => setModalOpen(false)}
                            className="flex-1 py-3 rounded-xl font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                        >
                            {currentUser ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Users;
