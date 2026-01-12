import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Plus, Search, Loader2 } from 'lucide-react';
import axios from 'axios';
const API_BASE_URL = 'http://localhost:5000';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [mainCategories, setMainCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [formData, setFormData] = useState({ title: '', type: 'image', mainCategory: '' });
    const [imageFile, setImageFile] = useState(null);

    const columns = [
        { key: "sr.no", label: "Sr.No", render: (val, user, index) => <span className="text-slate-400">{index + 1}</span> },
        {
            key: 'imageUrl',
            label: 'Image',
            render: (val) => val ? (
                <img src={val} alt="Category" className="h-10 w-10 rounded-lg object-cover border border-slate-200" />
            ) : (
                <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-[10px] font-bold">NO IMG</div>
            )
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
            const res = await axios.get(`${API_BASE_URL}/api/categories/all`);
            console.log("Categories:", res.data);
            setCategories(res.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
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
                type: category.type || 'image',
                mainCategory: category.mainCategory?._id || category.mainCategory || (mainCategories[0]?._id || '')
            });
        } else {
            setCurrentCategory(null);
            setFormData({
                title: '',
                type: 'image',
                mainCategory: mainCategories[0]?._id || ''
            });
        }
        setImageFile(null);
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('type', formData.type);
            if (imageFile) {
                data.append('image', imageFile);
                console.log('Image file:', imageFile);
            }

            if (currentCategory) {
                const response = await axios.put(`${API_BASE_URL}/api/categories/update/${currentCategory._id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                console.log("Response:", response.data);
            } else {
                const response = await axios.post(`${API_BASE_URL}/api/categories/create`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                console.log("Response:", response.data);
            }
            setModalOpen(false);
            fetchCategories();
        } catch (error) {
            console.error('Error saving category:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await api.delete(`/categories/delete/${id}`);
                fetchCategories();
            } catch (error) {
                console.error('Error deleting category:', error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Categories</h2>
                    <p className="text-slate-500 mt-1 text-sm">Organize prompts into categories.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-100"
                >
                    <Plus size={20} />
                    Create Category
                </button>
            </div>

            <div className="glass p-6 rounded-3xl space-y-6">
                <div className="flex items-center gap-4 bg-slate-50/50 p-2 rounded-2xl w-full max-w-md border border-slate-100">
                    <Search className="text-slate-400 ml-2" size={20} />
                    <input type="text" placeholder="Search categories..." className="bg-transparent border-none focus:ring-0 w-full text-sm py-2" />
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
                    />
                )}
            </div>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={currentCategory ? 'Edit Category' : 'Create Category'}>
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
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-100 focus:bg-white outline-none"
                        />
                        {currentCategory?.imageUrl && !imageFile && (
                            <div className="mt-2">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Current Image:</p>
                                <img src={currentCategory.imageUrl} alt="Current" className="h-20 w-20 rounded-lg object-cover border border-slate-200" />
                            </div>
                        )}
                    </div>
                    <button type="submit" className="w-full py-3 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700">
                        {currentCategory ? 'Update' : 'Create'}
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Categories;
