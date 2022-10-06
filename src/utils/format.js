const formatCurrency = (currency) => {
  const formatted = currency.toLocaleString('es-es', {
    style: 'currency',
    currency: 'EUR'
  })

  return formatted
}

export {
  formatCurrency
}
