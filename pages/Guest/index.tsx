import { Text, Button, Input, Overlay, Icon, Slider } from "@rneui/themed";
import { View, ScrollView, Dimensions, Keyboard, TouchableWithoutFeedback } from "react-native";

import React, { useState, useRef, FC } from 'react';

import SvgQRCode from 'react-native-qrcode-svg';
import { styles } from "../../styles";

export default function Guest() {
  const [wordsPerPlayer, setWordsPerPlayer] = useState(5);
  const [name, setName] = useState('');
  const [wordsList, setWordsList] = useState('') // slash separated
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlay2Visible, setOverlay2Visible] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView style={[styles.container, { padding: 30 }]}>
        <Input label='Nome' leftIcon={{ type: 'ionicon', name: 'person-outline' }} onChangeText={t => setName(t)} />

        <Text style={styles.subtitle}>Quantidade de palavras por jogador: {wordsPerPlayer}</Text>
        <Slider
          value={wordsPerPlayer}
          onValueChange={e => setWordsPerPlayer(e)}
          maximumValue={10}
          minimumValue={1}
          step={1}
          allowTouchTrack
          style={{ marginVertical: 25 }}
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

        <Button type="outline" buttonStyle={styles.button} titleStyle={styles.buttonTitle}
          onPress={() => setOverlayVisible(true)}>
          <Icon name='pencil-outline' type="ionicon" size={32} color='#4c4c4c' containerStyle={{ position: 'absolute', left: 10 }} />
          Adicionar Palavras
        </Button>

        <Overlay isVisible={overlayVisible} onBackdropPress={() => setOverlayVisible(prev => !prev)}>
          <AddPlayerOverlay wordsPerPlayer={wordsPerPlayer} onHide={(words) => { setWordsList(words); setOverlayVisible(false) }}
            wordsList={wordsList.split('/')} key={wordsPerPlayer} />
        </Overlay>

        <Button type="outline" buttonStyle={styles.button} titleStyle={styles.buttonTitle}
          onPress={() => setOverlay2Visible(true)}>
          <Icon name='qr-code-outline' type="ionicon" size={32} color='#4c4c4c' containerStyle={{ position: 'absolute', left: 10 }} />
          Gerar QRCode
        </Button>

        <Overlay isVisible={overlay2Visible} onBackdropPress={() => setOverlay2Visible(prev => !prev)}>
          <SvgQRCode value={[name, wordsList].join('/')} size={0.85 * Dimensions.get('window').width} />
        </Overlay>

      </ScrollView >
    </TouchableWithoutFeedback>
  )
}

const AddPlayerOverlay: FC<{ wordsPerPlayer: number, onHide: (words: string) => void, wordsList: string[] }> = ({
  wordsPerPlayer, onHide, wordsList
}) => {
  const inputs = Array.from(Array(wordsPerPlayer).keys()).map(_idx => useRef<any>());
  const scrollView = useRef<any>()
  const [currentPosition, setCurrentPosition] = useState(0);
  const submitEditing = (idx: number) => {
    if (idx + 1 < wordsPerPlayer) {
      inputs[idx + 1].current.focus();
      scrollView.current?.scrollTo({ y: currentPosition + 70 })
    }
    else {
      onHide(inputValues.map(input => input[0]).join('/'));
    }
  }
  const inputValues = Array.from(Array(wordsPerPlayer).keys()).map(idx => useState(wordsList[idx] ?? ''));
  const onRegister = () => {
    onHide(inputValues.map(input => input[0]).join('/'));
  }

  return (
    <View
      style={{ width: 0.8 * Dimensions.get('window').width, height: 0.6 * Dimensions.get('window').height, padding: 10 }}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 130 }} ref={scrollView}
        onScroll={e => setCurrentPosition(e.nativeEvent.contentOffset.y)} scrollEventThrottle={8}>
        <View>
          <Input label='Palavras' leftIcon={{ type: 'ionicon', name: 'pencil-outline' }} ref={inputs[0]} returnKeyType='next'
            onSubmitEditing={() => submitEditing(0)} onChangeText={t => inputValues[0][1](t)} selectTextOnFocus
            value={inputValues[0][0]}
          />
          {Array.from(Array(wordsPerPlayer - 1).keys()).map(idx => (
            <Input key={idx} leftIcon={{ type: 'ionicon', name: 'pencil-outline' }} ref={inputs[idx + 1]}
              onSubmitEditing={() => submitEditing(idx + 1)} onChangeText={t => inputValues[idx + 1][1](t)}
              returnKeyType={idx + 2 < wordsPerPlayer ? 'next' : 'done'} selectTextOnFocus value={inputValues[idx + 1][0]}
            />
          ))}
        </View>

        <Button type="outline" buttonStyle={styles.button} titleStyle={styles.buttonTitle} onPress={onRegister}>
          <Icon name='add-circle-outline' type="ionicon" size={32} color='#4c4c4c' containerStyle={{ position: 'absolute', left: 10 }} />
          Registrar Palavras
        </Button>
      </ScrollView>
    </View>
  )
}
