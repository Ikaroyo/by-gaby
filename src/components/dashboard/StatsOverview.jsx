const StatsOverview = ({ recipes, ingredients, quotes }) => {
  return (
    <div className="stats-grid slide-up">
      <div className="stat-card">
        <h3>
          <i className="fas fa-birthday-cake"></i>
          {recipes.length}
        </h3>
        <p>Recetas</p>
      </div>
      <div className="stat-card">
        <h3>
          <i className="fas fa-seedling"></i>
          {ingredients.length}
        </h3>
        <p>Ingredientes</p>
      </div>
      <div className="stat-card">
        <h3>
          <i className="fas fa-file-invoice-dollar"></i>
          {quotes.length}
        </h3>
        <p>Cotizaciones</p>
      </div>
    </div>
  )
}
export default StatsOverview
