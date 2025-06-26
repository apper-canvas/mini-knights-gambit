// Create initial 5x5 chess board setup
export const createInitialBoard = () => {
  const board = Array(5).fill(null).map(() => Array(5).fill(null))
  
  // Black pieces (top)
  board[0][0] = { type: 'rook', color: 'black', hasMoved: false }
  board[0][1] = { type: 'knight', color: 'black', hasMoved: false }
  board[0][2] = { type: 'king', color: 'black', hasMoved: false }
  board[0][3] = { type: 'knight', color: 'black', hasMoved: false }
  board[0][4] = { type: 'rook', color: 'black', hasMoved: false }
  board[1][2] = { type: 'queen', color: 'black', hasMoved: false }
  
  // Black pawns
  board[1][0] = { type: 'pawn', color: 'black', hasMoved: false }
  board[1][1] = { type: 'pawn', color: 'black', hasMoved: false }
  board[1][3] = { type: 'pawn', color: 'black', hasMoved: false }
  board[1][4] = { type: 'pawn', color: 'black', hasMoved: false }
  
  // White pawns
  board[3][0] = { type: 'pawn', color: 'white', hasMoved: false }
  board[3][1] = { type: 'pawn', color: 'white', hasMoved: false }
  board[3][3] = { type: 'pawn', color: 'white', hasMoved: false }
  board[3][4] = { type: 'pawn', color: 'white', hasMoved: false }
  
  // White pieces (bottom)
  board[4][0] = { type: 'rook', color: 'white', hasMoved: false }
  board[4][1] = { type: 'knight', color: 'white', hasMoved: false }
  board[4][2] = { type: 'king', color: 'white', hasMoved: false }
  board[4][3] = { type: 'knight', color: 'white', hasMoved: false }
  board[4][4] = { type: 'rook', color: 'white', hasMoved: false }
  board[3][2] = { type: 'queen', color: 'white', hasMoved: false }
  
  return board
}

// Check if coordinates are within board bounds
const isValidPosition = (row, col) => {
  return row >= 0 && row < 5 && col >= 0 && col < 5
}

// Get all possible moves for a piece at given position
export const getValidMovesForPiece = (board, row, col, currentPlayer) => {
  const piece = board[row][col]
  if (!piece || piece.color !== currentPlayer) {
    return []
  }

  const moves = []
  
  switch (piece.type) {
    case 'pawn':
      moves.push(...getPawnMoves(board, row, col, piece.color))
      break
    case 'rook':
      moves.push(...getRookMoves(board, row, col, piece.color))
      break
    case 'knight':
      moves.push(...getKnightMoves(board, row, col, piece.color))
      break
    case 'queen':
      moves.push(...getQueenMoves(board, row, col, piece.color))
      break
    case 'king':
      moves.push(...getKingMoves(board, row, col, piece.color))
      break
  }
  
  // Filter out moves that would put own king in check
  return moves.filter(move => {
    const testBoard = simulateMove(board, row, col, move.row, move.col)
    return !isInCheck(testBoard, piece.color)
  })
}

// Get pawn moves
const getPawnMoves = (board, row, col, color) => {
  const moves = []
  const direction = color === 'white' ? -1 : 1
  const startRow = color === 'white' ? 3 : 1
  
  // Forward move
  const newRow = row + direction
  if (isValidPosition(newRow, col) && !board[newRow][col]) {
    moves.push({ row: newRow, col })
    
    // Double move from starting position
    if (row === startRow && !board[newRow + direction]?.[col]) {
      moves.push({ row: newRow + direction, col })
    }
  }
  
  // Diagonal captures
  for (const deltaCol of [-1, 1]) {
    const captureRow = row + direction
    const captureCol = col + deltaCol
    if (isValidPosition(captureRow, captureCol)) {
      const target = board[captureRow][captureCol]
      if (target && target.color !== color) {
        moves.push({ row: captureRow, col: captureCol })
      }
    }
  }
  
  return moves
}

// Get rook moves
const getRookMoves = (board, row, col, color) => {
  const moves = []
  const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]
  
  for (const [deltaRow, deltaCol] of directions) {
    for (let i = 1; i < 5; i++) {
      const newRow = row + deltaRow * i
      const newCol = col + deltaCol * i
      
      if (!isValidPosition(newRow, newCol)) break
      
      const target = board[newRow][newCol]
      if (!target) {
        moves.push({ row: newRow, col: newCol })
      } else {
        if (target.color !== color) {
          moves.push({ row: newRow, col: newCol })
        }
        break
      }
    }
  }
  
  return moves
}

