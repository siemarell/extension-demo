import React, {Component, Fragment} from 'react'
import {observer} from "mobx-react";
import Init from './components/Initialize'
import Keys from './components/Keys'
import Sign from './components/Sign'
import Unlock from './components/Unlock'

@observer // У Компонета с этим декоратом будет автоматически вызван метод render, если будут изменены observable на которые он ссылается
export default class App extends Component {

    // Правильно конечно вынести логику рендера страниц в роутинг и не использовать вложенные тернарные операторы,
    // и привязывать observable и методы background непосредственно к тем компонентам, которые их используют
    render() {
        const {keys, messages, initialized, locked} = this.props.background.state;
        const {lock, unlock, addKey, removeKey, initVault, deleteVault, approve, reject} = this.props.background;

        return <Fragment>
            {!initialized
                ?
                <Init onInit={initVault}/>
                :
                locked
                    ?
                    <Unlock onUnlock={unlock}/>
                    :
                    messages.length > 0
                        ?
                        <Sign keys={keys} message={messages[messages.length - 1]} onApprove={approve} onReject={reject}/>
                        :
                        <Keys keys={keys} onAdd={addKey} onRemove={removeKey}/>
            }
            <div>
                {!locked && <button onClick={() => lock()}>Lock App</button>}
                {initialized && <button onClick={() => deleteVault()}>Delete all keys and init</button>}
            </div>
        </Fragment>
    }
}

