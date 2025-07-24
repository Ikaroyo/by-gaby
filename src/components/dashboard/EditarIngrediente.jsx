import { useState } from 'react'
import { supabase } from '../../lib/supabase'

const EditarIngrediente = ({ ingredient, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: ingredient.name || '',
    brand: ingredient.brand || '',
    quantity: ingredient.quantity || '',
    unit: ingredient.unit || 'g',
    price: ingredient.price || ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const quantity = Math.round(parseFloat(formData.quantity) * 100) / 100
      const price = Math.round(parseFloat(formData.price) * 100) / 100
      
      const { error } = await supabase
        .from('ingredients')
        .update({
          name: formData.name,
          brand: formData.brand,
          quantity: quantity,
          unit: formData.unit,
          price: price
        })
        .eq('id', ingredient.id)

      if (error) throw error

      setMessage('¡Ingrediente actualizado exitosamente!')
      onSuccess()
      setTimeout(() => onCancel(), 1500)
    } catch (error) {
      setMessage('Error al actualizar ingrediente: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3>Editar Ingrediente</h3>
        <button onClick={onCancel} className="btn btn-secondary btn-sm">
          <i className="fas fa-times"></i> Cancelar
        </button>
      </div>
      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre del Ingrediente</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="ej. Harina"
          />
        </div>
        <div className="form-group">
          <label>Marca</label>
          <input
            type="text"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            placeholder="ej. Harina Blanca"
          />
        </div>
        <div className="form-group">
          <label>Cantidad</label>
          <div className="number-input-wrapper">
            <input
              type="number"
              step="0.01"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
              placeholder="ej. 1000"
            />
            <div className="number-controls mobile-only">
              <button
                type="button"
                className="number-btn number-btn-up"
                onClick={() => setFormData({ ...formData, quantity: (parseFloat(formData.quantity) + 1).toString() })}
                disabled={!formData.quantity}
              >
                <i className="fas fa-plus"></i>
              </button>
              <button
                type="button"
                className="number-btn number-btn-down"
                onClick={() => setFormData({ ...formData, quantity: Math.max(0, parseFloat(formData.quantity) - 1).toString() })}
                disabled={!formData.quantity || parseFloat(formData.quantity) <= 0}
              >
                <i className="fas fa-minus"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label>Unidad</label>
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
        <div className="form-group">
          <label>Precio ($)</label>
          <div className="number-input-wrapper">
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              placeholder="ej. 4.99"
            />
            <div className="number-controls mobile-only">
              <button
                type="button"
                className="number-btn number-btn-up"
                onClick={() => setFormData({ ...formData, price: (parseFloat(formData.price) + 1).toString() })}
                disabled={!formData.price}
              >
                <i className="fas fa-plus"></i>
              </button>
              <button
                type="button"
                className="number-btn number-btn-down"
                onClick={() => setFormData({ ...formData, price: Math.max(0, parseFloat(formData.price) - 1).toString() })}
                disabled={!formData.price || parseFloat(formData.price) <= 0}
              >
                <i className="fas fa-minus"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Actualizando...' : 'Actualizar Ingrediente'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditarIngrediente
