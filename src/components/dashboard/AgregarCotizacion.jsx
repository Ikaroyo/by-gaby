import { useState } from 'react'
import { supabase } from '../../lib/supabase'

const AgregarCotizacion = ({ recipes, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    client_name: ''
  })
  const [quoteRecipes, setQuoteRecipes] = useState([])
  const [profitMargin, setProfitMargin] = useState(() => {
    return parseFloat(localStorage.getItem('profitMargin') || '20')
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const addRecipe = () => {
    setQuoteRecipes([...quoteRecipes, { recipe_id: '', quantity: 1 }])
  }

  const updateRecipe = (index, field, value) => {
    const updated = [...quoteRecipes]
    updated[index][field] = value
    setQuoteRecipes(updated)
  }

  const removeRecipe = (index) => {
    setQuoteRecipes(quoteRecipes.filter((_, i) => i !== index))
  }

  const calculateBaseCost = () => {
    return quoteRecipes.reduce((total, qr) => {
      const recipe = recipes.find(rec => rec.id === qr.recipe_id)
      if (recipe && qr.quantity) {
        return total + (parseInt(qr.quantity) * (recipe.total_cost || 0))
      }
      return total
    }, 0)
  }

  const calculateFinalCost = () => {
    const baseCost = calculateBaseCost()
    return baseCost * (1 + profitMargin / 100)
  }

  const handleProfitMarginChange = (newMargin) => {
    setProfitMargin(newMargin)
    localStorage.setItem('profitMargin', newMargin.toString())
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const baseCost = calculateBaseCost()
      const finalCost = calculateFinalCost()

      const { data: quote, error: quoteError } = await supabase
        .from('quotes')
        .insert([{
          name: formData.name,
          client_name: formData.client_name,
          profit_margin: profitMargin,
          base_cost: baseCost,
          total_cost: finalCost
        }])
        .select()
        .single()

      if (quoteError) throw quoteError

      if (quoteRecipes.length > 0) {
        const recipeData = quoteRecipes
          .filter(qr => qr.recipe_id && qr.quantity)
          .map(qr => {
            const recipe = recipes.find(rec => rec.id === qr.recipe_id)
            return {
              quote_id: quote.id,
              recipe_id: qr.recipe_id,
              quantity: parseInt(qr.quantity),
              unit_cost: recipe?.total_cost || 0,
              total_cost: (recipe?.total_cost || 0) * parseInt(qr.quantity)
            }
          })

        const { error: recipesError } = await supabase
          .from('quote_recipes')
          .insert(recipeData)

        if (recipesError) throw recipesError
      }

      setMessage('¡Cotización agregada exitosamente!')
      setFormData({ name: '', client_name: '' })
      setQuoteRecipes([])
      onSuccess()
    } catch (error) {
      setMessage('Error al agregar cotización: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-section">
      <h3>
        <i className="fas fa-file-invoice-dollar"></i>
        Agregar Nueva Cotización
      </h3>
      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            <i className="fas fa-tag"></i>
            Nombre de la Cotización
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="ej. Pedido Cumpleaños María"
          />
        </div>
        
        <div className="form-group">
          <label>
            <i className="fas fa-user"></i>
            Nombre del Cliente
          </label>
          <input
            type="text"
            value={formData.client_name}
            onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
            placeholder="Nombre del cliente (opcional)"
          />
        </div>

        <div className="recipe-ingredients">
          <h4>Recetas de la Cotización</h4>
          {quoteRecipes.map((qr, index) => (
            <div key={index} className="ingredient-item">
              <select
                value={qr.recipe_id}
                onChange={(e) => updateRecipe(index, 'recipe_id', e.target.value)}
                required
              >
                <option value="">Seleccionar receta</option>
                {recipes.map(recipe => (
                  <option key={recipe.id} value={recipe.id}>
                    {recipe.name} - ${recipe.total_cost?.toFixed(2) || '0.00'} ({recipe.servings} {recipe.size_type})
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                placeholder="Cantidad"
                value={qr.quantity}
                onChange={(e) => updateRecipe(index, 'quantity', e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => removeRecipe(index)}
                className="btn btn-danger btn-sm"
              >
                <i className="fas fa-trash"></i>
                Quitar
              </button>
            </div>
          ))}
          
          <div className="add-ingredients-buttons">
            <button type="button" onClick={addRecipe} className="btn btn-secondary">
              <i className="fas fa-plus"></i>
              Agregar Receta
            </button>
          </div>
        </div>

        {quoteRecipes.length > 0 && (
          <div className="profit-section">
            <h4>Margen de Ganancia</h4>
            <div className="profit-controls">
              <label>Porcentaje de ganancia:</label>
              <div className="profit-input">
                <input
                  type="number"
                  min="0"
                  max="500"
                  step="0.1"
                  value={profitMargin}
                  onChange={(e) => handleProfitMarginChange(parseFloat(e.target.value) || 0)}
                />
                <span>%</span>
              </div>
              <small>Este valor se guardará para futuras cotizaciones</small>
            </div>
            
            <div className="profit-summary">
              <p>
                <span>Costo base:</span>
                <strong>${calculateBaseCost().toFixed(2)}</strong>
              </p>
              <p>
                <span>Ganancia ({profitMargin}%):</span>
                <strong>${(calculateFinalCost() - calculateBaseCost()).toFixed(2)}</strong>
              </p>
              <p style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                <span>Total final:</span>
                <strong style={{ color: '#059669', fontSize: '1.1em' }}>${calculateFinalCost().toFixed(2)}</strong>
              </p>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <i className="fas fa-check"></i>
            {loading ? 'Agregando...' : 'Agregar Cotización'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AgregarCotizacion
