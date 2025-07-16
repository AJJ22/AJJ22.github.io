import { Character, helpMsg, itemMap, locationMap, enemyMap } from '../TextGames/textGame2019_objectCreation.js';

export const initialState = {
    player: new Character(15, 7/10, 7, 10, 5, 10, "town", ["apple", "sword", "apple", "dex-pot", "brass-dome", "str-pot", "hp-pot", "armor-pot", "leather-armor"]),
    locationMap,
    messages: ["Type 'help' for a list of commands"]
};

export function gameReducer(state, action) {
    const { player, locationMap } = state;

    let removeFirstFoundItem = (arr, item) => {
        const index = arr.indexOf(item)

        if (index === -1) {
            return [...arr]
        }
        return arr.filter((element, i) => i !== index)
    }

    let isAPotion = (item) => {
        return (['dex-pot', 'str-pot', 'hp-pot', 'armor-pot'].includes(item))
    }

    //when you change something that affects a stat, these should be used
    //such as changing weapons/armor or increasing strength/dexterity/hp/armor with pots
    function updateArmor(player){
        return {
            ...player,
            armor: player.armorStat + itemMap[player.armorPiece]
        };
    }

    function updateHP(player){
        return {
            ...player,
            maxHp: player.baseHP + Math.round(player.strength * (player.baseHP / (player.initialBaseHP * player.healthScaling)))
        }
    }

    function updateChanceToHit (player){
        if(player.weapon !== ""){
            return{
                ...player,
                totalChanceToHit: Math.round((player.baseChanceToHit * itemMap[player.weapon.chanceToHit]) * 100) / 100
            }
        }
        else{
            return{
                ...player,
                totalChanceToHit: player.baseChanceToHit
            }
        }
    }
    
    function updateCritChance(player){
        if (player.weapon !== ""){
            return{
                ...player,
                totalCrit: Math.round((player.baseCrit * itemMap[player.weapon.critChance]) * 100) / 100
            }
        }
        else{
            return{
                ...player,
                totalCrit: player.baseCrit
            }
        }
    }

    switch (action.type) {
        case 'HELP': {
            return {
                ...state,
                messages: [...state.messages, helpMsg]
            }
        }

        case 'LOOK': {
            const { player } = state;
            const enemiesHere = locationMap[player.location].enemies;
            return {
                ...state,
                messages: [...state.messages,
                    `Currently in: ${player.location}\n` +
                    `Takeable Items: ${locationMap[player.location].floorItems.join(', ') || 'None'}\n` +
                    `Places to move: ${locationMap[player.location].exits.join(', ') || 'None'}\n` +
                    `Enemies: ` + (enemiesHere.length > 0 ? enemiesHere.join(', ') : 'None')
                ]
            };
        }

        case 'INV': {
            return {
                ...state,
                messages: [...state.messages, 
                    `Inventory: ${player.inv.join(', ') || 'Empty'}`,
                    `Gold: ${player.gold}`]
            }
        }

        case 'STATUS': {
            return {
                ...state,
                messages: [...state.messages, 
                    `HP: ${player.currentHP}/${player.maxHp}`,
                    `Strength: ${player.strength}`,
                    `Dexterity: ${player.dex}`,
                    `Armor: ${player.armor}`,
                    `Crit Chance: ${player.totalCrit}`,
                    `Chance to Hit: ${player.totalChanceToHit}`,
                    `Weapon Equipped: ${player.weapon || 'None'}`,
                    `Armor Equipped: ${player.armorPiece || 'None'}`,
                    //``,
                    //`Base chance to hit: ${player.baseChanceToHit}`
                    //`current hp: ${player.currentHP}`,
                    //`base hp: ${player.baseHP}`,
                    //`max hp: ${player.maxHp}`
                ]
            };
        }

        case 'MOVE': {
            const exitsHere = locationMap[player.location].exits;

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

        //eating will restore HP
        //possibly grant temporary stat buffs. for now, only restoring health.
        case 'EAT': {
            if (player.inv.includes(action.item) && action.item in itemMap.food){
                if(player.currentHP < player.maxHp){
                    if(player.currentHP + itemMap.food[action.item][0] > player.maxHp){
                        const updatePlayer = {
                            ...player,
                            currentHP: player.maxHp,
                            inv: removeFirstFoundItem(player.inv, action.item)
                        }
                        return{
                            ...state,
                            player: updatePlayer,
                            messages: [...state.messages, `You eat the ${action.item} and restore to full health.`]
                        }
                    }
                    else{
                        const updatePlayer = {
                            ...player,
                            currentHP: player.currentHP + itemMap.food[action.item][0],
                            inv: removeFirstFoundItem(player.inv, action.item)
                        }
                        return{
                            ...state,
                            player: updatePlayer,
                            messages: [...state.messages, `You eat the ${action.item} and restore ${itemMap.food[action.item][0]} health.`]
                        }
                    }
                }
                else{
                    return {
                        ...state,
                        messages: [...state.messages, "You are already at full health."]
                    }
                }
            }
            else{
                return{
                    ...state,
                    messages: [...state.messages, "You don't have that item or it's not food."]
                }
            }
        }

        //drinking potions will increase the corosponding stat
        case 'DRINK': {
            if(player.inv.includes(action.item) && isAPotion(action.item)){
                if(action.item === 'dex-pot'){
                    let updatePlayer = {
                        ...player,
                        dex: player.dex + itemMap.potions[action.item],
                        baseChanceToHit: Math.round((.7 + player.dex * .005) * 100) / 100,
                        inv: removeFirstFoundItem(player.inv, action.item)
                    }
                    updatePlayer = updateChanceToHit(updatePlayer)
                    return{
                        ...state,
                        player: updatePlayer,
                        messages: [...state.messages, `Dexterity has been increased.`]
                    }
                }
                else if(action.item === 'str-pot'){
                    let updatePlayer = {
                        ...player,
                        strength: player.strength + itemMap.potions[action.item],
                        inv: removeFirstFoundItem(player.inv, action.item)
                    }
                    updatePlayer = updateHP(updatePlayer)

                    return{
                        ...state,
                        player: updatePlayer,
                        messages: [...state.messages, `Strength has been increased.`]
                    }
                }
                else if(action.item === 'hp-pot'){
                    let updatePlayer = {
                        ...player,
                        baseHP: player.baseHP + itemMap.potions[action.item],
                        inv: removeFirstFoundItem(player.inv, action.item)
                    }
                    updatePlayer = updateHP(updatePlayer)

                    return{
                        ...state,
                        player: updatePlayer,
                        messages: [...state.messages, `Max HP has been increased.`]
                    }
                }
                else if(action.item === 'armor-pot'){
                    let updatePlayer = {
                        ...player,
                        armorStat: player.armorStat + itemMap.potions[action.item],
                        inv: removeFirstFoundItem(player.inv, action.item)
                    }
                    updatePlayer = updateArmor(updatePlayer)

                    return{
                        ...state,
                        player: updatePlayer,
                        messages: [...state.messages, "Armor has been increased."]
                    }
                }
                else{
                    return{
                        ...state,
                        messages: [...state.messages, "Whoopsie doopsies, something went wrong..."]
                    }
                }
            }
            else{
                return{
                    ...state,
                    messages: [...state.messages, "You can't drink that."]
                }
            }
        }

        case 'TAKE': {
            const itemsHere = locationMap[player.location].floorItems;
            if (itemsHere.includes(action.item)){
                const updatePlayer = {
                    ...player,
                    inv: player.inv.concat(action.item)
                }
                const updateItems = {
                    ...locationMap,
                    [player.location]: locationMap[player.location].floorItems.filter(i => i !== action.item)
                }
                return{
                    ...state,
                    player: updatePlayer,
                    locationMap: updateItems,
                    messages: [...state.messages, `You take the ${action.item}.`]
                }
            }
            else{
                return {
                    ...state,
                    messages: [...state.messages, "You can't take that."]
                }
            }
        }

        case 'DROP': {
            const { player } = state;
            if(player.inv.includes(action.item)){
                const updatePlayer = {
                    ...player,
                    inv: removeFirstFoundItem(player.inv, action.item)
                }
                const updateItems = {
                    ...locationMap,
                    [player.location]: locationMap[player.location].floorItems.concat(action.item)
                }
                return{
                    ...state,
                    player: updatePlayer,
                    locationMap: updateItems,
                    messages: [...state.messages, `You drop the ${action.item}`]
                }
            }
            else{
                return{
                    ...state,
                    messages: [...state.messages, "You can't drop that."]
                }
            }
        }

        case 'EQUIP': {
            let isWeapon = action.item in itemMap.weapons;
            let isArmor = action.item in itemMap.armorPieces;

            if ((!isWeapon && !isArmor) || !player.inv.includes(action.item)) {
                return {
                    ...state,
                    messages: [...state.messages, "You can't equip that."]
                };
            }

            let newInv = player.inv.filter(i => i !== action.item);

            // If swapping, add the old item back to inventory
            if (isWeapon && player.weapon !== '') {
                newInv = newInv.concat(player.weapon);
            }
            if (isArmor && player.armorPiece !== '') {
                newInv = newInv.concat(player.armorPiece);
            }

            let updatePlayer = {
                ...player,
                inv: newInv,
                weapon: isWeapon ? action.item : player.weapon,
                armorPiece: isArmor ? action.item : player.armorPiece
            };

            // Update stats
            if (isWeapon) {
                updatePlayer = updateCritChance(updatePlayer);
                updatePlayer = updateChanceToHit(updatePlayer);
            }
            if (isArmor) {
                updatePlayer = updateArmor(updatePlayer);
            }

            return {
                ...state,
                player: updatePlayer,
                messages: [...state.messages, `You equip the ${action.item}`]
            };
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