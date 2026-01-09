import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Users, Layers, Grid2X2, TrendingUp, Activity, Smartphone, Coins, CreditCard } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-4 ${color}`}>
            <Icon size={24} />
        </div>
        <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">{title}</p>
        <div className="flex items-end justify-between mt-2">
            <h3 className="text-3xl font-black text-slate-800">{value}</h3>
            {trend && (
                <div className="flex items-center text-emerald-600 text-xs font-bold gap-1 bg-emerald-50 px-2 py-1 rounded-full">
                    <TrendingUp size={12} />
                    <span>{trend}</span>
                </div>
            )}
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        users: 0,
        categories: 0,
        subcategories: 0,
        credits: 0,
        totalCoins: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [u, c, s, cred] = await Promise.all([
                    api.get('/users/all'),
                    api.get('/categories/all'),
                    api.get('/subcategories/all'),
                    api.post('/ai/check-credits')
                ]);

                console.log("🚀 ~ fetchStats ~ cred:", cred.data)
                const totalUserCoins = u.data.reduce((acc, user) => acc + (user.coins || 0), 0);

                setStats({
                    users: u.data.length,
                    categories: c.data.length,
                    subcategories: s.data.length,
                    credits: cred.data.data.gems || 0,
                    totalCoins: totalUserCoins
                });
            } catch (err) {
                console.error('Stats fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-4xl font-black text-slate-800">Admin Overview</h2>
                <p className="text-slate-500 mt-2 font-medium">Welcome back! Here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value={loading ? '...' : stats.users}
                    icon={Users}
                    color="bg-indigo-50 text-indigo-600"
                    trend="+"
                />
                <StatCard
                    title="Categories"
                    value={loading ? '...' : stats.categories}
                    icon={Layers}
                    color="bg-amber-50 text-amber-600"
                    trend="+"
                />
                <StatCard
                    title="Subcategories"
                    value={loading ? '...' : stats.subcategories}
                    icon={Grid2X2}
                    color="bg-purple-50 text-purple-600"
                    trend="+"
                />
                <StatCard
                    title="API Credits"
                    value={loading ? '...' : stats.credits}
                    icon={CreditCard}
                    color="bg-emerald-50 text-emerald-600"
                />
            </div>

            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass p-8 rounded-[2rem]">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Activity className="text-indigo-500" size={24} />
                            System Status
                        </h4>
                    </div>
                    <div className="space-y-4">
                        {[
                            { label: 'API Server', status: 'Online', color: 'bg-emerald-500' },
                            { label: 'Database', status: 'Online', color: 'bg-emerald-500' },
                            { label: 'Cloudinary', status: 'Offline', color: 'bg-red-500' },
                        ].map((sys, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                <span className="font-bold text-slate-600">{sys.label}</span>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${sys.color} animate-pulse`}></div>
                                    <span className="text-sm font-bold text-slate-500">{sys.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass p-8 rounded-[2rem]">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Smartphone className="text-purple-500" size={24} />
                            Recent Signups (Placeholder)
                        </h4>
                    </div>
                    <div className="text-center py-10">
                        <p className="text-slate-400 font-medium">Live activity feed coming soon.</p>
                    </div>
                </div>
            </div> */}
        </div>
    );
};

export default Dashboard;
