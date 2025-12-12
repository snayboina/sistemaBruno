import React from 'react';
import { NavLink } from 'react-router-dom';
import { Truck, PieChart, Wrench, FileText, AlertTriangle, LogOut } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import './Sidebar.css';

const Sidebar = () => {
    const { logout, state } = useAppContext();
    const user = state.user || { name: 'Guest', role: 'Viewer' };

    return (
        <nav className="sidebar">
            <div className="logo-area">
                <Truck size={28} className="text-primary" />
                <h2>Frota<span>Pro</span></h2>
            </div>

            <ul className="nav-links">
                <li>
                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        <PieChart size={20} />
                        <span>Visão Geral</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/maintenance" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        <Wrench size={20} />
                        <span>Manutenção</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/rentals" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        <FileText size={20} />
                        <span>Locações</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/damages" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        <AlertTriangle size={20} />
                        <span>Avarias</span>
                    </NavLink>
                </li>
            </ul>

            <div className="sidebar-footer">
                <div className="user-profile">
                    <div className="avatar">AD</div>
                    <div className="user-info">
                        <p className="name">{user.name}</p>
                        <p className="role">{user.role}</p>
                    </div>
                </div>
                <button onClick={logout} className="logout-btn" title="Sair">
                    <LogOut size={20} />
                </button>
            </div>
        </nav>
    );
};

export default Sidebar;
