import { Text, Button, Icon, Input, Slider, Overlay } from "@rneui/themed";
import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import CreateGame from "./CreateGame";
import StartGame from "./StartGame";
import FinishedGame from "./FinishedGame";

export type HostStackParamList = {
  CreateGame: undefined,
  StartGame: undefined,
  FinishedGame: undefined
}
const HostStack = createStackNavigator<HostStackParamList>();

export default function HostStackScreen() {
  return (
    <HostStack.Navigator>
      <HostStack.Screen name='CreateGame' component={CreateGame} options={{ title: 'Criar Jogo' }} />
      <HostStack.Screen name='StartGame' component={StartGame} options={{ headerShown: false }} />
      <HostStack.Screen name='FinishedGame' component={FinishedGame} options={{ headerShown: false }} />
    </HostStack.Navigator>
  )
}
