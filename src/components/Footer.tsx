import * as React from 'react';
import logo from '../assets/images/logo.svg'

export default class Header extends React.PureComponent {
    render() {
        return <div id="footer-content">
            <div className="container">
                <div className="b-header__content">
                    <p>Copyright 2019</p>
                    <img src={logo} alt=""/>
                    <p><a href="" >Privacy Policy</a></p>
                </div>
            </div>
        </div>
    }
}