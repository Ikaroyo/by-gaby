const StatsOverview = ({ recipes, ingredients, quotes }) => {
  return (
    <div className="stats-grid slide-up">
      <div className="stat-card">
        <div className="stat-content">
          <i className="fas fa-birthday-cake stat-icon"></i>          
            <span className="stat-label">Recetas</span>
          <div className="stat-info">
            <span className="stat-number">{recipes.length}</span>
          </div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-content">
          <i className="fas fa-seedling stat-icon"></i>
          
            <span className="stat-label">Ingredientes</span>
          <div className="stat-info">
            <span className="stat-number">{ingredients.length}</span>
          </div>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-content">
          <i className="fas fa-file-invoice-dollar stat-icon"></i>
          <span className="stat-label">Cotizaciones</span>
          <div className="stat-info">
            <span className="stat-number">{quotes.length}</span>
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsOverview
