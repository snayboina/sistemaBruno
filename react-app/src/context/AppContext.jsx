import React, { createContext, useState, useEffect, useContext } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    // Initial State
    const [state, setState] = useState({
        equipment: [],
        maintenances: [],
        rentals: [],
        damages: [],
        user: null
    });

    // Load from LocalStorage on Mount
    useEffect(() => {
        const stored = localStorage.getItem('fleetApp_react_data');
        if (stored) {
            setState(prev => ({ ...prev, ...JSON.parse(stored) }));
        } else {
            seedData();
        }
    }, []);

    // Save to LocalStorage on Change
    useEffect(() => {
        localStorage.setItem('fleetApp_react_data', JSON.stringify(state));
    }, [state]);

    // Actions
    const seedData = () => {
        const initialData = {
            equipment: [
                { id: 'EQ-001', type: 'Caminhão', model: 'Volvo FH 540', year: 2022, plate: 'ABC-1234', status: 'Ativo', odometer: 15000 },
                { id: 'EQ-002', type: 'Carro', model: 'Fiat Strada', year: 2023, plate: 'XYZ-9876', status: 'Locado', odometer: 5000 },
                { id: 'EQ-003', type: 'Máquina', model: 'CAT 320', year: 2021, plate: 'S/N 554433', status: 'Em manutenção', horometer: 2500 },
                { id: 'EQ-004', type: 'Caminhão', model: 'Mercedes Actros', year: 2020, plate: 'DEF-5678', status: 'Ativo', odometer: 32000 }
            ],
            maintenances: [
                { id: 'M-001', equipmentId: 'EQ-003', type: 'Preventiva', dateIn: '2023-10-01', dateOut: '2023-10-05', cost: 1500.00, description: 'Troca de óleo e filtros', provider: 'Oficina Central' }
            ],
            rentals: [
                { id: 'R-001', equipmentId: 'EQ-002', client: 'Construtora ABC', dateOut: '2023-09-15', dateReturn: null, value: 3500.00, contractType: 'Mensal' }
            ],
            damages: [
                { id: 'D-001', equipmentId: 'EQ-001', date: '2023-08-20', type: 'Colisão', description: 'Quebra de retrovisor', responsible: 'Motorista João', cost: 450.00, status: 'Pago' }
            ],
            user: null
        };
        setState(initialData);
    };

    const login = (email, password) => {
        if (email && password) {
            setState(prev => ({
                ...prev,
                user: { name: 'Admin User', email, role: 'Gestor de Frota' }
            }));
            return true;
        }
        return false;
    };

    const logout = () => {
        setState(prev => ({ ...prev, user: null }));
    };

    const addEquipment = (item) => {
        setState(prev => ({ ...prev, equipment: [...prev.equipment, item] }));
    };

    const updateEquipmentStatus = (id, newStatus) => {
        setState(prev => ({
            ...prev,
            equipment: prev.equipment.map(e => e.id === id ? { ...e, status: newStatus } : e)
        }));
    };

    const addMaintenance = (item) => {
        setState(prev => {
            // If maintenance is finishing (has dateOut), set to Active, else status stays 'Em manutenção' unless explicitly handled
            /* 
              Logic simplified: 
              - If adding a NEW open maintenance -> Set status to 'Em manutenção'
              - If closing one -> Set status to 'Ativo' logic handled in component usually, 
                but here we assume 'item' is the full record.
           */
            const isActive = !!item.dateOut;
            const targetStatus = isActive ? 'Ativo' : 'Em manutenção';

            const updatedEq = prev.equipment.map(e =>
                e.id === item.equipmentId
                    ? { ...e, status: targetStatus }
                    : e
            );
            return {
                ...prev,
                equipment: updatedEq,
                maintenances: [...prev.maintenances, item]
            };
        });
    };

    const addRental = (item) => {
        setState(prev => {
            const updatedEq = prev.equipment.map(e =>
                e.id === item.equipmentId ? { ...e, status: 'Locado' } : e
            );
            return {
                ...prev,
                equipment: updatedEq,
                rentals: [...prev.rentals, item]
            };
        });
    };

    const closeRental = (rentalId, returnData) => {
        setState(prev => {
            // Find rental to get equipment ID
            const rental = prev.rentals.find(r => r.id === rentalId);
            if (!rental) return prev;

            const updatedEq = prev.equipment.map(e =>
                e.id === rental.equipmentId ? { ...e, status: 'Ativo' } : e
            );

            const updatedRentals = prev.rentals.map(r =>
                r.id === rentalId ? { ...r, ...returnData } : r
            );

            return {
                ...prev,
                equipment: updatedEq,
                rentals: updatedRentals
            };
        });
    }

    const addDamage = (item) => {
        setState(prev => ({ ...prev, damages: [...prev.damages, item] }));
    };

    return (
        <AppContext.Provider value={{
            state,
            login,
            logout,
            addEquipment,
            updateEquipmentStatus,
            addMaintenance,
            addRental,
            closeRental,
            addDamage
        }}>
            {children}
        </AppContext.Provider>
    );
};
