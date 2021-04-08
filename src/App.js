import React, { useEffect, useState } from "react";
import SplashScreen from "react-native-splash-screen";
import { Animated, Easing, View, StatusBar, Platform, Text } from "react-native";
import AppContainer from "./navigation/AppContainer";
import AsyncStorage from "@react-native-community/async-storage";
import LottieView from "lottie-react-native";
import ThemeContextProvider from "./hooks/useTheme";
import SnowflakeState from "./context/SnowFlake/SnowflakeState";
import MainNavigation from "./navigation/MainNavigation";
import Home from './screens/Dashboard/Home'
import { Alert } from "react-native";
console.disableYellowBox = true;
const ShowAnimation = () => {
  return (
    <View
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* <LottieView
        source={require("./assets/waves.json")}
        autoPlay
        key={1}
        loop
        style={{
          height: "100%",
          width: "100%",
        }}
      /> */}

      <Text></Text>
    </View>
  );
};

const App = ({ navigation, route }) => {
  const [animationTime, setAnimationTime] = useState(false);

  useEffect(async () => {

    // console.log(web3)
    SplashScreen.hide();
    // console.log('calling')
  }, []);
  setTimeout(() => {
    setAnimationTime(true);
  }, 1000);
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
