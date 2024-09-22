import { useState, useRef, useEffect } from 'react'
import { Button, Dialog, DialogContent } from '@mui/material'

export default function SignatureCanvas({ onSave, size = { width: 400, height: 200 } }) {
  const [isOpen, setIsOpen] = useState(false)
  const [signature, setSignature] = useState(null)
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.strokeStyle = '#000'
      }
    }
  }, [isOpen])

  const startDrawing = e => {
    setIsDrawing(true)
    draw(e)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) ctx.beginPath()
    }
  }

  const draw = e => {
    if (!isDrawing || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top

    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      }
    }
    setSignature(null)
  }

  const saveSignature = () => {
    if (canvasRef.current) {
      const signatureDataUrl = canvasRef.current.toDataURL()
      setSignature(signatureDataUrl)
      if (onSave) {
        onSave(signatureDataUrl) // Call the onSave prop with the signature data
      }
      setIsOpen(false)
    }
  }

  return (
    <div className='flex flex-col items-center'>
      <div
        onClick={() => setIsOpen(true)}
        className='w-40 h-20 border border-gray-300 rounded cursor-pointer flex items-center justify-center'
      >
        {signature ? (
          <img src={signature} alt='Signature' className='object-contain' />
        ) : (
          <span className='text-gray-400'>Click to sign</span>
        )}
      </div>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onOpenChange={open => {
          setIsOpen(open)
          if (!open) clearCanvas()
        }}
      >
        <DialogContent className='sm:max-w-[425px]'>
          <div className='flex flex-col items-center'>
            <canvas
              ref={canvasRef}
              width={size.width} // Use size prop for width
              height={size.height} // Use size prop for height
              className='border border-gray-300 rounded'
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              onMouseOut={stopDrawing}
              onMouseMove={draw}
              onTouchStart={startDrawing}
              onTouchEnd={stopDrawing}
              onTouchMove={draw}
            />
            <div className='flex gap-4 mt-4'>
              <Button onClick={clearCanvas}>Clear</Button>
              <Button onClick={saveSignature}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
