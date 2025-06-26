import { useState, useCallback, useEffect } from 'react'
import { createInitialBoard, isValidChessMove, getValidMovesForPiece, isInCheck, isCheckmate } from '../utils/chessLogic'
import settingsService from '../services/settingsService'

export const useChessGame = () => {
const [gameState, setGameState] = useState(() => ({
    board: createInitialBoard(),
    currentPlayer: 'white',
    selectedSquare: null,
    validMoves: [],
    capturedPieces: { white: [], black: [] },
    inCheck: false,
    gameOver: false,
    winner: null,
    moveHistory: []
  }))

  const [settings, setSettings] = useState({
    difficulty: 'intermediate',
    timeControl: 'rapid',
    playerName: '',
    autoSave: true,
    showHints: true,
    animationSpeed: 'normal'
  })

  // Load settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const loadedSettings = await settingsService.getSettings()
        setSettings(loadedSettings)
      } catch (error) {
        console.error('Failed to load settings:', error)
      }
    }
    
    loadSettings()
  }, [])
  const makeMove = useCallback((fromRow, fromCol, toRow, toCol) => {
    const newBoard = gameState.board.map(row => [...row])
    const piece = newBoard[fromRow][fromCol]
    const capturedPiece = newBoard[toRow][toCol]
    
    // Validate the move
    if (!isValidChessMove(gameState.board, fromRow, fromCol, toRow, toCol, gameState.currentPlayer)) {
      return { success: false, error: 'Invalid move' }
    }

    // Make the move
    newBoard[toRow][toCol] = piece
    newBoard[fromRow][fromCol] = null
    
    // Mark piece as moved
    if (piece) {
      piece.hasMoved = true
    }

    // Update captured pieces
    const newCapturedPieces = { ...gameState.capturedPieces }
    if (capturedPiece) {
      newCapturedPieces[capturedPiece.color].push(capturedPiece)
    }

    // Switch players
    const nextPlayer = gameState.currentPlayer === 'white' ? 'black' : 'white'
    
    // Check if next player is in check
    const inCheck = isInCheck(newBoard, nextPlayer)
    const checkmate = inCheck && isCheckmate(newBoard, nextPlayer)
    
    // Create move record
    const move = {
      from: { row: fromRow, col: fromCol },
      to: { row: toRow, col: toCol },
      piece: { ...piece },
      captured: capturedPiece ? { ...capturedPiece } : null,
      notation: `${piece.type}${String.fromCharCode(97 + toCol)}${5 - toRow}`
    }

    // Update game state
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      currentPlayer: nextPlayer,
      selectedSquare: null,
      validMoves: [],
      capturedPieces: newCapturedPieces,
      inCheck,
      gameOver: checkmate,
      winner: checkmate ? gameState.currentPlayer : null,
      moveHistory: [...prev.moveHistory, move]
    }))

    return { 
      success: true, 
      move, 
      captured: capturedPiece,
      check: inCheck,
      checkmate 
    }
  }, [gameState])

  const resetGame = useCallback(() => {
    setGameState({
      board: createInitialBoard(),
      currentPlayer: 'white',
      selectedSquare: null,
      validMoves: [],
      capturedPieces: { white: [], black: [] },
      inCheck: false,
      gameOver: false,
      winner: null,
      moveHistory: []
    })
  }, [])

  const undoMove = useCallback(() => {
    if (gameState.moveHistory.length === 0) {
      return { success: false, error: 'No moves to undo' }
    }

    const lastMove = gameState.moveHistory[gameState.moveHistory.length - 1]
    const newBoard = gameState.board.map(row => [...row])
    
    // Restore piece to original position
    newBoard[lastMove.from.row][lastMove.from.col] = lastMove.piece
    
    // Restore captured piece if any
    if (lastMove.captured) {
      newBoard[lastMove.to.row][lastMove.to.col] = lastMove.captured
    } else {
      newBoard[lastMove.to.row][lastMove.to.col] = null
    }

    // Remove captured piece from captured pieces list
    const newCapturedPieces = { ...gameState.capturedPieces }
    if (lastMove.captured) {
      const capturedList = newCapturedPieces[lastMove.captured.color]
      const index = capturedList.findIndex(p => 
        p.type === lastMove.captured.type && p.color === lastMove.captured.color
      )
      if (index !== -1) {
        capturedList.splice(index, 1)
      }
    }

    // Switch back to previous player
    const previousPlayer = gameState.currentPlayer === 'white' ? 'black' : 'white'
    
    // Update game state
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      currentPlayer: previousPlayer,
      selectedSquare: null,
      validMoves: [],
      capturedPieces: newCapturedPieces,
      inCheck: false,
      gameOver: false,
      winner: null,
      moveHistory: prev.moveHistory.slice(0, -1)
    }))

    return { success: true }
  }, [gameState])

  const getValidMoves = useCallback((row, col) => {
    return getValidMovesForPiece(gameState.board, row, col, gameState.currentPlayer)
  }, [gameState])

  const isValidMove = useCallback((fromRow, fromCol, toRow, toCol) => {
    return isValidChessMove(gameState.board, fromRow, fromCol, toRow, toCol, gameState.currentPlayer)
  }, [gameState])

  const saveGameState = useCallback(() => {
    return {
      ...gameState,
      timestamp: new Date().toISOString()
    }
  }, [gameState])

  const loadGameState = useCallback((savedState) => {
    setGameState({
      board: savedState.board,
      currentPlayer: savedState.currentPlayer,
      selectedSquare: null,
      validMoves: [],
      capturedPieces: savedState.capturedPieces,
      inCheck: savedState.inCheck,
      gameOver: savedState.gameOver,
      winner: savedState.winner,
      moveHistory: savedState.moveHistory || []
    })
}, [])

  const updateSettings = useCallback(async (newSettings) => {
    try {
      const updatedSettings = await settingsService.updateSettings(newSettings)
      setSettings(updatedSettings)
      return updatedSettings
    } catch (error) {
      console.error('Failed to update settings:', error)
      throw error
    }
  }, [])

  const getSettings = useCallback(() => {
    return settings
  }, [settings])

  return {
    gameState,
    makeMove,
    resetGame,
    undoMove,
    getValidMoves,
    isValidMove,
    saveGameState,
    loadGameState,
    settings,
    updateSettings,
    getSettings
  }
}