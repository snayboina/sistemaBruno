import { store } from '../state.js';
import { generateID, formatCurrency, getStatusClass } from '../utils.js';

export function renderDamages() {
    const container = document.getElementById('tab-damages');
    container.innerHTML = `
        <div class="form-section" style="border-top: 4px solid var(--danger);">
            <div class="form-header">
                <h3><i class="fa-solid fa-triangle-exclamation"></i> Registro de Avaria</h3>
                <button class="btn btn-primary" id="btn-save-damage" style="background-color: var(--danger);">
                    Salvar Ocorrência
                </button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label>Equipamento Envolvido</label>
                    <select class="form-control" id="dmg-equipment">
                        <!-- Populated via JS -->
                    </select>
                </div>
                <div class="form-group">
                    <label>Data do Ocorrido</label>
                    <input type="date" class="form-control" id="dmg-date">
                </div>
                <div class="form-group">
                    <label>Tipo de Avaria</label>
                    <select class="form-control" id="dmg-type">
                        <option value="Mecânica">Mecânica</option>
                        <option value="Colisão">Colisão / Batida</option>
                        <option value="Elétrica">Elétrica</option>
                        <option value="Estética">Estética / Lataria</option>
                        <option value="Perda Total">Perda Total</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Motorista / Responsável</label>
                    <input type="text" class="form-control" id="dmg-driver" placeholder="Nome do condutor">
                </div>
                <div class="form-group">
                    <label>Custo do Reparo (R$)</label>
                    <input type="number" class="form-control" id="dmg-cost" placeholder="0.00">
                </div>
                 <div class="form-group">
                    <label>Quem paga?</label>
                    <select class="form-control" id="dmg-resp">
                        <option value="Empresa">Empresa (Falha Mecânica/Desgaste)</option>
                        <option value="Motorista">Motorista (Desconto em folha)</option>
                        <option value="Locadora">Locatária (Mau uso)</option>
                    </select>
                </div>
                <div class="form-group" style="grid-column: span 2;">
                    <label>Descrição do Dano</label>
                    <textarea class="form-control" id="dmg-desc" rows="2" placeholder="Descreva o que aconteceu..."></textarea>
                </div>
            </div>
        </div>

        <div style="margin-top: 2rem;">
            <h3>Histórico de Avarias</h3>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Equipamento</th>
                            <th>Data</th>
                            <th>Tipo</th>
                            <th>Responsável</th>
                            <th>Custo</th>
                            <th>Status Pagamento</th>
                        </tr>
                    </thead>
                    <tbody id="damages-table-body">
                        <!-- Rows -->
                    </tbody>
                </table>
            </div>
        </div>
    `;

    setupDamageEvents();
    refreshDamageData();

    store.subscribe(() => refreshDamageData());
}

function setupDamageEvents() {
    document.getElementById('btn-save-damage')?.addEventListener('click', () => {
        const equipmentId = document.getElementById('dmg-equipment').value;
        const date = document.getElementById('dmg-date').value;
        const type = document.getElementById('dmg-type').value;
        const driver = document.getElementById('dmg-driver').value;
        const cost = document.getElementById('dmg-cost').value;
        const resp = document.getElementById('dmg-resp').value;
        const desc = document.getElementById('dmg-desc').value;

        if (!equipmentId || !date || !cost) return alert('Preencha os campos obrigatórios');

        store.addDamage({
            id: generateID('AVG'),
            equipmentId,
            date,
            type,
            driver,
            cost: parseFloat(cost),
            resp,
            desc,
            status: 'Aberto'
        });

        // Potentially trigger maintenance creation here too? 
        // For simplicity, we just log the damage for now.

        clearDamageForm();
        alert('Avaria registrada!');
    });
}

function refreshDamageData() {
    const equipment = store.get('equipment');
    const damages = store.get('damages');

    // Populate Select
    const dmgSelect = document.getElementById('dmg-equipment');
    if (dmgSelect) {
        const currentVal = dmgSelect.value;
        dmgSelect.innerHTML = '<option value="">Selecione...</option>' +
            equipment.map(e => `<option value="${e.id}">${e.model} (${e.plate})</option>`).join('');
        if (currentVal) dmgSelect.value = currentVal;
    }

    // Populate Table
    const tbody = document.getElementById('damages-table-body');
    if (tbody) {
        tbody.innerHTML = damages.map(d => {
            const eq = equipment.find(e => e.id === d.equipmentId);
            return `
                <tr>
                    <td>${d.id}</td>
                    <td>${eq ? eq.model : 'N/A'}</td>
                    <td>${d.date}</td>
                    <td>${d.type}</td>
                    <td>${d.driver} (${d.resp})</td>
                    <td style="color: var(--danger); font-weight: bold;">${formatCurrency(d.cost)}</td>
                    <td><span class="status-badge status-reserve">${d.status}</span></td>
                </tr>
            `;
        }).join('');
    }
}

function clearDamageForm() {
    document.getElementById('dmg-driver').value = '';
    document.getElementById('dmg-cost').value = '';
    document.getElementById('dmg-desc').value = '';
}
