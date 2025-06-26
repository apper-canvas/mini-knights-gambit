import { motion } from 'framer-motion'
import ChessPiece from '../atoms/ChessPiece'

const ChessSquare = ({ 
  row, 
  col, 
  piece, 
  isLight, 
  isSelected, 
  isValidMove, 
  isCaptureMove,
  inCheck,
  onClick,
  onPieceDragStart,
  onPieceDragEnd,
  onDrop,
  onDragOver
}) => {
  const handleDragOver = (e) => {
    e.preventDefault()
    if (onDragOver) onDragOver(e, row, col)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    if (onDrop) onDrop(e, row, col)
  }

  return (
    <motion.div
      className={`
        chess-square w-16 h-16 relative border border-black/10
        ${isLight ? 'light' : 'dark'}
        ${isSelected ? 'selected' : ''}
        ${isValidMove ? 'valid-move' : ''}
        ${isCaptureMove ? 'capture-move' : ''}
        ${inCheck && piece?.type === 'king' ? 'in-check' : ''}
        cursor-pointer
      `}
      onClick={() => onClick(row, col)}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {piece && (
        <ChessPiece
          piece={piece}
          isSelected={isSelected}
          onDragStart={(e) => onPieceDragStart(e, row, col, piece)}
          onDragEnd={(e) => onPieceDragEnd(e, row, col)}
        />
      )}
      
      {/* Coordinate labels for edge squares */}
      {col === 0 && (
        <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 text-xs text-secondary/70 font-medium">
          {5 - row}
        </div>
      )}
      {row === 4 && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-secondary/70 font-medium">
          {String.fromCharCode(97 + col)}
        </div>
      )}
    </motion.div>
  )
}

export default ChessSquare