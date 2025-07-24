const TabNavigation = ({ activeTab, setActiveTab, isMobile }) => {
  return (
    <div className="tab-nav slide-up">
      {/* View/List Section */}
      <div className="tab-section">
        <div className="tab-section-label">Ver</div>
        <div className="tab-section-buttons">
          <button
            onClick={() => setActiveTab('recetas')}
            className={`btn tab-button ${activeTab === 'recetas' ? 'active' : 'btn-secondary'}`}
            title="Recetas"
          >
            <i className="fas fa-birthday-cake"></i>
            <span>{isMobile ? 'Recetas' : 'Recetas'}</span>
          </button>
          <button
            onClick={() => setActiveTab('ingredientes')}
            className={`btn tab-button ${activeTab === 'ingredientes' ? 'active' : 'btn-secondary'}`}
            title="Ingredientes"
          >
            <i className="fas fa-seedling"></i>
            <span>{isMobile ? 'Ingredientes' : 'Ingredientes'}</span>
          </button>
          <button
            onClick={() => setActiveTab('cotizaciones')}
            className={`btn tab-button ${activeTab === 'cotizaciones' ? 'active' : 'btn-secondary'}`}
            title="Cotizaciones"
          >
            <i className="fas fa-file-invoice-dollar"></i>
            <span>{isMobile ? 'Cotizaciones' : 'Cotizaciones'}</span>
          </button>
        </div>
      </div>

      {/* Add/Create Section */}
      <div className="tab-section">
        <div className="tab-section-label">Agregar</div>
        <div className="tab-section-buttons">
          <button
            onClick={() => setActiveTab('agregar-ingrediente')}
            className={`btn tab-button ${activeTab === 'agregar-ingrediente' ? 'active' : 'btn-accent'}`}
            title="Agregar Ingrediente"
          >
            <i className="fas fa-plus"></i>
            <span>{isMobile ? 'Ingrediente' : 'Ingrediente'}</span>
          </button>
          <button
            onClick={() => setActiveTab('agregar-receta')}
            className={`btn tab-button ${activeTab === 'agregar-receta' ? 'active' : 'btn-accent'}`}
            title="Agregar Receta"
          >
            <i className="fas fa-plus"></i>
            <span>{isMobile ? 'Receta' : 'Receta'}</span>
          </button>
          <button
            onClick={() => setActiveTab('agregar-cotizacion')}
            className={`btn tab-button ${activeTab === 'agregar-cotizacion' ? 'active' : 'btn-accent'}`}
            title="Agregar Cotización"
          >
            <i className="fas fa-plus"></i>
            <span>{isMobile ? 'Cotización' : 'Cotización'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default TabNavigation
