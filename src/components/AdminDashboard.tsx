'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, FileText, RefreshCw, Activity, Download } from 'lucide-react';

interface Ticket {
  id: string;
  text: string;
  apartment: string;
  classification: {
    type: string;
    priority: string;
    summary: string;
    object: string;
  };
  status: 'нова' | 'в_роботі' | 'закрита';
  created_at: string;
}

export default function AdminDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/tickets');
      const data = await res.json();
      setTickets(data.tickets);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: Ticket['status']) => {
    await fetch('/api/tickets', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    });
    fetchTickets();
  };

  const getDailyReport = () => {
    const today = new Date().toDateString();
    const todayTickets = tickets.filter(t => new Date(t.created_at).toDateString() === today);
    
    const stats = {
      total: todayTickets.length,
      emergency: todayTickets.filter(t => t.classification.priority === 'високий').length,
      closed: todayTickets.filter(t => t.status === 'закрита').length,
      byType: {} as Record<string, number>
    };

    todayTickets.forEach(t => {
      stats.byType[t.classification.type] = (stats.byType[t.classification.type] || 0) + 1;
    });

    return stats;
  };

  const stats = getDailyReport();

  if (loading) return <div className="p-10 text-center text-xl">Завантаження...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📊 Панель керування ОСББ</h1>
            <p className="text-gray-500 mt-1">Моніторинг заявок в реальному часі</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowReport(!showReport)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
            >
              <FileText size={18} /> {showReport ? 'Сховати звіт' : 'Звіт за день'}
            </button>
            <button 
              onClick={fetchTickets}
              className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {/* Report Section */}
        {showReport && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Download className="text-blue-600" /> Звіт за сьогодні ({new Date().toLocaleDateString()})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">Всього заявок</div>
                <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-sm text-red-600 font-medium">Аварії (Високий пріоритет)</div>
                <div className="text-2xl font-bold text-red-900">{stats.emergency}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600 font-medium">Закрито</div>
                <div className="text-2xl font-bold text-green-900">{stats.closed}</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-600 font-medium">Активність</div>
                <div className="text-2xl font-bold text-purple-900">{stats.total > 0 ? 'Висока' : 'Низька'}</div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <strong>Розподіл по типах:</strong>{' '}
              {Object.entries(stats.byType).map(([type, count]) => (
                <span key={type} className="mr-3 bg-gray-100 px-2 py-1 rounded text-xs">{type}: {count}</span>
              ))}
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Всього заявок</p>
                <p className="text-3xl font-bold">{tickets.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-full text-blue-600"><Activity size={24} /></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">В роботі</p>
                <p className="text-3xl font-bold">{tickets.filter(t => t.status === 'в_роботі').length}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-full text-yellow-600"><Clock size={24} /></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Аварійні</p>
                <p className="text-3xl font-bold text-red-600">{tickets.filter(t => t.classification.priority === 'високий' && t.status !== 'закрита').length}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-full text-red-600"><AlertTriangle size={24} /></div>
            </div>
          </div>
        </div>

        {/* Table with scroll */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col max-h-[70vh]">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
            <h3 className="font-semibold text-gray-900">Список заявок</h3>
          </div>
          
          <div className="overflow-y-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Тип</th>
                  <th className="px-6 py-3">Пріоритет</th>
                  <th className="px-6 py-3">Кв/Об&apos;єкт</th>
                  <th className="px-6 py-3 w-1/3">Опис (AI)</th>
                  <th className="px-6 py-3">Статус</th>
                  <th className="px-6 py-3">Час</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tickets
                  .sort((a, b) => {
                    const priorityOrder = { 'високий': 0, 'середній': 1, 'низький': 2 };
                    const priorityDiff = priorityOrder[a.classification.priority as keyof typeof priorityOrder] - 
                                        priorityOrder[b.classification.priority as keyof typeof priorityOrder];
                    
                    if (priorityDiff !== 0) return priorityDiff;
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                  })
                  .map((ticket) => (
                  <tr 
                    key={ticket.id} 
                    className={`hover:bg-gray-50 transition-colors ${
                      ticket.classification.priority === 'високий' && ticket.status !== 'закрита' 
                        ? 'bg-red-50/50 border-l-4 border-red-500' 
                        : ''
                    }`}
                  >
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{ticket.id.split('-')[1].slice(0, 4)}</td>
                    <td className="px-6 py-4 font-medium capitalize">{ticket.classification.type}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        ticket.classification.priority === 'високий' ? 'bg-red-100 text-red-800' :
                        ticket.classification.priority === 'середній' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {ticket.classification.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium">{ticket.apartment || '—'}</span>
                        <span className="text-xs text-gray-400">{ticket.classification.object}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 truncate max-w-xs" title={ticket.classification.summary}>
                      {ticket.classification.summary}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={ticket.status}
                        onChange={(e) => updateStatus(ticket.id, e.target.value as Ticket['status'])}
                        className={`text-xs font-medium rounded-md border-0 py-1.5 px-2 cursor-pointer focus:ring-2 focus:ring-blue-500 ${
                          ticket.status === 'закрита' ? 'bg-green-100 text-green-800' :
                          ticket.status === 'в_роботі' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <option value="нова">Нова</option>
                        <option value="в_роботі">В роботі</option>
                        <option value="закрита">Закрита</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(ticket.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {tickets.length === 0 && (
            <div className="text-center py-16 text-gray-400 flex-1 flex items-center justify-center">
              <div>
                <CheckCircle className="mx-auto h-12 w-12 mb-3 opacity-50" />
                <p>Заявок поки немає</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}