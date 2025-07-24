import { useState } from 'react'
import { supabase } from '../../lib/supabase'

const IngredientModal = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    quantity: '',
    unit: 'g',
    price: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { data, error } = await supabase.from('ingredients').insert([
        {
          name: formData.name,
          brand: formData.brand,
          quantity: parseFloat(formData.quantity),
          unit: formData.unit,
          price: parseFloat(formData.price)
        }
      ]).select().single()

      if (error) throw error

      setMessage('¡Ingrediente agregado exitosamente!')
      setTimeout(() => {
        onSuccess(data)
      }, 1000)
    } catch (error) {
      setMessage('Error al agregar ingrediente: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>
            <i className="fas fa-plus-circle"></i>
            Agregar Nuevo Ingrediente
          </h3>
          <button onClick={onCancel} className="btn-close">
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="modal-body">
          {message && (
            <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
              {message}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                <i className="fas fa-tag"></i>
                Nombre del Ingrediente
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="ej. Harina"
                autoFocus
              />
            </div>
            
            <div className="form-group">
              <label>
                <i className="fas fa-store"></i>
                Marca
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="ej. Harina Blanca"
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>
                  <i className="fas fa-weight"></i>
                  Cantidad
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                  placeholder="ej. 1000"
                />
              </div>
              
              <div className="form-group">
                <label>
                  <i className="fas fa-ruler"></i>
                  Unidad
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                >
                  <option value="g">Gramos (g)</option>
                  <option value="ml">Mililitros (ml)</option>
                  <option value="kg">Kilogramos (kg)</option>
                  <option value="l">Litros (l)</option>
                  <option value="unit">Unidades</option>
                  <option value="oz">Onzas (oz)</option>
                  <option value="lb">Libras (lb)</option>
                  <option value="cup">Tazas</option>
                  <option value="tsp">Cucharaditas</option>
                  <option value="tbsp">Cucharadas</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label>
                <i className="fas fa-dollar-sign"></i>
                Precio ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                placeholder="ej. 4.99"
              />
            </div>
            
            <div className="modal-actions">
              <button type="button" onClick={onCancel} className="btn btn-secondary">
                <i className="fas fa-times"></i>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                <i className="fas fa-check"></i>
                {loading ? 'Agregando...' : 'Agregar Ingrediente'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default IngredientModal
