import { motion } from 'framer-motion'
import ChessSquare from '../molecules/ChessSquare'

const ChessBoard = ({ 
  board, 
  selectedSquare, 
  validMoves, 
  inCheck,
  onSquareClick, 
  onPieceDragStart, 
  onPieceDragEnd, 
  onPieceDrop 
}) => {
  const isSquareLight = (row, col) => (row + col) % 2 === 0
  
  const isValidMove = (row, col) => {
    return validMoves.some(move => move.row === row && move.col === col)
  }
  
  const isCaptureMove = (row, col) => {
    return validMoves.some(move => 
      move.row === row && move.col === col && board[row][col]
    )
  }
  
  const isSquareInCheck = (row, col) => {
    const piece = board[row][col]
    return inCheck && piece?.type === 'king'
  }

  return (
    <motion.div 
      className="premium-card p-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative">
        <div className="grid grid-cols-5 gap-0 border-2 border-secondary/20 rounded-lg overflow-hidden shadow-2xl">
          {board.map((row, rowIndex) =>
            row.map((piece, colIndex) => (
              <ChessSquare
                key={`${rowIndex}-${colIndex}`}
                row={rowIndex}
                col={colIndex}
                piece={piece}
                isLight={isSquareLight(rowIndex, colIndex)}
                isSelected={
                  selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex
                }
                isValidMove={isValidMove(rowIndex, colIndex)}
                isCaptureMove={isCaptureMove(rowIndex, colIndex)}
                inCheck={isSquareInCheck(rowIndex, colIndex)}
                onClick={onSquareClick}
                onPieceDragStart={onPieceDragStart}
                onPieceDragEnd={onPieceDragEnd}
                onDrop={onPieceDrop}
                onDragOver={(e) => e.preventDefault()}
              />
            ))
          )}
        </div>
        
        {/* Board glow effect when in check */}
        {inCheck && (
          <motion.div
            className="absolute inset-0 rounded-lg border-2 border-accent/50 pointer-events-none"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>
    </motion.div>
  )
}

export default ChessBoard