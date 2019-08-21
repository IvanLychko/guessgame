import * as React from 'react'
import MetaMaskIcon from '../../assets/images/icon-metamask.png';

export default class MetaMask extends React.PureComponent<IMetaMask> {
    render() {
        return <div className="metamask popup-wrap">
            <div className="popup-fon"/>
            <div className="popup-metamask-blank">
                <span className="popup-close" onClick={this.props.closePopup}>X</span>
                <img src={MetaMaskIcon} alt="pic"/>
                <div className="popup-metamask-title">
                    {this.props.title}
                </div>
                <div className="popup-metamask-text">
                    {this.props.text}
                </div>
            </div>
        </div>
    }
}

interface IMetaMask {
    title: string
    text: string
    closePopup: () => void
}