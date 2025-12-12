/**
 * Simple State Management Store
 */

class Store {
    constructor() {
        this.state = {
            equipment: [],
            maintenances: [],
            rentals: [],
            damages: []
        };
        this.listeners = [];
        this.load();
    }

    // Load from LocalStorage
    load() {
        const stored = localStorage.getItem('fleetApp_data');
        if (stored) {
            this.state = JSON.parse(stored);
        } else {
            // Seed initial dummy data if empty for demo purposes
            this.seed();
        }
    }

    // Save to LocalStorage
    save() {
        localStorage.setItem('fleetApp_data', JSON.stringify(this.state));
        this.notify();
    }

    // Seed Data
    seed() {
        this.state.equipment = [
            { id: 'EQ-001', type: 'Caminhão', model: 'Volvo FH 540', year: 2022, plate: 'ABC-1234', status: 'Ativo' },
            { id: 'EQ-002', type: 'Carro', model: 'Fiat Strada', year: 2023, plate: 'XYZ-9876', status: 'Reserva' },
            { id: 'EQ-003', type: 'Máquina', model: 'CAT 320', year: 2021, plate: 'S/N 554433', status: 'Em manutenção' }
        ];
        this.save();
    }

    // Getters
    get(key) {
        return this.state[key];
    }

    // Actions
    addEquipment(item) {
        this.state.equipment.push(item);
        this.save();
    }

    updateEquipmentStatus(id, newStatus) {
        const item = this.state.equipment.find(e => e.id === id);
        if (item) {
            item.status = newStatus;
            this.save();
        }
    }

    addMaintenance(item) {
        this.state.maintenances.push(item);
        // Automatically link to equipment status if needed
        if (!item.exitDate) { // If no exit date, it's ongoing
            this.updateEquipmentStatus(item.equipmentId, 'Em manutenção');
        } else {
            this.updateEquipmentStatus(item.equipmentId, 'Ativo');
        }
        this.save();
    }

    addRental(item) {
        this.state.rentals.push(item);
        this.save();
    }

    addDamage(item) {
        this.state.damages.push(item);
        this.save();
    }

    // Subscription
    subscribe(listener) {
        this.listeners.push(listener);
    }

    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }
}

export const store = new Store();
