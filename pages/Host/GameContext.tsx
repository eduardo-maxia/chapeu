import React, { createContext, FC, useContext, useEffect, useState } from 'react';
import { Audio } from 'expo-av';

export type TPlayer = {
  name: string,
  words: string[],
  team?: 1 | 2
}

type TGameState = {
  gameStep: 'Descrição' | 'Uma palavra' | 'Mímica',
  currentPlayer: number,
  wordsGone: string[],
  turn: number,
  paused: boolean,
  score: { vermelho: number, azul: number },
  message?: string
}

type TGame = {
  settings: {
    turnTime: number,
    wordsPerPlayer: number
  },
  players: TPlayer[],
  gameState: TGameState
}

const initialValue: TGame = {
  settings: {
    turnTime: 30,
    wordsPerPlayer: 5
  },
  players: [],
  gameState: {
    gameStep: 'Descrição',
    currentPlayer: 0,
    wordsGone: [],
    turn: 1,
    paused: true,
    score: { vermelho: 0, azul: 0 }
  }
}

type TContext = {
  state: TGame,
  setState: React.Dispatch<React.SetStateAction<TGame>>
}
const GameContext = createContext<TContext>({} as TContext);
export const Provider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contextState, setContextState] = useState<TGame>(initialValue)
  return (
    <GameContext.Provider value={{ state: contextState, setState: setContextState }}>{children}</GameContext.Provider>
  )
}

function get_random_item<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

const usePlayEndingSound = () => {
  const [sound, setSound] = useState<Audio.Sound>();

  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(require('../../assets/alarm.mp4')
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
        console.log('Unloading Sound');
        sound.unloadAsync();
      }
      : undefined;
  }, [sound]);

  return playSound
}

// Create Action Dispatchers
export const useGameContextDispatchers = () => {
  const { state, setState } = useContext(GameContext);
  const { players, gameState: { paused, wordsGone, gameStep, currentPlayer, turn } } = state;
  const playSound = usePlayEndingSound();

  const allWordsAvailable = players.map(p => p.words).flat(1).filter(w => !wordsGone.includes(w))
  const currentWord = get_random_item(allWordsAvailable)

  // Update Base Settings
  const updateSettings = (turnTime?: number, wordsPerPlayer?: number) => {
    setState(prev => {
      if (turnTime)
        prev.settings = { ...prev.settings, turnTime: turnTime }
      if (wordsPerPlayer)
        prev.settings = { ...prev.settings, wordsPerPlayer: wordsPerPlayer }
      return { ...prev }
    })
  }

  // Players registers
  const registerNewPlayer = (newPlayer: TPlayer) => {
    setState(prev => {
      // Check team with least players
      const team = players.filter(p => p.team === 1).length < players.filter(p => p.team === 2).length ? 1 : 2
      prev.players.push({ ...newPlayer, team: newPlayer.team ?? team })
      return { ...prev }
    })
  }

  const updateTeam = (name: string) => {
    setState(prev => {
      let player = prev.players.find(p => p.name === name)
      if (!player)
        return prev
      player.team = player.team === 1 ? 2 : player.team === 2 ? undefined : 1
      return { ...prev }
    })
  }

  const deletePlayer = (name: string) => {
    setState(prev => {
      let playerIdx = prev.players.findIndex(p => p.name === name)
      if (playerIdx === -1)
        return prev
      prev.players.splice(playerIdx, 1)
      return { ...prev }
    })
  }

  // Game management
  const setGameState = (updateFunction: (prev: TGameState) => Partial<TGameState>) => {
    setState(prevState => ({ ...prevState, gameState: { ...prevState.gameState, ...updateFunction(prevState.gameState) } }))
  }

  const setOverlayMessage = (message: string | undefined) => {
    setGameState(_prev => ({ message: message }))
  }

  const handleTimerClick = (onGameEnd: () => void) => {
    // If turn has not started, start turn
    if (paused)
      return setGameState(_prev => ({ paused: false }))

    // Score the point
    const { team } = players[currentPlayer]
    setGameState(prev => ({
      score: team === 1 ? { ...prev.score, vermelho: prev.score.vermelho + 1 } : { ...prev.score, azul: prev.score.azul + 1 }
    }))

    // Go to next word, if there is any
    if (allWordsAvailable.length > 1) {
      // Set word as gone
      setGameState(prev => ({ wordsGone: [...prev.wordsGone, currentWord] }))
      return
    }

    // Check if game is over
    if (gameStep === 'Mímica') {
      onGameEnd();
      return
    }

    // Else, go to next gameStep and reset wordsGone
    playSound();
    setOverlayMessage(`Fim da etapa de ${gameStep}!`);
    setGameState(prev => ({ wordsGone: [], gameStep: prev.gameStep === 'Descrição' ? 'Uma palavra' : 'Mímica', paused: true }))

  }

  const handleNextTurn = () => {
    // Get next player
    const { team } = players[currentPlayer]
    const nextTeam = team === 1 ? 2 : 1
    const nextTeamPlayers = players.filter(p => p.team === nextTeam);
    const currentTeamPlayer = Math.floor(turn / 2) % nextTeamPlayers.length
    const { name } = nextTeamPlayers[currentTeamPlayer]

    // Go to next turn
    playSound();
    setOverlayMessage(`Turno do jogador ${name}`)
    setGameState(prev => ({ paused: true, turn: prev.turn + 1, currentPlayer: players.findIndex(p => p.name === name) }))
  }

  const resetGame = () => setState(initialValue)

  return {
    ...state, currentWord, setState, updateSettings, registerNewPlayer, updateTeam,
    deletePlayer, handleTimerClick, handleNextTurn, resetGame, setOverlayMessage
  }
}
