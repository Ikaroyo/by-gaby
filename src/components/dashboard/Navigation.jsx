import { useTheme } from '../../contexts/ThemeContext'

const Navigation = ({ user, onSignOut, isMobile }) => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <div className="nav fade-in">
      <div className="brand-title">
        <div className="brand-main brand-main-font">A Hornear</div>
        <div className="brand-cursive cursive-text" data-text="By Gaby">By Gaby</div>
      </div>
      <div className="nav-links">
        <span>
          <i className="fas fa-user-circle"></i>
          {isMobile ? user?.email?.split('@')[0] : `Bienvenida, ${user?.email}`}
        </span>
        <button 
          onClick={toggleTheme} 
          className="btn btn-secondary btn-sm theme-toggle"
          title={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
        >
          <i className={isDark ? 'fas fa-sun' : 'fas fa-moon'}></i>
          {!isMobile && (isDark ? 'Claro' : 'Oscuro')}
        </button>
        <button onClick={onSignOut} className="btn btn-secondary btn-sm">
          <i className="fas fa-sign-out-alt"></i>
          {isMobile ? 'Salir' : 'Cerrar Sesión'}
        </button>
      </div>
    </div>
  )
}

export default Navigation
