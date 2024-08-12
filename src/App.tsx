import { Button } from 'antd'
import './App.css'
import { usePlayer } from './usePlayer'

function App() {
  const player = usePlayer()
  return (
    <>
    <Button onClick={()=>{
      player.connect()
    }}>Play</Button>
    </>
  )
}

export default App
