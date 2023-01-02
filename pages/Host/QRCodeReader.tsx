import { Text, Icon, Overlay } from "@rneui/themed";
import { View, StyleSheet, Dimensions } from "react-native";


import React, { useState, useEffect, FC } from 'react';

import { BarCodeScanner } from 'expo-barcode-scanner';
import { useGameContextDispatchers } from "./GameContext";

const getCameraPermission = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  return hasPermission
}

export const QRCodeScanner: FC<{ stopScanning: () => void }> = ({ stopScanning }) => {
  const hasPermission = getCameraPermission();
  const { registerNewPlayer } = useGameContextDispatchers();

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    // Parse data
    const namesParsed = data.split('/');
    registerNewPlayer({
      name: namesParsed[0],
      words: namesParsed.slice(1,)
    });
    stopScanning();;
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  hasPermission === false && stopScanning();

  return (
    <Overlay isVisible>
      <View style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}>
        <Icon type="ionicon" name='chevron-back-outline' containerStyle={{ position: 'absolute', top: 20, left: 10, zIndex: 2 }}
          color='#4c4c4c' size={40} onPress={stopScanning} />
        <BarCodeScanner
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          onBarCodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
    </Overlay>
  );
}
