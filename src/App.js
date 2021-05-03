import React, { useEffect, useState } from "react";
import SplashScreen from "react-native-splash-screen";
import { View, Text } from "react-native";
import AppContainer from "./navigation/AppContainer";
import ThemeContextProvider from "./hooks/useTheme";
import SnowflakeState from "./context/SnowFlake/SnowflakeState";
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
