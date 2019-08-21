import * as React from "react";
import './WhoWe.css';

export default class WhoWe extends React.PureComponent {
    componentDidMount(): void {
        document.getElementsByTagName('body')[0].classList.add('WhoWe');
        document.getElementsByClassName('b-page')[0].classList.add('WhoWe');
    }

    componentWillUnmount(): void {
        document.getElementsByTagName('body')[0].classList.remove('WhoWe');
        document.getElementsByClassName('b-page')[0].classList.remove('WhoWe');
    }

    render() {
        return <div className="b-page">
            <div className="container">
                <div className="b-features">
                <div className="b-features__title">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M23.9992 0L4.36281 8.72725V21.8182C4.36281 33.9382 12.7301 45.24 23.9992 48C35.2683 45.24 43.6356 33.9382 43.6356 21.8182V8.72725L23.9992 0ZM19.6355 34.9091L10.9083 26.1818L13.9956 23.0945L19.6355 28.7346L34.0028 14.3673L37.0901 17.4546L19.6355 34.9091Z"
                            fill="white"/>
                    </svg>
                    100% Гарантия<br/><span>честности</span></div>

                <ol className="b-features__list">
                    <li>Все игры имеют уникальный Smart контракт в который невозможно внести изменения</li>
                    <li>На основе статистики по каждой игре рассчитывается процент выплат и формируются рейтинги
                        игр
                    </li>
                    <li>Соотношение выигрышей и проигрышей можно проверить в любой момент</li>
                </ol>
            </div>
            </div>
        </div>
    }
}