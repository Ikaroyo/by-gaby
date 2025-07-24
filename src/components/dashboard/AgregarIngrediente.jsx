import { useState } from 'react'
import { supabase } from '../../lib/supabase'

const AgregarIngrediente = ({ onSuccess }) => {
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
      const { error } = await supabase.from('ingredients').insert([
        {
          name: formData.name,
          brand: formData.brand,
          quantity: parseFloat(formData.quantity),
          unit: formData.unit,
          price: parseFloat(formData.price)
        }
      ])

      if (error) throw error

      setMessage('¡Ingrediente agregado exitosamente!')
      setFormData({ name: '', brand: '', quantity: '', unit: 'g', price: '' })
      onSuccess()
    } catch (error) {
      setMessage('Error al agregar ingrediente: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-section">
      <h3>Agregar Nuevo Ingrediente</h3>
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
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
            placeholder="ej. 4.99"
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Agregando...' : 'Agregar Ingrediente'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AgregarIngrediente
