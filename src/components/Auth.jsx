import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      let result
      if (isLogin) {
        result = await signIn(email, password)
      } else {
        result = await signUp(email, password, fullName)
      }

      if (result.error) {
        setMessage(result.error.message)
      } else if (!isLogin) {
        setMessage('¡Revisa tu correo electrónico para confirmar tu cuenta!')
      }
    } catch (error) {
      setMessage('Ocurrió un error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container fade-in">
      <div className="auth-card slide-up">
        <div className="auth-header">
          <div className="brand-title">
            <div className="brand-main">A Hornear</div>
            <div className="brand-cursive cursive-text">By Gaby</div>
          </div>
          <h2>
            <i className={`fas ${isLogin ? 'fa-sign-in-alt' : 'fa-user-plus'}`}></i>
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
        </div>
        
        {message && (
          <div className={`alert ${message.includes('error') || message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
            <i className={`fas ${message.includes('error') || message.includes('Error') ? 'fa-exclamation-triangle' : 'fa-check-circle'}`}></i>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="fullName">
                <i className="fas fa-user"></i>
                Nombre Completo
              </label>
              <div style={{ position: 'relative' }}>
                <i className="fas fa-user input-icon"></i>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={!isLogin}
                  placeholder="Ingresa tu nombre completo"
                />
              </div>
            </div>
          )}

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
                placeholder="Mínimo 6 caracteres"
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
                <i className={`fas ${isLogin ? 'fa-sign-in-alt' : 'fa-user-plus'}`}></i>
                {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(248, 165, 194, 0.2)' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
            {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
          </p>
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin)
              setMessage('')
            }}
            className="btn btn-secondary"
          >
            <i className={`fas ${isLogin ? 'fa-user-plus' : 'fa-sign-in-alt'}`}></i>
            {isLogin ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Auth