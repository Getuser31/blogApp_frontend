const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(Number(timestamp) || timestamp);
    return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).replace(',', '');
};

export default formatDate;