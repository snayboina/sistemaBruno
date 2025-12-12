import { store } from '../state.js';
import { generateID, formatCurrency, getStatusClass, parseCurrency } from '../utils.js';

export function renderMaintenance() {
    const container = document.getElementById('tab-maintenance');
    container.innerHTML = `
        <!-- Equipment Registration Section -->
        <div class="form-section">
            <div class="form-header">
                <h3><i class="fa-solid fa-truck"></i> Cadastro de Equipamento</h3>
                <button class="btn btn-primary" id="btn-save-equipment">
                    <i class="fa-solid fa-plus"></i> Salvar Equipamento
                </button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label>Tipo</label>
                    <select class="form-control" id="eq-type">
                        <option value="Caminhão">Caminhão</option>
                        <option value="Carro">Carro</option>
                        <option value="Máquina">Máquina</option>
                        <option value="Implemento">Implemento</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Modelo</label>
                    <input type="text" class="form-control" id="eq-model" placeholder="Ex: Volvo FH 540">
                </div>
                <div class="form-group">
                    <label>Placa / Série</label>
                    <input type="text" class="form-control" id="eq-plate" placeholder="ABC-1234">
                </div>
                <div class="form-group">
                    <label>Ano</label>
                    <input type="number" class="form-control" id="eq-year" placeholder="2023">
                </div>
                <div class="form-group">
                    <label>Status Inicial</label>
                    <select class="form-control" id="eq-status">
                        <option value="Ativo">Ativo</option>
                        <option value="Reserva">Reserva</option>
                        <option value="Em manutenção">Em manutenção</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Maintenance Record Section -->
        <div class="form-section" style="border-top: 4px solid var(--warning);">
            <div class="form-header">
                <h3><i class="fa-solid fa-screwdriver-wrench"></i> Nova Manutenção</h3>
                <button class="btn btn-primary" id="btn-save-maintenance" style="background-color: var(--warning);">
                    <i class="fa-solid fa-save"></i> Registrar Manutenção
                </button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label>Equipamento</label>
                    <select class="form-control" id="maint-equipment">
                        <!-- Populated by JS -->
                    </select>
                </div>
                <div class="form-group">
                    <label>Tipo de Manutenção</label>
                    <select class="form-control" id="maint-type">
                        <option value="Preventiva">Preventiva</option>
                        <option value="Corretiva">Corretiva</option>
                        <option value="Revisão">Revisão Periódica</option>
                    </select>
                </div>
                 <div class="form-group">
                    <label>Data Entrada</label>
                    <input type="date" class="form-control" id="maint-date-in">
                </div>
                 <div class="form-group">
                    <label>Data Saída (Prevista/Real)</label>
                    <input type="date" class="form-control" id="maint-date-out">
                </div>
                <div class="form-group">
                    <label>Custo (R$)</label>
                    <input type="number" class="form-control" id="maint-cost" placeholder="0.00">
                </div>
                 <div class="form-group">
                    <label>Oficina / Fornecedor</label>
                    <input type="text" class="form-control" id="maint-provider" placeholder="Nome da oficina">
                </div>
                <div class="form-group" style="grid-column: span 2;">
                    <label>Descrição do Serviço</label>
                    <textarea class="form-control" id="maint-desc" rows="2" placeholder="Detalhes do serviço..."></textarea>
                </div>
            </div>
        </div>

        <!-- Lists -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
            <!-- Equipment List -->
            <div>
                <h4 style="margin-bottom: 1rem;">Frota Cadastrada</h4>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Modelo</th>
                                <th>Placa</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody id="equipment-table-body">
                            <!-- Rows -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Recent Maintenance List -->
             <div>
                <h4 style="margin-bottom: 1rem;">Histórico de Manutenções</h4>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Equipamento</th>
                                <th>Tipo</th>
                                <th>Data</th>
                                <th>Custo</th>
                            </tr>
                        </thead>
                        <tbody id="maintenance-table-body">
                            <!-- Rows -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    setupEvents();
    refreshData();

    store.subscribe(() => refreshData());
}

function setupEvents() {
    // Save Equipment
    document.getElementById('btn-save-equipment')?.addEventListener('click', () => {
        const type = document.getElementById('eq-type').value;
        const model = document.getElementById('eq-model').value;
        const plate = document.getElementById('eq-plate').value;
        const year = document.getElementById('eq-year').value;
        const status = document.getElementById('eq-status').value;

        if (!model || !plate) return alert('Preencha os campos obrigatórios (Modelo e Placa)');

        store.addEquipment({
            id: generateID('EQ'),
            type,
            model,
            plate,
            year,
            status
        });

        clearEquipmentForm();
        alert('Equipamento cadastrado com sucesso!');
    });

    // Save Maintenance
    document.getElementById('btn-save-maintenance')?.addEventListener('click', () => {
        const equipmentId = document.getElementById('maint-equipment').value;
        const type = document.getElementById('maint-type').value;
        const dateIn = document.getElementById('maint-date-in').value;
        const dateOut = document.getElementById('maint-date-out').value;
        const cost = document.getElementById('maint-cost').value;
        const provider = document.getElementById('maint-provider').value;
        const desc = document.getElementById('maint-desc').value;

        if (!equipmentId || !dateIn) return alert('Selecione um equipamento e data de entrada');

        store.addMaintenance({
            id: generateID('MT'),
            equipmentId,
            type,
            dateIn,
            dateOut,
            cost: parseFloat(cost) || 0,
            provider,
            desc
        });

        clearMaintenanceForm();
        alert('Manutenção registrada!');
    });
}

function refreshData() {
    const equipment = store.get('equipment');
    const maintenances = store.get('maintenances');

    // Update Equipment Table
    const eqBody = document.getElementById('equipment-table-body');
    if (eqBody) {
        eqBody.innerHTML = equipment.map(item => `
            <tr>
                <td>${item.model}</td>
                <td>${item.plate}</td>
                <td><span class="status-badge ${getStatusClass(item.status)}">${item.status}</span></td>
            </tr>
        `).join('');
    }

    // Update Maintenance Dropdown
    const eqSelect = document.getElementById('maint-equipment');
    if (eqSelect) {
        const currentVal = eqSelect.value;
        eqSelect.innerHTML = '<option value="">Selecione...</option>' +
            equipment.map(e => `<option value="${e.id}">${e.model} (${e.plate})</option>`).join('');
        if (currentVal) eqSelect.value = currentVal;
    }

    // Update Maintenance Table
    const mtBody = document.getElementById('maintenance-table-body');
    if (mtBody) {
        mtBody.innerHTML = maintenances.slice().reverse().slice(0, 5).map(item => {
            const eq = equipment.find(e => e.id === item.equipmentId);
            return `
                <tr>
                    <td>${eq ? eq.model : 'S/ Reg'}</td>
                    <td>${item.type}</td>
                    <td>${item.dateIn}</td>
                    <td>${formatCurrency(item.cost)}</td>
                </tr>
            `;
        }).join('');
    }
}

function clearEquipmentForm() {
    document.getElementById('eq-model').value = '';
    document.getElementById('eq-plate').value = '';
    document.getElementById('eq-year').value = '';
}

function clearMaintenanceForm() {
    document.getElementById('maint-date-in').value = '';
    document.getElementById('maint-date-out').value = '';
    document.getElementById('maint-cost').value = '';
    document.getElementById('maint-provider').value = '';
    document.getElementById('maint-desc').value = '';
    document.getElementById('maint-equipment').value = '';
}
