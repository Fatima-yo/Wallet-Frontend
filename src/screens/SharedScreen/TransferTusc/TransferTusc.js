import React, { Component } from 'react';
import {
    View,
    ScrollView,
    KeyboardAvoidingView,
    Text,
    Dimensions,
    Linking,
    TouchableHighlight,
    PermissionsAndroid,
    Platform,
    StatusBar, StyleSheet, SafeAreaView, Clipboard, ToastAndroid,
} from "react-native";

import {Apis} from "tuscjs-ws";
import {ChainStore, FetchChain, PrivateKey, TransactionHelper, Aes, TransactionBuilder, SerializerValidation} from "tuscjs";


import { LabelInput } from "../../../components/Forms";
import { BgView, Header } from "../../../components/Layouts";
import Button from "../../../components/Button/index";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from "@react-native-community/async-storage";
const { height, width } = Dimensions.get('window');

var privKey = "5KK1f4tVVpMikKbphYjh3Kb9ARh4JdSmgPTSzEkSGSgNN1SvEUp"
var pKey = PrivateKey.fromWif(privKey);

class TransferTusc extends Component {
    state = {
        from: "",
        tuscaddress: "",
        amount: "",
        comments: "",
        isError: false,
        isSuccess: false,
        error: "",
        privatekeyValue: ''
    }

    async componentDidMount() {
        this.retrieveData()
    }

    retrieveData = async () => {
        try {
            this.setState({ privatekeyValue: pKey })
        } catch (error) {

        }
    }

    transfer = async () => {

        try {
            /* if (!this.state.tuscaddress) {
                await this.setState({ isError: true, error: "Hydro Address Required" })
                return
            } else {
                await this.setState({ isError: false })
            }

            if (!this.state.amount) {
                await this.setState({ isError: true, error: "uint256 must required!" })
                return
            } else {
                await this.setState({ isError: false })
            }*/
            console.log("hello")
            Apis.instance("wss://tuscapi.gambitweb.com/", true)
            .init_promise.then((res) => {
                console.log("connected to:", res, "network");
            
                //ChainStore.init().then(() => {
            
                    let fromAccount = "marcocastiglionem";
                    let memoSender = fromAccount;
                    let memo = "Testing transfer from node.js";
            
                    let toAccount = "marcocastiglione5";
            
                    let sendAmount = {
                        amount: 10000,
                        asset: "TUSC"
                    }
            
                    Promise.all([
                            FetchChain("getAccount", fromAccount),
                            FetchChain("getAccount", toAccount),
                            FetchChain("getAccount", memoSender),
                            FetchChain("getAsset", sendAmount.asset),
                            FetchChain("getAsset", sendAmount.asset)
                        ]).then((res)=> {
                            // console.log("got data:", res);
                            let [fromAccount, toAccount, memoSender, sendAsset, feeAsset] = res;
            
                            // Memos are optional, but if you have one you need to encrypt it here
                            //let memoFromKey = memoSender.getIn(["options","memo_key"]);
                            //console.log("memo pub key:", memoFromKey);
                            //let memoToKey = toAccount.getIn(["options","memo_key"]);
                            let nonce = TransactionHelper.unique_nonce_uint64();
            
                            //let memo_object = {
                            //    from: memoFromKey,
                            //    to: memoToKey,
                            //    nonce,
                            //    message: Aes.encrypt_with_checksum(
                            //        pKey,
                            //        memoToKey,
                            //        nonce,
                            //        memo
                            //    )
                            //}
            
                            let tr = new TransactionBuilder()
            
                            tr.add_type_operation( "transfer", {
                                fee: {
                                    amount: 0,
                                    asset_id: feeAsset.get("id")
                                },
                                from: fromAccount.get("id"),
                                to: toAccount.get("id"),
                                amount: { amount: sendAmount.amount, asset_id: sendAsset.get("id") }//,
                                //memo: memo_object
                            } )
            
                            tr.set_required_fees().then(() => {
                                tr.add_signer(pKey, pKey.toPublicKey().toPublicKeyString());
                                console.log("serialized transaction:", tr.serialize());
                                console.log("Now I will broadcast")
                                tr.broadcast();
                            })
                        });
                //});
            });
            


        }
        catch (ex) {
            console.log(ex)
            await this.setState({ isError: true })
            if (ex.message)
                await this.setState({ error: ex.message })
        }

    };


    onCopyToClipboard = async () => {
        await Clipboard.setString(this.props.route.params.walletToken);
        ToastAndroid.show("Copied To Clipboard!", ToastAndroid.SHORT);
    };
    onChange = (value) => {
        // alert(value)
        this.setState({ amount: value })
        console.log("state value --->", this.state.amount);
    }

    render() {
        return (

            <BgView>
                <Header.Back title="Transfer Tusc" onBackPress={this.props.navigation.goBack} containerStyle={styles.header} />
                <View style={styles.container}>
                    <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ paddingVertical: width * 0.02 }} />

                        <LabelInput
                            label="Tusc Address"
                            placeholder="Enter Tusc Address" 
                            // keyboardType={'number-pad'}
                            value={this.state.tuscaddress}
                            onChangeText={(value) => {
                                console.log(value)
                                this.setState({ tuscaddress: value })
                            }}
                        />
                        <LabelInput
                            label="Amount"
                            placeholder="0.00"
                            keyboardType={'number-pad'}
                            value={this.state.amount}
                            onChangeText={(value) => this.onChange(value)}
                        // onChangeText={(value) => {
                        //     console.log(value)
                        //     this.setState({ value })
                        // }}
                        />

                        {this.state.isError &&
                            <Text style={{ color: 'red' }}>
                                Error : {this.state.error}
                            </Text>
                        }
                        {this.state.isSuccess &&
                            <Text style={{ color: 'green' }}>
                                Transfer Success!
                            </Text>
                        }

                        <View style={{ flexDirection: 'row', flex: 1, }}>
                            <View style={styles.button}>
                                <Button text="Transfer" onPress={this.transfer} />
                            </View>
                            {/* <View style={styles.button}>
                                <Button text="Read QR" onPress={this.onOpenScanner} />
                            </View> */}
                        </View>

                    </KeyboardAwareScrollView>
                </View>
            </BgView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingHorizontal: width * 0.05
    },

    header: {
        marginTop: Platform.OS == 'ios' ? 0 : StatusBar.currentHeight,
        paddingTop: 0,
        height: 50
    },

    button: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: width * 0.03,

    },
    qrcode: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: width * 0.05,
        marginBottom: width * 0.05,
        marginRight: width * 0.02,
    },

})

export default TransferTusc;
