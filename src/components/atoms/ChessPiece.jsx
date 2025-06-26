import { motion } from 'framer-motion'
import ApperIcon from './ApperIcon'

const ChessPiece = ({ 
  piece, 
  isSelected = false, 
  isDragging = false, 
  onDragStart, 
  onDragEnd, 
  style = {} 
}) => {
  if (!piece) return null

  const getPieceIcon = (type, color) => {
    const iconMap = {
      'king': color === 'white' ? 'Crown' : 'Crown',
      'queen': color === 'white' ? 'Gem' : 'Gem', 
      'rook': color === 'white' ? 'Castle' : 'Castle',
      'knight': color === 'white' ? 'Horse' : 'Horse',
      'pawn': color === 'white' ? 'Circle' : 'Circle'
    }
    return iconMap[type] || 'Circle'
  }

  const getPieceColor = (color) => {
    return color === 'white' ? '#ECF0F1' : '#2C3E50'
  }

  const getPieceStroke = (color) => {
    return color === 'white' ? '#2C3E50' : '#ECF0F1'
  }

  return (
    <motion.div
      className={`
        chess-piece absolute inset-0 flex items-center justify-center
        ${isDragging ? 'dragging' : ''}
        ${isSelected ? 'ring-2 ring-accent ring-opacity-80' : ''}
      `}
      style={style}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      whileHover={{ scale: 1.1 }}
      whileDrag={{ scale: 1.2, zIndex: 1000 }}
      animate={isSelected ? { y: [0, -2, 0] } : {}}
      transition={{ duration: 0.2 }}
    >
      <ApperIcon
        name={getPieceIcon(piece.type, piece.color)}
        size={piece.type === 'pawn' ? 24 : piece.type === 'king' ? 32 : 28}
        color={getPieceColor(piece.color)}
        stroke={getPieceStroke(piece.color)}
        strokeWidth={2.5}
        style={{
          filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.3)) ${
            piece.color === 'white' 
              ? 'drop-shadow(0 0 0 rgba(44, 62, 80, 0.8))' 
              : 'drop-shadow(0 0 0 rgba(236, 240, 241, 0.8))'
          }`,
          pointerEvents: 'none'
        }}
      />
    </motion.div>
  )
}

export default ChessPiece