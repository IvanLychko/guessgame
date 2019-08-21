import * as React from 'react'
import Contract from "web3/eth/contract";
import Popup from 'reactjs-popup'
import Ethereum from "../ethereum";
import PromiEvent from "web3/promiEvent";
import {TransactionReceipt} from "web3-core";
import {AnyObject} from "../shared/types";
import BigNumber from 'bn.js'
import MetaMaskPopup from './Popups/MetaMask'
import Utils from "../Utils";
import {WithTranslation, withTranslation} from 'react-i18next';

class Game extends React.PureComponent<T> {
    state = {
        wins: 0,
        loses: 0,
        profit: 0,
        digits: [],
        popup: false,
        sign: false,
        chance: 0,
        mobile: window.innerWidth <= 500
    };

    async componentDidMount(): Promise<void> {
        const audio = (document.getElementById("audio")! as HTMLAudioElement);
        audio.volume = 0.1;
        document.getElementsByTagName('body')[0].onclick = () => audio.play().catch(console.error);

        document.getElementsByClassName('bet_minus')[0].setAttribute('disabled', 'disabled');
        document.getElementsByClassName('chance_minus')[0].setAttribute('disabled', 'disabled');

        window.onresize = () => this.setState({mobile: window.innerWidth <= 500});

        if (!this.props.contract || !this.props.address) return;
        const {wins, loses, profit} = await Ethereum.callContract(this.props.contract, 'userGameStats', [this.props.address]);
        this.updateState(wins, loses, profit);

        this.props.contract.events.Status({filter: {user: this.props.address}, fromBlock: this.props.blockNumber},
            (err: Error, {returnValues: {wins, loses, profit}}: IStatusEvent) => {
                console.log(wins, loses, profit);
                if (err) return console.error(err);
                this.updateState(wins, loses, profit);
            });
    }

    private toggleSign(sign: boolean) {
        if (sign === this.state.sign) return;
        const chance = this.state.chance !== 0 ? 100 - this.state.chance : 0;
        this.setState({sign, chance})
    }

    private updateState(wins: BigNumber, loses: BigNumber, profit: BigNumber) {
        this.setState({wins: wins.toNumber(), loses: loses.toNumber(), profit: window.web3.fromWei(profit.toString())});
    }

    private closePopup() {
        this.setState({popup: false});
    }

    private play() {
       // alert('Ведётся аудит Smart контракта в ближайшее время вы снова сможете насладиться игрой.');
       // return false;
        if (!window.ethereum) return this.setState({popup: true});
        const bet = parseFloat((document.getElementById('bet') as HTMLInputElement).value);
        if (!bet) return alert('Укажите свою ставку');
        if (!this.state.chance) return alert('Укажите шанс выигрыша');
        if (this.state.chance < 1 || this.state.chance > 99) return alert('Указан неверный шанс выигрыша. Укажите число от 1-99.');
        this.setState({popup: true});
        const balls = document.getElementsByClassName('b-game__ball');
        return this.props.play(this.state.chance, this.state.sign, (bet * 10 ** 18).toString(), async (ev: PromiEvent<TransactionReceipt>) => {
            ev.on("transactionHash", () => {
                this.closePopup();
                for (const ball of balls) ball.classList.add('rotating')
            });
            try {
                const receipt = await ev;
                const eventData = this.props.decodeLog(receipt);
                let number = eventData.number.toNumber();
                const digits: number[] = [];
                for (let i = 0; i < 3; i++) {
                    digits.push(number % 10);
                    number = Math.floor(number / 10);
                }
                this.setState({digits: digits.reverse()})
            } catch (e) {
                alert("Ошибка при транзакции");
                console.error(e);
                this.closePopup();
            } finally {
                for (const ball of balls) ball.classList.remove('rotating')
            }
        })
    }

    private static setPrize() {
        const [bet, chance] = [
            parseFloat((document.getElementById('bet') as HTMLInputElement).value),
            parseFloat((document.getElementById('chance') as HTMLInputElement).value),
        ];
        if (!bet || !chance) return;

        (document.getElementById('prize') as HTMLInputElement).value = Utils.formatNumber(bet * (99 / chance) - bet, 8).toString();
    }

    private setInputValue(e: any, val: string, id: string) {
        e.preventDefault();
        (document.getElementById(id) as HTMLInputElement).value = val;
        const ok = (id === 'chance') ? this.handleChanceChange() : Game.handleBetChange();
        if (!ok) return;
        const btns = document.getElementsByClassName(`${id}__btns`)[0].querySelectorAll('button');
        for (const btn of btns) btn.classList.remove('-active');
        e.target.classList.add('-active');

        if (id === 'chance') this.handleChanceChange();
        Game.setPrize();
    }

