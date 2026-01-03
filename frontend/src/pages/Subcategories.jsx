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
    const [formData, setFormData] = useState({
        title: '',
        prompt: '',
        category: ''
    });

    const columns = [
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

    const handleOpenModal = (sub = null) => {
        if (sub) {
            setCurrentSub(sub);
            setFormData({
                title: sub.title,
                prompt: sub.prompt,
                category: sub.category?._id || sub.category
            });
        } else {
            setCurrentSub(null);
            setFormData({
                title: '',
                prompt: '',
                category: categories[0]?._id || ''
            });
        }
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentSub) {
                await api.put(`/subcategories/update/${currentSub._id}`, formData);
            } else {
                await api.post('/subcategories/create', formData);
            }
            setModalOpen(false);
            fetchData();
        } catch (error) {
            console.error('Error saving subcategory:', error);
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
                    <button type="submit" className="w-full py-3 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700">
                        {currentSub ? 'Update' : 'Create'}
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Subcategories;
