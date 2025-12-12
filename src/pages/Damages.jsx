import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { AlertTriangle, Plus, DollarSign, User, ShieldAlert } from 'lucide-react';

const Damages = () => {
    const { state, addDamage } = useAppContext();
    const [view, setView] = useState('list');

    const [form, setForm] = useState({ equipmentId: '', date: '', type: 'Colisão', description: '', responsible: 'Motorista', cost: '', status: 'Aberto' });

    // Stats
    const totalDamages = state.damages.reduce((acc, curr) => acc + (parseFloat(curr.cost) || 0), 0);
    const openCases = state.damages.filter(d => d.status === 'Aberto' || d.status === 'Em cobrança').length;

    const handleSubmit = (e) => {
        e.preventDefault();
        addDamage({ ...form, id: `D-${Date.now()}`, cost: parseFloat(form.cost) || 0 });
        setView('list');
        setForm({ equipmentId: '', date: '', type: 'Colisão', description: '', responsible: 'Motorista', cost: '', status: 'Aberto' });
    };

    const getStatusClass = (status) => {
        if (status === 'Pago') return 'status-active';
        if (status === 'Aberto') return 'status-reserve'; // Orange
        return 'status-maint'; // Red for Em cobrança
    };

    return (
        <div className="damages-container fade-in">
            <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 className="page-title">Controle de Avarias e Sinistros</h1>
                    <p className="subtitle text-gray-400">Registre danos e acompanhe a recuperação de custos</p>
                </div>
                {view === 'list' && (
                    <button className="btn-primary" onClick={() => setView('new')}>
                        <Plus size={18} /> Novo Registro
                    </button>
                )}
                {view !== 'list' && (
                    <button className="btn-secondary" onClick={() => setView('list')} style={{ background: 'transparent', border: '1px solid #475569', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer' }}>
                        Voltar
                    </button>
                )}
            </header>

            {view === 'list' && (
                <>
                    {/* KPI Cards */}
                    <div className="stats-grid" style={{ marginBottom: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                        <div className="stat-card red">
                            <div className="icon-box"><ShieldAlert size={24} /></div>
                            <div>
                                <h3>Casos Abertos</h3>
                                <p className="value">{openCases}</p>
                            </div>
                        </div>
                        <div className="stat-card blue">
                            <div className="icon-box"><DollarSign size={24} /></div>
                            <div>
                                <h3>Custo Total (Mês)</h3>
                                <p className="value">R$ {totalDamages.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                            </div>
                        </div>
                    </div>

                    <div className="card full-width">
                        <h2 className="card-title">Histórico de Avarias</h2>
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Data</th>
                                        <th>Equipamento</th>
                                        <th>Tipo</th>
                                        <th>Responsável</th>
                                        <th>Custo Reparo</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {state.damages.length === 0 ? (
                                        <tr><td colSpan="6" style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>Nenhuma avaria registrada.</td></tr>
                                    ) : state.damages.map(item => {
                                        const eq = state.equipment.find(e => e.id === item.equipmentId);
                                        return (
                                            <tr key={item.id}>
                                                <td>{item.date}</td>
                                                <td>
                                                    <div style={{ fontWeight: 500 }}>{eq?.model || 'Excluído'}</div>
                                                    <div className="text-sm text-gray">{eq?.plate}</div>
                                                </td>
                                                <td>{item.type}</td>
                                                <td>{item.responsible}</td>
                                                <td>R$ {item.cost?.toLocaleString()}</td>
                                                <td>
                                                    <span className={`status-badge ${getStatusClass(item.status)}`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {view === 'new' && (
                <div className="card fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 className="card-title">Registrar Nova Avaria</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid-2" style={{ marginBottom: '1rem' }}>
                            <div className="input-group">
                                <label>Equipamento</label>
                                <select
                                    className="input-field"
                                    value={form.equipmentId}
                                    onChange={e => setForm({ ...form, equipmentId: e.target.value })}
                                    required
                                >
                                    <option value="">Selecione...</option>
                                    {state.equipment.map(e => (
                                        <option key={e.id} value={e.id}>{e.model} - {e.plate}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Data do Ocorrido</label>
                                <input
                                    type="date"
                                    className="input-field"
                                    value={form.date}
                                    onChange={e => setForm({ ...form, date: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-grid-2" style={{ marginBottom: '1rem' }}>
                            <div className="input-group">
                                <label>Tipo de Avaria</label>
                                <select
                                    className="input-field"
                                    value={form.type}
                                    onChange={e => setForm({ ...form, type: e.target.value })}
                                >
                                    <option>Colisão</option>
                                    <option>Mecânica (Mau uso)</option>
                                    <option>Elétrica</option>
                                    <option>Roubo/Furto</option>
                                    <option>Estética</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Responsável</label>
                                <select
                                    className="input-field"
                                    value={form.responsible}
                                    onChange={e => setForm({ ...form, responsible: e.target.value })}
                                >
                                    <option>Motorista (Próprio)</option>
                                    <option>Locatário (Cliente)</option>
                                    <option>Terceiro</option>
                                    <option>A Apurar</option>
                                </select>
                            </div>
                        </div>

                        <div className="input-group" style={{ marginBottom: '1rem' }}>
                            <label>Descrição Detalhada</label>
                            <textarea
                                className="input-field"
                                rows="3"
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                placeholder="Descreva como ocorreu o dano..."
                            ></textarea>
                        </div>

                        <div className="form-grid-2" style={{ marginBottom: '1rem' }}>
                            <div className="input-group">
                                <label>Custo de Reparo (Estimado/Real)</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    value={form.cost}
                                    onChange={e => setForm({ ...form, cost: e.target.value })}
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Status Cobrança</label>
                                <select
                                    className="input-field"
                                    value={form.status}
                                    onChange={e => setForm({ ...form, status: e.target.value })}
                                >
                                    <option>Aberto</option>
                                    <option>Em cobrança</option>
                                    <option>Pago</option>
                                    <option>Isento</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" style={{ backgroundColor: '#eab308' }}>
                            <AlertTriangle size={18} /> Registrar Sinistro
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Damages;
