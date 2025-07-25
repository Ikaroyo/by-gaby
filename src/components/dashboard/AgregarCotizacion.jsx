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
  const [roundPrices, setRoundPrices] = useState(false)

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

  const calculateProductPrice = (recipe) => {
    const baseCost = recipe.total_cost || 0
    const price = baseCost * (1 + profitMargin / 100)
    return roundPrices ? Math.ceil(price) : price
  }

  const calculateBaseCost = () => {
    return quoteRecipes.reduce((total, qr) => {
      const recipe = recipes.find(rec => rec.id === qr.recipe_id)
      if (recipe && qr.quantity) {
        const baseCost = recipe.total_cost || 0
        return total + (parseInt(qr.quantity) * baseCost)
      }
      return total
    }, 0)
  }

  const calculateFinalCost = () => {
    return quoteRecipes.reduce((total, qr) => {
      const recipe = recipes.find(rec => rec.id === qr.recipe_id)
      if (recipe && qr.quantity) {
        const productPrice = calculateProductPrice(recipe)
        return total + (parseInt(qr.quantity) * productPrice)
      }
      return total
    }, 0)
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
            const productPrice = calculateProductPrice(recipe)
            return {
              quote_id: quote.id,
              recipe_id: qr.recipe_id,
              quantity: parseInt(qr.quantity),
              unit_cost: productPrice,
              total_cost: productPrice * parseInt(qr.quantity)
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

  const updateRecipeQuantity = (index, increment) => {
    const updated = [...quoteRecipes]
    const currentQuantity = parseInt(updated[index].quantity) || 1
    const newQuantity = Math.max(1, currentQuantity + increment)
    updated[index].quantity = newQuantity
    setQuoteRecipes(updated)
  }

  return (
    <div className="form-section">
      <h3>
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
              <div className="number-input-wrapper">
                <input
                  type="number"
                  min="1"
                  placeholder="Cantidad"
                  value={qr.quantity}
                  onChange={(e) => updateRecipe(index, 'quantity', e.target.value)}
                  required
                />
                <div className="number-controls mobile-only">
                  <button
                    type="button"
                    className="number-btn number-btn-up"
                    onClick={() => updateRecipeQuantity(index, 1)}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                  <button
                    type="button"
                    className="number-btn number-btn-down"
                    onClick={() => updateRecipeQuantity(index, -1)}
                    disabled={parseInt(qr.quantity) <= 1}
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                </div>
              </div>
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
            <h4>Configuración de Precios</h4>
            <div className="profit-controls">
              <label>Margen de ganancia:</label>
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
              <small>Este margen se incluye en el precio de cada producto</small>
            </div>
            
            <div className="rounding-controls">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={roundPrices}
                  onChange={(e) => setRoundPrices(e.target.checked)}
                />
                <span className="checkmark"></span>
                Redondear precios hacia arriba (números enteros)
              </label>
              <small>Los precios se redondearán al número entero superior más cercano</small>
            </div>
            
            <div className="profit-summary">
              <h5>Vista previa de precios:</h5>
              {quoteRecipes.map((qr, index) => {
                const recipe = recipes.find(rec => rec.id === qr.recipe_id)
                if (!recipe || !qr.quantity) return null
                
                const basePrice = recipe.total_cost || 0
                const finalPrice = calculateProductPrice(recipe)
                
                return (
                  <div key={index} className="price-preview">
                    <span>{recipe.name} × {qr.quantity}:</span>
                    <span>
                      <small>${basePrice.toFixed(2)} → </small>
                      <strong>${finalPrice.toFixed(2)} c/u = {(finalPrice * qr.quantity).toFixed(2)}</strong>
                      {roundPrices && finalPrice !== basePrice * (1 + profitMargin / 100) && (
                        <small className="rounded-indicator"> (redondeado)</small>
                      )}
                    </span>
                  </div>
                )
              })}
              
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                <p>
                  <span>Total cotización:</span>
                  <strong style={{ color: '#059669', fontSize: '1.1em' }}>${calculateFinalCost().toFixed(2)}</strong>
                </p>
              </div>
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
