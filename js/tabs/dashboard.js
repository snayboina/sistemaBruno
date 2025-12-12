import { store } from '../state.js';
import { formatCurrency } from '../utils.js';

let revenueChartInstance = null;
let statusChartInstance = null;

export function renderDashboard() {
    // Initial Render
    updateDashboardStats();
    initCharts();

    // Re-render charts when data changes (simple approach: destroy and rebuild)
    store.subscribe(() => {
        updateDashboardStats();
        updateCharts();
    });
}

export function updateDashboardStats() {
    const state = store.state;

    // 1. Status Counts
    const activeCount = state.equipment.filter(e => e.status === 'Ativo').length;
    const maintenanceCount = state.equipment.filter(e => e.status === 'Em manutenção').length;
    const rentedCount = state.rentals.filter(r => r.status === 'Ativo').length;

    // 2. Financials
    const totalRevenue = state.rentals.reduce((acc, curr) => acc + (curr.value || 0), 0);
    // Maintenance Costs (All time for now, or filter by month if needed)
    const totalMaintenanceCost = state.maintenances.reduce((acc, curr) => acc + (curr.cost || 0), 0);

    // Update DOM Elements
    const elActive = document.getElementById('dash-active-fleet');
    const elRented = document.getElementById('dash-rented-today');
    const elMaint = document.getElementById('dash-maintenance');
    const elRev = document.getElementById('dash-revenue');

    if (elActive) elActive.textContent = activeCount;
    if (elRented) elRented.textContent = rentedCount;
    if (elMaint) elMaint.textContent = maintenanceCount;
    if (elRev) elRev.textContent = formatCurrency(totalRevenue);
}

function initCharts() {
    // We only init if they don't exist
    if (!revenueChartInstance) {
        const ctxRevenue = document.getElementById('revenueChart')?.getContext('2d');
        if (ctxRevenue) {
            revenueChartInstance = new Chart(ctxRevenue, {
                type: 'line',
                data: getRevenueChartData(),
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }
                    }
                }
            });
        }
    }

    if (!statusChartInstance) {
        const ctxStatus = document.getElementById('statusChart')?.getContext('2d');
        if (ctxStatus) {
            statusChartInstance = new Chart(ctxStatus, {
                type: 'doughnut',
                data: getStatusChartData(),
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'right', labels: { color: '#f8fafc' } }
                    },
                    borderWidth: 0
                }
            });
        }
    }
}

function updateCharts() {
    if (revenueChartInstance) {
        revenueChartInstance.data = getRevenueChartData();
        revenueChartInstance.update();
    }
    if (statusChartInstance) {
        statusChartInstance.data = getStatusChartData();
        statusChartInstance.update();
    }
}

function getRevenueChartData() {
    // Mocking monthly data distribution based on total revenue for demo
    // In a real app, we would group `store.state.rentals` by month
    const total = store.state.rentals.reduce((acc, curr) => acc + (curr.value || 0), 0);

    // Distribute total somewhat randomly for the "Last 6 Months" visual
    const m6 = total * 0.1;
    const m5 = total * 0.15;
    const m4 = total * 0.1;
    const m3 = total * 0.2;
    const m2 = total * 0.25;
    const m1 = total * 0.2;

    return {
        labels: ['Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        datasets: [{
            label: 'Receita (R$)',
            data: [m6, m5, m4, m3, m2, m1],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#3b82f6'
        }]
    };
}

function getStatusChartData() {
    const state = store.state;
    const active = state.equipment.filter(e => e.status === 'Ativo').length;
    const maintenance = state.equipment.filter(e => e.status === 'Em manutenção').length;
    const reserve = state.equipment.filter(e => e.status === 'Reserva').length;

    return {
        labels: ['Ativo', 'Manutenção', 'Reserva'],
        datasets: [{
            data: [active, maintenance, reserve],
            backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
            borderWidth: 0,
            hoverOffset: 4
        }]
    };
}
