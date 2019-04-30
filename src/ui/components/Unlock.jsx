import React, {Component} from 'react';

export default class Unlock extends Component {
    state = {
        pass: ''
    }

    onChange = (e) => this.setState({pass: e.target.value})

    render(){
        const {pass} = this.state;
        const {onUnlock} = this.props;
        return <div>
            <input type='password' value={pass} onChange={this.onChange}/>
            <button onClick={()=> onUnlock(pass)} disabled={pass.length < 1}>Unlock</button>
        </div>
    }
}