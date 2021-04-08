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
import SnowflakeContext from "../../context/SnowFlake/snowflakeContext";
import w3s from '../../libs/Web3Service';
import AsyncStorage from "@react-native-community/async-storage";
import { ethers, } from 'ethers';
import Web3 from 'web3';
import { Apis } from "tuscjs-ws";

const { height, width } = Dimensions.get('window');
const Home = ({ navigation, route }) => {
  const [hydrobalance, setHydrobalance] = React.useState(0);
  const [etherbalance, setEtherbalance] = React.useState(0);
  const [tuscbalance, setTuscbalance] = React.useState(0);
  const [hydrobalanceb, setHydrobalanceb] = React.useState(0);
  const [balanceFlag, setBalanceflag] = React.useState('USDT');

  const snowflakeContext = useContext(SnowflakeContext);
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

  const handlegetHydroBalance = async () => {
    try {
      const value = await AsyncStorage.getItem('@privateKey');
      let currentProvider = await new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/75cc8cba22ab40b9bfa7406ae9b69a27');
      let provider = new ethers.providers.Web3Provider(currentProvider);
      let wallet = new ethers.Wallet(value, provider)

      const abi = await w3s.getHydroTokenABI()
      const hydrotokenaddress = await w3s.getHydroTokenAddress()
      const contract = new ethers.Contract(hydrotokenaddress, abi, wallet)

      let hydrobalance = await contract.balanceOf(wallet.address);
      hydrobalance = Web3.utils.fromWei(hydrobalance.toString())
      setHydrobalance(hydrobalance)
    } catch (error) {
      console.log(error)
    }
  }

  const handlegetEtherBalance = async () => {
    try {
      const value = await AsyncStorage.getItem('@privateKey');
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

  const handlegetTuscBalance = async () => {
    console.log('handlegetTuscBalance')
    let socket = new WebSocket('wss://tuscapi.gambitweb.com');
    socket.onopen = async () => {
      console.log('open')
      const accountName = await AsyncStorage.getItem('@accountName');
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
  }

  useEffect(() => {  
    handleGetAllBalances();
  }, [])

  const handleGetAllBalances = () => {
    handlegetHydroBalance();
    handlegetEtherBalance();
    handlegetTuscBalance();
    setTimeout(handleGetAllBalances, 1000000);
  }

  const handleChangeLeftBalance = () => {
    console.log('left')
    setHydrobalanceb(100);
    setBalanceflag('HYDRO (BNB)')
  }

  const handleChangeRightBalance = () => {
    console.log('right')
    setHydrobalanceb(200);
    setBalanceflag('HYDRO (ETH)')
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
            balance={hydrobalanceb}
            balanceFlag={balanceFlag}
            address={address}
            cardName="Usdt Card"
            withdraw={() => console.log('cardName')}
            transfer={() => console.log('transfer')}
            history={() => console.log('history')}
            handleChangeLeftBalance={handleChangeLeftBalance}
            handleChangeRightBalance={handleChangeRightBalance}
          />

          <HydroBNBCard
            balance={hydrobalance}
            address={address}
            cardName="Hydro Card"
            receive={() => navigation.navigate("receivebnbhydro")}
            transfer={() => navigation.navigate("transferbnbhydro", { walletToken: address })}
          />

          <BNBCard
            balance={etherbalance}
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

          <HydroCard
            balance={hydrobalance}
            address={address}
            cardName="Hydro Card"
            receive={() => navigation.navigate("receivehydro")}
            transfer={() => navigation.navigate("deposits", { walletToken: address })}
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
