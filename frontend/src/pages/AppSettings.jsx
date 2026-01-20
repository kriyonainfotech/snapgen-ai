import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Modal from '../components/Modal';
import { Save, Plus, Trash2, Upload, Loader2, Image as ImageIcon, Shield, Lock, Key, Edit, Mail, UserPlus, Eye, EyeOff } from 'lucide-react';

const AppSettings = () => {
    const [settings, setSettings] = useState({
        onboarding: [],
        carouselBanners: [],
        removeBgToolImage: '',
        imageUpscalerToolImage: '',
        faceSwapToolImage: '',
        undressImageToolImage: '',
        undressVideoToolImage: '',
        undressImageIntroBeforeImage: '',
        undressImageIntroAfterImage: '',
        IntroImageToVideo: '',
        faceSwapApiUrl: '',
        faceSwapApiKeys: [],
        briaApiUrl: '',
        briaApiKeys: []
    });
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [previews, setPreviews] = useState({});

    // Admin Modal states
    const [adminModalOpen, setAdminModalOpen] = useState(false);
    const [currentAdmin, setCurrentAdmin] = useState(null);
    const [adminFormData, setAdminFormData] = useState({ email: '', password: '' });
    const [submittingAdmin, setSubmittingAdmin] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const [settingsRes, adminsRes] = await Promise.all([
                api.get('/app-settings'),
                api.get('/auth/admins')
            ]);
            setSettings(settingsRes.data);
            setAdmins(adminsRes.data);
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleAddRow = (section) => {
        const newRow = { headline: '', description: '', image: '' };
        setSettings({ ...settings, [section]: [...settings[section], newRow] });
    };

    const handleRemoveRow = (section, index) => {
        const updated = settings[section].filter((_, i) => i !== index);
        setSettings({ ...settings, [section]: updated });
    };

    const handleInputChange = (section, index, field, value) => {
        const updated = [...settings[section]];
        updated[index][field] = value;
        setSettings({ ...settings, [section]: updated });
    };

    const handleFileChange = (e, fieldname, index = null, section = null) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const previewKey = section ? `${section}-${index}` : fieldname;
            setPreviews(prev => ({ ...prev, [previewKey]: reader.result }));
        };
        reader.readAsDataURL(file);

        // Store file target for submission
        if (!window.uploadFiles) window.uploadFiles = {};
        const key = section ? `${section}[${index}][image]` : fieldname;
        window.uploadFiles[key] = file;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const formData = new FormData();

            // Append JSON data
            formData.append('onboarding', JSON.stringify(settings.onboarding));
            formData.append('carouselBanners', JSON.stringify(settings.carouselBanners));
            formData.append('faceSwapApiUrl', settings.faceSwapApiUrl);
            formData.append('faceSwapApiKeys', JSON.stringify(settings.faceSwapApiKeys));
            formData.append('briaApiUrl', settings.briaApiUrl);
            formData.append('briaApiKeys', JSON.stringify(settings.briaApiKeys));

            // Append files
            if (window.uploadFiles) {
                Object.keys(window.uploadFiles).forEach(key => {
                    formData.append(key, window.uploadFiles[key]);
                });
            }

            const response = await api.post('/app-settings/update', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setSettings(response.data);
            setPreviews({});
            window.uploadFiles = {};
            alert('Settings updated successfully!');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const handleOpenAdminModal = (admin = null) => {
        if (admin) {
            setCurrentAdmin(admin);
            setAdminFormData({ email: admin.email, password: '' });
        } else {
            setCurrentAdmin(null);
            setAdminFormData({ email: '', password: '' });
        }
        setShowPassword(false);
        setAdminModalOpen(true);
    };

    const handleAdminSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmittingAdmin(true);
            if (currentAdmin) {
                // Update existing admin
                const data = { email: adminFormData.email };
                if (adminFormData.password) data.password = adminFormData.password;
                await api.put(`/auth/admins/${currentAdmin._id}`, data);
                alert('Admin updated successfully!');
            } else {
                // Create new admin
                await api.post('/auth/admins', adminFormData);
                alert('Admin created successfully!');
            }
            setAdminModalOpen(false);
            const adminsRes = await api.get('/auth/admins');
            setAdmins(adminsRes.data);
        } catch (error) {
            console.error('Error saving admin:', error);
            alert(error.response?.data?.message || 'Failed to save admin');
        } finally {
            setSubmittingAdmin(false);
        }
    };

    const handleAdminDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this admin?')) {
            try {
                await api.delete(`/auth/admins/${id}`);
                alert('Admin deleted successfully!');
                const adminsRes = await api.get('/auth/admins');
                setAdmins(adminsRes.data);
            } catch (error) {
                console.error('Error deleting admin:', error);
                alert(error.response?.data?.message || 'Failed to delete admin');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
                <p className="text-slate-500 font-medium">Loading settings...</p>
            </div>
        );
    }

    return (
        <div className="max-w-full space-y-4 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">App Settings</h2>
                    <p className="text-slate-400 mt-0.5 text-xs">Manage onboarding, banners, and tool assets.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleOpenAdminModal()}
                        className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-600 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:bg-indigo-100 shadow-sm"
                    >
                        <UserPlus size={18} />
                        Add Admin
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-100"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </div>

            {/* Admin Management Section */}
            <section className="glass p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Shield className="text-indigo-600" size={20} />
                            Manage Admins
                        </h3>
                        <p className="text-xs text-slate-500">View total admins and manage credentials.</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="py-2 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sr.No</th>
                                <th className="py-2 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</th>
                                <th className="py-2 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {admins.map((admin, index) => (
                                <tr key={admin._id} className="border-b border-slate-50 group hover:bg-slate-50/50 transition-colors">
                                    <td className="py-2 px-4 text-xs text-slate-400 font-medium">{index + 1}</td>
                                    <td className="py-2 px-4 text-xs text-slate-600 font-bold">{admin.email}</td>
                                    <td className="py-2 px-4">
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleOpenAdminModal(admin)}
                                                className="flex items-center gap-1.5 text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-all"
                                                title="Edit Admin"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleAdminDelete(admin._id)}
                                                className="flex items-center gap-1.5 text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                                                title="Delete Admin"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Onboarding Section */}
            <section className="glass p-5 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Onboarding Screens</h3>
                        <p className="text-sm text-slate-500">Initial screens shown to new users.</p>
                    </div>
                    <button
                        onClick={() => handleAddRow('onboarding')}
                        className="flex items-center gap-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl text-sm font-bold transition-all"
                    >
                        <Plus size={18} />
                        Add Screen
                    </button>
                </div>

                <div className="grid gap-4">
                    {settings.onboarding.map((item, index) => (
                        <div key={index} className="flex flex-col md:flex-row gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 relative group">
                            <button
                                onClick={() => handleRemoveRow('onboarding', index)}
                                className="absolute -top-2 -right-2 bg-white text-red-500 p-2 rounded-full shadow-md hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 size={16} />
                            </button>

                            <div className="w-full md:w-1/3 flex flex-col gap-2">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Screen Image</label>
                                <div className="relative aspect-video bg-white rounded-xl border-2 border-dashed border-slate-200 overflow-hidden group/img">
                                    {(previews[`onboarding-${index}`] || item.image) ? (
                                        <img src={previews[`onboarding-${index}`] || item.image} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                            <ImageIcon size={32} strokeWidth={1.5} />
                                        </div>
                                    )}
                                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                        <Upload className="text-white" size={24} />
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, null, index, 'onboarding')} />
                                    </label>
                                </div>
                            </div>

                            <div className="flex-1 space-y-3">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Headline</label>
                                    <input
                                        type="text"
                                        value={item.headline}
                                        onChange={(e) => handleInputChange('onboarding', index, 'headline', e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
                                        placeholder="Enter headline..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Description</label>
                                    <textarea
                                        value={item.description}
                                        onChange={(e) => handleInputChange('onboarding', index, 'description', e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none text-sm"
                                        rows={2}
                                        placeholder="Enter description..."
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Banners Section */}
            <section className="glass p-5 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Carousel Banners</h3>
                        <p className="text-sm text-slate-500">Promotions shown in the carousel.</p>
                    </div>
                    <button
                        onClick={() => handleAddRow('carouselBanners')}
                        className="flex items-center gap-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl text-sm font-bold transition-all"
                    >
                        <Plus size={18} />
                        Add Banner
                    </button>
                </div>

                <div className="grid gap-4">
                    {settings.carouselBanners.map((item, index) => (
                        <div key={index} className="flex flex-col md:flex-row gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 relative group">
                            <button
                                onClick={() => handleRemoveRow('carouselBanners', index)}
                                className="absolute -top-2 -right-2 bg-white text-red-500 p-2 rounded-full shadow-md hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 size={16} />
                            </button>

                            <div className="w-full md:w-1/3 flex flex-col gap-2">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Banner Image</label>
                                <div className="relative aspect-video bg-white rounded-xl border-2 border-dashed border-slate-200 overflow-hidden group/img">
                                    {(previews[`carouselBanners-${index}`] || item.image) ? (
                                        <img src={previews[`carouselBanners-${index}`] || item.image} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                            <ImageIcon size={32} strokeWidth={1.5} />
                                        </div>
                                    )}
                                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                        <Upload className="text-white" size={24} />
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, null, index, 'carouselBanners')} />
                                    </label>
                                </div>
                            </div>

                            <div className="flex-1 space-y-3">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Headline</label>
                                    <input
                                        type="text"
                                        value={item.headline}
                                        onChange={(e) => handleInputChange('carouselBanners', index, 'headline', e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
                                        placeholder="Enter headline..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Description</label>
                                    <textarea
                                        value={item.description}
                                        onChange={(e) => handleInputChange('carouselBanners', index, 'description', e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none text-sm"
                                        rows={2}
                                        placeholder="Enter description..."
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Tools Section */}
            <section className="glass p-5 rounded-3xl space-y-4">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Tool Icons</h3>
                    <p className="text-sm text-slate-500">Main icons used for various tools.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {[
                        { key: 'removeBgToolImage', label: 'Remove BG' },
                        { key: 'imageUpscalerToolImage', label: 'Upscaler' },
                        { key: 'faceSwapToolImage', label: 'Face Swap' },
                        { key: 'undressImageToolImage', label: 'Undress Img' },
                        { key: 'undressVideoToolImage', label: 'Undress Vid' },
                        { key: 'undressImageIntroBeforeImage', label: 'Undress Intro Before' },
                        { key: 'undressImageIntroAfterImage', label: 'Undress Intro After' },
                        { key: 'IntroImageToVideo', label: 'Intro Img To Vid', type: 'video' }
                    ].map((tool) => (
                        <div key={tool.key} className="space-y-3 p-3 bg-slate-50/50 rounded-2xl border border-slate-100 group">
                            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center">{tool.label}</label>
                            <div className="relative aspect-square w-20 mx-auto bg-white rounded-xl border-2 border-dashed border-slate-200 overflow-hidden group/img shadow-sm hover:border-indigo-300 transition-colors">
                                {(previews[tool.key] || settings[tool.key]) ? (
                                    tool.type === 'video' ? (
                                        <video
                                            src={previews[tool.key] || settings[tool.key]}
                                            className="w-full h-full object-contain p-2"
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                        />
                                    ) : (
                                        <img src={previews[tool.key] || settings[tool.key]} alt="Tool" className="w-full h-full object-contain p-4" />
                                    )
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                        <ImageIcon size={24} strokeWidth={1.5} />
                                    </div>
                                )}
                                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                    <Upload className="text-white" size={20} />
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept={tool.type === 'video' ? "video/*" : "image/*"}
                                        onChange={(e) => handleFileChange(e, tool.key)}
                                    />
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* API Configuration Section */}
            <section className="glass p-5 rounded-3xl space-y-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Key className="text-indigo-600" size={24} />
                        API Configuration
                    </h3>
                    <p className="text-sm text-slate-500">Manage external service URLs and API keys.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Face Swap API */}
                    <div className="space-y-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                        <h4 className="font-bold text-slate-700 flex items-center gap-2">
                            FaceSwap Service
                        </h4>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">API URL</label>
                                <input
                                    type="text"
                                    value={settings.faceSwapApiUrl}
                                    onChange={(e) => setSettings({ ...settings, faceSwapApiUrl: e.target.value })}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
                                    placeholder="https://api..."
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">API Keys</label>
                                    <button
                                        onClick={() => setSettings({ ...settings, faceSwapApiKeys: [...settings.faceSwapApiKeys, ''] })}
                                        className="text-indigo-600 hover:text-indigo-700 text-xs font-bold flex items-center gap-1"
                                    >
                                        <Plus size={14} /> Add Key
                                    </button>
                                </div>
                                {settings.faceSwapApiKeys.map((key, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={key}
                                            onChange={(e) => {
                                                const updated = [...settings.faceSwapApiKeys];
                                                updated[idx] = e.target.value;
                                                setSettings({ ...settings, faceSwapApiKeys: updated });
                                            }}
                                            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
                                            placeholder="Enter API key..."
                                        />
                                        <button
                                            onClick={() => {
                                                const updated = settings.faceSwapApiKeys.filter((_, i) => i !== idx);
                                                setSettings({ ...settings, faceSwapApiKeys: updated });
                                            }}
                                            className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bria API */}
                    <div className="space-y-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                        <h4 className="font-bold text-slate-700 flex items-center gap-2">
                            Bria Service (Remove BG)
                        </h4>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">API URL</label>
                                <input
                                    type="text"
                                    value={settings.briaApiUrl}
                                    onChange={(e) => setSettings({ ...settings, briaApiUrl: e.target.value })}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
                                    placeholder="https://api..."
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">API Keys</label>
                                    <button
                                        onClick={() => setSettings({ ...settings, briaApiKeys: [...settings.briaApiKeys, ''] })}
                                        className="text-indigo-600 hover:text-indigo-700 text-xs font-bold flex items-center gap-1"
                                    >
                                        <Plus size={14} /> Add Key
                                    </button>
                                </div>
                                {settings.briaApiKeys.map((key, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={key}
                                            onChange={(e) => {
                                                const updated = [...settings.briaApiKeys];
                                                updated[idx] = e.target.value;
                                                setSettings({ ...settings, briaApiKeys: updated });
                                            }}
                                            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
                                            placeholder="Enter API key..."
                                        />
                                        <button
                                            onClick={() => {
                                                const updated = settings.briaApiKeys.filter((_, i) => i !== idx);
                                                setSettings({ ...settings, briaApiKeys: updated });
                                            }}
                                            className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Admin Management Modal */}
            <Modal
                isOpen={adminModalOpen}
                onClose={() => setAdminModalOpen(false)}
                title={currentAdmin ? `Edit Admin: ${currentAdmin.email}` : 'Add New Admin'}
            >
                <form onSubmit={handleAdminSubmit} className="space-y-6 pt-2">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="email"
                                    required
                                    value={adminFormData.email}
                                    onChange={(e) => setAdminFormData({ ...adminFormData, email: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-10 py-2.5 focus:ring-4 focus:ring-indigo-100 focus:bg-white outline-none transition-all text-sm font-medium"
                                    placeholder="admin@example.com"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                {currentAdmin ? 'New Password (leave blank to keep)' : 'Password'}
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required={!currentAdmin}
                                    value={adminFormData.password}
                                    onChange={(e) => setAdminFormData({ ...adminFormData, password: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-10 py-2.5 focus:ring-4 focus:ring-indigo-100 focus:bg-white outline-none transition-all text-sm font-medium"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={submittingAdmin}
                        className="w-full py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
                    >
                        {submittingAdmin ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {submittingAdmin ? 'Saving...' : (currentAdmin ? 'Update Admin' : 'Create Admin')}
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default AppSettings;
