import { Button, message } from 'antd'
import './App.css'
import { usePlayer } from './usePlayer'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IPlayer } from './player.instance'

function App() {
  const player = usePlayer()
  const navigate = useNavigate();
  const [playerInfo, setPlayerInfo] = useState<IPlayer | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    try {
      player.refreshToken()
    } catch {
      navigate('/signIn')
    }
  }, [player, navigate])

  return (
    <>
      {playerInfo && <>
        <h1>Player</h1>
        <p>ID: {playerInfo.playerId}</p>
        <p>Username: {playerInfo.username}</p>
        <p>Token: {playerInfo.createdAt}</p>
        <p>LocatedAt: {playerInfo.locatedAt}</p>
        <p>SpacePosition: {playerInfo.auX}AU, {playerInfo.auY}AU, {playerInfo.auZ}AU</p>
        <p>Position: {playerInfo.x}m, {playerInfo.y}m, {playerInfo.z}m</p>
        <Button onClick={async () => {
          const delay = await player.ping()
          message.info(`Ping: ${delay}ms`)
        }}>ping</Button>
        <Button onClick={async () => {
          player.sendSocket(1,"123", 456)
        }}>test</Button>
      </>}
      <Button
        loading={loading}
        onClick={() => {
          if (player.online) {
            player.disconnect()
            setPlayerInfo(null)
          } else {
            setLoading(true)
            player.startLink()
              .then((player) => {
                setPlayerInfo(player)
              })
              .catch((err) => {
                message.error(err.message)
              })
              .finally(() => {
                setLoading(false)
              })
          }
        }}
      >
        {player.online ? 'Back' : 'Start Link'}
      </Button>
    </>
  )
}

export default App
