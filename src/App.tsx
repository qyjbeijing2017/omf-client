import { Button } from 'antd'
import './App.css'
import { usePlayer } from './usePlayer'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function App() {
  const player = usePlayer()
  const navigate = useNavigate();

  useEffect(() => {
    try {
      player.refreshToken()
    } catch {
      navigate('/signIn')
    }
  }, [player, navigate])

  return (
    <>
      <Button onClick={() => {
        player.startLink()
      }}>Start Link</Button>
    </>
  )
}

export default App
