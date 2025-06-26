import { motion } from 'framer-motion'
import Button from '../atoms/Button'
import ApperIcon from '../atoms/ApperIcon'

const GameControls = ({ 
  onNewGame, 
  gameInProgress, 
  onUndo, 
  canUndo, 
  onSaveGame, 
  onLoadGame,
  onOpenSettings 
}) => {
  const handleNewGame = () => {
    if (gameInProgress) {
      if (window.confirm("Are you sure you want to start a new game? Current progress will be lost.")) {
        onNewGame()
      }
    } else {
      onNewGame()
    }
  }

  return (
    <motion.div 
      className="premium-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <h3 className="text-lg font-display mb-4 text-center text-secondary/90">
        Game Controls
      </h3>
      
      <div className="space-y-3">
        <Button
          variant="primary"
          className="w-full flex items-center justify-center space-x-2"
          onClick={handleNewGame}
        >
          <ApperIcon name="RotateCcw" size={18} />
          <span>New Game</span>
        </Button>
        
        <Button
          variant="secondary"
          className="w-full flex items-center justify-center space-x-2"
          onClick={onUndo}
          disabled={!canUndo}
        >
          <ApperIcon name="Undo" size={18} />
          <span>Undo Move</span>
        </Button>
        
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center justify-center space-x-1"
            onClick={onSaveGame}
            disabled={!gameInProgress}
          >
            <ApperIcon name="Save" size={16} />
            <span>Save</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center justify-center space-x-1"
            onClick={onLoadGame}
          >
            <ApperIcon name="Upload" size={16} />
            <span>Load</span>
</Button>
        </div>
        
        <Button
          variant="ghost"
          className="w-full flex items-center justify-center space-x-2 mt-3"
          onClick={onOpenSettings}
        >
          <ApperIcon name="Settings" size={18} />
          <span>Settings</span>
        </Button>
      </div>
    </motion.div>
  )
}

export default GameControls