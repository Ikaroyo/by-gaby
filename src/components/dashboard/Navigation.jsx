const Navigation = ({ user, onSignOut, isMobile }) => {
  return (
    <div className="nav fade-in">
      <div className="brand-title">
        <div className="brand-main brand-main-font">A Hornear</div>
        <div className="brand-cursive cursive-text">By Gaby</div>
      </div>
      <div className="nav-links">
        <span>
          <i className="fas fa-user-circle"></i>
          {isMobile ? user?.email?.split('@')[0] : `Bienvenida, ${user?.email}`}
        </span>
        <button onClick={onSignOut} className="btn btn-secondary btn-sm">
          <i className="fas fa-sign-out-alt"></i>
          {isMobile ? 'Salir' : 'Cerrar Sesión'}
        </button>
      </div>
    </div>
  )
}

export default Navigation
