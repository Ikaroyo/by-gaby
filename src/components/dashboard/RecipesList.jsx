const RecipesList = ({ recipes, onEdit, onDelete }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h2>Mis Recetas</h2>
      </div>
      <div className="card-body">
        {recipes.length === 0 ? (
          <div className="empty-state">
            <h3>No hay recetas aún</h3>
            <p>¡Crea tu primera receta para comenzar!</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Tamaño</th>
                  <th>Costo Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {recipes.map(recipe => (
                  <tr key={recipe.id}>
                    <td><strong>{recipe.name}</strong></td>
                    <td>{recipe.description}</td>
                    <td>{recipe.servings} {recipe.size_type || 'porciones'}</td>
                    <td><strong>${recipe.total_cost?.toFixed(2) || '0.00'}</strong></td>
                    <td>
                      <button
                        onClick={() => onEdit(recipe)}
                        className="btn btn-primary btn-sm"
                        style={{ marginRight: '0.5rem' }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => onDelete(recipe.id)}
                        className="btn btn-danger btn-sm"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecipesList
