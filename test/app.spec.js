import {observable, autorun} from 'mobx'
import {assert, expect} from 'chai'
import {SignerApp} from '../src/SignerApp'

describe('app store', () => {
    it('should add and remove keys', () => {
        const app = new SignerApp()

        let autoruns = 0
        autorun(() => {
            console.log(app.store.keys)
            autoruns++
        })

        app.addKey('key0')
        app.addKey('key1')
        app.removeKey(0)
        expect(app.store.keys.length).to.equal(1)
        expect(app.store.keys[0]).to.equal('key1')
        expect(autoruns).to.equal(4)
    })
})
