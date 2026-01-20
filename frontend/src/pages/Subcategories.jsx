import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Plus, Search, Loader2 } from 'lucide-react';

const Subcategories = () => {
    const [subcategories, setSubcategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentSub, setCurrentSub] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [viewData, setViewData] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        prompt: '',
        category: '',
        type: 'image',
        povId: '',
        image: ''
    });

    const columns = [
        { key: "sr.no", label: "Sr.No", render: (val, user, index) => <span className="text-slate-400">{index + 1}</span> },
        {
            key: 'image',
            label: 'Asset',
            render: (img, row) => {
                if (!img) return <span className="text-slate-400">No Asset</span>;
                if (row.category?.type === 'video') {
                    return (
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                            <video src={img} className="h-full w-full object-cover rounded-lg" crossOrigin="anonymous" preload="metadata" />
                        </div>
                    );
                }
                return <img src={img} alt="subcategory" className="w-10 h-10 object-cover rounded-lg border border-slate-200" />;
            }
        },
        { key: 'title', label: 'Title' },
        {
            key: 'category',
            label: 'Category',
            render: (cat) => cat?.title || 'N/A'
        },
        {
            key: 'type',
            label: 'Type',
            render: (_, row) => row.category?.type || 'N/A'
        },
        {
            key: 'prompt',
            label: 'Prompt',
            render: (p) => <span className="truncate max-w-xs inline-block">{p}</span>
        },
        { key: 'povId', label: 'POV ID' },
    ];

    const fetchData = async () => {
        try {
            setLoading(true);
            const [subRes, catRes] = await Promise.all([
                api.get('/subcategories/all'),
                api.get('/categories/all')
            ]);
            setSubcategories(subRes.data);
            setCategories(catRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchCategoriesByType = async (type) => {
        try {
            const res = await api.get(`/categories/get/${type}`);
            setCategories(res.data);
            return res.data;
        } catch (error) {
            console.error('Error fetching categories by type:', error);
            return [];
        }
    };

    const handleOpenModal = async (sub = null) => {
        setSelectedImage(null);
        if (sub) {
            const subType = sub.category?.type || 'image';
            const cats = await fetchCategoriesByType(subType);
            setCurrentSub(sub);
            setImagePreview(sub.image || '');
            setFormData({
                title: sub.title,
                prompt: sub.prompt,
                category: sub.category?._id || sub.category,
                type: subType,
                povId: sub.povId || '',
                image: sub.image || ''
            });
        } else {
            const cats = await fetchCategoriesByType('image');
            setCurrentSub(null);
            setImagePreview('');
            setFormData({
                title: '',
                prompt: '',
                category: cats[0]?._id || '',
                type: 'image',
                povId: '',
                image: ''
            });
        }
        setModalOpen(true);
    };

    const handleView = (data) => {
        setViewData(data);
        setViewModalOpen(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;

        try {
            setSubmitting(true);
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });
            if (selectedImage) {
                data.append('image', selectedImage);
            }

            if (currentSub) {
                await api.put(`/subcategories/update/${currentSub._id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/subcategories/create', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            setModalOpen(false);
            fetchData();
        } catch (error) {
            console.error('Error saving subcategory:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await api.delete(`/subcategories/delete/${id}`);
                fetchData();
            } catch (error) {
                console.error('Error deleting subcategory:', error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Subcategories</h2>
                    <p className="text-slate-500 mt-1 text-sm">Manage prompts and their parent categories.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-100"
                >
                    <Plus size={20} />
                    Create Subcategory
                </button>
            </div>

            <div className="glass p-6 rounded-3xl space-y-6">
                <div className="flex items-center gap-4 bg-slate-50/50 p-2 rounded-2xl w-full max-w-md border border-slate-100">
                    <Search className="text-slate-400 ml-2" size={20} />
                    <input type="text" placeholder="Search subcategories..." className="bg-transparent border-none focus:ring-0 w-full text-sm py-2" />
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="animate-spin mb-4" size={40} />
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={subcategories}
                        onEdit={handleOpenModal}
                        onDelete={handleDelete}
                        onView={handleView}
                    />
                )}
            </div>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={currentSub ? 'Edit Subcategory' : 'Create Subcategory'}>
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
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Asset ({formData.type})</label>
                        <input
                            type="file"
                            accept={formData.type === 'video' ? 'video/*' : 'image/*'}
                            onChange={handleImageChange}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-100 focus:bg-white outline-none"
                        />
                        {imagePreview && (
                            <div className="mt-2 text-center">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Preview:</p>
                                {formData.type === 'video' ? (
                                    <video
                                        src={imagePreview}
                                        controls
                                        crossOrigin="anonymous"
                                        preload="metadata"
                                        className="h-32 w-full max-w-[200px] mx-auto rounded-lg object-cover border border-slate-200"
                                    />
                                ) : (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="h-20 w-20 mx-auto rounded-lg object-cover border border-slate-200"
                                    />
                                )}
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Type</label>
                        <select
                            required
                            value={formData.type}
                            onChange={async (e) => {
                                const newType = e.target.value;
                                setFormData({ ...formData, type: newType, category: '' });
                                const cats = await fetchCategoriesByType(newType);
                                if (cats.length > 0) {
                                    setFormData(prev => ({ ...prev, type: newType, category: cats[0]._id }));
                                }
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-100 focus:bg-white outline-none"
                        >
                            <option value="image">Image</option>
                            <option value="video">Video</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                        <select
                            required
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-100 focus:bg-white outline-none"
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat._id}>{cat.title}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Prompt</label>
                        <textarea
                            required rows={4}
                            value={formData.prompt}
                            onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-100 focus:bg-white outline-none resize-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">POV ID</label>
                        <input
                            type="text"
                            value={formData.povId}
                            onChange={(e) => setFormData({ ...formData, povId: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-100 focus:bg-white outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {submitting && <Loader2 className="animate-spin" size={18} />}
                        {currentSub ? 'Update' : 'Create'}
                    </button>
                </form>
            </Modal>

            <Modal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} title={`View: ${viewData?.title}`}>
                <div className="flex flex-col items-center gap-4 text-center">
                    {viewData?.category?.type === 'video' ? (
                        <video
                            src={viewData?.image}
                            controls
                            autoPlay
                            crossOrigin="anonymous"
                            preload="auto"
                            className="w-full rounded-2xl border border-slate-100 shadow-xl"
                        />
                    ) : (
                        <img
                            src={viewData?.image}
                            alt={viewData?.title}
                            className="w-full rounded-2xl border border-slate-100 shadow-xl object-contain max-h-[70vh]"
                        />
                    )}
                    <div className="space-y-1">
                        <h4 className="text-lg font-bold text-slate-800 uppercase tracking-tight">{viewData?.title}</h4>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{viewData?.category?.title} | {viewData?.category?.type}</p>
                    </div>
                    {viewData?.prompt && (
                        <div className="w-full bg-slate-50 p-4 rounded-xl text-left border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Prompt</p>
                            <p className="text-xs text-slate-600 font-medium leading-relaxed">{viewData.prompt}</p>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default Subcategories;
