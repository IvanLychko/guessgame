import * as React from "react";
import './HowToPlay.css';

export default class HowToPlay extends React.PureComponent {
    componentDidMount(): void {
        document.getElementsByTagName('body')[0].classList.add('HowToPlay');
        document.getElementsByClassName('b-page')[0].classList.add('HowToPlay');
    }

    componentWillUnmount(): void {
        document.getElementsByTagName('body')[0].classList.remove('HowToPlay');
        document.getElementsByClassName('b-page')[0].classList.remove('HowToPlay');
    }

    render() {
        return <div className="b-page">
            <div className="container">
                <div className="b-features">
                    <div className="b-features__title">
                        как <br/><span>играть?</span></div>
                        <div className="how-to-pay-text">
                            <p>Чтобы начать играть, вам необходимо выбрать наиболее удобный для вас способ оплаты и пополнить депозит.  В течение 2 минут вам будут зачислены игровые монеты.
                            </p>
                            <p>Чтобы вывести выигрыш, вам нужно нажать на кнопку "Вывод", указав необходимую сумму.
                            </p>
                            <p>Вы получите выигрыш на счет, с которого был внесен депозит, в течение часа.
                            </p>
                        </div>
                </div>
            </div>
        </div>
    }
}