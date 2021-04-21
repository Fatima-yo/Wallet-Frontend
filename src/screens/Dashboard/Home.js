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
import {AllHydroCard, CustomTokenCard, EtherCard, BNBCard, TuscCard } from "../../components/cards";
import w3s from '../../libs/Web3Service';
import * as SecureStore from 'expo-secure-store';
import { ethers, } from 'ethers';
import Web3 from 'web3';
import { Apis } from "tuscjs-ws";
import { SliderComponent } from "react-native";

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
  const [customtokensymbol, setcustomtokensymbol] = React.useState('');
  const [customtokenaddress, setcustomtokenaddress] = React.useState('');
  const [customtokendecimals, setcustomtokendecimals] = React.useState(0);

  const [customTokenRightColor, setCustomTokenRightColor] = React.useState('#000');
  const [customTokenLeftColor, setCustomTokenLeftColor] = React.useState('gray');
  const [customTokenBalanceFlag, setCustomTokenBalanceFlag] = React.useState('');
  const [customTokenIndex, setCustomTokenIndex] = React.useState(0);
  const [customtoken, setcustomtoken] = React.useState('');
  const [balances, setBalances] = React.useState('{}');

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

  const getCustomTokenBalance = () => {
    if (!customtoken) {
      return 0;
    }
    var customtokens_list = JSON.parse(customtoken);
    let symbol = customtokens_list['tokens'][customTokenIndex]['symbol']

    let balances_aux = JSON.parse(balances);

    if (symbol in balances_aux) {
      return balances_aux[symbol]
    }
    return 0
  } 

  const getCustomTokenSymbol = () => {
    if (!customtoken) {
      return;
    }

    var customtokens_list = JSON.parse(customtoken);

    return customtokens_list['tokens'][customTokenIndex]['symbol'];
  }

  const receiveCustomToken = async () => {
    
    var customtokens_list = await SecureStore.getItemAsync("customToken")

    if (!customtokens_list) {
        console.log('no custom token')
        return
    }

    customtokens_list = JSON.parse(customtokens_list)
    let customtoken = customtokens_list['tokens'][customTokenIndex]

    let symbol = customtoken.symbol;
    let contractAddress = customtoken.contractAddress;
    let decimals = customtoken.decimals;

    navigation.navigate("receivecustomtoken",
      {
        symbol: symbol, 
        contractAddress: contractAddress, 
        decimals: decimals 
      }
    )
  }

  const sendCustomToken = async () => {

    var customtokens_list = await SecureStore.getItemAsync("customToken")
    
    if (!customtokens_list) {
        console.log('no custom token')
        return
    }

    customtokens_list = JSON.parse(customtokens_list)
    let customtoken = customtokens_list['tokens'][customTokenIndex]

    let symbol = customtoken.symbol;
    let contractAddress = customtoken.contractAddress;
    let decimals = customtoken.decimals;

    navigation.navigate("transfercustomtoken",
      {
        symbol: symbol, 
        contractAddress: contractAddress, 
        decimals: decimals 
      }
    )
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
    const accountName = await SecureStore.getItemAsync('accountName');
      if (!accountName) {
        setTuscbalance(0)
        return
      }
    let socket = new WebSocket('wss://tuscapi.gambitweb.com');
    socket.onopen = async () => {
      console.log('open')
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

  const handleGetCustomToken = async () => {

    var customtokens_list = await SecureStore.getItemAsync("customToken")
    
    if (!customtokens_list) {
        console.log('no custom token')
        return
    } else {
      setcustomtoken(customtokens_list)
      customtokens_list = JSON.parse(customtokens_list)

      let symbol = customtokens_list['tokens'][0]['symbol']
      let address = customtokens_list['tokens'][0]['contractAddress']
      let decimals = customtokens_list['tokens'][0]['decimals']

      console.log(customtokens_list)
      
      setcustomtokensymbol(symbol)
      setcustomtokenaddress(address)
      setcustomtokendecimals(decimals)
    }

  }

  const handleGetCustomTokenBalance = async () => {

    var customtokens_list = await SecureStore.getItemAsync("customToken")
    
    if (!customtokens_list) {
        console.log('no custom token')
        return
    }

    customtokens_list = JSON.parse(customtokens_list)
    let customtoken = customtokens_list['tokens'][customTokenIndex]

    const value = await SecureStore.getItemAsync('privateKey');
    let currentProvider = await new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/75cc8cba22ab40b9bfa7406ae9b69a27');
    let provider = new ethers.providers.Web3Provider(currentProvider);
    let wallet = new ethers.Wallet(value, provider)

    const abi = await w3s.getCustomTokenABI()
    const contract = new ethers.Contract(customtoken.contractAddress, abi, wallet)

    let tokenbalance = await contract.balanceOf(wallet.address);
    tokenbalance = tokenbalance / (10**customtoken.decimals)

    console.log(balances)

    let balances_aux = {}

    try {
      balances_aux = JSON.parse(balances);
    } catch {
      balances_aux = {}
    }

    balances_aux[customtoken.symbol] = tokenbalance;

    balances_aux = JSON.stringify(balances_aux)

    setBalances(balances_aux);
    
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
    handleGetCustomToken();
  }, [])

  const handleGetAllBalances = async () => {
    handlegetBnbBalance();

    let hydrobnbbalance = await handlegetHydroBNBBalance();
    setBEP20Balance(hydrobnbbalance);

    let hydroercbalance = await handlegetHydroBalance();
    setERC20Balance(hydroercbalance);

    setHydroCardBalance()
    handlegetEtherBalance();

    handleGetCustomTokenBalance();
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

  const customTokenHandleChangeLeftBalance = async () => {
    if (customTokenIndex == 0) {
      return
    }

    let index = customTokenIndex - 1;
    var customtokens_list = await SecureStore.getItemAsync("customToken")

    if (!customtokens_list) {
        return
    }

    customtokens_list = JSON.parse(customtokens_list)

    let token = customtokens_list['tokens'][index];

    setCustomTokenIndex(index);

    setcustomtokensymbol(token.symbol);
    setcustomtokenaddress(token.contractAddress);
    setcustomtokendecimals(token.decimals);
    handleGetCustomTokenBalance();
  }

  const customTokenHandleChangeRightBalance = async () => {
    let index = customTokenIndex + 1
    var customtokens_list = await SecureStore.getItemAsync("customToken")
    
    if (!customtokens_list) {
        console.log('no custom token')
        return
    }

    customtokens_list = JSON.parse(customtokens_list)

    if (typeof customtokens_list['tokens'][index] === 'undefined') {
      console.log('custom token index + 1 undefined')
      return
    }

    let token = customtokens_list['tokens'][index];
    setCustomTokenIndex(index);

    setcustomtokensymbol(token.symbol);
    setcustomtokenaddress(token.contractAddress);
    setcustomtokendecimals(token.decimals);
    handleGetCustomTokenBalance();

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

          <EtherCard
            balance={etherbalance}
            address={address}
            cardName="Ether Card"
            withdraw={() => navigation.navigate("withdraw", { walletToken: address })}
            transfer={() => navigation.navigate("receiveether")}
            history={() => navigation.navigate("etherhistory", { walletToken: address })}
          />

          <CustomTokenCard
            balance={getCustomTokenBalance()}
            symbol={getCustomTokenSymbol()}
            balanceFlag={customTokenBalanceFlag}
            address={address}
            cardName="Custom Token Card"
            receive={receiveCustomToken}
            transfer={sendCustomToken}
            history={hydroHistory}
            handleChangeLeftBalance={customTokenHandleChangeLeftBalance}
            handleChangeRightBalance={customTokenHandleChangeRightBalance}
            rightColor={customTokenRightColor}
            leftColor={customTokenLeftColor}
          />

          <BNBCard
            balance={bnbbalance}
            address={address}
            cardName="Ether Card"
            send={() => navigation.navigate("sendbnb", { walletToken: address })}
            transfer={() => navigation.navigate("receivebnb")}
          />

          <TuscCard
            balance={tuscbalance}
            address={address}
            cardName="TUSC Card"
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
