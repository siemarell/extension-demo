import React, {Component} from 'react';

const MIN_SYMBOLS = 6
export default class Initialize extends Component {
    state = {
        pass: ''
    }

    onChange = (e) => this.setState({pass: e.target.value})

    handleInit = () => this.props.onInit(this.state.pass)

    render(){
        return <div>
            <p>App is not initialized. Enter new password and init app. Password should contain more than {MIN_SYMBOLS} symbols</p>
            <input type='password' value={this.state.pass} onChange={this.onChange}/>
            <button onClick={()=> this.handleInit()} disabled={this.state.pass.length <= MIN_SYMBOLS}>Init app</button>
        </div>
    }
}