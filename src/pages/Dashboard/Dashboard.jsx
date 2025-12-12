import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { useAppContext } from '../../context/AppContext';
import { Truck, CheckCircle, AlertTriangle, Wallet, Wrench, ShieldAlert } from 'lucide-react';
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
    const { state } = useAppContext();

    // Stats
    const activeCount = state.equipment.filter(e => e.status === 'Ativo').length;
    const maintenanceCount = state.equipment.filter(e => e.status === 'Em manutenção').length;
    const rentedCount = state.equipment.filter(e => e.status === 'Locado').length;
    const reserveCount = state.equipment.filter(e => e.status === 'Reserva').length;

    // Financials
    const totalRevenue = state.rentals.reduce((acc, curr) => acc + (parseFloat(curr.value) || 0), 0);
    const totalMaintCost = state.maintenances.reduce((acc, curr) => acc + (parseFloat(curr.cost) || 0), 0);
    const totalDamageCost = state.damages.reduce((acc, curr) => acc + (parseFloat(curr.cost) || 0), 0);

    // Chart Data: Maintenances by Type
    const maintTypes = {};
    state.maintenances.forEach(m => {
        maintTypes[m.type] = (maintTypes[m.type] || 0) + 1;
    });

    const maintChartData = {
        labels: Object.keys(maintTypes).length ? Object.keys(maintTypes) : ['Sem dados'],
        datasets: [{
            data: Object.keys(maintTypes).length ? Object.values(maintTypes) : [1], // Placeholder
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
            borderWidth: 0
        }]
    };

    // Chart Data: Revenue (Mock trend + Real Total)
    const revenueData = {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        datasets: [{
            label: 'Receita',
            data: [15000, 18000, 12000, 22000, 25000, totalRevenue || 30000],
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6, 182, 212, 0.1)',
            tension: 0.4,
            fill: true
        }]
    };

    // Chart Data: Fleet Status
    const statusData = {
        labels: ['Ativo', 'Locado', 'Manutenção', 'Reserva'],
        datasets: [{
            data: [activeCount, rentedCount, maintenanceCount, reserveCount],
            backgroundColor: ['#10b981', '#3b82f6', '#ef4444', '#eab308'],
            borderWidth: 0
        }]
    };

    return (
        <div className="dashboard-container fade-in">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-white">Dashboard Geral</h1>
                <p className="text-gray-400">Visão consolidada da frota.</p>
            </header>

            {/* Stats Grid */}
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                <StatCard title="Total Alugados" value={rentedCount} icon={CheckCircle} color="green" />
                <StatCard title="Em Manutenção" value={maintenanceCount} icon={Wrench} color="red" />
                <StatCard title="Receita (Locação)" value={`R$ ${totalRevenue.toLocaleString()}`} icon={Wallet} color="blue" />
                <StatCard title="Custo (Manut.)" value={`R$ ${totalMaintCost.toLocaleString()}`} icon={AlertTriangle} color="orange" />
                <StatCard title="Custo (Avarias)" value={`R$ ${totalDamageCost.toLocaleString()}`} icon={ShieldAlert} color="purple" />
                <StatCard title="Frota Disponível" value={activeCount + reserveCount} icon={Truck} color="gray" />
            </div>

            {/* Charts Grid */}
            <div className="charts-grid mt-8">
                <div className="chart-card large">
                    <h3>Evolução de Receita</h3>
                    <div style={{ height: '300px' }}>
                        <Line options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { color: '#334155' } }, y: { grid: { color: '#334155' } } } }} data={revenueData} />
                    </div>
                </div>
                <div className="chart-card">
                    <h3>Status da Frota</h3>
                    <div style={{ height: '250px', display: 'flex', justifyContent: 'center' }}>
                        <Doughnut options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#cbd5e1' } } } }} data={statusData} />
                    </div>
                </div>
                <div className="chart-card">
                    <h3>Tipos de Manutenção</h3>
                    <div style={{ height: '250px', display: 'flex', justifyContent: 'center' }}>
                        <Doughnut options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#cbd5e1' } } } }} data={maintChartData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className={`stat-card ${color}`}>
        <div className="icon-box">
            <Icon size={24} />
        </div>
        <div>
            <h3>{title}</h3>
            <p className="value">{value}</p>
        </div>
    </div>
);

export default Dashboard;
