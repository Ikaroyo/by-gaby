/** biome-ignore-all lint/a11y/useButtonType: <explanation> */
/** biome-ignore-all lint/correctness/noUnusedFunctionParameters: <explanation> */
import { useState } from 'react'

const QuotesList = ({ quotes, onView, onDelete, isMobile, recipes = [] }) => {
  const [searchTerm, setSearchTerm] = useState('')

  // Fuzzy search algorithm
  const fuzzyMatch = (text, query) => {
    if (!query) return true
    
    const textLower = text.toLowerCase()
    const queryLower = query.toLowerCase()
    
    // Exact match
    if (textLower.includes(queryLower)) return true
    
    // Character similarity
    let score = 0
    let queryIndex = 0
    
    for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
      if (textLower[i] === queryLower[queryIndex]) {
        score++
        queryIndex++
      }
    }
    
    // Return true if at least 70% of query characters are found in order
    return score / queryLower.length >= 0.7
  }

  const filteredQuotes = quotes.filter(quote => {
    if (!searchTerm) return true
    
    return fuzzyMatch(quote.name, searchTerm) || 
           (quote.client_name && fuzzyMatch(quote.client_name, searchTerm))
  })

  // Calculate profit for a quote using database fields
  const calculateQuoteProfit = (quote) => {
    const totalCost = quote.total_cost || 0
    const profitMargin = quote.profit_margin || 0
    
    // Since total_cost includes profit, we need to calculate base cost first
    // If total_cost = base_cost * (1 + profit_margin/100)
    // Then base_cost = total_cost / (1 + profit_margin/100)
    // And profit = total_cost - base_cost
    
    if (profitMargin > 0) {
      const baseCost = totalCost / (1 + profitMargin / 100)
      return totalCost - baseCost
    }
    
    return 0
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>Mis Cotizaciones</h2>
        <div style={{ marginTop: '1rem', position: 'relative', maxWidth: '300px' }}>
          <input
            type="text"
            placeholder="Buscar por nombre o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%',
              padding: '1rem 1rem 1rem 3rem',
              border: '2px solid var(--gray-200)',
              borderRadius: 'var(--radius)',
              fontSize: '1rem',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              paddingRight: searchTerm ? '2.5rem' : '1rem'
            }}
          />
          <i 
            className="fas fa-search" 
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              fontSize: '1rem'
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute',
                right: '0.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.25rem',
                fontSize: '0.875rem'
              }}
              title="Limpiar búsqueda"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
      </div>
      <div className="card-body">
        {filteredQuotes.length === 0 ? (
          <div className="empty-state">
            <h3>{searchTerm ? 'No se encontraron cotizaciones' : 'No hay cotizaciones aún'}</h3>
            <p>{searchTerm ? 'Intenta con otros términos de búsqueda' : '¡Crea tu primera cotización!'}</p>
          </div>
        ) : isMobile ? (
          <div className="mobile-list">
            {filteredQuotes.map(quote => {
              const profit = calculateQuoteProfit(quote)
              return (
                <div key={quote.id} className="mobile-item">
                  <div className="mobile-item-header">
                    <h4>{quote.name}</h4>
                    <div className="mobile-actions">
                      <button
                        onClick={() => onView(quote)}
                        className="btn btn-primary btn-sm"
                        title="Ver Presupuesto"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        onClick={() => onDelete(quote.id)}
                        className="btn btn-danger btn-sm"
                        title="Eliminar"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="mobile-item-content">
                    <div className="mobile-field">
                      <span className="mobile-label">Cliente:</span>
                      <span className="mobile-value">{quote.client_name || 'N/A'}</span>
                    </div>
                    
                    <div className="mobile-field">
                      <span className="mobile-label">Total:</span>
                      <span className="mobile-value">
                        <strong>${(quote.total_cost || 0).toFixed(2)}</strong>
                      </span>
                    </div>
                    
                    <div className="mobile-field">
                      <span className="mobile-label">Ganancia:</span>
                      <span className="mobile-value">
                        <strong style={{ color: profit >= 0 ? 'var(--success-color)' : 'var(--danger-color)' }}>
                          ${profit.toFixed(2)}
                        </strong>
                      </span>
                    </div>
                    
                    <div className="mobile-field">
                      <span className="mobile-label">Fecha:</span>
                      <span className="mobile-value">{new Date(quote.created_at).toLocaleDateString('es-ES')}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Cliente</th>
                  <th>Total Fijo</th>
                  <th>Ganancia</th>
                  <th>Fecha Creación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuotes.map(quote => {
                  const profit = calculateQuoteProfit(quote)
                  return (
                    <tr key={quote.id}>
                      <td><strong>{quote.name}</strong></td>
                      <td>{quote.client_name || 'N/A'}</td>
                      <td><strong>${(quote.total_cost || 0).toFixed(2)}</strong></td>
                      <td>
                        <strong style={{ color: profit >= 0 ? 'var(--success-color)' : 'var(--danger-color)' }}>
                          ${profit.toFixed(2)}
                        </strong>
                      </td>
                      <td>{new Date(quote.created_at).toLocaleDateString('es-ES')}</td>
                      <td>
                        <button
                          onClick={() => onView(quote)}
                          className="btn btn-primary btn-sm"
                          style={{ marginRight: '0.5rem' }}
                        >
                          Ver Presupuesto
                        </button>
                        <button
                          onClick={() => onDelete(quote.id)}
                          className="btn btn-danger btn-sm"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuotesList