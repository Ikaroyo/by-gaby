const RecipesList = ({ recipes, onEdit, onDelete, isMobile }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h2>Mis Recetas</h2>
      </div>
      <div className="card-body">
        {recipes.length === 0 ? (
          <div className="empty-state">
            <h3>No hay recetas aún</h3>
            <p>¡Crea tu primera receta para comenzar!</p>
          </div>
        ) : isMobile ? (
          <div className="mobile-list">
            {recipes.map(recipe => (
              <div key={recipe.id} className="mobile-item">
                <div className="mobile-item-header">
                  <h4>{recipe.name}</h4>
                  <div className="mobile-actions">
                    <button
                      onClick={() => onEdit(recipe)}
                      className="btn btn-primary btn-sm"
                      title="Editar"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => onDelete(recipe.id)}
                      className="btn btn-danger btn-sm"
                      title="Eliminar"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
                
                <div className="mobile-item-content">
                  {recipe.description && (
                    <div className="mobile-field">
                      <span className="mobile-label">Descripción:</span>
                      <span className="mobile-value">{recipe.description}</span>
                    </div>
                  )}
                  
                  <div className="mobile-field">
                    <span className="mobile-label">Tamaño:</span>
                    <span className="mobile-value">{recipe.servings} {recipe.size_type || 'porciones'}</span>
                  </div>
                  
                  <div className="mobile-field">
                    <span className="mobile-label">Costo Total:</span>
                    <span className="mobile-value">
                      <strong>${recipe.total_cost?.toFixed(2) || '0.00'}</strong>
                    </span>
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
                  <th>Descripción</th>
                  <th>Tamaño</th>
                  <th>Costo Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {recipes.map(recipe => (
                  <tr key={recipe.id}>
                    <td>
                      <strong>{recipe.name}</strong>
                    </td>
                    <td>{recipe.description}</td>
                    <td>{recipe.servings} {recipe.size_type || 'porciones'}</td>
                    <td><strong>${recipe.total_cost?.toFixed(2) || '0.00'}</strong></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button
                          onClick={() => onEdit(recipe)}
                          className="btn btn-primary btn-sm"
                          title="Editar"
                        >
                          {isMobile ? <i className="fas fa-edit"></i> : 'Editar'}
                        </button>
                        <button
                          onClick={() => onDelete(recipe.id)}
                          className="btn btn-danger btn-sm"
                          title="Eliminar"
                        >
                          {isMobile ? <i className="fas fa-trash"></i> : 'Eliminar'}
                        </button>
                      </div>
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

export default RecipesList
