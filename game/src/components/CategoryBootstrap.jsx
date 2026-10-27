import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { loadGameState, saveGameState } from '../state/gameState'

const CATEGORY_BY_TOKEN = {
  '65a9c1c6475536fc21f3055beeb94083': 'regular',
  '294392927ed521485b7d20e394f4f046': 'add-on',
}

function CategoryBootstrap() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    const category = CATEGORY_BY_TOKEN[token]
    if (category !== 'regular' && category !== 'add-on') {
      navigate('/', { replace: true })
      return
    }

    try {
      const gameState = loadGameState()
      if (gameState.playerCategory === null) {
        saveGameState({ ...gameState, playerCategory: category })
      }
      navigate('/', { replace: true })
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to save the player category.',
      )
    }
  }, [token, navigate])

  if (error) {
    return <p role="alert">{error}</p>
  }

  return <p>Setting up your game...</p>
}

export default CategoryBootstrap