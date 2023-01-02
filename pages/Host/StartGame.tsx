import { Text, Icon, Overlay } from "@rneui/themed";
import { View, TouchableOpacity } from "react-native";
import { getTeamColor, styles } from "../../styles";
import { useGameContextDispatchers } from "./GameContext";
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import { FC, useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HostStackParamList } from ".";

type Props = NativeStackScreenProps<HostStackParamList, 'StartGame'>;
export default function StartGame({ navigation }: Props) {
  const { players, gameState, setOverlayMessage } = useGameContextDispatchers();
  const [dismissable, setDismissable] = useState(false)
  const { name, team } = players[gameState.currentPlayer]

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDismissable(true);
    }, 3000);
    return () => {
      clearTimeout(timeout);
    }
  }, [gameState.message])

  const handleDismiss = () => dismissable && setOverlayMessage(undefined)
  return (
    <View style={styles.centeredContainer}>
      <Score />
      <Text style={styles.title}>Etapa: {gameState.gameStep}</Text>
      <Text style={styles.text}>
        Turno de:
        <Text style={{ marginLeft: 10, color: getTeamColor(team), fontWeight: 'bold', fontSize: 20 }}> {name}</Text>
      </Text>
      <Timer onGameEnd={() => navigation.navigate('FinishedGame')} />
      <Overlay isVisible={!!gameState.message} onBackdropPress={handleDismiss} backdropStyle={{ shadowOpacity: 1 }}>
        <TouchableOpacity style={{ padding: 30 }} onPress={handleDismiss}>
          <Text style={styles.subtitle}>{gameState.message}</Text>
        </TouchableOpacity>
      </Overlay>
    </View>
  )
}

const Score = () => {
  const [visible, setVisible] = useState(true);
  const { gameState: { score: { vermelho, azul } } } = useGameContextDispatchers();
  return (
    <View style={styles.borderBox}>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 10, justifyContent: 'center' }}>
        <Text style={styles.title}>Placar geral:   </Text>
        <Icon name={!visible ? 'eye-outline' : 'eye-off-outline'} type='ionicon' size={32} onPress={() => setVisible(prev => !prev)} />
      </View>

      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: 'coral', fontWeight: 'bold', fontSize: 20 }}>Vermelho: </Text>
        <Text style={{ marginRight: 10, color: 'coral', fontWeight: 'bold', fontSize: 20 }}>{visible ? vermelho : '-'}</Text>
        <Text style={{ marginLeft: 10, color: getTeamColor(2), fontWeight: 'bold', fontSize: 20 }}>Azul: </Text>
        <Text style={{ color: getTeamColor(2), fontWeight: 'bold', fontSize: 20 }}>{visible ? azul : '-'}</Text>
      </View>
    </View>
  )
}

const Timer: FC<{ onGameEnd: () => void }> = ({ onGameEnd }) => {
  const { settings: { turnTime }, gameState: { turn, paused }, currentWord, handleTimerClick, handleNextTurn } = useGameContextDispatchers();
  return (
    <>
      {!paused && <Text style={styles.text}>Palavra: <Text style={styles.palavra}>{currentWord}</Text></Text>}
      <TouchableOpacity onPress={() => handleTimerClick(onGameEnd)}>
        <CountdownCircleTimer
          key={turn}
          isPlaying={!paused}
          duration={turnTime}
          colors={['#004777', '#F7B801', '#A30000', '#A30000']}
          colorsTime={[7, 5, 2, 0]}
          onComplete={handleNextTurn}
        >
          {({ remainingTime, color }) => (
            <Text style={{ color, fontSize: 40 }}>
              {remainingTime}
            </Text>
          )}
        </CountdownCircleTimer>
      </TouchableOpacity>
      {paused ?
        <Text style={styles.text}>Clique no contador para iniciar seu turno.</Text> :
        <Text style={styles.text}>Clique no contador para passar de palavra.</Text>
      }
    </>
  )
}
