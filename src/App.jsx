import { useState } from 'react'
import './App.css'
import Scanner from './components/scanner'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Scanner />
  )
}

export default App
