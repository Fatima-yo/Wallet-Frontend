import React, { useEffect } from "react";
import { Text } from "react-native";
import * as SecureStore from 'expo-secure-store';
import LoadingView from 'react-native-loading-view'

const Landing = ({ navigation }) => {
  useEffect(async () => {
    console.log(SecureStore.isAvailableAsync())
    const address = await SecureStore.getItemAsync('walletAddress');
    const hydroId = await SecureStore.getItemAsync('hydro_id_key');

    if (address !== null) {
      navigation.navigate("app", { screen: "home", params: { address, hydroId } })
    }
    else
      navigation.navigate("landing")
  }, [])

  return (
    <LoadingView loading={true}>
    </LoadingView>
  );
};

export default Landing;
