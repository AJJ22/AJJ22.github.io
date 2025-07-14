import { Character, helpMsg } from './textGame2019_Data.js';

export const initialState = {
    player: new Character(30, 10, 10, 5, "town", [], 10),
    messages: ["Type 'help' for a list of commands"]
};

export function gameReducer(state, action) {
    const player = state.player;

    switch (action.type) {
        case 'HELP': {
            return {
                ...state,
                messages: [...state.messages, helpMsg]
            }
        }

        case 'LOOK': {
            const location = player.location;
            const itemsHere = action.items[location] || [];
            const exitsHere = action.exits[location] || [];

            const msg = `Currently in: ${location}\n` +
                        `Takeable Items: ${itemsHere.join(', ') || 'None'}\n` +
                        `Places to go: ${exitsHere.join(', ') || 'None'}`;

            return {
                ...state,
                messages: [...state.messages, msg]
            };
        }

        case 'MOVE': {
            const exitsHere = action.exits[player.location] || [];

            if (exitsHere.includes(action.direction)) {
                const updatePlayer = {
                    ...player,
                    location: action.direction
                };
                return {
                    ...state,
                    player: updatePlayer,
                    messages: [...state.messages, `You move to ${action.direction}.`]
                };
            } 
            else {
                return {
                    ...state,
                    messages: [...state.messages, "You can't go that way."]
                };
            }
        }

        case 'ADD_MESSAGE': {
            return {
                ...state,
                messages: [...state.messages, action.message]
            };
        }

        default:
            return state;
    }
}