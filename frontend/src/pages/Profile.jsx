import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { User, Mail, Lock, Save, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const Profile = () => {
    const [admin, setAdmin] = useState({ email: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await api.get('/auth/profile');
            setAdmin(res.data);
            setFormData(prev => ({ ...prev, email: res.data.email }));
        } catch (error) {
            console.error('Error fetching profile:', error);
            setMessage({ type: 'error', text: 'Failed to load profile' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password && formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        try {
            setSaving(true);
            setMessage({ type: '', text: '' });

            const updateData = { email: formData.email };
            if (formData.password) {
                updateData.password = formData.password;
            }

            await api.put('/auth/profile', updateData);

            setMessage({ type: 'success', text: 'Profile updated successfully' });
            setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
            fetchProfile();
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to update profile'
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
                <p className="text-slate-500 font-medium">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-slate-800">Admin Profile</h2>
                <p className="text-slate-500 mt-1">Manage your account credentials.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-6">
                    <div className="glass p-6 rounded-3xl flex flex-col items-center text-center">
                        <div className="h-24 w-24 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-4 border-4 border-white shadow-sm">
                            <User size={48} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Administrator</h3>
                        <p className="text-sm text-slate-500">{admin.email}</p>
                        <div className="mt-4 px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-wider">
                            Super Admin
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <form onSubmit={handleSubmit} className="glass p-8 rounded-3xl space-y-6">
                        {message.text && (
                            <div className={`flex items-center gap-3 p-4 rounded-2xl ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                                }`}>
                                {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                                <p className="text-sm font-bold">{message.text}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    <Mail size={14} />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-100 focus:bg-white outline-none transition-all text-slate-700 font-medium"
                                    placeholder="admin@example.com"
                                />
                            </div>

                            <hr className="border-slate-100 my-2" />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                        <Lock size={14} />
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-100 focus:bg-white outline-none transition-all text-slate-700 font-medium"
                                        placeholder="••••••••"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-2 ml-1">Leave blank to keep current password</p>
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                        <Lock size={14} />
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-100 focus:bg-white outline-none transition-all text-slate-700 font-medium"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-100 active:scale-[0.98]"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Updating Profile...
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
