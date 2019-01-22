import React, {Component} from 'react';
import {libs} from '@waves/waves-transactions'

export default class Sign extends Component {
    state = {
        selectedAccount: 0
    }

    render(){
        const {message, onApprove, onReject} = this.props;
        const {selectedAccount} = this.state;

        return <div>
            <p>
                Transaction from {message.origin}
            </p>
            <pre style={{overflow: 'auto'}}>{JSON.stringify(message.data, null, 2)}</pre>
            <select name="Sign with" onChange={e=> this.setState(e.target.value)}>
                {this.props.keys.map((seed, index) => <option key={index} value={index}>{libs.crypto.address(seed)}</option>)}
            </select>
            <div>
                <button onClick={() => onApprove(message.id, selectedAccount)}>approve</button>
                <button onClick={() => onReject(message.id)}>reject</button>
            </div>
        </div>
    }
}