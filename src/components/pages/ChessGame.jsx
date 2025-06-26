import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ChessBoard from '../organisms/ChessBoard'
import GameStatus from '../molecules/GameStatus'
import CapturedPieces from '../molecules/CapturedPieces'
import GameControls from '../organisms/GameControls'
import { useChessGame } from '../../hooks/useChessGame'
import ApperIcon from '../atoms/ApperIcon'

const ChessGame = () => {
  const {
    gameState,
    makeMove,
    resetGame,
    undoMove,
    isValidMove,
    getValidMoves,
    saveGameState,
    loadGameState
  } = useChessGame()

  const [draggedPiece, setDraggedPiece] = useState(null)
  const [draggedFrom, setDraggedFrom] = useState(null)
  const [moveHistory, setMoveHistory] = useState([])

  // Handle square clicks
  const handleSquareClick = useCallback((row, col) => {
    const piece = gameState.board[row][col]
    
    // If a square is already selected
    if (gameState.selectedSquare) {
      const fromRow = gameState.selectedSquare.row
      const fromCol = gameState.selectedSquare.col
      
      // If clicking the same square, deselect
      if (fromRow === row && fromCol === col) {
        resetSelection()
        return
      }
      
      // Try to make a move
      const moveResult = makeMove(fromRow, fromCol, row, col)
      if (moveResult.success) {
        setMoveHistory(prev => [...prev, moveResult.move])
        if (moveResult.captured) {
          toast.success(`${moveResult.move.piece.type} captured ${moveResult.captured.type}!`)
        }
        if (moveResult.check) {
          toast.warning("Check!")
        }
        if (moveResult.checkmate) {
          toast.success(`Checkmate! ${gameState.currentPlayer === 'white' ? 'Black' : 'White'} wins!`)
        }
      } else {
        toast.error("Invalid move!")
        // Add shake animation to invalid piece
        const element = document.querySelector(`[data-square="${fromRow}-${fromCol}"] .chess-piece`)
        if (element) {
          element.classList.add('animate-piece-shake')
          setTimeout(() => element.classList.remove('animate-piece-shake'), 300)
        }
      }
      resetSelection()
    } else {
      // Select a piece if it belongs to current player
      if (piece && piece.color === gameState.currentPlayer && !gameState.gameOver) {
        selectSquare(row, col)
      }
    }
  }, [gameState, makeMove])

  const selectSquare = (row, col) => {
    const validMoves = getValidMoves(row, col)
    if (validMoves.length > 0) {
      gameState.selectedSquare = { row, col }
      gameState.validMoves = validMoves
    }
  }

  const resetSelection = () => {
    gameState.selectedSquare = null
    gameState.validMoves = []
  }

  // Handle drag and drop
  const handlePieceDragStart = (e, row, col, piece) => {
    if (piece.color !== gameState.currentPlayer || gameState.gameOver) {
      e.preventDefault()
      return
    }
    
    setDraggedPiece(piece)
    setDraggedFrom({ row, col })
    selectSquare(row, col)
    
    // Set drag data
    e.dataTransfer.setData('text/plain', JSON.stringify({ row, col, piece }))
    e.dataTransfer.effectAllowed = 'move'
  }

  const handlePieceDragEnd = (e, row, col) => {
    setDraggedPiece(null)
    setDraggedFrom(null)
  }

  const handlePieceDrop = (e, row, col) => {
    e.preventDefault()
    
    if (!draggedFrom) return
    
    const moveResult = makeMove(draggedFrom.row, draggedFrom.col, row, col)
    if (moveResult.success) {
      setMoveHistory(prev => [...prev, moveResult.move])
      if (moveResult.captured) {
        toast.success(`${moveResult.move.piece.type} captured ${moveResult.captured.type}!`)
      }
      if (moveResult.check) {
        toast.warning("Check!")
      }
      if (moveResult.checkmate) {
        toast.success(`Checkmate! ${gameState.currentPlayer === 'white' ? 'Black' : 'White'} wins!`)
      }
    } else {
      toast.error("Invalid move!")
    }
    
    resetSelection()
    setDraggedPiece(null)
    setDraggedFrom(null)
  }

  const handleNewGame = () => {
    resetGame()
    setMoveHistory([])
    resetSelection()
    toast.info("New game started!")
  }

  const handleUndo = () => {
    const result = undoMove()
    if (result.success) {
      setMoveHistory(prev => prev.slice(0, -1))
      resetSelection()
      toast.info("Move undone")
    } else {
      toast.error("Cannot undo move")
    }
  }

  const handleSaveGame = () => {
    try {
      const gameData = saveGameState()
      localStorage.setItem('knightsGambitSave', JSON.stringify(gameData))
      toast.success("Game saved!")
    } catch (error) {
      toast.error("Failed to save game")
    }
  }

  const handleLoadGame = () => {
    try {
      const savedData = localStorage.getItem('knightsGambitSave')
      if (savedData) {
        const gameData = JSON.parse(savedData)
        loadGameState(gameData)
        setMoveHistory(gameData.moveHistory || [])
        resetSelection()
        toast.success("Game loaded!")
      } else {
        toast.info("No saved game found")
      }
    } catch (error) {
      toast.error("Failed to load game")
    }
  }

  const gameInProgress = moveHistory.length > 0 && !gameState.gameOver
  const canUndo = moveHistory.length > 0

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.header 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center space-x-3 mb-2">
            <ApperIcon name="Crown" size={32} className="text-accent" />
            <h1 className="text-4xl font-display bg-gradient-to-r from-secondary via-accent to-secondary bg-clip-text text-transparent">
              Knight's Gambit
            </h1>
          </div>
          <p className="text-secondary/70 text-lg">
            Strategic mini chess on a 5×5 board
          </p>
        </motion.header>

        {/* Game Layout */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Sidebar - White Captured Pieces */}
          <div className="lg:col-span-1 order-3 lg:order-1">
            <CapturedPieces 
              capturedPieces={gameState.capturedPieces}
              color="black"
              title="Black Captured"
            />
          </div>

          {/* Center - Game Board and Status */}
          <div className="lg:col-span-2 order-1 lg:order-2 space-y-6">
            <GameStatus
              currentPlayer={gameState.currentPlayer}
              inCheck={gameState.inCheck}
              gameOver={gameState.gameOver}
              winner={gameState.winner}
              moveCount={moveHistory.length}
            />
            
            <div className="flex justify-center">
              <ChessBoard
                board={gameState.board}
                selectedSquare={gameState.selectedSquare}
                validMoves={gameState.validMoves}
                inCheck={gameState.inCheck}
                onSquareClick={handleSquareClick}
                onPieceDragStart={handlePieceDragStart}
                onPieceDragEnd={handlePieceDragEnd}
                onPieceDrop={handlePieceDrop}
              />
            </div>
          </div>

          {/* Right Sidebar - Black Captured Pieces and Controls */}
          <div className="lg:col-span-1 order-2 lg:order-3 space-y-6">
            <CapturedPieces 
              capturedPieces={gameState.capturedPieces}
              color="white"
              title="White Captured"
            />
            
            <GameControls
              onNewGame={handleNewGame}
              gameInProgress={gameInProgress}
              onUndo={handleUndo}
              canUndo={canUndo}
              onSaveGame={handleSaveGame}
              onLoadGame={handleLoadGame}
            />
          </div>
        </div>

        {/* Footer */}
        <motion.footer 
          className="text-center mt-12 text-secondary/50 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <p>Built with React • Tailwind CSS • Framer Motion</p>
        </motion.footer>
      </div>
    </div>
  )
}

export default ChessGame