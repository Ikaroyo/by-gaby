import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const VerCotizacion = ({ quote, onCancel }) => {
  const [quoteDetails, setQuoteDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadQuoteDetails()
  }, [quote.id])

  const loadQuoteDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          quote_recipes(
            quantity,
            unit_cost,
            total_cost,
            recipes(
              id,
              name,
              servings,
              size_type
            )
          )
        `)
        .eq('id', quote.id)
        .single()

      if (error) throw error

      // Use stored costs instead of recalculating
      const processedData = {
        ...data,
        quote_recipes: data.quote_recipes.map(qr => ({
          ...qr,
          recipe_cost: qr.unit_cost || 0,
          total_cost: qr.total_cost || 0
        }))
      }

      setQuoteDetails(processedData)
    } catch (error) {
      console.error('Error loading quote details:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateSubtotal = () => {
    if (!quoteDetails) return 0
    return quoteDetails.base_cost || 0
  }

  const calculateTotal = () => {
    return quoteDetails?.total_cost || 0
  }

  const printQuote = () => {
    window.print()
  }

  const copyQuoteText = () => {
    const quoteText = generateQuoteText()
    navigator.clipboard.writeText(quoteText).then(() => {
      alert('Presupuesto copiado al portapapeles')
    })
  }

  const generateQuoteText = () => {
    if (!quoteDetails) return ''

    const subtotal = calculateSubtotal()
    const total = calculateTotal()
    const currentDate = new Date().toLocaleDateString('es-ES')

    return `
🧁 A HORNEAR BY GABY 🧁

PRESUPUESTO
═══════════════════════════════

📋 Cotización: ${quoteDetails.name}
👤 Cliente: ${quoteDetails.client_name || 'N/A'}
📅 Fecha: ${currentDate}

DETALLE DEL PEDIDO:
${quoteDetails.quote_recipes.map(qr => 
  `• ${qr.recipes.name} (${qr.recipes.servings} ${qr.recipes.size_type}) × ${qr.quantity} = $${qr.total_cost.toFixed(2)}`
).join('\n')}

═══════════════════════════════
SUBTOTAL: $${subtotal.toFixed(2)}
MANO DE OBRA Y SERVICIOS: $${(total - subtotal).toFixed(2)}
═══════════════════════════════
TOTAL: $${total.toFixed(2)}

¡Gracias por confiar en nosotros! 💕

Para confirmar tu pedido, ponte en contacto con nosotros.
    `.trim()
  }

  if (loading) {
    return (
      <div className="form-section">
        <div className="loading">Cargando presupuesto...</div>
      </div>
    )
  }

  if (!quoteDetails) {
    return (
      <div className="form-section">
        <div className="alert alert-error">Error al cargar el presupuesto</div>
      </div>
    )
  }

  return (
    <div className="form-section quote-view">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3>
          Presupuesto para Cliente
        </h3>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <button onClick={copyQuoteText} className="btn btn-success btn-sm">
            <i className="fas fa-copy"></i>
            Copiar
          </button>
          <button onClick={printQuote} className="btn btn-secondary btn-sm">
            <i className="fas fa-print"></i>
            Imprimir
          </button>
          <button onClick={onCancel} className="btn btn-secondary btn-sm">
            <i className="fas fa-times"></i>
            Cerrar
          </button>
        </div>
      </div>

      <div className="quote-document">
        <div className="quote-header">
          <div className="business-info">
            <h1 className="business-name">
              <span className="brand-main brand-main-font">A Hornear</span>
              <span className="brand-cursive cursive-text">By Gaby</span>
            </h1>
            <p className="business-tagline">Repostería Artesanal</p>
          </div>
          <div className="quote-info">
            <h2>PRESUPUESTO</h2>
            <p><strong>Cotización:</strong> {quoteDetails.name}</p>
            <p><strong>Cliente:</strong> {quoteDetails.client_name || 'N/A'}</p>
            <p><strong>Fecha:</strong> {new Date().toLocaleDateString('es-ES')}</p>
          </div>
        </div>

        <div className="quote-body">
          <h3>Detalle del Pedido</h3>
          <table className="quote-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Tamaño</th>
                <th>Cantidad</th>
                <th>Precio Unit.</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {quoteDetails.quote_recipes.map((qr, index) => (
                <tr key={index}>
                  <td><strong>{qr.recipes.name}</strong></td>
                  <td>{qr.recipes.servings} {qr.recipes.size_type}</td>
                  <td className="text-center">{qr.quantity}</td>
                  <td className="text-right">${qr.recipe_cost.toFixed(2)}</td>
                  <td className="text-right"><strong>${qr.total_cost.toFixed(2)}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="quote-totals">
            <div className="total-line">
              <span>Subtotal:</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="total-line">
              <span>Mano de Obra y Servicios:</span>
              <span>${(calculateTotal() - calculateSubtotal()).toFixed(2)}</span>
            </div>
            <div className="total-line final-total">
              <span><strong>TOTAL:</strong></span>
              <span><strong>${calculateTotal().toFixed(2)}</strong></span>
            </div>
          </div>

          <div className="quote-footer">
            <p><strong>¡Gracias por confiar en nosotros!</strong> 💕</p>
            <p>Para confirmar tu pedido, ponte en contacto con nosotros.</p>
            <div className="terms">
              <p><small>• Los precios están sujetos a cambios sin previo aviso</small></p>
              <p><small>• Se requiere anticipo del 50% para confirmar el pedido</small></p>
              <p><small>• Tiempo de entrega: consultar disponibilidad</small></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerCotizacion
