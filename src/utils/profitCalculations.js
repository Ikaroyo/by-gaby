export const calculateProfit = (quotes, recipes) => {
  const currentDate = new Date()
  const thirtyDaysAgo = new Date(currentDate.getTime() - (30 * 24 * 60 * 60 * 1000))
  
  // Filter quotes from last 30 days
  const recentQuotes = quotes.filter(quote => {
    const quoteDate = new Date(quote.created_at)
    return quoteDate >= thirtyDaysAgo && quoteDate <= currentDate
  })
  
  // Calculate total revenue (what customers paid)
  const totalRevenue = recentQuotes.reduce((sum, quote) => {
    return sum + (quote.total_cost || 0)
  }, 0)
  
  // Calculate total costs (ingredient costs for recipes sold)
  const totalCosts = recentQuotes.reduce((sum, quote) => {
    if (quote.quote_items) {
      const quoteCosts = quote.quote_items.reduce((itemSum, item) => {
        const recipe = recipes.find(r => r.id === item.recipe_id)
        if (recipe) {
          // Calculate actual ingredient cost per unit
          const costPerUnit = recipe.total_cost || 0
          return itemSum + (costPerUnit * item.quantity)
        }
        return itemSum
      }, 0)
      return sum + quoteCosts
    }
    return sum
  }, 0)
  
  const profit = totalRevenue - totalCosts
  const profitMargin = totalRevenue > 0 ? ((profit / totalRevenue) * 100) : 0
  
  return {
    totalRevenue,
    totalCosts,
    profit,
    profitMargin,
    quotesCount: recentQuotes.length
  }
}

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}
