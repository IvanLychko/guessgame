import * as React from 'react';
import Web3 from 'web3';
import './assets/css/style.css'
import Header from "./components/Header";
import Footer from "./components/Footer";
import ContractABI from './abi/GameGuess.json';
import {Route, Switch} from "react-router";
import Contract from "web3/eth/contract";
import {AnyObject} from "./shared/types";
import {AbiItem, AbiInput} from 'web3-utils';
import config from "./config";
import Game from "./components/Game";
import About from "./components/About/About";
import WhoWe from "./components/WhoWe/WhoWe";
import HowToPlay from "./components/HowToPlay/HowToPlay";
import FAQ from "./components/FAQ/FAQ";

export default class App extends React.Component {
    private readonly web3: Web3 = new Web3(window.web3
        ? window.web3.currentProvider
        : new Web3.providers.HttpProvider("https://mainnet.infura.io"),
        undefined, {transactionConfirmationBlocks: 1});
    state: IAppState = {address: "", contract: undefined, blockNumber: 0};

    async componentDidMount(): Promise<void> {
        if (window.ethereum) window.ethereum.on('accountsChanged',
            (accounts: string[]) => this.setState({address: accounts[0]}));
        try {
            const [bn, addresses] = await Promise.all([
                this.web3.eth.getBlockNumber(),
                this.web3.eth.getAccounts()
            ]);
            this.setState({
                address: addresses[0],
                blockNumber: bn,
                contract: new this.web3.eth.Contract(ContractABI.abi as AbiItem[], config.contract)
            })
        } catch (err) {
            console.error(err);
            return alert("Error on loading page");
        }
    }

    private async authorize(): Promise<string> {
        try {
            const accounts: string[] = await (this.state.address ? Promise.resolve([this.state.address]) : window.ethereum.enable());

            if (window.ethereum.networkVersion !== config.network) {
                alert('This application requires the main network, please switch it in your MetaMask UI.');
                throw new Error("invalid network");
            }
            this.setState({address: accounts[0]});

            return accounts[0];
        } catch (e) {
            console.error(e)
        }

        return '';
    }

    private play(num: number, sign: boolean, value: string, callback: (_this: any) => Promise<void>): any {
        console.log(num, sign);
        return this.authorize().then(from => callback(this.state.contract!.methods.play(num, sign)
            .send({from, to: config.contract, value, gas: 100000})))
    }

    private decodeLog(receipt: AnyObject): AnyObject {
        const eventAbi = ContractABI.abi.find(item => item.name === "Status" && item.type === "event")!.inputs;
        const {data, topics} = receipt.events.Status.raw;
        return this.web3.eth.abi.decodeLog((eventAbi as AbiInput[]), data, topics as string[])
    }

    render() {
        return (this.state.contract
            ? <React.Fragment>
                <Header address={this.state.address} authorize={() => this.authorize()}/>
                <Switch>
                    <Route exact path="/" render={() => this.state.contract
                        ? <Game
                            contract={this.state.contract}
                            address={this.state.address}
                            play={(num: number, sign: boolean, value: string, callback: (_this: any) => Promise<void>) =>
                                this.play(num, sign, value, callback)}
                            decodeLog={(receipt: AnyObject) => this.decodeLog(receipt)}
                            blockNumber={this.state.blockNumber}
                        /> : ""}/>
                    <Route exact path="/who-we" component={WhoWe}/>
                    <Route exact path="/faq" component={FAQ}/>
                    <Route exact path="/how-to-play" component={HowToPlay}/>
                    <Route exact path="/about" component={About}/>
                </Switch>
                <Footer />
            </React.Fragment>
            : "Loading");
    }
}

interface IAppState {
    address: string
    contract: undefined | Contract
    blockNumber: number
}