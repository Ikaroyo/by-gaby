import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Navigation from './dashboard/Navigation'
import StatsOverview from './dashboard/StatsOverview'
import TabNavigation from './dashboard/TabNavigation'
import RecipesList from './dashboard/RecipesList'
import IngredientsList from './dashboard/IngredientsList'
import QuotesList from './dashboard/QuotesList'
import AgregarIngrediente from './dashboard/AgregarIngrediente'
import AgregarReceta from './dashboard/AgregarReceta'
import EditarReceta from './dashboard/EditarReceta'
import EditarIngrediente from './dashboard/EditarIngrediente'
import AgregarCotizacion from './dashboard/AgregarCotizacion'
import VerCotizacion from './dashboard/VerCotizacion'

const Dashboard = () => {
  const { user, signOut } = useAuth()
  const [recipes, setRecipes] = useState([])
  const [ingredients, setIngredients] = useState([])
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('recetas')
  const [editingRecipe, setEditingRecipe] = useState(null)
  const [editingIngredient, setEditingIngredient] = useState(null)
  const [viewingQuote, setViewingQuote] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [recipesResult, ingredientsResult, quotesResult] = await Promise.all([
        supabase.from('recipes').select(`
          *,
          recipe_ingredients(
            quantity_used,
            ingredients(price_per_unit)
          )
        `).order('created_at', { ascending: false }),
        supabase.from('ingredients').select('*').order('name'),
        supabase.from('quotes').select(`
          *,
          quote_recipes(
            quantity,
            recipes(
              id,
              name,
              servings,
              size_type
            )
          )
        `).order('created_at', { ascending: false })
      ])

      if (recipesResult.error) throw recipesResult.error
      if (ingredientsResult.error) throw ingredientsResult.error
      if (quotesResult.error) throw quotesResult.error

      // Calculate recipe costs dynamically
      const recipesWithCosts = (recipesResult.data || []).map(recipe => ({
        ...recipe,
        total_cost: calculateRecipeCost(recipe.recipe_ingredients || []),
        cost_per_serving: recipe.servings > 0 ? calculateRecipeCost(recipe.recipe_ingredients || []) / recipe.servings : 0
      }))

      // Don't recalculate quote costs - use stored values
      const quotesData = quotesResult.data || []

      setRecipes(recipesWithCosts)
      setIngredients(ingredientsResult.data || [])
      setQuotes(quotesData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateRecipeCost = (recipeIngredients) => {
    return recipeIngredients.reduce((total, ri) => {
      if (ri.ingredients && ri.quantity_used) {
        return total + (ri.quantity_used * ri.ingredients.price_per_unit)
      }
      return total
    }, 0)
  }

  const editRecipe = (recipe) => {
    setEditingRecipe(recipe)
    setActiveTab('editar-receta')
  }

  const editIngredient = (ingredient) => {
    setEditingIngredient(ingredient)
    setActiveTab('editar-ingrediente')
  }

  const viewQuote = (quote) => {
    setViewingQuote(quote)
    setActiveTab('ver-cotizacion')
  }

  const cancelEdit = () => {
    setEditingRecipe(null)
    setEditingIngredient(null)
    setActiveTab('recetas')
  }

  const cancelQuoteView = () => {
    setViewingQuote(null)
    setActiveTab('cotizaciones')
  }

  const handleSignOut = async () => {
    await signOut()
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Cargando datos...</div>
      </div>
    )
  }

  return (
    <div className="container">
      <Navigation user={user} onSignOut={handleSignOut} />
      
      <StatsOverview 
        recipes={recipes}
        ingredients={ingredients}
        quotes={quotes}
      />

      <TabNavigation 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Tab Content */}
      {activeTab === 'recetas' && (
        <RecipesList 
          recipes={recipes}
          onEdit={editRecipe}
          onDelete={(id) => {
            if (window.confirm('¿Estás seguro de que quieres eliminar esta receta?')) {
              supabase.from('recipes').delete().eq('id', id).then(({ error }) => {
                if (!error) {
                  setRecipes(recipes.filter(recipe => recipe.id !== id))
                }
              })
            }
          }}
        />
      )}

      {activeTab === 'ingredientes' && (
        <IngredientsList 
          ingredients={ingredients}
          setIngredients={setIngredients}
          onEdit={editIngredient}
          onDelete={(id) => {
            if (window.confirm('¿Estás seguro de que quieres eliminar este ingrediente?')) {
              supabase.from('ingredients').delete().eq('id', id).then(({ error }) => {
                if (!error) {
                  setIngredients(ingredients.filter(ingredient => ingredient.id !== id))
                }
              })
            }
          }}
          onDataChange={loadData}
        />
      )}

      {activeTab === 'cotizaciones' && (
        <QuotesList 
          quotes={quotes}
          onView={viewQuote}
          onDelete={(id) => {
            if (window.confirm('¿Estás seguro de que quieres eliminar esta cotización?')) {
              supabase.from('quotes').delete().eq('id', id).then(({ error }) => {
                if (!error) {
                  setQuotes(quotes.filter(quote => quote.id !== id))
                }
              })
            }
          }}
        />
      )}

      {activeTab === 'agregar-ingrediente' && (
        <AgregarIngrediente onSuccess={loadData} />
      )}

      {activeTab === 'agregar-receta' && (
        <AgregarReceta 
          ingredients={ingredients} 
          onSuccess={loadData} 
          onAddIngredient={(ingredient) => setIngredients([...ingredients, ingredient])} 
        />
      )}

      {activeTab === 'agregar-cotizacion' && (
        <AgregarCotizacion recipes={recipes} onSuccess={loadData} />
      )}

      {activeTab === 'editar-receta' && editingRecipe && (
        <EditarReceta 
          recipe={editingRecipe} 
          ingredients={ingredients} 
          onSuccess={loadData} 
          onCancel={cancelEdit}
          onAddIngredient={(ingredient) => setIngredients([...ingredients, ingredient])}
        />
      )}

      {activeTab === 'editar-ingrediente' && editingIngredient && (
        <EditarIngrediente 
          ingredient={editingIngredient} 
          onSuccess={loadData} 
          onCancel={cancelEdit}
        />
      )}

      {activeTab === 'ver-cotizacion' && viewingQuote && (
        <VerCotizacion 
          quote={viewingQuote} 
          onCancel={cancelQuoteView}
        />
      )}
    </div>
  )
}

export default Dashboard