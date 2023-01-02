import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { Icon } from '@rneui/themed';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Guest from './pages/Guest';
import Host from './pages/Host';
import { Provider } from './pages/Host/GameContext';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Provider>
      <NavigationContainer>
        {/* <View style={styles.container}> */}
        <Tab.Navigator
          sceneContainerStyle={{ overflow: 'visible' }}
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Host') {
                iconName = focused ? 'game-controller' : 'game-controller-outline'
              } else if (route.name === 'Guest') {
                iconName = focused ? 'link' : 'link-outline'
              } else if (route.name === 'Settings') {
                iconName = focused ? 'settings' : 'settings-outline'
              }

              // You can return any component that you like here!
              return <Icon name={iconName ?? ''} color={color} size={size} type='ionicon' containerStyle={{ paddingTop: 10 }} />;
            },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
            tabBarLabelStyle: { fontWeight: 'bold' },
            tabBarStyle: { height: 55, marginBottom: 10 }
          })}>
          <Tab.Screen name="Host" component={Host} options={{ headerShown: false }} />
          <Tab.Screen name="Guest" component={Guest} />
          {/* <Tab.Screen name="Settings" component={Guest} /> */}
        </Tab.Navigator>
        {/* <Host /> */}
        {/* <Guest /> */}
        <StatusBar style="auto" />
        {/* </View> */}
      </NavigationContainer>
    </Provider>
  );
}