// Get knight moves
const getKnightMoves = (board, row, col, color) => {
  const moves = []
  const directions = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1]
  ]
  
  for (const [deltaRow, deltaCol] of directions) {
    const newRow = row + deltaRow
    const newCol = col + deltaCol
    
    if (isValidPosition(newRow, newCol)) {
      const target = board[newRow][newCol]
      if (!target || target.color !== color) {
        moves.push({ row: newRow, col: newCol })
      }
    }
  }
  
  return moves
}

// Get queen moves (combination of rook and bishop)
const getQueenMoves = (board, row, col, color) => {
  const moves = []
  const directions = [
    [0, 1], [0, -1], [1, 0], [-1, 0],
    [1, 1], [1, -1], [-1, 1], [-1, -1]
  ]
  
  for (const [deltaRow, deltaCol] of directions) {
    for (let i = 1; i < 5; i++) {
      const newRow = row + deltaRow * i
      const newCol = col + deltaCol * i
      
      if (!isValidPosition(newRow, newCol)) break
      
      const target = board[newRow][newCol]
      if (!target) {
        moves.push({ row: newRow, col: newCol })
      } else {
        if (target.color !== color) {
          moves.push({ row: newRow, col: newCol })
        }
        break
      }
    }
  }
  
  return moves
}

// Get king moves
const getKingMoves = (board, row, col, color) => {
  const moves = []
  const directions = [
    [0, 1], [0, -1], [1, 0], [-1, 0],
    [1, 1], [1, -1], [-1, 1], [-1, -1]
  ]
  
  for (const [deltaRow, deltaCol] of directions) {
    const newRow = row + deltaRow
    const newCol = col + deltaCol
    
    if (isValidPosition(newRow, newCol)) {
      const target = board[newRow][newCol]
      if (!target || target.color !== color) {
        moves.push({ row: newRow, col: newCol })
      }
    }
  }
  
  return moves
}

// Simulate a move on the board
const simulateMove = (board, fromRow, fromCol, toRow, toCol) => {
  const newBoard = board.map(row => [...row])
  const piece = newBoard[fromRow][fromCol]
  
  newBoard[toRow][toCol] = piece
  newBoard[fromRow][fromCol] = null
  
  return newBoard
}

// Find king position for a given color
const findKing = (board, color) => {
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      const piece = board[row][col]
      if (piece && piece.type === 'king' && piece.color === color) {
        return { row, col }
      }
    }
  }
  return null
}

// Check if a position is under attack by opponent
const isPositionUnderAttack = (board, row, col, attackerColor) => {
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      const piece = board[r][c]
      if (piece && piece.color === attackerColor) {
        const moves = getValidMovesForPiece(board, r, c, attackerColor)
        if (moves.some(move => move.row === row && move.col === col)) {
          return true
        }
      }
    }
  }
  return false
}

// Check if king is in check
export const isInCheck = (board, color) => {
  const kingPos = findKing(board, color)
  if (!kingPos) return false
  
  const opponentColor = color === 'white' ? 'black' : 'white'
  return isPositionUnderAttack(board, kingPos.row, kingPos.col, opponentColor)
}

// Check if it's checkmate
export const isCheckmate = (board, color) => {
  if (!isInCheck(board, color)) return false
  
  // Try all possible moves for the player
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      const piece = board[row][col]
      if (piece && piece.color === color) {
        const moves = getValidMovesForPiece(board, row, col, color)
        if (moves.length > 0) {
          return false // Found at least one valid move
        }
      }
    }
  }
  
  return true // No valid moves found
}

// Validate if a move is legal
export const isValidChessMove = (board, fromRow, fromCol, toRow, toCol, currentPlayer) => {
  // Basic validation
  if (!isValidPosition(fromRow, fromCol) || !isValidPosition(toRow, toCol)) {
    return false
  }
  
  const piece = board[fromRow][fromCol]
  if (!piece || piece.color !== currentPlayer) {
    return false
  }
  
  // Can't capture own piece
  const targetPiece = board[toRow][toCol]
  if (targetPiece && targetPiece.color === piece.color) {
    return false
  }
  
  // Get valid moves for the piece
  const validMoves = getValidMovesForPiece(board, fromRow, fromCol, currentPlayer)
  
  // Check if the target position is in valid moves
  return validMoves.some(move => move.row === toRow && move.col === toCol)
}