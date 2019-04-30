import React, {Component} from 'react';
import {libs} from '@waves/waves-transactions'

export default class Keys extends Component {
    state = {
        newSeed: ''
    }

    deleteSeed = (index) => () => this.props.onRemove(index)

    addSeed = () => {
        this.props.onAdd(this.state.newSeed)
        this.setState({newSeed: ''})
    }

    onChange = (e) => this.setState({newSeed: e.target.value})

    render(){
        return <div>
            <ul>
                {this.props.keys.map((seed, index) => (
                    <li key={seed}>
                        <span>{libs.crypto.address(seed)}</span>
                        <button onClick={this.deleteSeed(index)}>delete</button>
                    </li>
                ))}
            </ul>
            <input value={this.state.newSeed} onChange={this.onChange}/>
            <button onClick={this.addSeed} disabled={this.state.newSeed.length < 4}>Add new seed</button>
        </div>
    }
}