const QuotesList = ({ quotes, onView, onDelete }) => {
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
