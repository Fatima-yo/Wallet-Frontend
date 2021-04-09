import React, { useContext, useEffect } from "react";
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  StatusBar,
  BackHandler
} from "react-native";
import { BgView, Header } from "../../components/Layouts";
import Icon from "react-native-vector-icons/FontAwesome5";
import { ThemeContext } from "../../hooks/useTheme";
import {AllHydroCard, HydroCard, HydroBNBCard, EtherCard, BNBCard, TuscCard } from "../../components/cards";
import w3s from '../../libs/Web3Service';
import * as SecureStore from 'expo-secure-store';
import { ethers, } from 'ethers';
import Web3 from 'web3';
import { Apis } from "tuscjs-ws";

const { height, width } = Dimensions.get('window');
const Home = ({ navigation, route }) => {
  
  const [etherbalance, setEtherbalance] = React.useState(0);
  const [bnbbalance, setBnbbalance] = React.useState(0);
  const [tuscbalance, setTuscbalance] = React.useState(0);
  
  const [allHydroBalanceFlag, setAllHydroBalanceFlag] = React.useState('HYDRO (BEP20)');
  const [currentToken, setCurrentToken] = React.useState('BEP20')
  
  const [leftColor, setLeftColor] = React.useState('gray');
  const [rightColor, setRightColor] = React.useState('#000');
  const [BEP20Balance, setBEP20Balance] = React.useState(0)
  const [ERC20Balance, setERC20Balance] = React.useState(0)
  const [hydrobalance, setHydrobalance] = React.useState(0);

  const { address, hydroId } = route.params;

  const { isLightTheme, lightTheme, darkTheme, toggleTheme } = useContext(
    ThemeContext
  );

  const theme = isLightTheme ? lightTheme : darkTheme;

  function handleBackButtonClick() {
    if (navigation.isFocused()) {
      BackHandler.exitApp();
      return true;
    } else {
      return false;
    }
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    };
  }, []);

  const getHydroBalance = () => { 
    if (currentToken == 'BEP20') {
      return BEP20Balance
    }  else {
      return ERC20Balance
    }
  }

  const sendHydro = async () => {
    if (currentToken == 'BEP20') {
      navigation.navigate("transferbnbhydro", { walletToken: address })
    } else {
      navigation.navigate("deposits", { walletToken: address })
    }
  }

  const hydroHistory = async () => {
    if (currentToken == 'BEP20') {
      console.log('BEP20 HISTORY')
    } else {
      console.log('ERC20 HISTORY')
    }
  }

  const receiveHydro = async () => {
    if (currentToken == 'BEP20') {
      navigation.navigate("receivebnbhydro")
    } else {
      navigation.navigate("receivehydro")
    }
  }


  const handlegetHydroBalance = async () => {
    try {
      const value = await SecureStore.getItemAsync('privateKey');
      let currentProvider = await new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/75cc8cba22ab40b9bfa7406ae9b69a27');
      let provider = new ethers.providers.Web3Provider(currentProvider);
      let wallet = new ethers.Wallet(value, provider)

      const abi = await w3s.getHydroTokenABI()
      const hydrotokenaddress = await w3s.getHydroTokenAddress()
      const contract = new ethers.Contract(hydrotokenaddress, abi, wallet)

      let hydrobalance_aux = await contract.balanceOf(wallet.address);
      hydrobalance_aux = Web3.utils.fromWei(hydrobalance_aux.toString())
      setERC20Balance(hydrobalance_aux)
      return hydrobalance_aux
    } catch (error) {
      console.log(error)
    }
  }

  const handlegetHydroBNBBalance = async () => {
    try {
      const value = await SecureStore.getItemAsync('privateKey');
      let currentProvider = await new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org/');
      let provider = new ethers.providers.Web3Provider(currentProvider);
      let wallet = new ethers.Wallet(value, provider)

      const abi = await w3s.getHydroTokenABI()
      const hydrotokenaddress = await w3s.getHydroTokenBNBAddress()
      const contract = new ethers.Contract(hydrotokenaddress, abi, wallet)

      let hydrobalance_aux = await contract.balanceOf(wallet.address);
      hydrobalance_aux = Web3.utils.fromWei(hydrobalance_aux.toString())
      setBEP20Balance(hydrobalance_aux)
      return hydrobalance_aux
    } catch (error) {
      console.log(error)
    }
  }

  const handlegetEtherBalance = async () => {
    try {
      const value = await SecureStore.getItemAsync('privateKey');
      let currentProvider = await new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/75cc8cba22ab40b9bfa7406ae9b69a27');
      let provider = new ethers.providers.Web3Provider(currentProvider);
      let wallet = new ethers.Wallet(value, provider)

      const abi = await w3s.getHydroTokenABI()
      const hydrotokenaddress = await w3s.getHydroTokenAddress()
      const contract = new ethers.Contract(hydrotokenaddress, abi, wallet)

      let etherbalance = await wallet.getBalance()
      etherbalance = Web3.utils.fromWei(etherbalance.toString())
      setEtherbalance(etherbalance)

    } catch (error) {
      console.log(error)
    }
  }

  const handlegetBnbBalance = async () => {
    try {
      const value = await SecureStore.getItemAsync('privateKey');
      let currentProvider = await new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org/');
      let provider = new ethers.providers.Web3Provider(currentProvider);
      let wallet = new ethers.Wallet(value, provider)

      let etherbalance = await wallet.getBalance()
      etherbalance = Web3.utils.fromWei(etherbalance.toString())
      setBnbbalance(etherbalance)

    } catch (error) {
      console.log(error)
    }
  }

  const handlegetTuscBalance = async () => {
    console.log('handlegetTuscBalance')
    let socket = new WebSocket('wss://tuscapi.gambitweb.com');
    socket.onopen = async () => {
      console.log('open')
      const accountName = await SecureStore.getItemAsync('accountName');
      if (!accountName) {
        setTuscbalance(0)
        return
      }
      Apis.instance('wss://tuscapi.gambitweb.com/', true).init_promise.then((res) => {
        console.log("connected to:", res[0].network);
        return Apis.instance().db_api().exec("lookup_accounts", [
          accountName, 100
        ]).then(accounts => {
          console.log('success')
          Apis.instance().db_api().exec("get_full_accounts", [accounts[0], false]).then(res => {
            let tuscbalance = res[0][1]['balances'][0]['balance']
            if (tuscbalance === 11000100000) {
              tuscbalance = 0;
            }
            tuscbalance = tuscbalance / 100000 
            setTuscbalance(tuscbalance)
          })
            .catch(err => {
              console.log('erro---->', err)
            })
        }).catch((err) => {
          console.log('failed')
        })
      })

    }
    socket.onclose = (e) => {
      console.log('close');
    };
    socket.close();
    socket.CLOSED;

    setTimeout(handleGetAllBalances, 100000);
  }

  const setHydroCardBalance = async () => {
    try {
      if (currentToken == 'BEP20') {
        await setHydrobalance(BEP20Balance)
      } else {
        await setHydrobalance(ERC20Balance)
      }
    } catch (error) {
      console.log(error.message)
    }}

  useEffect(() => {
    handleGetAllBalances();
    handlegetTuscBalance();
  }, [])

  const handleGetAllBalances = async () => {
    handlegetBnbBalance();

    let hydrobnbbalance = await handlegetHydroBNBBalance();
    setBEP20Balance(hydrobnbbalance);

    let hydroercbalance = await handlegetHydroBalance();
    setERC20Balance(hydroercbalance);

    setHydroCardBalance()
    handlegetEtherBalance();
    setTimeout(handleGetAllBalances, 10000);
  }

  const handleChangeLeftBalance = () => {
    console.log('left')
    setCurrentToken('BEP20')
    setHydrobalance(BEP20Balance)
    setAllHydroBalanceFlag('HYDRO (BEP20)')
    setLeftColor('gray')
    setRightColor('#000')
  }

  const handleChangeRightBalance = () => {
    console.log('right')
    setCurrentToken('ERC20')
    setHydrobalance(ERC20Balance)
    setAllHydroBalanceFlag('HYDRO (ERC20)')
    setRightColor('gray')
    setLeftColor('#000')
  }

  return (
    <BgView>

      <Header
        leftComponent={
          <View style={styles.nav}>
            <View style={styles.headerLeft}>
              <Image style={{ resizeMode: "contain", width: width * 0.2 }} source={require("../../assets/images/logo.png")} />
            </View>
          </View>
        }

        rightComponent={
          <View style={styles.nav}>
            <TouchableOpacity onPress={toggleTheme} style={{ paddingHorizontal: width * 0.02 }}>
              <Icon name="moon" color={theme.basic} solid={true} size={20} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("notification", { hydroId })} style={{ paddingHorizontal: width * 0.02 }}>
              <Icon name="bell" color={theme.basic} solid={true} size={20} />
            </TouchableOpacity>

            <TouchableOpacity
              style={{ paddingLeft: width * 0.02, paddingRight: '1%' }}
              onPress={() => navigation.navigate("settings", { address })}
            >
              <Icon name="cog" color={theme.basic} size={20} />
            </TouchableOpacity>
          </View>
        }

        containerStyle={{
          marginTop: Platform.OS == 'ios' ? 0 : StatusBar.currentHeight,
          borderBottomWidth: 0,
          height: Platform.OS === 'ios' ? 70 - 20 : 70 - 20,
          paddingTop: Platform.OS === 'ios' ? - 20 : 0,
          borderBottomWidth: 1
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: width * 0.05 }}>
        <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 30 }}>


          <AllHydroCard
            balance={getHydroBalance()}
            balanceFlag={allHydroBalanceFlag}
            address={address}
            cardName="Hydro Card"
            receive={receiveHydro}
            transfer={sendHydro}
            history={hydroHistory}
            handleChangeLeftBalance={handleChangeLeftBalance}
            handleChangeRightBalance={handleChangeRightBalance}
            rightColor={rightColor}
            leftColor={leftColor}
          />

          <BNBCard
            balance={bnbbalance}
            address={address}
            cardName="Ether Card"
            send={() => navigation.navigate("sendbnb", { walletToken: address })}
            transfer={() => navigation.navigate("receivebnb")}
          />

          <EtherCard
            balance={etherbalance}
            address={address}
            cardName="Ether Card"
            withdraw={() => navigation.navigate("withdraw", { walletToken: address })}
            transfer={() => navigation.navigate("receiveether")}
            history={() => navigation.navigate("etherhistory", { walletToken: address })}
          />

          <TuscCard
            balance={tuscbalance}
            address={address}
            cardName="Tusc Card"
            withdraw={() => navigation.navigate("transfertusc", { walletToken: address })}
            transfer={() => navigation.navigate("receivetusc")}
            account={() => navigation.navigate("account")}
          />
        </View>

        {/* {identityAddress !== null ? (
          <>
            <Lead style={{ textAlign: "left", color: theme.primary, fontSize:20, paddingTop:10 }}>
              Identity Address
            </Lead>

            <TouchableOpacity
              onPress={CopyIdentityAddressClipboard}
              style={{
                padding: 10,
                backgroundColor: theme.secondary,
                marginTop: "5%",
              }}
            >
              <Paragraph style={{ color: theme.basic }}>
                
                {identityAddress}
              </Paragraph>
            </TouchableOpacity>
          </>
        ) : (
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              style={{ marginTop: "5%" }}
              text="Get Identity Address"
              onPress={getIdentityAddress}
            />
          </View>
          )} */}


        {/*<Lead style={{ paddingVertical: width * 0.05 }}>Tx Feed</Lead>*/}
        { /*<View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <LottieView
            source={require('../../assets/tx.json')}
            autoPlay
            key={1}
            loop
            style={{ width: '60%', height: '100%', }}
          />
        </View> }
        <Paragraph
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 22,
            marginTop: "30%",
          }}
        >
          You have no transaction record. 
        </Paragraph> 
        { <View
          style={{
            flex: 1,
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          {TxFeed.map((feedItem, id) => (
            <TxFeedCard {...feedItem} key={id} />
          ))}
          </View> */}
      </ScrollView>

    </BgView>
  );
};


const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: width * 0.03
  },

  headerRight: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: width * 0.03
  },

})

export default Home;
