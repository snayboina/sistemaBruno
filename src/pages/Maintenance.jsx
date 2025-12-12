import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, Wrench, Truck, Calendar, DollarSign, PenTool as Tool } from 'lucide-react';
import './Maintenance.css';

const Maintenance = () => {
    const { state, addEquipment, addMaintenance } = useAppContext();
    const [activeTab, setActiveTab] = useState('equipment'); // 'equipment' or 'maintenance'

    // Equipment Form State
    const [eqForm, setEqForm] = useState({ type: 'Caminhão', model: '', plate: '', year: '', status: 'Ativo', odometer: '' });

    // Maintenance Form State
    const [maintForm, setMaintForm] = useState({ equipmentId: '', type: 'Preventiva', dateIn: '', dateOut: '', cost: '', description: '', provider: '' });

    // Computed Stats for Maintenance Tab
    const totalMaintCost = state.maintenances.reduce((acc, curr) => acc + (parseFloat(curr.cost) || 0), 0);
    const activeMaintenances = state.maintenances.filter(m => !m.dateOut).length;

    const handleEqSubmit = (e) => {
        e.preventDefault();
        addEquipment({ ...eqForm, id: `EQ-${Date.now()}` });
        setEqForm({ type: 'Caminhão', model: '', plate: '', year: '', status: 'Ativo', odometer: '' });
    };

    const handleMaintSubmit = (e) => {
        e.preventDefault();
        const costFloat = parseFloat(maintForm.cost) || 0;
        addMaintenance({ ...maintForm, id: `M-${Date.now()}`, cost: costFloat });
        setMaintForm({ equipmentId: '', type: 'Preventiva', dateIn: '', dateOut: '', cost: '', description: '', provider: '' });
    };

    const getStatusClass = (status) => {
        if (status === 'Ativo') return 'status-active';
        if (status === 'Em manutenção') return 'status-maint';
        if (status === 'Locado') return 'status-rented';
        return 'status-reserve';
    };

    return (
        <div className="maintenance-container">
            <header className="page-header">
                <h1 className="page-title">Manutenção e Frota</h1>
                <div className="tab-buttons">
                    <button
                        className={`tab-btn ${activeTab === 'equipment' ? 'active' : ''}`}
                        onClick={() => setActiveTab('equipment')}
                    >
                        <Truck size={18} /> Cadastro de Equipamentos
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'maintenance' ? 'active' : ''}`}
                        onClick={() => setActiveTab('maintenance')}
                    >
                        <Wrench size={18} /> Controle de Manutenção
                    </button>
                </div>
            </header>

            {activeTab === 'equipment' ? (
                <div className="content-grid fade-in">
                    {/* Equipment Form */}
                    <div className="card">
                        <h2 className="card-title">Novo Equipamento</h2>
                        <form onSubmit={handleEqSubmit}>
                            <div className="form-grid-2" style={{ marginBottom: '1rem' }}>
                                <div className="input-group">
                                    <label>Tipo</label>
                                    <select
                                        className="input-field"
                                        value={eqForm.type}
                                        onChange={e => setEqForm({ ...eqForm, type: e.target.value })}
                                    >
                                        <option>Caminhão</option>
                                        <option>Carro</option>
                                        <option>Máquina</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Status Inicial</label>
                                    <select
                                        className="input-field"
                                        value={eqForm.status}
                                        onChange={e => setEqForm({ ...eqForm, status: e.target.value })}
                                    >
                                        <option>Ativo</option>
                                        <option>Reserva</option>
                                        <option>Em manutenção</option>
                                    </select>
                                </div>
                            </div>
                            <div className="input-group" style={{ marginBottom: '1rem' }}>
                                <label>Modelo</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={eqForm.model}
                                    onChange={e => setEqForm({ ...eqForm, model: e.target.value })}
                                    required
                                    placeholder="Ex: Volvo FH 540"
                                />
                            </div>
                            <div className="form-grid-2" style={{ marginBottom: '1rem' }}>
                                <div className="input-group">
                                    <label>Placa / Série</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={eqForm.plate}
                                        onChange={e => setEqForm({ ...eqForm, plate: e.target.value })}
                                        required
                                        placeholder="ABC-1234"
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Ano</label>
                                    <input
                                        type="number"
                                        className="input-field"
                                        value={eqForm.year}
                                        onChange={e => setEqForm({ ...eqForm, year: e.target.value })}
                                        placeholder="2023"
                                    />
                                </div>
                            </div>
                            <div className="input-group" style={{ marginBottom: '1rem' }}>
                                <label>Odômetro/Horímetro Atual</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    value={eqForm.odometer}
                                    onChange={e => setEqForm({ ...eqForm, odometer: e.target.value })}
                                    placeholder="0"
                                />
                            </div>
                            <button type="submit" className="btn-primary">
                                <Plus size={18} /> Cadastrar
                            </button>
                        </form>
                    </div>

                    {/* Equipment List */}
                    <div className="card">
                        <h2 className="card-title">Frota Cadastrada</h2>
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Modelo</th>
                                        <th>Placa</th>
                                        <th>Status</th>
                                        <th>Odômetro</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {state.equipment.map(item => (
                                        <tr key={item.id}>
                                            <td>
                                                <div style={{ fontWeight: 500 }}>{item.model}</div>
                                                <div className="text-sm text-gray">{item.type} • {item.year}</div>
                                            </td>
                                            <td>{item.plate}</td>
                                            <td>
                                                <span className={`status-badge ${getStatusClass(item.status)}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td>{item.odometer || item.horometer || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="fade-in">
                    {/* Maintenance KPIs */}
                    <div className="stats-grid" style={{ marginBottom: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                        <div className="stat-card blue">
                            <div className="icon-box"><Wrench size={24} /></div>
                            <div>
                                <h3>Em Manutenção Now</h3>
                                <p className="value">{activeMaintenances}</p>
                            </div>
                        </div>
                        <div className="stat-card red">
                            <div className="icon-box"><DollarSign size={24} /></div>
                            <div>
                                <h3>Custo Total (Mês)</h3>
                                <p className="value">R$ {totalMaintCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                            </div>
                        </div>
                    </div>

                    <div className="content-grid">
                        {/* Maintenance Form */}
                        <div className="card">
                            <h2 className="card-title">Registrar Manutenção</h2>
                            <form onSubmit={handleMaintSubmit}>
                                <div className="input-group" style={{ marginBottom: '1rem' }}>
                                    <label>Equipamento</label>
                                    <select
                                        className="input-field"
                                        value={maintForm.equipmentId}
                                        onChange={e => setMaintForm({ ...maintForm, equipmentId: e.target.value })}
                                        required
                                    >
                                        <option value="">Selecione...</option>
                                        {state.equipment.map(eq => (
                                            <option key={eq.id} value={eq.id}>{eq.model} - {eq.plate}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-grid-2" style={{ marginBottom: '1rem' }}>
                                    <div className="input-group">
                                        <label>Tipo</label>
                                        <select
                                            className="input-field"
                                            value={maintForm.type}
                                            onChange={e => setMaintForm({ ...maintForm, type: e.target.value })}
                                        >
                                            <option>Preventiva</option>
                                            <option>Corretiva</option>
                                            <option>Revisão Periódica</option>
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label>Fornecedor</label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            value={maintForm.provider}
                                            onChange={e => setMaintForm({ ...maintForm, provider: e.target.value })}
                                            placeholder="Oficina X"
                                        />
                                    </div>
                                </div>

                                <div className="form-grid-2" style={{ marginBottom: '1rem' }}>
                                    <div className="input-group">
                                        <label>Data Entrada</label>
                                        <input
                                            type="date"
                                            className="input-field"
                                            value={maintForm.dateIn}
                                            onChange={e => setMaintForm({ ...maintForm, dateIn: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Data Saída (Prevista/Real)</label>
                                        <input
                                            type="date"
                                            className="input-field"
                                            value={maintForm.dateOut}
                                            onChange={e => setMaintForm({ ...maintForm, dateOut: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="input-group" style={{ marginBottom: '1rem' }}>
                                    <label>Descrição do Serviço / Peças</label>
                                    <textarea
                                        className="input-field"
                                        rows="3"
                                        value={maintForm.description}
                                        onChange={e => setMaintForm({ ...maintForm, description: e.target.value })}
                                        placeholder="Detalhes do serviço e peças trocadas..."
                                    ></textarea>
                                </div>

                                <div className="input-group" style={{ marginBottom: '1rem' }}>
                                    <label>Custo Total (R$)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="input-field"
                                        value={maintForm.cost}
                                        onChange={e => setMaintForm({ ...maintForm, cost: e.target.value })}
                                        placeholder="0.00"
                                    />
                                </div>

                                <button type="submit" className="btn-primary">
                                    <Tool size={18} /> Salvar Manutenção
                                </button>
                            </form>
                        </div>

                        {/* Maintenance History */}
                        <div className="card">
                            <h2 className="card-title">Histórico de Manutenções</h2>
                            <div className="table-responsive">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Equipamento</th>
                                            <th>Tipo</th>
                                            <th>Data</th>
                                            <th>Custo</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {state.maintenances.map(item => {
                                            const eq = state.equipment.find(e => e.id === item.equipmentId);
                                            return (
                                                <tr key={item.id}>
                                                    <td>
                                                        <div style={{ fontWeight: 500 }}>{eq?.model || 'Desconhecido'}</div>
                                                        <div className="text-sm text-gray">{eq?.plate}</div>
                                                    </td>
                                                    <td>{item.type}</td>
                                                    <td>{item.dateIn}</td>
                                                    <td>R$ {item.cost?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                                    <td>
                                                        {item.dateOut ? (
                                                            <span className="status-badge status-active">Concluído</span>
                                                        ) : (
                                                            <span className="status-badge status-maint">Em Andamento</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Maintenance;
