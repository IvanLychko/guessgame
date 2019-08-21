import * as React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';
import logo from '../assets/images/logo.svg';
import en from '../assets/images/languages/en.svg';
import ru from '../assets/images/languages/ru.svg';
import Popup from "reactjs-popup";
import MetaMaskPopup from './Popups/MetaMask';


const languages: { [k: string]: { icon: string, name: string } } =
    {
        en: {icon: en, name: "English"},
        ru: {icon: ru, name: "Русский"}
    };

class Header extends React.PureComponent<T> {
    state: IHeaderState = {popup: false};

    private togglePopup() {
        this.setState({popup: !this.state.popup});
    }

    private static toggleMenu() {
        const menu = document.getElementsByClassName('hamburger')[0];
        menu.classList.toggle('is-active');
        document.getElementsByTagName('body')[0].classList.toggle('menu-opened');
    }

    private changeLanguage(locale: string) {
        document.getElementById('js-languages-current')!.className = `languages__current languages__current--${locale}`;
        this.props.i18n.changeLanguage(locale).then(() => {
            document.getElementById('js-languages-list')!.classList.toggle('languages__list--display');
            window.localStorage.setItem('locale', locale);
        }).catch(console.error)
    }

    render() {
        console.log(this.props);
        const locale = window.localStorage.getItem('locale') || 'ru';
        return <header className="b-header">
            <div className="container">
                <div className="b-header__content">
                    <a href="/" className="b-header__logo" title="Go to main page">
                        <img src={logo} alt=""/>
                    </a>
                    <div className="b-header__left">
                        <nav className="b-header__nav">
                            <a href={"/"}>{this.props.t('home')}</a>
                        </nav>
                        <nav className="b-header__nav">
                            <a href={"/about"}>{this.props.t('about')}</a>
                        </nav>
                        <nav className="b-header__nav">
                            <a href={"/who-we"}>{this.props.t('whyMe')}</a>
                        </nav>
                        <nav className="b-header__nav">
                            <a href={"/how-to-play"}>{this.props.t('howPlay')}</a>
                        </nav>
                        <nav className="b-header__nav">
                            <a href={"/faq"}>{this.props.t('faq')}</a>
                        </nav>
                        <div className="b-header__buttons">
                            {this.props.address
                                ? <a className="pr__button"><span>{this.props.address.substr(0, this.props.address.length - 38)+'...'+this.props.address.substr(38, this.props.address.length)}</span></a>
                                : <a onClick={window.ethereum ? this.props.authorize : () => this.togglePopup()}
                                     className="pr__button">
                                    <span>{this.props.t('login')}</span>
                                </a>
                            }
                            <div className="languages">
                                <div id="js-languages-current"
                                     className={"languages__current languages__current--" + locale}
                                     onClick={() => document.getElementById('js-languages-list')!.classList.toggle('languages__list--display')}
                                />
                                <ul id="js-languages-list" className="languages__list">
                                    {Object.keys(languages).map((lang, i) =>
                                        <li key={i} className="languages__item">
                                            <a href="#" className="languages__link"
                                               onClick={() => this.changeLanguage(lang)}>
                                                <img src={languages[lang].icon} alt="" className="languages__image"/>
                                                <span style={{marginLeft: "5px"}}>{languages[lang].name}</span>
                                            </a>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <button className="b-header__menu hamburger hamburger--slider" onClick={() => Header.toggleMenu()}>
                    <span className="hamburger-box">
                        <span className="hamburger-inner"/>
                    </span>
                </button>
            </div>
            <Popup open={this.state.popup} onClose={() => this.setState({popup: false})}>
                <MetaMaskPopup
                    closePopup={() => this.togglePopup()}
                    title={this.props.t('MetaMaskPopupTitle')}
                    text={this.props.t('MetaMaskPopupText')}
                />
            </Popup>
        </header>
    }
}
export default withTranslation()(Header);

interface IHeader {
    address: string
    authorize: () => void
}

interface IHeaderState {
    popup: boolean
}

interface T extends IHeader, WithTranslation {
}