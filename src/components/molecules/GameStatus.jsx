import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '../atoms/ApperIcon'

const GameStatus = ({ 
  currentPlayer, 
  inCheck, 
  gameOver, 
  winner, 
  moveCount 
}) => {
  const getStatusMessage = () => {
    if (gameOver) {
      if (winner === 'draw') {
        return { text: "Game Draw!", color: "text-warning", icon: "Equal" }
      }
      return { 
        text: `${winner === 'white' ? 'White' : 'Black'} Wins!`, 
        color: winner === 'white' ? "text-secondary" : "text-primary", 
        icon: "Crown" 
      }
    }
    
    if (inCheck) {
      return { 
        text: `${currentPlayer === 'white' ? 'White' : 'Black'} King in Check!`, 
        color: "text-accent", 
        icon: "AlertTriangle" 
      }
    }
    
    return { 
      text: `${currentPlayer === 'white' ? 'White' : 'Black'} to Move`, 
      color: currentPlayer === 'white' ? "text-secondary" : "text-primary", 
      icon: currentPlayer === 'white' ? "Circle" : "Circle" 
    }
  }

  const status = getStatusMessage()

  return (
    <motion.div 
      className="premium-card p-6 text-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-center space-x-3 mb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={status.icon}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ApperIcon 
              name={status.icon} 
              size={24} 
              className={status.color}
            />
          </motion.div>
        </AnimatePresence>
        
        <AnimatePresence mode="wait">
          <motion.h2
            key={status.text}
            className={`text-xl font-display ${status.color}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {status.text}
          </motion.h2>
        </AnimatePresence>
      </div>
      
      <div className="flex justify-center space-x-6 text-sm text-secondary/70">
        <div className="flex items-center space-x-1">
          <ApperIcon name="Move" size={16} />
          <span>Move {Math.ceil(moveCount / 2)}</span>
        </div>
        <div className="flex items-center space-x-1">
          <ApperIcon name="Clock" size={16} />
          <span>{moveCount} Plies</span>
        </div>
      </div>
    </motion.div>
  )
}

export default GameStatus