import { useState } from 'react'
import { supabase } from '../../lib/supabase'

const IngredientsList = ({ ingredients, setIngredients, onEdit, onDelete, onDataChange, isMobile }) => {
  const [editingPrice, setEditingPrice] = useState(null)
  const [editingQuantity, setEditingQuantity] = useState(null)
  const [tempPrice, setTempPrice] = useState('')
  const [tempQuantity, setTempQuantity] = useState('')
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

  const filteredIngredients = ingredients.filter(ingredient => {
    if (!searchTerm) return true
    
    return fuzzyMatch(ingredient.name, searchTerm) || 
           fuzzyMatch(ingredient.brand, searchTerm)
  })

  const startPriceEdit = (ingredient) => {
    setEditingPrice(ingredient.id)
    setTempPrice(ingredient.price.toString())
  }

  const cancelPriceEdit = () => {
    setEditingPrice(null)
    setTempPrice('')
  }

  const savePriceEdit = async (ingredientId) => {
    try {
      const price = Math.round(parseFloat(tempPrice) * 100) / 100
      
      const { error } = await supabase
        .from('ingredients')
        .update({ price: price })
        .eq('id', ingredientId)

      if (error) throw error

      const updatedIngredients = ingredients.map(ing => 
        ing.id === ingredientId 
          ? { ...ing, price: price, price_per_unit: price / ing.quantity }
          : ing
      )
      setIngredients(updatedIngredients)
      
      await onDataChange()
      
      setEditingPrice(null)
      setTempPrice('')
    } catch (error) {
      console.error('Error updating price:', error)
      alert('Error al actualizar el precio')
    }
  }

  const startQuantityEdit = (ingredient) => {
    setEditingQuantity(ingredient.id)
    setTempQuantity(ingredient.quantity.toString())
  }

  const cancelQuantityEdit = () => {
    setEditingQuantity(null)
    setTempQuantity('')
  }

  const saveQuantityEdit = async (ingredientId) => {
    try {
      const quantity = Math.round(parseFloat(tempQuantity) * 100) / 100
      
      const { error } = await supabase
        .from('ingredients')
        .update({ quantity: quantity })
        .eq('id', ingredientId)

      if (error) throw error

      const updatedIngredients = ingredients.map(ing => 
        ing.id === ingredientId 
          ? { ...ing, quantity: quantity, price_per_unit: ing.price / quantity }
          : ing
      )
      setIngredients(updatedIngredients)
      
      await onDataChange()
      
      setEditingQuantity(null)
      setTempQuantity('')
    } catch (error) {
      console.error('Error updating quantity:', error)
      alert('Error al actualizar la cantidad')
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>Mis Ingredientes</h2>
        <div style={{ marginTop: '1rem', position: 'relative', maxWidth: '300px' }}>
          <input
            type="text"
            placeholder="Buscar por nombre o marca..."
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
        <small style={{ color: 'var(--text-muted)', marginTop: '0.5rem', display: 'block' }}>
          💡 Haz clic en el precio o cantidad para editarlos rápidamente. Los costos de las recetas se actualizarán automáticamente.
        </small>
      </div>
      <div className="card-body">
        {filteredIngredients.length === 0 ? (
          <div className="empty-state">
            <h3>{searchTerm ? 'No se encontraron ingredientes' : 'No hay ingredientes aún'}</h3>
            <p>{searchTerm ? 'Intenta con otros términos de búsqueda' : '¡Agrega tu primer ingrediente para empezar!'}</p>
          </div>
        ) : isMobile ? (
          <div className="mobile-list">
            {filteredIngredients.map(ingredient => (
              <div key={ingredient.id} className="mobile-item">
                <div className="mobile-item-header">
                  <h4>{ingredient.name}</h4>
                  <div className="mobile-actions">
                    <button
                      onClick={() => onEdit(ingredient)}
                      className="btn btn-primary btn-sm"
                      title="Editar"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => onDelete(ingredient.id)}
                      className="btn btn-danger btn-sm"
                      title="Eliminar"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
                
                <div className="mobile-item-content">
                  <div className="mobile-field">
                    <span className="mobile-label">Marca:</span>
                    <span className="mobile-value">{ingredient.brand}</span>
                  </div>
                  
                  <div className="mobile-field">
                    <span className="mobile-label">Cantidad:</span>
                    <span className="mobile-value">
                      {editingQuantity === ingredient.id ? (
                        <div className="inline-quantity-edit">
                          <input
                            type="number"
                            step="0.01"
                            value={tempQuantity}
                            onChange={(e) => setTempQuantity(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                saveQuantityEdit(ingredient.id)
                              } else if (e.key === 'Escape') {
                                cancelQuantityEdit()
                              }
                            }}
                            autoFocus
                            className="mobile-inline-input"
                          />
                          <div className="inline-edit-actions">
                            <button
                              onClick={() => saveQuantityEdit(ingredient.id)}
                              className="btn-inline-save"
                              title="Guardar"
                            >
                              <i className="fas fa-check"></i>
                            </button>
                            <button
                              onClick={cancelQuantityEdit}
                              className="btn-inline-cancel"
                              title="Cancelar"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span 
                          className="quantity-clickable"
                          onClick={() => startQuantityEdit(ingredient)}
                          title="Tocar para editar"
                        >
                          <strong>{ingredient.quantity} {ingredient.unit}</strong>
                          <i className="fas fa-edit quantity-edit-icon"></i>
                        </span>
                      )}
                    </span>
                  </div>
                  
                  <div className="mobile-field">
                    <span className="mobile-label">Precio:</span>
                    <span className="mobile-value">
                      {editingPrice === ingredient.id ? (
                        <div className="inline-price-edit">
                          <input
                            type="number"
                            step="0.01"
                            value={tempPrice}
                            onChange={(e) => setTempPrice(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                savePriceEdit(ingredient.id)
                              } else if (e.key === 'Escape') {
                                cancelPriceEdit()
                              }
                            }}
                            autoFocus
                            className="mobile-inline-input"
                          />
                          <div className="inline-edit-actions">
                            <button
                              onClick={() => savePriceEdit(ingredient.id)}
                              className="btn-inline-save"
                              title="Guardar"
                            >
                              <i className="fas fa-check"></i>
                            </button>
                            <button
                              onClick={cancelPriceEdit}
                              className="btn-inline-cancel"
                              title="Cancelar"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span 
                          className="price-clickable"
                          onClick={() => startPriceEdit(ingredient)}
                          title="Tocar para editar"
                        >
                          <strong>${ingredient.price?.toFixed(2)}</strong>
                          <i className="fas fa-edit price-edit-icon"></i>
                        </span>
                      )}
                    </span>
                  </div>
                  
                  <div className="mobile-field">
                    <span className="mobile-label">Precio por unidad:</span>
                    <span className="mobile-value">
                      <strong>${ingredient.price_per_unit?.toFixed(2)}</strong>
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
                  <th>Marca</th>
                  <th>Cantidad</th>
                  <th>Unidad</th>
                  <th>Precio</th>
                  <th>Precio por Unidad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredIngredients.map(ingredient => (
                  <tr key={ingredient.id}>
                    <td><strong>{ingredient.name}</strong></td>
                    <td>{ingredient.brand}</td>
                    <td>
                      {editingQuantity === ingredient.id ? (
                        <div className="inline-quantity-edit">
                          <input
                            type="number"
                            step="0.01"
                            value={tempQuantity}
                            onChange={(e) => setTempQuantity(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                saveQuantityEdit(ingredient.id)
                              } else if (e.key === 'Escape') {
                                cancelQuantityEdit()
                              }
                            }}
                            autoFocus
                            style={{
                              width: '80px',
                              padding: '0.25rem 0.5rem',
                              border: '2px solid var(--secondary-color)',
                              borderRadius: '4px',
                              fontSize: '0.875rem'
                            }}
                          />
                          <div className="inline-edit-actions">
                            <button
                              onClick={() => saveQuantityEdit(ingredient.id)}
                              className="btn-inline-save"
                              title="Guardar (Enter)"
                            >
                              <i className="fas fa-check"></i>
                            </button>
                            <button
                              onClick={cancelQuantityEdit}
                              className="btn-inline-cancel"
                              title="Cancelar (Escape)"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span 
                          className="quantity-clickable"
                          onClick={() => startQuantityEdit(ingredient)}
                          title="Clic para editar cantidad"
                        >
                          <strong>{ingredient.quantity}</strong>
                          <i className="fas fa-edit quantity-edit-icon"></i>
                        </span>
                      )}
                    </td>
                    <td>{ingredient.unit}</td>
                    <td>
                      {editingPrice === ingredient.id ? (
                        <div className="inline-price-edit">
                          <input
                            type="number"
                            step="0.01"
                            value={tempPrice}
                            onChange={(e) => setTempPrice(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                savePriceEdit(ingredient.id)
                              } else if (e.key === 'Escape') {
                                cancelPriceEdit()
                              }
                            }}
                            autoFocus
                            style={{
                              width: '80px',
                              padding: '0.25rem 0.5rem',
                              border: '2px solid var(--primary-color)',
                              borderRadius: '4px',
                              fontSize: '0.875rem'
                            }}
                          />
                          <div className="inline-edit-actions">
                            <button
                              onClick={() => savePriceEdit(ingredient.id)}
                              className="btn-inline-save"
                              title="Guardar (Enter)"
                            >
                              <i className="fas fa-check"></i>
                            </button>
                            <button
                              onClick={cancelPriceEdit}
                              className="btn-inline-cancel"
                              title="Cancelar (Escape)"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span 
                          className="price-clickable"
                          onClick={() => startPriceEdit(ingredient)}
                          title="Clic para editar precio"
                        >
                          <strong>${ingredient.price?.toFixed(2)}</strong>
                          <i className="fas fa-edit price-edit-icon"></i>
                        </span>
                      )}
                    </td>
                    <td><strong>${ingredient.price_per_unit?.toFixed(2)}</strong></td>
                    <td>
                      <button
                        onClick={() => onEdit(ingredient)}
                        className="btn btn-primary btn-sm"
                        style={{ marginRight: '0.5rem' }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => onDelete(ingredient.id)}
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

export default IngredientsList
