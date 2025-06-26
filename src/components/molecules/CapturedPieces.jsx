import { motion } from 'framer-motion'
import ChessPiece from '../atoms/ChessPiece'

const CapturedPieces = ({ capturedPieces, color, title }) => {
  const pieces = capturedPieces[color] || []

  return (
    <motion.div 
      className="premium-card p-4"
      initial={{ opacity: 0, x: color === 'white' ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <h3 className="text-lg font-display mb-3 text-center text-secondary/90">
        {title}
      </h3>
      
      <div className="grid grid-cols-3 gap-2 min-h-[120px]">
        {pieces.map((piece, index) => (
          <motion.div
            key={`${piece.type}-${piece.color}-${index}`}
            className="w-12 h-12 relative flex items-center justify-center bg-surface/30 rounded-lg border border-secondary/10"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.2 }}
          >
            <ChessPiece piece={piece} />
          </motion.div>
        ))}
      </div>
      
      <div className="mt-3 text-center">
        <span className="text-sm text-secondary/60">
          {pieces.length} piece{pieces.length !== 1 ? 's' : ''} captured
        </span>
      </div>
    </motion.div>
  )
}

export default CapturedPieces