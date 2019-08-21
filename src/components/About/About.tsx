import * as React from "react";
import './About.css';
import  block1 from "../../assets/images/block1.png";
import  block2 from "../../assets/images/block2.png";
import  block3 from "../../assets/images/block3.png";

export default class About extends React.PureComponent {
    componentDidMount(): void {
        document.getElementsByTagName('body')[0].classList.add('About');
        document.getElementsByClassName('b-page')[0].classList.add('About');
    }

    componentWillUnmount(): void {
        document.getElementsByTagName('body')[0].classList.remove('About');
        document.getElementsByClassName('b-page')[0].classList.remove('About');
    }

    render () {
        return <div className="b-page">
            <div className="container">
                <div className="b-features">
                    <div className="b-features__title">
                        Guess Game <br/><span>blockhain-лото</span></div>
                    <div className="about-blocks" >
                        <div>
                            <img src={block1} />
                            <p>Заработайте свой первый ETH (Ethereum) уже сегодня</p>
                        </div>
                        <div>
                            <img src={block2} />
                            <p>Прозрачность и честность каждой игры обеспечена Smart контрактом</p>
                        </div>
                        <div>
                            <img src={block3} />
                            <p>Играйте и выигрывайте в Blockchain лото ежедневно</p>
                        </div>
                    </div>
                    <a href="/">
                        <button className="about-start-game pr__button pr__button_large pr__button_orange-fill b-game__spin">
                            Начать
                        </button>
                    </a>
                </div>
            </div>
        </div>
    }
}