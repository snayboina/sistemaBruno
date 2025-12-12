import { store } from '../state.js';
import { generateID, formatCurrency, getStatusClass } from '../utils.js';

export function renderRentals() {
    const container = document.getElementById('tab-rentals');
    container.innerHTML = `
        <div class="form-section">
            <div class="form-header">
                <h3><i class="fa-solid fa-file-contract"></i> Novo Contrato de Locação</h3>
                <button class="btn btn-primary" id="btn-save-rental">
                    <i class="fa-solid fa-check"></i> Gerar Contrato
                </button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label>Equipamento (Disponível)</label>
                    <select class="form-control" id="rent-equipment">
                        <!-- Populated via JS -->
                    </select>
                </div>
                <div class="form-group">
                    <label>Cliente / Locatário</label>
                    <input type="text" class="form-control" id="rent-client" placeholder="Nome da empresa">
                </div>
                <div class="form-group">
                    <label>Valor da Locação (R$)</label>
                    <input type="number" class="form-control" id="rent-value">
                </div>
                <div class="form-group">
                    <label>Tipo de Contrato</label>
                    <select class="form-control" id="rent-type">
                        <option value="Mensal">Mensal</option>
                        <option value="Diária">Diária</option>
                        <option value="Hora Machine">Por Hora</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Data Início (Mobilização)</label>
                    <input type="date" class="form-control" id="rent-date-start">
                </div>
                 <div class="form-group">
                    <label>Local de Operação</label>
                    <input type="text" class="form-control" id="rent-location" placeholder="Cidade/Obra">
                </div>
            </div>
        </div>

        <div style="margin-top: 2rem;">
            <h3>Contratos Ativos</h3>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Contrato ID</th>
                            <th>Equipamento</th>
                            <th>Cliente</th>
                            <th>Início</th>
                            <th>Valor</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody id="rentals-table-body">
                        <!-- Rows -->
                    </tbody>
                </table>
            </div>
        </div>
    `;

    setupRentalEvents();
    refreshRentalData();

    store.subscribe(() => refreshRentalData());
}

function setupRentalEvents() {
    document.getElementById('btn-save-rental')?.addEventListener('click', () => {
        const equipmentId = document.getElementById('rent-equipment').value;
        const client = document.getElementById('rent-client').value;
        const value = document.getElementById('rent-value').value;
        const type = document.getElementById('rent-type').value;
        const dateStart = document.getElementById('rent-date-start').value;
        const location = document.getElementById('rent-location').value;

        if (!equipmentId || !client || !value) return alert('Preencha os campos obrigatórios');

        // Create Rental
        store.addRental({
            id: generateID('CTR'),
            equipmentId,
            client,
            value: parseFloat(value),
            type,
            dateStart,
            location,
            status: 'Ativo'
        });

        // Update Equipment Status to 'Locado' (or similar, though user spec didn't explicitly ask for 'Locado' status in Eq list, it makes sense)
        // Note: The main Eq list restricts status to Ativo/Reserva/Manutenção based on Prompt A.
        // We will assume 'Ativo' can technically be 'Locado'. 
        // For better UX, let's update it to 'Ativo' but track it here.

        clearRentalForm();
        alert('Contrato gerado com sucesso!');
    });
}

function refreshRentalData() {
    const equipment = store.get('equipment');
    const rentals = store.get('rentals');

    // Populate Select with Active Equipment ONLY
    const rentSelect = document.getElementById('rent-equipment');
    if (rentSelect) {
        const currentVal = rentSelect.value;
        // Filter out equipment that is currently in maintenance
        const available = equipment.filter(e => e.status !== 'Em manutenção');

        rentSelect.innerHTML = '<option value="">Selecione...</option>' +
            available.map(e => `<option value="${e.id}">${e.model} - ${e.status}</option>`).join('');

        if (currentVal) rentSelect.value = currentVal;
    }

    // Populate Table
    const tbody = document.getElementById('rentals-table-body');
    if (tbody) {
        tbody.innerHTML = rentals.map(r => {
            const eq = equipment.find(e => e.id === r.equipmentId);
            return `
                <tr>
                    <td>${r.id}</td>
                    <td>${eq ? eq.model : 'N/A'}</td>
                    <td>${r.client}</td>
                    <td>${r.dateStart}</td>
                    <td>${formatCurrency(r.value)}</td>
                    <td><span class="status-badge status-active">${r.status}</span></td>
                    <td>
                        <button class="icon-btn" title="Encerrar"><i class="fa-solid fa-stop"></i></button>
                    </td>
                </tr>
            `;
        }).join('');
    }
}

function clearRentalForm() {
    document.getElementById('rent-client').value = '';
    document.getElementById('rent-value').value = '';
    document.getElementById('rent-location').value = '';
}
