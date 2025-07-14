import { useReducer, useState } from 'react';
import { items, exits } from '../TextGames/textGame2019_Data.js';
import { gameReducer, initialState } from './textGame2019_characterHandler.js';

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
        if (cmd === 'help'){
            dispatch({ type: 'HELP' });
        }
        if (cmd === 'look' || cmd === 'l') {
            dispatch({ type: 'LOOK', items, exits });
        }
        else if (cmd.startsWith('mv ')) {
            const direction = cmd.split(' ')[1];
            dispatch({ type: 'MOVE', direction, exits });
        }
        else {
            dispatch({ type: 'ADD_MESSAGE', message: "Unknown command." });
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