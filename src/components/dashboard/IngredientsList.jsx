import { useState } from 'react'
import { supabase } from '../../lib/supabase'

const IngredientsList = ({ ingredients, setIngredients, onEdit, onDelete, onDataChange }) => {
  const [editingPrice, setEditingPrice] = useState(null)
  const [editingQuantity, setEditingQuantity] = useState(null)
  const [tempPrice, setTempPrice] = useState('')
  const [tempQuantity, setTempQuantity] = useState('')

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
      const { error } = await supabase
        .from('ingredients')
        .update({ price: parseFloat(tempPrice) })
        .eq('id', ingredientId)

      if (error) throw error

      const updatedIngredients = ingredients.map(ing => 
        ing.id === ingredientId 
          ? { ...ing, price: parseFloat(tempPrice), price_per_unit: parseFloat(tempPrice) / ing.quantity }
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
      const { error } = await supabase
        .from('ingredients')
        .update({ quantity: parseFloat(tempQuantity) })
        .eq('id', ingredientId)

      if (error) throw error

      const updatedIngredients = ingredients.map(ing => 
        ing.id === ingredientId 
          ? { ...ing, quantity: parseFloat(tempQuantity), price_per_unit: ing.price / parseFloat(tempQuantity) }
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
        <small style={{ color: 'var(--text-muted)', marginTop: '0.5rem', display: 'block' }}>
          💡 Haz clic en el precio o cantidad para editarlos rápidamente. Los costos de las recetas se actualizarán automáticamente.
        </small>
      </div>
      <div className="card-body">
        {ingredients.length === 0 ? (
          <div className="empty-state">
            <h3>No hay ingredientes aún</h3>
            <p>¡Agrega tu primer ingrediente para empezar!</p>
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
                {ingredients.map(ingredient => (
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
                    <td><strong>${ingredient.price_per_unit?.toFixed(4)}</strong></td>
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
