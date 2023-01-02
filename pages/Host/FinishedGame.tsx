import { Text, Button, Icon, Input, Slider, Overlay } from "@rneui/themed";
import { View, Dimensions, ScrollView } from "react-native";

import React, { useState } from 'react';
import { useGameContextDispatchers } from "./GameContext";

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HostStackParamList } from ".";
import { getTeamColor, styles } from "../../styles";

type Props = NativeStackScreenProps<HostStackParamList, 'FinishedGame'>;
export default function FinishedGame({ navigation }: Props) {
  const { resetGame, gameState: { score: { vermelho, azul } } } = useGameContextDispatchers();
  return (
    <View style={styles.centeredContainer}>
      <View style={{ paddingHorizontal: 30, paddingTop: 25 }}>
        <Text style={styles.title}>Fim do jogo</Text>
        <Text style={[styles.title, { marginVertical: 20, color: getTeamColor(vermelho > azul ? 1 : 2), fontWeight: 'bold' }]}>
          Time {vermelho > azul ? 'Vermelho' : 'Azul'} ganhou!!
        </Text>
        <Score />

        <Button type="outline" buttonStyle={styles.button} titleStyle={styles.buttonTitle}
          onPress={() => { resetGame(); navigation.navigate('CreateGame') }}>
          <Text style={styles.buttonTitle}>Novo Jogo</Text>
          <Icon name='refresh-circle-outline' type="ionicon" size={32} color='#4c4c4c' containerStyle={{ position: 'absolute', right: 10 }} />
        </Button>
      </View>
    </View>
  )
}

const Score = () => {
  const [visible, setVisible] = useState(true);
  const { gameState: { score: { vermelho, azul } } } = useGameContextDispatchers();
  return (
    <View style={styles.borderBox}>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 10, justifyContent: 'center' }}>
        <Text style={styles.title}>Placar geral:</Text>
        {/* <Icon name={!visible ? 'eye-outline' : 'eye-off-outline'} type='ionicon' size={32} onPress={() => setVisible(prev => !prev)} /> */}
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