    private handleChanceChange(): boolean {
        const chanceInput = (document.getElementById('chance') as HTMLInputElement);
        const chanceVal = parseInt(chanceInput.value);
        if (chanceVal < 1 || chanceVal > 98) {
            alert("Шанс должен быть между 1 и 98");
            if (chanceVal < 1) {
                chanceInput.value = '1';
                document.getElementsByClassName('chance_plus')[0].removeAttribute("disabled");
                document.getElementsByClassName('chance_minus')[0].setAttribute("disabled", 'disabled');
            } else {
                chanceInput.value = '98';
                document.getElementsByClassName('chance_minus')[0].removeAttribute("disabled");
                document.getElementsByClassName('chance_plus')[0].setAttribute("disabled", 'disabled');
            }
            return false;
        }

        if (chanceVal && chanceVal > 1) document.getElementsByClassName('chance_minus')[0].removeAttribute("disabled");
        else document.getElementsByClassName('chance_minus')[0].setAttribute("disabled", 'disabled');
        if (chanceVal < 98) document.getElementsByClassName('chance_plus')[0].removeAttribute("disabled");
        else document.getElementsByClassName('chance_plus')[0].setAttribute("disabled", 'disabled');

        const chance = this.state.sign ? 100 - chanceVal : chanceVal;
        this.setState({chance});

        return true;
    }

    private static handleBetChange() {
        const betInput = (document.getElementById('bet') as HTMLInputElement);
        const betVal = parseFloat(betInput.value);

        if (betVal < 0.001) {
            alert("Ставка не может быть меньше 0.001");
            betInput.value = '0.001';
            document.getElementsByClassName('bet_minus')[0].setAttribute("disabled", 'disabled');
            return false;
        }

        if (betVal && betVal > 0.001) document.getElementsByClassName('bet_minus')[0].removeAttribute("disabled");
        else document.getElementsByClassName('bet_minus')[0].setAttribute("disabled", 'disabled');
        betInput.value = betVal.toFixed(3);

        return true;
    }

