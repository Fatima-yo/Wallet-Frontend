import React, { useEffect, useState } from "react";
import SplashScreen from "react-native-splash-screen";
import { Animated, Easing, View, StatusBar, Platform } from "react-native";
import AppContainer from "./navigation/AppContainer";
import AsyncStorage from "@react-native-community/async-storage";
import LottieView from "lottie-react-native";
import ThemeContextProvider from "./hooks/useTheme";
import SnowflakeState from "./context/SnowFlake/SnowflakeState";
import Web3 from "web3";
import MainNavigation from "./navigation/MainNavigation";
import Home from './screens/Dashboard/Home'
import { Alert } from "react-native";

const ShowAnimation = () => {
  return (
    <View
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LottieView
        source={require("./assets/waves.json")}
        autoPlay
        key={1}
        loop
        style={{
          height: "100%",
          width: "100%",
        }}
      />
    </View>
  );
};

const App = ({ navigation, route }) => {
  const [animationTime, setAnimationTime] = useState(false);
  const [wallet_address_Value, setwallet_address_Value] = useState('');


  useEffect(async () => {

      // const address = await AsyncStorage.getItem('@wallet_address_key');
      // const hydroId = await AsyncStorage.getItem('@hydro_id_key');
      // console.log('wallet_address_key--------------------------->', address,)
      // console.log('Hydro----', hydroId);
      // setwallet_address_Value(address);
      // if (address, hydroId !== null) {

      //   navigation.navigate("app", { screen: "home", params: { address, hydroId } });
      // } else {

      //   navigation.navigate("register");
      // }

    const web3 = new Web3(
      new Web3.providers.HttpProvider(
        `https://mainnet.infura.io/v3/75cc8cba22ab40b9bfa7406ae9b69a27`
      )
    );

    console.log(web3)
    SplashScreen.hide();
  }, []);
  setTimeout(() => {
    setAnimationTime(true);
  }, 5200);
  return (
    <ThemeContextProvider>
      <SnowflakeState>
        {/* {wallet_address_Value !== null ? <MainNavigation /> : <AppContainer />} */}
        {animationTime ? <AppContainer /> : <ShowAnimation />}
      </SnowflakeState>
    </ThemeContextProvider>
  );
};

export default App;
