export const loadState = () => {
    try {
        const state = JSON.parse(localStorage.getItem('store'))
        return state || undefined
    } catch (error) {
        console.log(error);
        return undefined
    }
}
export const saveState = state => {
    localStorage.setItem('store', JSON.stringify(state))
}