    render() {
        const address = this.state.mobile ? '0xa...23FE' : '0xa18CE00bD6D8912d5a7746145F1aE7FD44db23FE';
        return <div className="b-page">
            <div className="b-game">
                <div className="b-game__header">
                    <div className="b-game__header-el">{this.props.t('kurt')} <span style={{color: "#18d858"}}>
                        {(((this.state.wins / (this.state.wins + this.state.loses)) || 0) * 100).toFixed(1)}%
                    </span></div>
                    <div className="b-game__header-el">{this.props.t('bets')} <span>{this.state.wins + this.state.loses}</span></div>
                    <div className="b-game__header-el">{this.props.t('wins')} <span>{this.state.wins}</span></div>
                    <div className="b-game__header-el">{this.props.t('losing')} <span>{this.state.loses}</span></div>
                    <div className="b-game__header-el">{this.props.t('profit')} <span style={{color: "#18d858"}}>
                        {`${this.state.profit > 0 ? '+' : ''}${this.state.profit} ETH`}
                    </span></div>
                </div>
                <div className="b-game__game">
                    <div className="b-game__ball-wrap">
                        <div className="b-game__ball"><span className="b-game__ball-text">
                            {this.state.digits[0]}
                        </span></div>
                    </div>
                    <div className="b-game__ball-wrap">
                        <div className="b-game__ball"><span className="b-game__ball-text">
                            {this.state.digits[1]}
                        </span></div>
                    </div>
                    <div className="b-game__ball-wrap">
                        <div className="b-game__ball"><span className="b-game__ball-text">
                            {this.state.digits[2]}
                        </span></div>
                    </div>
                    <div className="b-game__label">
                        <span className="b-game__label-text">{this.state.sign ? '>' : '<'} <span
                            id="chance-val">{this.state.chance * 10}</span></span>
                    </div>
                </div>
                <div className="b-game__footer-wrapper">
                    <div className="b-game__footer">
                        <div className="b-game__footer-content">
                            <div className="b-game__footer-top">
                                <button className="pr__button" onClick={() => this.toggleSign(false)}>{this.props.t('less')}</button>
                                <button onClick={() => this.play()}
                                        className="pr__button pr__button_large pr__button_orange-fill b-game__spin">
                                    {this.props.t('twist')}
                                </button>
                                <button className="pr__button" onClick={() => this.toggleSign(true)}>{this.props.t('larger')}</button>
                            </div>
                            <form action="/" className="b-form b-form_game">
                                <div className="b-form__el b-form__el_notice">
                                    <div className="b-form__el__wrapper">
                                        <button
                                            className="b-form__el__change b-form__el__minus bet_minus" type="button"
                                            onClick={e =>
                                                this.setInputValue(e, ((parseFloat((document.getElementById('bet') as HTMLInputElement).value) || 0) - 0.001).toString(), 'bet')}>
                                            -
                                        </button>
                                        <input onChange={() => {
                                            Game.setPrize();
                                            Game.handleBetChange()
                                        }}
                                               id="bet" className="b-form__text" type="number"
                                               placeholder={this.props.t('sizeBet')}
                                               step="0.001"/>
                                        <button
                                            type="button" className="b-form__el__change b-form__el__plus bet_plus"
                                            onClick={e =>
                                                this.setInputValue(e, ((parseFloat((document.getElementById('bet') as HTMLInputElement).value) || 0) + 0.001).toString(), 'bet')}>
                                            +
                                        </button>
                                    </div>
                                    <div className="b-form__el-notice">ETH</div>
                                    <div className="b-form__el__btn bet__btns">
                                        <button onClick={e => this.setInputValue(e, '0.001', 'bet')}>{this.props.t('min')}</button>
                                        <button onClick={e => this.setInputValue(e, '0.01', 'bet')}>0.01</button>
                                        <button onClick={e => this.setInputValue(e, '0.05', 'bet')}>0.05</button>
                                        <button onClick={e => this.setInputValue(e, '1', 'bet')}>{this.props.t('max')}</button>
                                    </div>
                                </div>
                                <div className="b-form__el b-form__el_notice">
                                    <div className="b-form__el__wrapper">
                                        <button
                                            className="b-form__el__change b-form__el__minus chance_minus" type="button"
                                            onClick={e =>
                                                this.setInputValue(e, ((parseFloat((document.getElementById('chance') as HTMLInputElement).value) || 0) - 1).toString(), 'chance')}>
                                            -
                                        </button>
                                        <input placeholder={this.props.t('chanceWin')} onChange={() => {
                                            this.handleChanceChange();
                                            Game.setPrize();
                                        }} id="chance" className="b-form__text" type="number"/>
                                        <button
                                            type="button" className="b-form__el__change b-form__el__plus chance_plus"
                                            onClick={e =>
                                                this.setInputValue(e, ((parseFloat((document.getElementById('chance') as HTMLInputElement).value) || 0) + 1).toString(), 'chance')}>
                                            +
                                        </button>
                                    </div>
                                    <div className="b-form__el-notice">%</div>
                                    <div className="b-form__el__btn chance__btns">
                                        <button onClick={e => this.setInputValue(e, '1', 'chance')}>{this.props.t('min')}</button>
                                        <button onClick={e => this.setInputValue(e, '40', 'chance')}>40%</button>
                                        <button onClick={e => this.setInputValue(e, '50', 'chance')}>50%</button>
                                        <button onClick={e => this.setInputValue(e, '98', 'chance')}>{this.props.t('max')}</button>
                                    </div>
                                </div>
                                <div className="b-form__el b-form__el_notice">
                                    <input id="prize" className="b-form__text -full" type="text" placeholder={this.props.t('payout')}
                                           readOnly/>
                                    <div className="b-form__el-notice">ETH</div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Popup open={this.state.popup} onClose={() => this.setState({popup: false})}>
                <MetaMaskPopup
                    closePopup={this.closePopup.bind(this)}
                    title={window.ethereum ? "Подтверждение" : this.props.t('MetaMaskPopupTitle')}
                    text={window.ethereum ? this.props.t('checkPopupText') : this.props.t('MetaMaskPopupText')}
                />
            </Popup>
            <audio id="audio" ref="audio_tag" src="/music.mp3" hidden/>
        </div>
    }
}
export default withTranslation()(Game);

interface IGame {
    contract: Contract
    address: string
    blockNumber: number
    play: (num: number, sign: boolean, value: string, callback: (_this: any) => Promise<void>) => any
    decodeLog: (receipt: AnyObject) => AnyObject
}

interface T extends IGame, WithTranslation {
}

interface IStatusEvent {
    transactionHash: string
    returnValues: {
        wins: BigNumber
        loses: BigNumber
        profit: BigNumber
    }
}
/*
*
* <div className="b-game__footer-panel">
                        <div className="b-game__footer-panel__inside">
                            <div className="b-game__footer-panel__title">{this.props.t('nowWin')}</div>
                            <div className="b-game__footer-panel__list">
                                <div className="b-game__footer-panel__item">
                                    <p>{address}</p>
                                    <div className="b-game__footer-panel__item__info">
                                        <div>{this.props.t('bet')}: <b>0.1 eth</b></div>
                                        <div className="-gold">{this.props.t('win')}: <b>0.119 eth</b></div>
                                    </div>
                                </div>
                                <div className="b-game__footer-panel__item">
                                    <p>{address}</p>
                                    <div className="b-game__footer-panel__item__info">
                                        <div>{this.props.t('bet')}: <b>0.1 eth</b></div>
                                        <div className="-gold">{this.props.t('win')}: <b>0.119 eth</b></div>
                                    </div>
                                </div>
                                <div className="b-game__footer-panel__item">
                                    <p style={{color: "gray"}}>{address}</p>
                                    <div className="b-game__footer-panel__item__info">
                                        <div>{this.props.t('bet')}: <b>0.1 eth</b></div>
                                        <div className="-gold">{this.props.t('win')}: <b>0.119 eth</b></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
* */