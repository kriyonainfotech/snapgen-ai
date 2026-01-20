import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Plus, Search, Loader2 } from 'lucide-react';

const GoogleCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [formData, setFormData] = useState({ title: '', type: 'image' });
    const [imageFile, setImageFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [viewData, setViewData] = useState(null);

    const columns = [
        { key: "sr.no", label: "Sr.No", render: (val, user, index) => <span className="text-slate-400">{index + 1}</span> },
        {
            key: 'imageUrl',
            label: 'Asset',
            render: (val, row) => {
                if (!val) return <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-[10px] font-bold">NO FILE</div>;
                if (row.type === 'video') {
                    return (
                        <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                            <video src={val} className="h-full w-full object-cover rounded-lg" crossOrigin="anonymous" preload="metadata" />
                        </div>
                    );
                }
                return <img src={val} alt="Category" className="h-10 w-10 rounded-lg object-cover border border-slate-200" />;
            }
        },
        { key: 'title', label: 'Title' },
        {
            key: 'type',
            label: 'Type',
            render: (val) => (
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${val === 'video' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                    {val}
                </span>
            )
        },
        {
            key: 'createdAt',
            label: 'Created At',
            render: (val) => new Date(val).toLocaleDateString()
        },
    ];

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await api.get('/google-categories/all');
            setCategories(res.data);
        } catch (error) {
            console.error('Error fetching google categories:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleOpenModal = (category = null) => {
        if (category) {
            setCurrentCategory(category);
            setFormData({
                title: category.title,
                type: category.type || 'image'
            });
        } else {
            setCurrentCategory(null);
            setFormData({
                title: '',
                type: 'image'
            });
        }
        setImageFile(null);
        setModalOpen(true);
    };

    const handleView = (data) => {
        setViewData(data);
        setViewModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;

        try {
            setSubmitting(true);
            const data = new FormData();
            data.append('title', formData.title);
            data.append('type', formData.type);
            if (imageFile) {
                data.append('image', imageFile);
            }

            if (currentCategory) {
                await api.put(`/google-categories/update/${currentCategory._id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/google-categories/create', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            setModalOpen(false);
            fetchCategories();
        } catch (error) {
            console.error('Error saving google category:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await api.delete(`/google-categories/delete/${id}`);
                fetchCategories();
            } catch (error) {
                console.error('Error deleting google category:', error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Google Categories</h2>
                    <p className="text-slate-500 mt-1 text-sm">Organize Google prompts into categories.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-100"
                >
                    <Plus size={20} />
                    Create Google Category
                </button>
            </div>

            <div className="glass p-6 rounded-3xl space-y-6">
                <div className="flex items-center gap-4 bg-slate-50/50 p-2 rounded-2xl w-full max-w-md border border-slate-100">
                    <Search className="text-slate-400 ml-2" size={20} />
                    <input type="text" placeholder="Search google categories..." className="bg-transparent border-none focus:ring-0 w-full text-sm py-2" />
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="animate-spin mb-4" size={40} />
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={categories}
                        onEdit={handleOpenModal}
                        onDelete={handleDelete}
                        onView={handleView}
                    />
                )}
            </div>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={currentCategory ? 'Edit Google Category' : 'Create Google Category'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Title</label>
                        <input
                            type="text" required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-100 focus:bg-white outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-100 focus:bg-white outline-none"
                        >
                            <option value="image">Image</option>
                            <option value="video">Video</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category Asset ({formData.type})</label>
                        <input
                            type="file"
                            accept={formData.type === 'video' ? 'video/*' : 'image/*'}
                            onChange={(e) => setImageFile(e.target.files[0])}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-100 focus:bg-white outline-none"
                        />
                        {(imageFile || currentCategory?.imageUrl) && (
                            <div className="mt-2 text-center">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Preview:</p>
                                {formData.type === 'video' ? (
                                    <video
                                        src={imageFile ? URL.createObjectURL(imageFile) : currentCategory?.imageUrl}
                                        controls
                                        crossOrigin="anonymous"
                                        preload="metadata"
                                        className="h-32 w-full max-w-[200px] mx-auto rounded-lg object-cover border border-slate-200"
                                    />
                                ) : (
                                    <img
                                        src={imageFile ? URL.createObjectURL(imageFile) : currentCategory?.imageUrl}
                                        alt="Preview"
                                        className="h-20 w-20 mx-auto rounded-lg object-cover border border-slate-200"
                                    />
                                )}
                            </div>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {submitting && <Loader2 className="animate-spin" size={18} />}
                        {currentCategory ? 'Update' : 'Create'}
                    </button>
                </form>
            </Modal>

            <Modal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} title={`View: ${viewData?.title}`}>
                <div className="flex flex-col items-center gap-4">
                    {viewData?.type === 'video' ? (
                        <video
                            src={viewData?.imageUrl}
                            controls
                            autoPlay
                            crossOrigin="anonymous"
                            preload="auto"
                            className="w-full rounded-2xl border border-slate-100 shadow-xl"
                        />
                    ) : (
                        <img
                            src={viewData?.imageUrl}
                            alt={viewData?.title}
                            className="w-full rounded-2xl border border-slate-100 shadow-xl object-contain max-h-[70vh]"
                        />
                    )}
                    <div className="text-center">
                        <h4 className="text-lg font-bold text-slate-800 uppercase tracking-tight">{viewData?.title}</h4>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{viewData?.type}</p>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default GoogleCategories;
