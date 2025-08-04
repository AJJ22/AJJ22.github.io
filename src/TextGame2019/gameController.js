import { useReducer, useState } from 'react'
import { gameReducer, initialState } from './redux/commandHandler.ts'
import { pickRandom, pickRandomItemWithWeights, doesKeyDrop, fish, crit, hit } from './redux/helperFunctions.ts'
import { armorMap, enemyMap, foodMap, potionMap, weaponMap } from './objectCreation.ts'

export function useGameLogic() {
    const [inputValue, setInputValue] = useState('')
    const [state, dispatch] = useReducer(gameReducer, initialState)

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            sendMessage()
        }
        else if (e.key === 'Tab') {
            autocomplete()
            e.preventDefault()
        }
    }

    function sendMessage() {
        const trimmed = inputValue.trim()
        if (!trimmed) return

        dispatch({ type: 'ADD_MESSAGE', message: `> ${trimmed}` })
        processCommand(trimmed.toLowerCase())
        setInputValue('')
    }

    //#region Auto-complete
    //TODO: implement feature that allows user to type the start of a secondary cmd, like
    // 'equip kn' - then it would try to match 'kn' to something that is available to be equipped
    // if it can't find a match, then it does nothing.
    const chooseSecondaryCmd = (inputArray) => {
        const [base, secondary] = inputValue.trim().split(/\s+/)
        const array = [...new Set(inputArray)]
        const newSecondary = array.includes(secondary) && array.indexOf(secondary) + 1 < array.length ? array[array.indexOf(secondary) + 1] : array[0]

        if(newSecondary !== undefined)
            setInputValue(`${base} ${newSecondary}`)
    }

    const baseCmdMap = {
        'MOVE': () => chooseSecondaryCmd(state.locationMap[state.player.location].exits),
        'ATTACK': () => chooseSecondaryCmd(state.locationMap[state.player.location].enemies),
        'TAKE': () => chooseSecondaryCmd(state.locationMap[state.player.location].floorItems),
        'DROP': () => chooseSecondaryCmd(state.player.inv),
        'EQUIP': () => chooseSecondaryCmd(state.player.inv.filter((element, i) => weaponMap.hasOwnProperty(element) || armorMap.hasOwnProperty(element))),
        'EAT': () => chooseSecondaryCmd(state.player.inv.filter((element, i) => foodMap.hasOwnProperty(element))),
        'DRINK': () => chooseSecondaryCmd(state.player.inv.filter((element, i) => potionMap.hasOwnProperty(element)))
    }

    function autocomplete() {
        const base = inputValue.trim().split(/\s+/)[0]
        
        if(base in multiWordCmdMap){
            baseCmdMap[multiWordCmdMap[base]]()
        }
    }
    //#endregion

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
    const singleWordCmdMap = {
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

        save: () => dispatch({ type: 'SAVE' }),
        load: () => dispatch({ type: 'LOAD' }),
        delete: () => dispatch({ type: 'DELETE' }),

        opencoffin: handleCoffin,
        o: handleCoffin,

        fish: handleFish,
        f: handleFish
    }

    const multiWordCmdMap = {
        eat: 'EAT',
        drink: 'DRINK',
        move: 'MOVE',
        m: 'MOVE',
        take: 'TAKE',
        t: 'TAKE',
        drop: 'DROP',
        d: 'DROP',
        equip: 'EQUIP',
        e: 'EQUIP',
        attack: 'ATTACK',
        a: 'ATTACK'
    }

    function processCommand(cmd){
        //these are run depending on state managed variables
        //if the player has entered into a an multi-command action such as combat or a shop interface
        if(state.awaitingBuyInput){
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
        else if(state.awaitingSaveConfirm){
            dispatch({ type: 'SAVE_STEP_2', cmd })
        }
        else if(state.awaitingLoadConfirm){
            dispatch({ type: 'LOAD_STEP_2', cmd })
        }
        else if(state.awaitingDeleteConfirm){
            dispatch({ type: 'DELETE_STEP_2', cmd })
        }
        else{
            //multi-word commands. if it requires a space + a 2nd word to make sense
            const [base, param] = cmd.toLowerCase().split(' ')

            if (['m', 'move'].includes(base)) {
                return dispatch({ type: 'MOVE', direction: param })
            }

            if (['eat', 'drink', 'take', 't', 'drop', 'd', 'equip', 'e'].includes(base)) {
                return dispatch({ type: multiWordCmdMap[base], item: param })
            }

            if (['a', 'attack'].includes(base)) {
                return dispatch({ type: 'ATTACK', enemy: param })
            }

            //single-word commands or gibberish (last case scenario)
            const baseCmdHandler = singleWordCmdMap[base]
            if (baseCmdHandler) {
                return baseCmdHandler()
            }

            dispatch({ type: 'ADD_MESSAGE', message: 'Unknown command.' })
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