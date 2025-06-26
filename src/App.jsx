import { BrowserRouter as Router } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import ChessGame from './components/pages/ChessGame'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-background via-primary to-surface">
        <ChessGame />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  )
}

export default App