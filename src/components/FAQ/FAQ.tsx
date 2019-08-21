import * as React from "react";
import './FAQ.css';

export default class FAQ extends React.PureComponent {
    componentDidMount(): void {
        document.getElementsByTagName('body')[0].classList.add('FAQ');
        document.getElementsByClassName('b-page')[0].classList.add('FAQ');
    }

    componentWillUnmount(): void {
        document.getElementsByTagName('body')[0].classList.remove('FAQ');
        document.getElementsByClassName('b-page')[0].classList.remove('FAQ');
    }

    faqOpen(event: any): void {
        let el = event.target;
        el.classList.toggle("faq-active");
        let content = el.nextElementSibling;
        if (content.style.maxHeight){
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight+30 + "px";
        }
    }


    render () {
        return <div className="b-page">
            <div className="container">
                <div className="b-features">
                    <div className="b-features__title">
                        частые вопросы<br/><span>FAQ</span></div>

                    <div className="faq-list">
                        <div>
                            <button onClick={e => this.faqOpen(e)} className="faq-collapsible">Что такое Blockchain?</button>
                            <div className="faq-content">
                                <p>Представьте себе огромную, децентрализованную базу данных, копии которой хранятся на тысячах компьютеров обычных людей. При этом, чтобы изменить что либо в этой базе данных, нужно чтобы все "держатели" базы данных согласились с этими изменениями и внесли в свою "копию". Сотни тысяч пользователей по всему миру гарантируют то, что казино не сможет никак повлиять на выплаты или результаты игры.</p>
                            </div>
                        </div>
						<div>
                            <button onClick={e => this.faqOpen(e)} className="faq-collapsible">Как проверить честность результатов?</button>
                            <div className="faq-content">
                                <p>С помощью технологии Blockchain, Вы сможете проверить честность любой игры, представленной на сайте.</p>
                            </div>
                        </div>
                        <div>
                            <button onClick={e => this.faqOpen(e)} className="faq-collapsible">Как пополнить счет?</button>
                            <div className="faq-content">
                                <p>Вам необходимо иметь кошелек MetaMask (сделать гиперссылкой на https://metamask.io), при помощи данного расширения вы авторизуетесь в игре и сразу сможете сделать первую ставку. Нет необходимости в пополнении баланса, после авторизации и нажатия кнопки "Крутить" ставка автоматически спишется с вашего кошелька.</p>
                            </div>
                        </div>
                        <div>
                            <button onClick={e => this.faqOpen(e)} className="faq-collapsible">Как вывести деньги?</button>
                            <div className="faq-content">
                                <p>После авторизации на сайте при помощи расширения MetaMask и успешной ставки деньги автоматически будут переведены на ваш ETH кошелек.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}