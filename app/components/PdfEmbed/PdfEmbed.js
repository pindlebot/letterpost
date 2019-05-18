import React from 'react'
import pdfLib from 'pdfjs-dist/build/pdf'

const isDev = process.env.NODE_ENV !== 'production'

pdfLib.GlobalWorkerOptions.workerSrc = isDev
  ? 'http://localhost:1234/pdf.worker.js'
  : 'https://letterpost.co/pdf.worker.js'

class PdfEmbed extends React.Component {
  static defaultProps = {
    scale: 1,
    page: 1,
    className: 'pdf-embed'
  }

  state = {
    pdf: null
  }

  async componentDidMount () {
    if (!this.props.url) return
    if (!this.props.open) return
    this.getDocument(this.props.url)
  }

  getDocument = async val => {
    if (this.documentPromise) {
      this.documentPromise.cancel()
    }
    this.documentPromise = pdfLib.getDocument(val).promise

    this.documentPromise
      .then(this.onDocumentComplete)
      .catch(this.onDocumentError)

    return this.documentPromise
  }

  drawPDF = async num => {
    const { pdf } = this.state
    const page = await pdf.getPage(num)
    const viewport = page.getViewport(this.props.scale)
    const canvas = this.canvas
    const canvasContext = canvas.getContext('2d')
    canvas.height = viewport.height
    canvas.width = viewport.width
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    page.render({ canvasContext, viewport })
  }

  onDocumentComplete = async pdf => {
    this.setState({ pdf }, () => {
      this.drawPDF(this.props.page)
    })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.page !== this.props.page) {
      this.drawPDF(nextProps.page)
    }
  }

  onDocumentError = err => {
    if (err.isCanceled && err.pdf) {
      err.pdf.destroy()
    }
  }

  render () {
    if (!this.state.pdf) {
      return false
    }
    return (
      <canvas
        ref={ref => {
          this.canvas = ref
        }}
        className={this.props.className}
      />
    )
  }
}

export default PdfEmbed
