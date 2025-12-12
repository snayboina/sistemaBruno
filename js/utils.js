/**
 * Utility Functions
 */

export const generateID = (prefix = 'ID') => {
    return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
};

export const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value || 0);
};

export const parseCurrency = (str) => {
    if (typeof str === 'number') return str;
    if (!str) return 0;
    return parseFloat(str.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()) || 0;
};

export const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
};

export const calculateDaysBetween = (start, end) => {
    if (!start || !end) return 0;
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date(start);
    const secondDate = new Date(end);
    return Math.round(Math.abs((firstDate - secondDate) / oneDay));
};

export const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
        case 'ativo': return 'status-active';
        case 'em manutenção': return 'status-maintenance';
        case 'reserva': return 'status-reserve';
        default: return '';
    }
};
