import { useReducer, useState } from 'react';
import { gameReducer, initialState } from './textGame2019_characterHandler.ts';

export function useGameLogic() {
    const [inputValue, setInputValue] = useState('');
    const [state, dispatch] = useReducer(gameReducer, initialState);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };

    function sendMessage() {
        const trimmed = inputValue.trim();
        if (!trimmed) return;

        dispatch({ type: 'ADD_MESSAGE', message: `> ${trimmed}` });
        processCommand(trimmed.toLowerCase());
        setInputValue('');
    }

    function processCommand(cmd) {
        if(!state.awaitingBuyInput && !state.awaitingSellInput){
            if (cmd === 'help'){
                dispatch({ type: 'HELP' });
            }
            if (cmd === 'look' || cmd === 'l'){
                dispatch({ type: 'LOOK' });
            }
            else if (cmd === 'inv' || cmd === 'i'){
                dispatch({ type: 'INV' });
            }
            else if (cmd === 'status' || cmd === 's'){
                dispatch({ type: 'STATUS' });
            }
            else if (cmd.startsWith('mv ')){
                const direction = cmd.split(' ')[1];
                dispatch({ type: 'MOVE', direction });
            }
            else if (cmd.startsWith('eat ')){
                const item = cmd.split(' ')[1];
                dispatch({ type: 'EAT', item })
            }
            else if (cmd.startsWith('drink ')){
                const item = cmd.split(' ')[1];
                dispatch({ type: 'DRINK', item })
            }
            else if (cmd.startsWith('take ') || cmd.startsWith('t ')){
                const item = cmd.split(' ')[1];
                dispatch({ type: 'TAKE', item })
            }
            else if (cmd.startsWith('drop ') || cmd.startsWith('d ')){
                const item = cmd.split(' ')[1];
                dispatch({ type: 'DROP', item })
            }
            else if (cmd.startsWith('equip ') || cmd.startsWith('e ')){
                const item = cmd.split(' ')[1];
                dispatch({ type: 'EQUIP', item })
            }
            else if (cmd === 'buy' || cmd === 'b'){
                dispatch({ type: 'BUY_STEP_1' })
            }
            else if(cmd === 'sell'){
                dispatch({ type: 'SELL_STEP_1' })
            }
            else {
                dispatch({ type: 'ADD_MESSAGE', message: "Unknown command." });
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
    }

    return {
        messages: state.messages,
        inputValue,
        setInputValue,
        sendMessage,
        handleKeyDown,
        player: state.player,
    };
}