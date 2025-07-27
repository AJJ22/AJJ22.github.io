import { useReducer, useState } from 'react'
import { gameReducer, initialState } from './redux/characterHandler.ts'
import { pickRandom, pickRandomItemWithWeights, doesKeyDrop, fish, crit, hit } from './redux/helperFunctions.ts'
import { enemyMap } from './objectCreation.ts'

export function useGameLogic() {
    const [inputValue, setInputValue] = useState('')
    const [state, dispatch] = useReducer(gameReducer, initialState)

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            sendMessage()
        }
    }

    function sendMessage() {
        const trimmed = inputValue.trim()
        if (!trimmed) return

        dispatch({ type: 'ADD_MESSAGE', message: `> ${trimmed}` })
        processCommand(trimmed.toLowerCase())
        setInputValue('')
    }

    function processCommand(cmd) {
        if(!state.awaitingBuyInput && !state.awaitingSellInput && !state.inCombat){
            //TODO: should this be a switch statement? it might be easier to read. but i can't use || operator. 
            // i would have to have 2 cases for each if block using ||. it's not quite double the statements, but close
            if (cmd === 'help' || cmd === 'h'){
                dispatch({ type: 'HELP' })
            }
            else if (cmd === 'look' || cmd === 'l'){
                dispatch({ type: 'LOOK' })
            }
            else if (cmd === 'inv' || cmd === 'i'){
                dispatch({ type: 'INV' })
            }
            else if (cmd === 'status' || cmd === 's'){
                dispatch({ type: 'STATUS' })
            }
            else if (cmd.startsWith('m ')){
                const direction = cmd.split(' ')[1]
                dispatch({ type: 'MOVE', direction })
            }
            else if (cmd === 'back' || cmd === 'b'){
                dispatch({ type: 'BACK' })
            }
            else if (cmd.startsWith('eat ')){
                const item = cmd.split(' ')[1]
                dispatch({ type: 'EAT', item })
            }
            else if (cmd.startsWith('drink ')){
                const item = cmd.split(' ')[1]
                dispatch({ type: 'DRINK', item })
            }
            else if (cmd.startsWith('take ') || cmd.startsWith('t ')){
                const item = cmd.split(' ')[1]
                dispatch({ type: 'TAKE', item })
            }
            else if (cmd.startsWith('drop ') || cmd.startsWith('d ')){
                const item = cmd.split(' ')[1]
                dispatch({ type: 'DROP', item })
            }
            else if (cmd.startsWith('equip ') || cmd.startsWith('e ')){
                const item = cmd.split(' ')[1]
                dispatch({ type: 'EQUIP', item })
            }
            else if (cmd === 'buy'){
                dispatch({ type: 'BUY_STEP_1' })
            }
            else if(cmd === 'sell'){
                dispatch({ type: 'SELL_STEP_1' })
            }
            else if(cmd === 'unlock' || cmd === 'u'){
                dispatch({ type: 'UNLOCK_ROOM' })
            }
            else if(cmd === 'search'){
                dispatch({ type: 'SEARCH' })
            }
            else if(cmd === 'rest' || cmd === 'r'){
                dispatch({ type: 'REST' })
            }
            else if(cmd === 'return'){
                dispatch({ type: 'RETURN' })
            }
            else if(cmd === 'open-coffin' || cmd === 'o'){
                const randomMummy = pickRandom(['gnome-mummy', 'hobbit-mummy', 'average-mummy', 'ronnie-mummy', 'andre-the-giant-mummy']) 
                dispatch({ type: 'OPEN_COFFIN', randomMummy })
            }
            else if(cmd === 'jump' || cmd === 'j'){
                dispatch({ type: 'JUMP' })
            }
            else if(cmd === 'fish' || cmd === 'f'){
                const fishCaught = fish()
                dispatch({ type: 'FISH', fishCaught })
            }
            else if(cmd.startsWith('a ') || cmd.startsWith('attack ')){
                const enemy = cmd.split(' ')[1]
                dispatch({ type: 'ATTACK', enemy })
            }
            else {
                dispatch({ type: 'ADD_MESSAGE', message: "Unknown command." })
            }
        }
        else if(state.awaitingBuyInput){
            const item = cmd
            dispatch({ type: 'BUY_STEP_2', item })
        }
        else if(state.awaitingSellInput){
            const item = cmd
            dispatch({ type: 'SELL_STEP_2', item })
        }
        else if(state.inCombat){
            const dropKey = doesKeyDrop(.3, state.brownKeyDropped)
            const bearMsg = pickRandom(state.bearMessages)

            const strengthMap = {'l': 'light', 'm': 'medium', 'h': 'heavy'}
            const playerAttackStrength = cmd in strengthMap ? strengthMap[cmd] : cmd
            const enemyAttackStrength = state.enemyName === 'wise-bear' ? '' : pickRandomItemWithWeights(enemyMap[state.enemyName].attackStrength, [.65, .25, .1])

            const playerCrits = crit(state.player.totalCrit, playerAttackStrength)
            const enemyCrits = crit(enemyMap[state.enemyName].critChance, enemyAttackStrength)

            const playerHits = hit(state.player, playerAttackStrength, true, state.enemyName)
            const enemyHits = hit(state.player, enemyAttackStrength, false, state.enemyName)

            dispatch({ type: 'COMBAT_ROUND', playerAttackStrength, enemyAttackStrength, playerCrits, enemyCrits, playerHits, enemyHits, dropKey, bearMsg })
        }
        else {
            dispatch({ type: 'ADD_MESSAGE', message: "Unknown command." })
        }
    }

    return {
        messages: state.messages,
        inputValue,
        setInputValue,
        sendMessage,
        handleKeyDown
    }
}