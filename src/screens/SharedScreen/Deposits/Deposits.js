import React, { Component } from 'react';
import {
    View,
    ScrollView,
    KeyboardAvoidingView,
    Text
} from "react-native";
import { LabelInput } from "../../../components/Forms";
import { BgView, Header } from "../../../components/Layouts";
import Button from "../../../components/Button";
import w3s from '../../../libs/Web3Service';
import { Wallet, providers, getDefaultProvider, ethers } from "ethers";

const _spender = "0xB0D5a36733886a4c5597849a05B315626aF5222E"

class Deposits extends Component {
    state = {
        amount: "",
        comments: "",
        isError: false,
        isSuccess: false,
        error: ""
    }
    componentDidMount() {
       // w3s.initContract()
       this.web3 = await new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/75cc8cba22ab40b9bfa7406ae9b69a27'));

    }

    deposit = async () => {
        try {
            if (!this.state.amount) {
                await this.setState({ isError: true, error: "uint256 must required!" })
                return
            }
            else {
                await this.setState({ isError: false })
            }

            
            let currentProvider = await new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/75cc8cba22ab40b9bfa7406ae9b69a27');
            let provider = new ethers.providers.Web3Provider(currentProvider);

            let privateKey = "0x25a1aa7db36ad50c4ff6f7e9cea762df20845e59d08f6e2b26dd496227061958";
            let wallet = new ethers.Wallet(privateKey)
            //alert(wallet.address); 
            let transaction = {
                to: "0x133Be4b9E8dfba8f115BA756548bD4CECB19Fd86",
                value: ethers.utils.parseEther("0.05"),
                chainId: 4,
                nonce: 3
            }

            provider.estimateGas(transaction).then(function (estimate) {
                transaction.gasLimit = estimate;
                console.log('estimate: ' + estimate);
                
                var signPromise = wallet.sign(transaction);
              
                signPromise.then((signedTransaction) => {
                    console.log(signedTransaction);
    
                    // let provider = new ethers.providers.Web3Provider(currentProvider);
                    let provider = ethers.getDefaultProvider()
                    provider.sendTransaction(signedTransaction).then((tx) => {
                        console.log(tx);
                        // {
                        //    // These will match the above values (excluded properties are zero)
                        //    "nonce", "gasLimit", "gasPrice", "to", "value", "data", "chainId"
                        //
                        //    // These will now be present
                        //    "from", "hash", "r", "s", "v"
                        //  }
                        // Hash:
                    })
                    .catch((e)=>{
                        console.log(e.message)
                    })
                })
                .catch((e)=>{
                    console.log(e.message)
                })


        }
        catch (ex) {
            console.log(ex)
            await this.setState({ isError: true })
            if (ex.message)
                await this.setState({ error: ex.message })
        }

    }
    render() {
        return (
            <BgView>
                <Header.Back title="Deposits" onBackPress={this.props.navigation.goBack} />
                <ScrollView>
                    <KeyboardAvoidingView>

                        <LabelInput
                            label="Amount"
                            placeholder="uint256"
                            value={this.state.amount}
                            onChangeText={(value) => {
                                console.log(value)
                                this.setState({ amount: value })
                            }}
                        />
                        <LabelInput
                            label="Comments"
                            placeholder="Comments"
                            value={this.state.comments}
                            onChangeText={(value) => {
                                console.log(value)
                                this.setState({ comments: value })
                            }}
                        />

                        {this.state.isError &&
                            <Text style={{ color: 'red' }}>
                                Error : {this.state.error}
                            </Text>
                        }
                        {this.state.isSuccess &&
                            <Text style={{ color: 'green' }}>
                                Deposit Successfully !
                            </Text>
                        }
                        <View
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: "10%",
                                marginBottom: "10%",
                            }}
                        >
                            <Button text="Deposit" onPress={this.deposit} />
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
            </BgView>
        );
    }
}

export default Deposits;