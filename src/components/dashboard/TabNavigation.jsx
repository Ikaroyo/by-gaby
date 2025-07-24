const TabNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <div className="tab-nav slide-up">
      <button
        onClick={() => setActiveTab('recetas')}
        className={`btn tab-button ${activeTab === 'recetas' ? 'active' : 'btn-secondary'}`}
      >
        <i className="fas fa-birthday-cake"></i>
        <span>Recetas</span>
      </button>
      <button
        onClick={() => setActiveTab('ingredientes')}
        className={`btn tab-button ${activeTab === 'ingredientes' ? 'active' : 'btn-secondary'}`}
      >
        <i className="fas fa-seedling"></i>
        <span>Ingredientes</span>
      </button>
      <button
        onClick={() => setActiveTab('cotizaciones')}
        className={`btn tab-button ${activeTab === 'cotizaciones' ? 'active' : 'btn-secondary'}`}
      >
        <i className="fas fa-file-invoice-dollar"></i>
        <span>Cotizaciones</span>
      </button>
      <button
        onClick={() => setActiveTab('agregar-ingrediente')}
        className={`btn tab-button ${activeTab === 'agregar-ingrediente' ? 'active' : 'btn-success'}`}
      >
        <i className="fas fa-plus"></i>
        <span>Ingrediente</span>
      </button>
      <button
        onClick={() => setActiveTab('agregar-receta')}
        className={`btn tab-button ${activeTab === 'agregar-receta' ? 'active' : 'btn-success'}`}
      >
        <i className="fas fa-plus"></i>
        <span>Receta</span>
      </button>
      <button
        onClick={() => setActiveTab('agregar-cotizacion')}
        className={`btn tab-button ${activeTab === 'agregar-cotizacion' ? 'active' : 'btn-success'}`}
      >
        <i className="fas fa-plus"></i>
        <span>Cotización</span>
      </button>
    </div>
  )
}

export default TabNavigation
