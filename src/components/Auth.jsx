import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

const Auth = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const { signIn } = useAuth()
  const { isDark, toggleTheme } = useTheme()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const result = await signIn(email, password)
      
      if (result.error) {
        setMessage(result.error.message)
      }
    } catch (error) {
      setMessage('Ocurrió un error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container fade-in">
      <div className="auth-card slide-up" style={{ position: 'relative' }}>
        <button 
          onClick={toggleTheme} 
          className="btn btn-secondary btn-sm theme-toggle"
          title={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
          style={{ 
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            minWidth: 'auto',
            padding: '0.75rem',
            fontSize: '1rem',
            borderRadius: '8px',
            zIndex: 10,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}
        >
          <i className={isDark ? 'fas fa-sun' : 'fas fa-moon'}></i>
        </button>
        
        <div className="auth-header">
          <div className="brand-title">
            <div className="brand-main">A Hornear</div>
            <div className="brand-cursive cursive-text">By Gaby</div>
          </div>
          <h2>
            <i className="fas fa-sign-in-alt"></i>
            Iniciar Sesión
          </h2>
        </div>

        <div className="auth-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        </div>
        
        {message && (
          <div className="alert alert-error">
            <i className="fas fa-exclamation-triangle"></i>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="email">
              <i className="fas fa-envelope"></i>
              Correo Electrónico
            </label>
            <div style={{ position: 'relative' }}>
              <i className="fas fa-envelope input-icon"></i>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@correo.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <i className="fas fa-lock"></i>
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <i className="fas fa-lock input-icon"></i>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Ingresa tu contraseña"
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
            style={{ width: '100%', marginTop: '1.5rem' }}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Procesando...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i>
                Iniciar Sesión
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Auth