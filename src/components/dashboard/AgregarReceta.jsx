import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import IngredientModal from './IngredientModal'

const AgregarReceta = ({ ingredients, onSuccess, onAddIngredient }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    servings: 1,
    size_type: 'porciones'
  })
  const [recipeIngredients, setRecipeIngredients] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showNewIngredientModal, setShowNewIngredientModal] = useState(false)

  const addIngredient = () => {
    setRecipeIngredients([...recipeIngredients, { ingredient_id: '', quantity_used: '' }])
  }

  const updateIngredient = (index, field, value) => {
    const updated = [...recipeIngredients]
    updated[index][field] = value
    setRecipeIngredients(updated)
  }

  const removeIngredient = (index) => {
    setRecipeIngredients(recipeIngredients.filter((_, i) => i !== index))
  }

  const calculateTotalCost = () => {
    return recipeIngredients.reduce((total, ri) => {
      const ingredient = ingredients.find(ing => ing.id === ri.ingredient_id)
      if (ingredient && ri.quantity_used) {
        return total + (parseFloat(ri.quantity_used) * ingredient.price_per_unit)
      }
      return total
    }, 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { data: recipe, error: recipeError } = await supabase
        .from('recipes')
        .insert([{
          name: formData.name,
          description: formData.description,
          servings: parseInt(formData.servings),
          size_type: formData.size_type
        }])
        .select()
        .single()

      if (recipeError) throw recipeError

      if (recipeIngredients.length > 0) {
        const ingredientData = recipeIngredients
          .filter(ri => ri.ingredient_id && ri.quantity_used)
          .map(ri => ({
            recipe_id: recipe.id,
            ingredient_id: ri.ingredient_id,
            quantity_used: parseFloat(ri.quantity_used)
          }))

        const { error: ingredientsError } = await supabase
          .from('recipe_ingredients')
          .insert(ingredientData)

        if (ingredientsError) throw ingredientsError
      }

      setMessage('¡Receta agregada exitosamente!')
      setFormData({ name: '', description: '', servings: 1, size_type: 'porciones' })
      setRecipeIngredients([])
      onSuccess()
    } catch (error) {
      setMessage('Error al agregar receta: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-section">
      <h3>Agregar Nueva Receta</h3>
      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre de la Receta</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="ej. Torta de Chocolate"
          />
        </div>
        
        <div className="form-group">
          <label>Descripción</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Breve descripción de la receta"
            rows="3"
          />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Cantidad</label>
            <input
              type="number"
              min="1"
              value={formData.servings}
              onChange={(e) => setFormData({ ...formData, servings: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Tipo de Tamaño</label>
            <select
              value={formData.size_type}
              onChange={(e) => setFormData({ ...formData, size_type: e.target.value })}
            >
              <option value="porciones">Porciones</option>
              <option value="cm">Centímetros (cm)</option>
              <option value="pequeña">Tamaño Pequeño</option>
              <option value="mediana">Tamaño Mediano</option>
              <option value="grande">Tamaño Grande</option>
              <option value="individual">Individual</option>
              <option value="familiar">Familiar</option>
            </select>
          </div>
        </div>

        <div className="recipe-ingredients">
          <h4>Ingredientes de la Receta</h4>
          {recipeIngredients.map((ri, index) => (
            <div key={index} className="ingredient-item">
              <select
                value={ri.ingredient_id}
                onChange={(e) => updateIngredient(index, 'ingredient_id', e.target.value)}
                required
              >
                <option value="">Seleccionar ingrediente</option>
                {ingredients.map(ingredient => (
                  <option key={ingredient.id} value={ingredient.id}>
                    {ingredient.name} ({ingredient.brand}) - ${ingredient.price_per_unit.toFixed(2)}/{ingredient.unit}
                  </option>
                ))}
              </select>
              <input
                type="number"
                step="0.01"
                placeholder="Cantidad"
                value={ri.quantity_used}
                onChange={(e) => updateIngredient(index, 'quantity_used', e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="btn btn-danger btn-sm"
              >
                <i className="fas fa-trash"></i>
                Quitar
              </button>
            </div>
          ))}
          
          <div className="add-ingredients-buttons">
            <button type="button" onClick={addIngredient} className="btn btn-secondary">
              <i className="fas fa-plus"></i>
              Agregar Ingrediente
            </button>
            <button 
              type="button" 
              onClick={() => setShowNewIngredientModal(true)} 
              className="btn btn-success"
            >
              <i className="fas fa-seedling"></i>
              Nuevo Ingrediente
            </button>
          </div>
        </div>

        {recipeIngredients.length > 0 && (
          <div className="cost-summary">
            <h4>Resumen de Costos</h4>
            <p>Costo Total: ${calculateTotalCost().toFixed(2)}</p>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Agregando...' : 'Agregar Receta'}
          </button>
        </div>
      </form>

      {showNewIngredientModal && (
        <IngredientModal
          onSuccess={(newIngredient) => {
            onAddIngredient(newIngredient)
            setShowNewIngredientModal(false)
          }}
          onCancel={() => setShowNewIngredientModal(false)}
        />
      )}
    </div>
  )
}

export default AgregarReceta
