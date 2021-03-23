import React, { useState, useContext } from "react";
import { View, Image, Alert, KeyboardAvoidingView, Dimensions, StyleSheet } from "react-native";
const { height, width } = Dimensions.get('window');
import Spinner from 'react-native-loading-spinner-overlay';
import { LabelInput } from "../../../components/Forms";
import SnowflakeContext from "../../../context/SnowFlake/snowflakeContext";
import { BgView, Header } from "../../../components/Layouts";
import { ThemeContext } from "../../../hooks/useTheme";
import Button from "../../../components/Button";
import { Paragraph, Lead } from "../../../components/Typography";
import AsyncStorage from "@react-native-community/async-storage";
import bip39 from 'react-native-bip39'
import { ethers } from 'ethers';

const Register = ({ navigation }) => {
  const { isLightTheme, lightTheme, darkTheme } = useContext(ThemeContext);
  const theme = isLightTheme ? lightTheme : darkTheme;
  const snowflakeContext = useContext(SnowflakeContext);

  const [spinner, setSpinner] = useState(false);

  const {
    createDefaultAddress,
    defaultWalletData,
    walletError,
  } = snowflakeContext;
  const [address, setAddress] = useState('');
  const storeData = async () => {


  }

  const createWallet = async (e) => {

    var mnemonic = await bip39.generateMnemonic(128);

    const wallet = ethers.Wallet.fromMnemonic(mnemonic);
    let address = wallet.address
    let key = wallet.privateKey
    
    console.log("@walletAddress =>", address)
    console.log("@privateKey =>", key)
    console.log("@mnemonic  =>", mnemonic)
    setSpinner(false);
    try {
      await AsyncStorage.setItem('@privateKey', key);
      await AsyncStorage.setItem('@walletAddress', address);
      await AsyncStorage.setItem('@mnemonic', mnemonic);
    } catch (error) {
      console.log(error)
    }
    navigation.navigate("mnemonic", { address, key });

  };

  const onSubmit = () => {
    setSpinner(true);
    setTimeout(() => {
      createWallet();
    }, 1000)
  };

  const onMnemonic = (e) => {
    e.preventDefault();
    navigation.navigate("mnemonic");
  }



  return (
    <BgView>
      <View style={styles.container}>

        <Spinner visible={spinner} small={'small'} color={theme.primary} />

        <View style={styles.top}>
          <Image style={styles.logo} source={require("../../../assets/images/wallet.png")} />
        </View>

        <Paragraph style={styles.paragraph}>
          Create default wallet which would be used to create an Ethereum Identity Number
        </Paragraph>

        <View style={styles.buttonContainer}>
          <Button text="Create Wallet" onPress={onSubmit} />
          {/* <Button text="Mnemonic" style={styles.mnemonic} onPress={onMnemonic} /> */}
        </View>

      </View>
    </BgView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  top: {
    justifyContent: 'center',
    alignItems: 'center',
    height: height * 60 / 100,
    paddingHorizontal: 25
  },

  logo: {
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
  },

  paragraph: {
    textAlign: 'center',
    paddingHorizontal: width * 0.05
  },


  buttonContainer: {
    position: 'absolute',
    width: width,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },



  mnemonic: {
    marginVertical: 15
  }

})

export default Register;
