const QuotesList = ({ quotes, onView, onDelete, isMobile }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h2>Mis Cotizaciones</h2>
      </div>
      <div className="card-body">
        {quotes.length === 0 ? (
          <div className="empty-state">
            <h3>No hay cotizaciones aún</h3>
            <p>¡Crea tu primera cotización!</p>
          </div>
        ) : isMobile ? (
          <div className="mobile-list">
            {quotes.map(quote => (
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
                    <span className="mobile-label">Fecha:</span>
                    <span className="mobile-value">{new Date(quote.created_at).toLocaleDateString('es-ES')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Cliente</th>
                  <th>Total Fijo</th>
                  <th>Fecha Creación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map(quote => (
                  <tr key={quote.id}>
                    <td><strong>{quote.name}</strong></td>
                    <td>{quote.client_name || 'N/A'}</td>
                    <td><strong>${(quote.total_cost || 0).toFixed(2)}</strong></td>
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuotesList
