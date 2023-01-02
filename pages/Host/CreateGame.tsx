import { Text, Button, Icon, Input, Slider, Overlay } from "@rneui/themed";
import { View, Dimensions, ScrollView } from "react-native";

import React, { useState, FC, useRef } from 'react';
import { QRCodeScanner } from "./QRCodeReader";
import { TPlayer, useGameContextDispatchers } from "./GameContext";

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HostStackParamList } from ".";
import { getTeamColor, styles } from "../../styles";

type Props = NativeStackScreenProps<HostStackParamList, 'CreateGame'>;
export default function CreateGame({ navigation }: Props) {
  const { players } = useGameContextDispatchers();
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 30, paddingTop: 25 }}>
        <Button type="outline" buttonStyle={styles.button} titleStyle={styles.buttonTitle}
          onPress={() => navigation.navigate('StartGame')} disabled={players.length < 4}>
          <Icon name='play-circle-outline' type="ionicon" size={32} color='#4c4c4c' containerStyle={{ position: 'absolute', left: 10 }} />
          <Text style={styles.buttonTitle}>Iniciar Jogo ({players.length} jogadores)</Text>
        </Button>
        <BaseSettings />
        <PlayerInput />
      </ScrollView>
    </View>
  )
}

const BaseSettings: FC<{}> = () => {
  const { settings, updateSettings } = useGameContextDispatchers();
  const { turnTime, wordsPerPlayer } = settings;
  return (
    <View style={{ paddingVertical: 20 }}>
      <Text style={styles.subtitle}>Quantidade de palavras por jogador: {wordsPerPlayer}</Text>
      <Slider
        value={wordsPerPlayer}
        onValueChange={e => updateSettings(undefined, e)}
        maximumValue={10}
        minimumValue={1}
        step={1}
        allowTouchTrack
        thumbStyle={{ height: 20, width: 20, backgroundColor: 'transparent' }}
        thumbProps={{
          children: (
            <Icon
              name="golf"
              type="ionicon"
              size={20}
              reverse
              containerStyle={{ bottom: 20, right: 20, backgroundColor: '#e5e5e5' }}
              color='#afafaf'
            />
          ),
        }}
      />
      <Text style={styles.subtitle}>Tempo por turno: {turnTime}s</Text>
      <Slider
        value={turnTime}
        onValueChange={e => updateSettings(e)}
        maximumValue={90}
        minimumValue={20}
        step={5}
        allowTouchTrack
        thumbStyle={{ height: 20, width: 20 }}
        thumbProps={{
          children: (
            <Icon
              name="hourglass"
              type="ionicon"
              size={20}
              reverse
              containerStyle={{ bottom: 20, right: 20, backgroundColor: '#e5e5e5' }}
              color='#afafaf'
            />
          ),
        }}
      />
    </View>
  )
}

const PlayerInput: FC<{}> = () => {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [scanning, setScanning] = useState(false);
  const { players, settings: { wordsPerPlayer } } = useGameContextDispatchers();

  let playersSorted = Object.values(players);
  playersSorted.sort((a, b) => a.name < b.name ? -1 : 1)

  return (
    <>
      <View style={{ width: '100%', paddingVertical: 10 }}>
        <Button type="outline" buttonStyle={styles.button} titleStyle={styles.buttonTitle}
          onPress={() => setOverlayVisible(true)}>
          <Icon name='person-add-outline' type="ionicon" size={32} color='#4c4c4c' containerStyle={{ position: 'absolute', left: 10 }} />
          Adicionar novo jogador
        </Button>

        <Overlay isVisible={overlayVisible} onBackdropPress={() => setOverlayVisible(prev => !prev)}>
          <AddPlayerOverlay key={wordsPerPlayer} wordsPerPlayer={wordsPerPlayer} onHide={() => setOverlayVisible(false)} />
        </Overlay>

        <Button type="outline" buttonStyle={styles.button} titleStyle={styles.buttonTitle}
          onPress={() => setScanning(true)}>
          <Icon name='qr-code-outline' type="ionicon" size={32} color='#4c4c4c' containerStyle={{ position: 'absolute', left: 10 }} />
          Adicionar por QRCode
        </Button>

        {/* <Input leftIcon={{ type: 'font-awesome', name: 'chevron-left' }} /> */}
        <Text style={styles.subtitle}>Jogadores: {playersSorted.length}</Text>
        {playersSorted.map(player => (
          <PlayerCard key={player.name} {...player} />
        ))}
      </View>
      {scanning && <QRCodeScanner stopScanning={() => setScanning(false)} />}
    </>
  )
}

const AddPlayerOverlay: FC<{ wordsPerPlayer: number, onHide: Function }> = ({
  wordsPerPlayer, onHide }) => {
  const inputs = Array.from(Array(wordsPerPlayer + 1).keys()).map(_idx => useRef<any>());
  const scrollView = useRef<any>()
  const [currentPosition, setCurrentPosition] = useState(0);
  const submitEditing = (idx: number) => {
    if (idx < wordsPerPlayer) {
      inputs[idx + 1].current.focus();
      scrollView.current?.scrollTo({ y: currentPosition + 70 })
    } else {
      onRegister();
    }
  }
  const inputValues = Array.from(Array(wordsPerPlayer + 1).keys()).map(_idx => useState(''));

  const newPlayer = { name: inputValues[0][0], words: inputValues.slice(1,).map(input => input[0]) }
  const { registerNewPlayer } = useGameContextDispatchers();
  const onRegister = () => {
    registerNewPlayer(newPlayer);
    onHide();
  }

  return (
    <View
      style={{ width: 0.8 * Dimensions.get('window').width, height: 0.6 * Dimensions.get('window').height, padding: 10 }}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 200 }} ref={scrollView}
        onScroll={e => setCurrentPosition(e.nativeEvent.contentOffset.y)} scrollEventThrottle={8}>
        <View>
          <Input label='Nome' leftIcon={{ type: 'ionicon', name: 'person-outline' }} ref={inputs[0]} selectTextOnFocus
            onSubmitEditing={() => submitEditing(0)} returnKeyType='next' onChangeText={t => inputValues[0][1](t)}
          />

          <Input label='Palavras' leftIcon={{ type: 'ionicon', name: 'pencil-outline' }} ref={inputs[1]} returnKeyType='next'
            onSubmitEditing={() => submitEditing(1)} onChangeText={t => inputValues[1][1](t)} selectTextOnFocus
          />
          {Array.from(Array(wordsPerPlayer - 1).keys()).map(idx => (
            <Input key={idx} leftIcon={{ type: 'ionicon', name: 'pencil-outline' }} ref={inputs[idx + 2]}
              onSubmitEditing={() => submitEditing(idx + 2)} onChangeText={t => inputValues[idx + 2][1](t)} selectTextOnFocus
              returnKeyType={idx + 2 < wordsPerPlayer ? 'next' : 'done'}
            />
          ))}
        </View>

        <Button type="outline" buttonStyle={styles.button} titleStyle={styles.buttonTitle} onPress={onRegister}>
          <Icon name='person-add' type="ionicon" size={32} color='#4c4c4c' containerStyle={{ position: 'absolute', left: 15 }} />
          Adicionar novo jogador
        </Button>
      </ScrollView>
    </View>
  )
}

const PlayerCard: FC<TPlayer> = (player) => {
  const { deletePlayer, updateTeam } = useGameContextDispatchers();
  const { name, team } = player;
  const backgroundColor = getTeamColor(team)
  return (
    <Button type="outline" buttonStyle={[styles.button, { backgroundColor: backgroundColor }]} titleStyle={styles.buttonTitle}
      onPress={() => updateTeam(name)}>
      {name}
      <Icon name='close-circle-outline' type="ionicon" size={32} color='#4c4c4c' containerStyle={{ position: 'absolute', right: 15 }}
        onPress={() => deletePlayer(name)}
      />
    </Button>
  )
}
