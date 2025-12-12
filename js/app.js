import { store } from './state.js';
import { renderMaintenance } from './tabs/maintenance.js';
import { renderRentals } from './tabs/rentals.js';
import { renderDamages } from './tabs/damages.js';
import { renderDashboard, updateDashboardStats } from './tabs/dashboard.js';

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    setupNavigation();

    // Initial Render of all tabs (or lazy load)
    renderMaintenance();
    renderRentals();
    renderDamages();
    renderDashboard();

    // Subscribe to state changes to update dashboard real-time
    store.subscribe((state) => {
        updateDashboardStats();
    });
}

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    const pageTitle = document.getElementById('page-title');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all
            navItems.forEach(nav => nav.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.add('hidden'));

            // Add active to clicked
            item.classList.add('active');

            // Show content
            const targetId = item.getAttribute('data-tab');
            document.getElementById(targetId).classList.remove('hidden');

            // Update Title
            pageTitle.textContent = item.querySelector('span').textContent;
        });
    });
}
