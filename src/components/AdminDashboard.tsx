'use client';

import { useEffect, useState } from 'react';
import { 
  AlertTriangle, 
  Activity, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Loader2,
  FileText,
  Download
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip
} from 'recharts';

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
    const interval = setInterval(fetchTickets, 10000);
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

  // Генерація звіту за день
  const generateDailyReport = () => {
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

  // Статистика для графіків
  const today = new Date().toDateString();
  const todayTickets = tickets.filter(t => new Date(t.created_at).toDateString() === today);

  const typeData = Object.values(
    todayTickets.reduce((acc, t) => {
      acc[t.classification.type] = acc[t.classification.type] || { name: t.classification.type, value: 0 };
      acc[t.classification.type].value++;
      return acc;
    }, {} as Record<string, { name: string; value: number }>)
  );

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const stats = getDailyStats();

  function getDailyStats() {
    return {
      total: tickets.length,
      active: tickets.filter(t => t.status === 'в_роботі').length,
      urgent: tickets.filter(t => t.classification.priority === 'високий' && t.status !== 'закрита').length,
      closed: tickets.filter(t => t.status === 'закрита').length,
    };
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 text-gray-800 font-sans p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
              Панель <span className="text-blue-600">ОСББ</span>
            </h1>
            <p className="text-gray-500 mt-2 font-medium">AI-асистент керування заявками</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowReport(!showReport)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition shadow-sm"
            >
              <FileText size={18} className="text-blue-600" />
              {showReport ? 'Сховати звіт' : 'Звіт за день'}
            </button>
            <button 
              onClick={fetchTickets}
              className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition shadow-sm"
            >
              <Activity className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* REPORT SECTION */}
        {showReport && (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Download className="text-blue-600" /> 
              Звіт за сьогодні ({new Date().toLocaleDateString('uk-UA')})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="text-sm text-blue-600 font-medium">Всього заявок</div>
                <div className="text-2xl font-bold text-blue-900">{generateDailyReport().total}</div>
              </div>
              <div className="bg-red-50 p-4 rounded-xl">
                <div className="text-sm text-red-600 font-medium">Аварії (Високий пріоритет)</div>
                <div className="text-2xl font-bold text-red-900">{generateDailyReport().emergency}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <div className="text-sm text-green-600 font-medium">Закрито</div>
                <div className="text-2xl font-bold text-green-900">{generateDailyReport().closed}</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl">
                <div className="text-sm text-purple-600 font-medium">Активність</div>
                <div className="text-2xl font-bold text-purple-900">
                  {generateDailyReport().total > 0 ? 'Висока' : 'Низька'}
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <strong>Розподіл по типах:</strong>{' '}
              {Object.entries(generateDailyReport().byType).map(([type, count]) => (
                <span key={type} className="mr-3 bg-gray-100 px-3 py-1 rounded-lg text-xs font-medium">
                  {type}: {count}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* METRICS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Всього заявок" 
            value={stats.total} 
            icon={<Activity className="text-blue-500" />} 
            trend="+12%" 
            color="bg-blue-50"
          />
          <StatCard 
            title="В роботі" 
            value={stats.active} 
            icon={<Clock className="text-yellow-500" />} 
            trend="Активно" 
            color="bg-yellow-50"
          />
          <StatCard 
            title="Увага!" 
            value={stats.urgent} 
            icon={<AlertTriangle className="text-red-500" />} 
            trend="Критично" 
            color="bg-red-50"
            alert={stats.urgent > 0}
          />
          <StatCard 
            title="Закрито" 
            value={stats.closed} 
            icon={<CheckCircle2 className="text-green-500" />} 
            trend="+5%" 
            color="bg-green-50"
          />
        </div>

        {/* ANALYTICS SECTION (компактна) */}
        {todayTickets.length > 0 && (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Аналітика за сьогодні
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {typeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold text-gray-800">{todayTickets.length}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 content-center">
                {typeData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2 text-sm bg-gray-100 px-3 py-2 rounded-lg">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="capitalize text-gray-700 font-medium">{entry.name}</span>
                    <span className="text-gray-500">({entry.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FULL-WIDTH TABLE */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 bg-white/40 flex justify-between items-center">
            <h3 className="font-bold text-gray-800 text-lg">Останні заявки</h3>
            <button onClick={fetchTickets} className="p-2 hover:bg-gray-100 rounded-lg transition">
              <Activity className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="overflow-y-auto max-h-[600px]">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 sticky top-0 z-10 backdrop-blur-md">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Заявка</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Пріоритет</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">AI Тип</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tickets
                  .sort((a, b) => {
                    const p = { 'високий': 0, 'середній': 1, 'низький': 2 };
                    return (p[a.classification.priority as keyof typeof p] || 3) - (p[b.classification.priority as keyof typeof p] || 3);
                  })
                  .map((ticket) => (
                  <tr key={ticket.id} className="group hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                          ticket.classification.priority === 'високий' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'
                        }`}>
                          #{ticket.id.split('-')[1].slice(-4)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {ticket.classification.summary}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Квартира: <span className="font-mono font-medium">{ticket.apartment || '—'}</span> • {ticket.classification.object}
                          </p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <PriorityBadge priority={ticket.classification.priority} />
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                        🤖 {ticket.classification.type}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={ticket.status}
                        onChange={(e) => updateStatus(ticket.id, e.target.value as Ticket['status'])}
                        className={`text-xs font-semibold py-1.5 pl-3 pr-8 rounded-lg border-0 cursor-pointer focus:ring-2 focus:ring-blue-500 appearance-none bg-no-repeat bg-[right_0.5rem_center] bg-[length:1em_1em] ${
                          ticket.status === 'закрита' ? 'bg-green-50 text-green-700' :
                          ticket.status === 'в_роботі' ? 'bg-yellow-50 text-yellow-700' :
                          'bg-gray-50 text-gray-600'
                        }`}
                        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")` }}
                      >
                        <option value="нова">Нова</option>
                        <option value="в_роботі">В роботі</option>
                        <option value="закрита">Закрита</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {tickets.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <CheckCircle2 className="w-12 h-12 mb-3 opacity-20" />
                <p>Немає активних заявок</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function StatCard({ title, value, icon, trend, color, alert }: any) {
  return (
    <div className={`relative overflow-hidden p-6 rounded-2xl border border-white/50 shadow-sm transition-all hover:shadow-md ${color}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl bg-white shadow-sm`}>
          {icon}
        </div>
        {alert && (
          <span className="animate-pulse inline-flex h-3 w-3 rounded-full bg-red-500"></span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className="flex items-baseline gap-2 mt-1">
          <p className="text-3xl font-extrabold text-gray-900">{value}</p>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
             alert ? 'bg-red-100 text-red-700' : 'bg-white/50 text-gray-600'
          }`}>
            {trend}
          </span>
        </div>
      </div>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles = {
    'високий': 'bg-red-100 text-red-700 border-red-200',
    'середній': 'bg-amber-100 text-amber-700 border-amber-200',
    'низький': 'bg-green-100 text-green-700 border-green-200',
  };
  const style = styles[priority as keyof typeof styles] || styles['низький'];
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${style}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        priority === 'високий' ? 'bg-red-500' : priority === 'середній' ? 'bg-amber-500' : 'bg-green-500'
      }`} />
      {priority}
    </span>
  );
}