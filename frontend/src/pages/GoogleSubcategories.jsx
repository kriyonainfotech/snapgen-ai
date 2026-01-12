import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Plus, Search, Loader2 } from 'lucide-react';

const GoogleSubcategories = () => {
    const [subcategories, setSubcategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentSub, setCurrentSub] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        prompt: '',
        category: '',
        type: 'image',
        povId: ''
    });

    const columns = [
        { key: "sr.no", label: "Sr.No", render: (val, user, index) => <span className="text-slate-400">{index + 1}</span> },
        { key: 'title', label: 'Title' },
        {
            key: 'category',
            label: 'Category',
            render: (cat) => cat?.title || 'N/A'
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
                api.get('/google-subcategories/all'),
                api.get('/google-categories/all')
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
            const res = await api.get(`/google-categories/get/${type}`);
            setCategories(res.data);
            return res.data;
        } catch (error) {
            console.error('Error fetching google categories by type:', error);
            return [];
        }
    };

    const handleOpenModal = async (sub = null) => {
        if (sub) {
            const subType = sub.category?.type || 'image';
            const cats = await fetchCategoriesByType(subType);
            setCurrentSub(sub);
            setFormData({
                title: sub.title,
                prompt: sub.prompt,
                category: sub.category?._id || sub.category,
                type: subType,
                povId: sub.povId || ''
            });
        } else {
            const cats = await fetchCategoriesByType('image');
            setCurrentSub(null);
            setFormData({
                title: '',
                prompt: '',
                category: cats[0]?._id || '',
                type: 'image',
                povId: ''
            });
        }
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentSub) {
                await api.put(`/google-subcategories/update/${currentSub._id}`, formData);
            } else {
                await api.post('/google-subcategories/create', formData);
            }
            setModalOpen(false);
            fetchData();
        } catch (error) {
            console.error('Error saving google subcategory:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await api.delete(`/google-subcategories/delete/${id}`);
                fetchData();
            } catch (error) {
                console.error('Error deleting google subcategory:', error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Google Subcategories</h2>
                    <p className="text-slate-500 mt-1 text-sm">Manage Google prompts and their parent categories.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-100"
                >
                    <Plus size={20} />
                    Create Google Subcategory
                </button>
            </div>

            <div className="glass p-6 rounded-3xl space-y-6">
                <div className="flex items-center gap-4 bg-slate-50/50 p-2 rounded-2xl w-full max-w-md border border-slate-100">
                    <Search className="text-slate-400 ml-2" size={20} />
                    <input type="text" placeholder="Search google subcategories..." className="bg-transparent border-none focus:ring-0 w-full text-sm py-2" />
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
                    />
                )}
            </div>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={currentSub ? 'Edit Google Subcategory' : 'Create Google Subcategory'}>
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
                    <button type="submit" className="w-full py-3 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700">
                        {currentSub ? 'Update' : 'Create'}
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default GoogleSubcategories;
