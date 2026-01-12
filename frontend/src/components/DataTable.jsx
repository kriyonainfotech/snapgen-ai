import React from 'react';
import { Edit2, Trash2, Eye } from 'lucide-react';

const DataTable = ({ columns, data, onEdit, onDelete, onView }) => {
    return (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-slate-100">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key} className="px-3 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                {col.label}
                            </th>
                        ))}
                        <th className="px-3 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {data.length > 0 ? (
                        data.map((row, index) => (
                            <tr key={row._id} className="hover:bg-slate-50 transition-colors group">
                                {columns.map((col) => (
                                    <td key={col.key} className="px-3 py-2 text-xs text-slate-600 font-medium">
                                        {col.render ? col.render(row[col.key], row, index) : row[col.key]}
                                    </td>
                                ))}
                                <td className="px-3 py-2 text-right space-x-1 whitespace-nowrap">
                                    {onView && (
                                        <button onClick={() => onView(row)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                                            <Eye size={16} />
                                        </button>
                                    )}
                                    {onEdit && (
                                        <button onClick={() => onEdit(row)} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all">
                                            <Edit2 size={16} />
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button onClick={() => onDelete(row._id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length + 1} className="px-3 py-8 text-center text-slate-400 font-medium text-sm">
                                No data available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
