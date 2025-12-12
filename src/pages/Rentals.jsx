import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { FileText, Truck, ArrowRight, ArrowLeft, PenTool, CheckCircle } from 'lucide-react';

const Rentals = () => {
    const { state, addRental, closeRental } = useAppContext();
    const [view, setView] = useState('list'); // 'list', 'new', 'return'

    // Form States
    const [rentalForm, setRentalForm] = useState({ equipmentId: '', client: '', dateOut: '', contractType: 'Mensal', value: '', mobilizationCost: '', demobilizationCost: '', location: '' });
    const [returnForm, setReturnForm] = useState({ rentalId: '', dateReturn: '', odometerRaw: '', notes: '' });
    const [selectedRental, setSelectedRental] = useState(null);
    const [signature, setSignature] = useState(false);

    // Filter available equipment (Ativo or Reserva)
    const availableEquipment = state.equipment.filter(e => e.status === 'Ativo' || e.status === 'Reserva');
    const activeRentals = state.rentals.filter(r => !r.dateReturn);

    const handleMobilize = (e) => {
        e.preventDefault();
        const newVal = {
            ...rentalForm,
            id: `R-${Date.now()}`,
            signature: signature ? 'Assinado Digitalmente' : 'Pendente',
            value: parseFloat(rentalForm.value) || 0,
            mobilizationCost: parseFloat(rentalForm.mobilizationCost) || 0,
            demobilizationCost: parseFloat(rentalForm.demobilizationCost) || 0
        };
        addRental(newVal);
        setView('list');
        setRentalForm({ equipmentId: '', client: '', dateOut: '', contractType: 'Mensal', value: '', mobilizationCost: '', demobilizationCost: '', location: '' });
        setSignature(false);
    };

    const handleReturnClick = (rental) => {
        setSelectedRental(rental);
        setReturnForm({ ...returnForm, rentalId: rental.id });
        setView('return');
    };

    const handleDemobilize = (e) => {
        e.preventDefault();
        closeRental(selectedRental.id, {
            dateReturn: returnForm.dateReturn,
            finalOdometer: returnForm.odometerRaw,
            returnNotes: returnForm.notes
        });
        setView('list');
        setSelectedRental(null);
        setReturnForm({ rentalId: '', dateReturn: '', odometerRaw: '', notes: '' });
    };

    return (
        <div className="rentals-container fade-in">
            <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 className="page-title">Locações e Mobilização</h1>
                    <p className="subtitle text-gray-400">Gerencie contratos e movimentação de equipamentos</p>
                </div>
                {view === 'list' && (
                    <button className="btn-primary" onClick={() => setView('new')}>
                        <FileText size={18} /> Nova Locação
                    </button>
                )}
                {view !== 'list' && (
                    <button className="btn-secondary" onClick={() => setView('list')} style={{ background: 'transparent', border: '1px solid #475569', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer' }}>
                        Voltar
                    </button>
                )}
            </header>

            {view === 'list' && (
                <div className="content-grid">
                    <div className="card full-width">
                        <h2 className="card-title">Contratos Ativos</h2>
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Cliente</th>
                                        <th>Equipamento</th>
                                        <th>Início</th>
                                        <th>Valor Contrato</th>
                                        <th>Local</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeRentals.length === 0 ? (
                                        <tr><td colSpan="6" style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>Nenhuma locação ativa no momento.</td></tr>
                                    ) : activeRentals.map(rental => {
                                        const eq = state.equipment.find(e => e.id === rental.equipmentId);
                                        return (
                                            <tr key={rental.id}>
                                                <td>{rental.client}</td>
                                                <td>
                                                    <div style={{ fontWeight: 500 }}>{eq?.model}</div>
                                                    <div className="text-sm text-gray">{eq?.plate}</div>
                                                </td>
                                                <td>{rental.dateOut}</td>
                                                <td>R$ {rental.value?.toLocaleString()} / {rental.contractType}</td>
                                                <td>{rental.location || 'N/A'}</td>
                                                <td>
                                                    <button
                                                        className="btn-sm status-maint"
                                                        onClick={() => handleReturnClick(rental)}
                                                        style={{ border: 'none', padding: '0.25rem 0.75rem', borderRadius: '4px', cursor: 'pointer', background: '#3b82f6', color: 'white' }}
                                                    >
                                                        Desmobilizar
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {view === 'new' && (
                <div className="card fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 className="card-title">Nova Mobilização</h2>
                    <form onSubmit={handleMobilize}>
                        <div className="form-grid-2" style={{ marginBottom: '1rem' }}>
                            <div className="input-group">
                                <label>Cliente / Locatário</label>
                                <input
                                    className="input-field"
                                    value={rentalForm.client}
                                    onChange={e => setRentalForm({ ...rentalForm, client: e.target.value })}
                                    required
                                    placeholder="Nome da Empresa"
                                />
                            </div>
                            <div className="input-group">
                                <label>Equipamento Disponível</label>
                                <select
                                    className="input-field"
                                    value={rentalForm.equipmentId}
                                    onChange={e => setRentalForm({ ...rentalForm, equipmentId: e.target.value })}
                                    required
                                >
                                    <option value="">Selecione...</option>
                                    {availableEquipment.map(e => (
                                        <option key={e.id} value={e.id}>{e.type} - {e.model} ({e.plate})</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-grid-2" style={{ marginBottom: '1rem' }}>
                            <div className="input-group">
                                <label>Data Início</label>
                                <input
                                    type="date"
                                    className="input-field"
                                    value={rentalForm.dateOut}
                                    onChange={e => setRentalForm({ ...rentalForm, dateOut: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Local de Operação</label>
                                <input
                                    className="input-field"
                                    value={rentalForm.location}
                                    onChange={e => setRentalForm({ ...rentalForm, location: e.target.value })}
                                    placeholder="Ex: Obra Zona Norte"
                                />
                            </div>
                        </div>

                        <div className="form-grid-2" style={{ marginBottom: '1rem' }}>
                            <div className="input-group">
                                <label>Tipo de Contrato</label>
                                <select
                                    className="input-field"
                                    value={rentalForm.contractType}
                                    onChange={e => setRentalForm({ ...rentalForm, contractType: e.target.value })}
                                >
                                    <option>Mensal</option>
                                    <option>Diária</option>
                                    <option>Por Hora</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Valor (R$)</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    value={rentalForm.value}
                                    onChange={e => setRentalForm({ ...rentalForm, value: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-grid-2" style={{ marginBottom: '1rem' }}>
                            <div className="input-group">
                                <label>Custo Mobilização (R$)</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    value={rentalForm.mobilizationCost}
                                    onChange={e => setRentalForm({ ...rentalForm, mobilizationCost: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <label>Custo Desmobilização (Estimado)</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    value={rentalForm.demobilizationCost}
                                    onChange={e => setRentalForm({ ...rentalForm, demobilizationCost: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="input-group" style={{ marginBottom: '2rem', marginTop: '1rem' }}>
                            <label>Assinatura Digital do Cliente</label>
                            <div
                                onClick={() => setSignature(!signature)}
                                style={{
                                    border: '2px dashed #475569',
                                    padding: '2rem',
                                    borderRadius: '8px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    background: signature ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                                    color: signature ? '#10b981' : '#94a3b8'
                                }}
                            >
                                {signature ? (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        <CheckCircle size={24} /> Assinado Digitalmente
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        <PenTool size={24} /> Clique para simular assinatura
                                    </div>
                                )}
                            </div>
                        </div>

                        <button type="submit" className="btn-primary full-width">
                            Confimar Mobilização
                        </button>
                    </form>
                </div>
            )}

            {view === 'return' && selectedRental && (
                <div className="card fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <h2 className="card-title">Desmobilização / Devolução</h2>
                    <p className="text-gray-400 mb-4">Finalizar contrato # {selectedRental.id}</p>

                    <form onSubmit={handleDemobilize}>
                        <div className="input-group" style={{ marginBottom: '1rem' }}>
                            <label>Data de Desmobilização</label>
                            <input
                                type="date"
                                className="input-field"
                                value={returnForm.dateReturn}
                                onChange={e => setReturnForm({ ...returnForm, dateReturn: e.target.value })}
                                required
                            />
                        </div>
                        <div className="input-group" style={{ marginBottom: '1rem' }}>
                            <label>Odômetro/Horímetro Final</label>
                            <input
                                type="number"
                                className="input-field"
                                value={returnForm.odometerRaw}
                                onChange={e => setReturnForm({ ...returnForm, odometerRaw: e.target.value })}
                                required
                            />
                        </div>
                        <div className="input-group" style={{ marginBottom: '1rem' }}>
                            <label>Observações / Avarias na Devolução</label>
                            <textarea
                                className="input-field"
                                value={returnForm.notes}
                                onChange={e => setReturnForm({ ...returnForm, notes: e.target.value })}
                                rows="3"
                            ></textarea>
                        </div>

                        <button type="submit" className="btn-primary" style={{ backgroundColor: '#ef4444' }}>
                            Encerrar Contrato
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Rentals;
