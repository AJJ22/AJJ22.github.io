import { useReducer, useState } from 'react'
import { gameReducer, initialState } from './redux/commandHandler.ts'
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

    const handleFish = () => {
        const fishCaught = fish(false)
        dispatch({ type: 'FISH', fishCaught })
    }

    const handleCoffin = () => {
        const randomMummy = pickRandom(['gnome-mummy', 'hobbit-mummy', 'average-mummy', 'ronnie-mummy', 'andre-the-giant-mummy'])
        dispatch({ type: 'OPEN_COFFIN', randomMummy })
    }

    const handleCombat = (cmd) => {
        const dropKey = doesKeyDrop(.3, state.brownKeyDropped)
        const bearMsg = pickRandom(state.bearMessages)
        const fishKilled = fish(true)

        const strengthMap = {'l': 'light', 'm': 'medium', 'h': 'heavy'}
        const playerAttackStrength = cmd in strengthMap ? strengthMap[cmd] : cmd
        const enemyAttackStrength = state.enemyName === 'wise-bear' ? '' : pickRandomItemWithWeights(enemyMap[state.enemyName].attackStrength, [.65, .25, .1])

        const playerCrits = crit(state.player.totalCrit, playerAttackStrength)
        const enemyCrits = crit(enemyMap[state.enemyName].critChance, enemyAttackStrength)

        const playerHits = hit(state.player, playerAttackStrength, true, state.enemyName)
        const enemyHits = hit(state.player, enemyAttackStrength, false, state.enemyName)

        dispatch({ type: 'COMBAT_ROUND', playerAttackStrength, enemyAttackStrength, playerCrits, enemyCrits, playerHits, enemyHits, dropKey, bearMsg, fishKilled })
    }

    //single word commands, do not need any additional item/parameter value
    const commandMap = {
        help: () => dispatch({ type: 'HELP' }),
        h: () => dispatch({ type: 'HELP' }),

        look: () => dispatch({ type: 'LOOK' }),
        l: () => dispatch({ type: 'LOOK' }),

        inv: () => dispatch({ type: 'INV' }),
        i: () => dispatch({ type: 'INV' }),

        status: () => dispatch({ type: 'STATUS' }),
        s: () => dispatch({ type: 'STATUS' }),

        back: () => dispatch({ type: 'BACK' }),
        b: () => dispatch({ type: 'BACK' }),

        buy: () => dispatch({ type: 'BUY_STEP_1' }),

        sell: () => dispatch({ type: 'SELL_STEP_1' }),

        unlock: () => dispatch({ type: 'UNLOCK_ROOM' }),
        u: () => dispatch({ type: 'UNLOCK_ROOM' }),

        search: () => dispatch({ type: 'SEARCH' }),

        rest: () => dispatch({ type: 'REST' }),
        r: () => dispatch({ type: 'REST' }),

        return: () => dispatch({ type: 'RETURN' }),

        jump: () => dispatch({ type: 'JUMP' }),
        j: () => dispatch({ type: 'JUMP' }),

        opencoffin: handleCoffin,
        o: handleCoffin,

        fish: handleFish,
        f: handleFish
    }

    function processCommand(cmd){
        if(!state.awaitingBuyInput && !state.awaitingSellInput && !state.inCombat){
            //multi-word commands. if it requires a space + a 2nd word to make sense
            const [base, param] = cmd.toLowerCase().split(' ')

            if (['m', 'move'].includes(base)) {
                return dispatch({ type: 'MOVE', direction: param })
            }

            if (['eat', 'drink', 'take', 't', 'drop', 'd', 'equip', 'e'].includes(base)) {
                const typeMap = {
                    eat: 'EAT',
                    drink: 'DRINK',
                    take: 'TAKE',
                    t: 'TAKE',
                    drop: 'DROP',
                    d: 'DROP',
                    equip: 'EQUIP',
                    e: 'EQUIP'
                }
                return dispatch({ type: typeMap[base], item: param })
            }

            if (['a', 'attack'].includes(base)) {
                return dispatch({ type: 'ATTACK', enemy: param })
            }

            //we have checked all the multi-word commands, it's now either a single-word command or gibberish
            const baseCmdHandler = commandMap[base]
            if (baseCmdHandler) {
                return baseCmdHandler()
            }

            dispatch({ type: 'ADD_MESSAGE', message: 'Unknown command.' })
        }

        //these are run depending on state managed variables
        //if the player has entered into a an multi-command action such as combat or a shop interface
        else if(state.awaitingBuyInput){
            const item = cmd
            dispatch({ type: 'BUY_STEP_2', item })
        }
        else if(state.awaitingSellInput){
            const item = cmd
            dispatch({ type: 'SELL_STEP_2', item })
        }
        else if(state.inCombat){
            handleCombat(cmd)
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