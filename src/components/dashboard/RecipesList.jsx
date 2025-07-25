import { useState } from 'react'

const RecipesList = ({ recipes, onEdit, onDelete, isMobile }) => {
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

  const filteredRecipes = recipes.filter(recipe => {
    if (!searchTerm) return true
    
    return fuzzyMatch(recipe.name, searchTerm) || 
           (recipe.description && fuzzyMatch(recipe.description, searchTerm))
  })

  return (
    <div className="card">
      <div className="card-header">
        <h2>Mis Recetas</h2>
        <div style={{ marginTop: '1rem', position: 'relative', maxWidth: '300px' }}>
          <input
            type="text"
            placeholder="Buscar por nombre o descripción..."
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
        {filteredRecipes.length === 0 ? (
          <div className="empty-state">
            <h3>{searchTerm ? 'No se encontraron recetas' : 'No hay recetas aún'}</h3>
            <p>{searchTerm ? 'Intenta con otros términos de búsqueda' : '¡Crea tu primera receta para comenzar!'}</p>
          </div>
        ) : isMobile ? (
          <div className="mobile-list">
            {filteredRecipes.map(recipe => (
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
                {filteredRecipes.map(recipe => (
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
