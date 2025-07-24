import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import html2canvas from 'html2canvas'

const VerCotizacion = ({ quote, onCancel }) => {
  const [quoteDetails, setQuoteDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [fullPageView, setFullPageView] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const quoteRef = useRef(null)

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

  const toggleFullPageView = () => {
    setFullPageView(!fullPageView)
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

  const downloadAsImage = async () => {
    if (!quoteRef.current) return
    
    setDownloading(true)
    try {
      const canvas = await html2canvas(quoteRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: quoteRef.current.scrollWidth,
        height: quoteRef.current.scrollHeight,
        scrollX: 0,
        scrollY: 0
      })
      
      const link = document.createElement('a')
      link.download = `presupuesto-${quoteDetails.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (error) {
      console.error('Error downloading image:', error)
      alert('Error al descargar la imagen')
    } finally {
      setDownloading(false)
    }
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

  if (fullPageView) {
    return (
      <div className="quote-full-page">
        <div className="quote-full-page-header">
          <div className="quote-header-actions">
            <button onClick={toggleFullPageView} className="btn btn-secondary btn-sm quote-back-btn">
              <i className="fas fa-arrow-left"></i>
              Volver
            </button>
            <button 
              onClick={downloadAsImage} 
              className="btn btn-success btn-sm"
              disabled={downloading}
            >
              <i className={downloading ? "fas fa-spinner fa-spin" : "fas fa-download"}></i>
              {downloading ? 'Descargando...' : 'Descargar Imagen'}
            </button>
          </div>
        </div>
        
        <div className="quote-print-document" ref={quoteRef}>
          <div className="quote-print-header">
            <div className="business-info-print">
              <h1 className="business-name-print">
                <span className="brand-main-print">A Hornear</span>
                <span className="brand-cursive-print" data-text="By Gaby">By Gaby</span>
              </h1>
              <p className="business-tagline-print">Repostería Artesanal</p>
            </div>
            <div className="quote-info-print">
              <h2 className="quote-title-print">PRESUPUESTO</h2>
              <div className="quote-details-print">
                <p><strong>Cotización:</strong> {quoteDetails.name}</p>
                <p><strong>Cliente:</strong> {quoteDetails.client_name || 'N/A'}</p>
                <p><strong>Fecha:</strong> {new Date().toLocaleDateString('es-ES')}</p>
              </div>
            </div>
          </div>

          <div className="quote-body-print">
            <h3 className="quote-section-title">Detalle del Pedido</h3>
            <div className="quote-table-print-container">
              <table className="quote-table-print">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th className="mobile-hide-print">Tamaño</th>
                    <th>Cant.</th>
                    <th className="mobile-hide-print">Precio Unit.</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {quoteDetails.quote_recipes.map((qr, index) => (
                    <tr key={index}>
                      <td>
                        <strong>{qr.recipes.name}</strong>
                        <div className="mobile-only-print quote-mobile-details-print">
                          <small>{qr.recipes.servings} {qr.recipes.size_type}</small>
                          <br />
                          <small>${qr.recipe_cost.toFixed(2)} c/u</small>
                        </div>
                      </td>
                      <td className="mobile-hide-print">{qr.recipes.servings} {qr.recipes.size_type}</td>
                      <td className="text-center">{qr.quantity}</td>
                      <td className="mobile-hide-print text-right">${qr.recipe_cost.toFixed(2)}</td>
                      <td className="text-right"><strong>${qr.total_cost.toFixed(2)}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="quote-totals-print">
              <div className="total-line-print final-total-print">
                <span><strong>TOTAL:</strong></span>
                <span><strong>${calculateTotal().toFixed(2)}</strong></span>
              </div>
            </div>

            <div className="quote-footer-print">
              <p><strong>¡Gracias por confiar en nosotros!</strong> 💕</p>
              <p>Para confirmar tu pedido, ponte en contacto con nosotros.</p>
              <div className="terms-print">
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

  return (
    <div className="form-section quote-view">
      <div className="quote-header-actions">
        <h3>
          Presupuesto para Cliente
        </h3>
        <div className="quote-actions">
          <button onClick={toggleFullPageView} className="btn btn-primary btn-sm">
            <i className="fas fa-expand"></i>
            Ver Presupuesto
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
              <span className="brand-cursive cursive-text" data-text="By Gaby">By Gaby</span>
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
          <div className="quote-table-container">
            <table className="quote-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th className="mobile-hide">Tamaño</th>
                  <th>Cant.</th>
                  <th className="mobile-hide">Precio Unit.</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {quoteDetails.quote_recipes.map((qr, index) => (
                  <tr key={index}>
                    <td>
                      <strong>{qr.recipes.name}</strong>
                      <div className="mobile-only quote-mobile-details">
                        <small>{qr.recipes.servings} {qr.recipes.size_type}</small>
                        <br />
                        <small>${qr.recipe_cost.toFixed(2)} c/u</small>
                      </div>
                    </td>
                    <td className="mobile-hide">{qr.recipes.servings} {qr.recipes.size_type}</td>
                    <td className="text-center">{qr.quantity}</td>
                    <td className="mobile-hide text-right">${qr.recipe_cost.toFixed(2)}</td>
                    <td className="text-right"><strong>${qr.total_cost.toFixed(2)}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="quote-totals">
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
