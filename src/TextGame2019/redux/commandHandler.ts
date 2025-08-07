import { player, helpMsg, weaponMap, armorMap, foodMap, potionMap, keyMap, locationMap, enemyMap, bearMessages, ripCurrentMsg } from '../objectCreation.ts'
import { removeFirstFoundItem, isAPotion, updateChanceToHit, updateHP, updateArmor, updateCritChance, calculateDamage, addLocationToExits, 
    removeEnemy, save, load, deleteData } from './helperFunctions.ts'
import cloneDeep from 'lodash/cloneDeep'

export const initialState = {
    player,
    locationMap,
    previousLocations: [],
    messages: ["Type 'help' or 'h' for a list of commands"],
    awaitingBuyInput: false,
    awaitingSellInput: false,
    inCombat: false,
    enemyName: '',
    enemyHP: 0,
    brownKeyDropped: false,
    bearMessages: bearMessages,
    awaitingSaveConfirm: false,
    awaitingLoadConfirm: false,
    awaitingDeleteConfirm: false
}

export function gameReducer(state, action) {
    const { player, locationMap } = state
    //TODO: add unit tests
    switch (action.type) {
        case 'HELP': {
            return {
                ...state,
                messages: [...state.messages, helpMsg]
            }
        }

        case 'LOOK': {
            const mermaidMsg = player.location === 'mermaid-house' ? `There is a sign near the door saying 'Will return you to the surface *alive* for 20 gold fee'.` : ``
            return {
                ...state,
                messages: [...state.messages,
                    `Currently in:   ${player.location}\n` +
                    `Takeable Items: ${locationMap[player.location].floorItems.join(', ') || 'None'}\n` +
                    `Places to move: ${locationMap[player.location].exits.join(', ') || 'None'}\n` +
                    `Enemies:        ${locationMap[player.location].enemies.join(', ') || 'None'}\n` + mermaidMsg
                ]
            }
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
                    `Crit Chance: ${Math.round(player.totalCrit * 100)}%`,
                    `Chance to Hit: ${Math.round(player.totalChanceToHit * 100)}%`,
                    `Weapon Equipped: ${player.weapon || 'None'}`,
                    `Armor Equipped: ${player.armorPiece || 'None'}`,
                    //``,
                    //`Base chance to hit: ${player.baseChanceToHit}`
                    //`current hp: ${player.currentHP}`,
                    //`base hp: ${player.baseHP}`,
                    //`max hp: ${player.maxHp}`
                ]
            }
        }

        case 'MOVE': {
            const exitsHere = locationMap[player.location].exits

            if (exitsHere.includes(action.direction)) {
                var updatePlayer
                var message = ''

                if(action.direction === 'sandstorm' && player.currentHP - 10 >= 1){
                    updatePlayer = {
                        ...player,
                        location: action.direction,
                        currentHP: player.currentHP - 10
                    }
                    message = '\nYou are hurt while forcing your way through.'
                }
                else if(action.direction === 'sandstorm' && player.currentHP - 10 < 1){
                    return {
                        ...state,
                        messages: [...state.messages, `You cannot move through the sandstorm on such low health.`]
                    }
                }

                else if(locationMap[action.direction].underwater){
                    if(player.inv.includes('underwater-breathing-apparatus')){
                        if(action.direction === 'rip-current'){
                            return{
                                ...state,
                                player: {
                                    ...player,
                                    location: "underwater-cavern"
                                },
                                previousLocations: [...state.previousLocations, "rip-current"],
                                messages: [...state.messages, ripCurrentMsg]
                            }
                        }
                        updatePlayer = {
                            ...player,
                            location: action.direction
                        }
                    }
                    else{
                        return{
                            ...state,
                            messages: [...state.messages, `You cannot breathe underwater on your own.`]
                        }
                    }
                }
                else if(action.direction === 'church' && locationMap[player.location].lockedRooms[2]){
                    return{
                        ...state,
                        messages: [...state.messages, `The church is locked.`]
                    }
                }
                else{
                    updatePlayer = {
                        ...player,
                        location: action.direction
                    }
                }
                
                return{
                    ...state,
                    player: updatePlayer,
                    previousLocations: state.previousLocations.includes(action.direction) ? state.previousLocations.slice(0, -1) : [...state.previousLocations, player.location],
                    messages: [...state.messages, `You move to ${action.direction}.` + message]
                }
            }
            else {
                return {
                    ...state,
                    messages: [...state.messages, "You can't go that way."]
                }
            }
        }

        case 'BACK': {
            if(state.previousLocations.length > 0){
                const prevLocation = state.previousLocations[state.previousLocations.length - 1]
                if(prevLocation === 'rip-current'){
                   return{
                    ...state,
                    messages: [...state.messages, ripCurrentMsg]
                } 
                }
                return{
                    ...state,
                    player: {
                        ...player,
                        location: prevLocation
                    },
                    previousLocations: state.previousLocations.slice(0, -1),
                    messages: [...state.messages, `You move back to your previous location, ${prevLocation}`]
                }
            }
            else{
                return{
                    ...state,
                    messages: [...state.messages, `You can't move backwards from the starting location.`]
                }
            }
        }

        //eating will restore HP
        //possibly grant temporary stat buffs. for now, only restoring health.
        case 'EAT': {
            if (player.inv.includes(action.item) && action.item in foodMap){
                if(player.currentHP < player.maxHp){
                    if(player.currentHP + foodMap[action.item].healAmount > player.maxHp){
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
                            currentHP: player.currentHP + foodMap[action.item].healAmount,
                            inv: removeFirstFoundItem(player.inv, action.item)
                        }
                        return{
                            ...state,
                            player: updatePlayer,
                            messages: [...state.messages, `You eat the ${action.item} and restore ${foodMap[action.item].healAmount} health.`]
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
                    //if i want to use const here instead of let, i have to chanceToHit, HP, etc... inside the updatePlayer, meaning i would not be 
                    // able to pass player objects in. i would have to use variables. either that or i get rid of the functions entirely, doing the calculation here
                    let updatePlayer = {
                        ...player,
                        dex: player.dex + potionMap[action.item].potionValue,
                        baseChanceToHit: .6 + (player.dex + potionMap[action.item].potionValue) * .005,
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
                        strength: player.strength + potionMap[action.item].potionValue,
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
                        baseHP: player.baseHP + potionMap[action.item].potionValue,
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
                        armorStat: player.armorStat + potionMap[action.item].potionValue,
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
            const itemsHere = locationMap[player.location].floorItems
            if (itemsHere.includes(action.item)){
                const updatePlayer = {
                    ...player,
                    inv: player.inv.concat(action.item)
                }
                const updateItems = {
                    ...locationMap,
                    [player.location]: {
                        ...locationMap[player.location],
                        floorItems: removeFirstFoundItem(itemsHere, action.item)
                    }
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

        //TODO: should the player die if they drop the underwater-breathing-apparatus while in an underwater area?
        //      should there be any consequence besides not being able to move to other locations?
        case 'DROP': {
            const itemsHere = locationMap[player.location].floorItems
            if(player.inv.includes(action.item)){
                const updatePlayer = {
                    ...player,
                    inv: removeFirstFoundItem(player.inv, action.item)
                }
                const updateItems = {
                    ...locationMap,
                    [player.location]: {
                        ...locationMap[player.location],
                        floorItems: itemsHere.concat(action.item)
                    }
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
            var itemIsWeapon = action.item in weaponMap
            var itemIsArmor = action.item in armorMap

            if ((!itemIsWeapon && !itemIsArmor) || !player.inv.includes(action.item)) {
                return {
                    ...state,
                    messages: [...state.messages, "You can't equip that."]
                }
            }

            let newInv = removeFirstFoundItem(player.inv, action.item)

            // If swapping, add the old item back to inventory
            if (itemIsWeapon && player.weapon !== '') {
                newInv = newInv.concat(player.weapon)
            }
            if (itemIsArmor && player.armorPiece !== '') {
                newInv = newInv.concat(player.armorPiece)
            }

            let updatePlayer = {
                ...player,
                inv: newInv,
                weapon: itemIsWeapon ? action.item : player.weapon,
                armorPiece: itemIsArmor ? action.item : player.armorPiece
            }

            // Update stats
            if (itemIsWeapon) {
                updatePlayer = updateCritChance(updatePlayer)
                updatePlayer = updateChanceToHit(updatePlayer)
            }
            if (itemIsArmor) {
                updatePlayer = updateArmor(updatePlayer)
            }

            return {
                ...state,
                player: updatePlayer,
                messages: [...state.messages, `You equip the ${action.item}`]
            }
        }

        case 'BUY_STEP_1': {
            let items = locationMap[player.location].itemsForSale
            if(items){
                //i wrote this one myself (after looking at the example one in sell)
                items = items.map(i => `${i.split(' ')[0]}: ${i.split(' ')[1]}`).join('\n')
                return{
                    ...state,
                    awaitingBuyInput: true,
                    messages: [...state.messages, `What would you like to buy? (exit using 'quit' or 'q').\n` + items ]
                }
            }
            else{
                return{
                    ...state,
                    awaitingBuyInput: false,
                    messages: [...state.messages, `This is not a store.`]
                }
            }
        }

        case 'BUY_STEP_2': {
            if(['quit', 'q'].includes(action.item)){
                return{
                    ...state,
                    awaitingBuyInput: false,
                    messages: [...state.messages, `You exit the shop menu.`]
                }
            }

            //reduce transforms an array into a new data structure by running the function definition for each array element
            //acc stands for 'accumulator', it is the new data structure with all the data up to this point. can be anything (array, object, dictionary, linked list, etc...)
            // {} at the bottom is the initial value for the accumulator. if i wanted to have a default item for sale, i could use { "item": 4 } as the initial value
            const saleItems = locationMap[player.location].itemsForSale.reduce((acc, itemStr) => {
                const [name, price] = itemStr.split(' ')
                acc[name] = Number(price)
                return acc
            }, {})

            if(action.item in saleItems){
                if(player.gold < saleItems[action.item]){
                    return{
                        ...state,
                        awaitingBuyInput: true,
                        messages: [...state.messages, `You don't have enough gold.`]
                    }
                }

                const updatePlayer = {
                    ...player,
                    gold: player.gold - saleItems[action.item],
                    inv: player.inv.concat(action.item)
                }
                return{
                    ...state,
                    awaitingBuyInput: true,
                    player: updatePlayer,
                    messages: [...state.messages, `You bought the ${action.item}`]
                }
            }
            else{
                return{
                    ...state,
                    awaitingBuyInput: true,
                    messages: [...state.messages, `You cannot buy ${action.item}`]
                }
            }
        }

        case 'SELL_STEP_1': {
            if(locationMap[player.location].itemsForSale){
                const itemMap = {...weaponMap, ...armorMap, ...foodMap, ...potionMap, ...keyMap}
                let sellItems = ''
                for(let i=0; i<player.inv.length; i++){
                    if(player.inv[i] === 'underwater-breathing-apparatus'){
                        sellItems += `${player.inv[i]}: ???\n`
                    }
                    else{
                        sellItems += `${player.inv[i]}: ${itemMap[player.inv[i]].sellValue}\n`
                    }
                }

                //better way of doing the same thing. lambda functions are much more elegant
                //const sellItems = player.inv.map(item => `${item}: ${itemMap[item]?.sellValue ?? 'Unknown'}`).join('\n')
                
                return{
                    ...state,
                    awaitingSellInput: true,
                    messages: [...state.messages, `What would you like to sell? (exit using 'quit' or 'q').\n` + sellItems ]
                }
            }
            else{
                return{
                    ...state,
                    awaitingSellInput: false,
                    messages: [...state.messages, `This is not a store.`]
                }
            }
        }

        case 'SELL_STEP_2': {
            if(['quit', 'q'].includes(action.item)){
                return{
                    ...state,
                    awaitingSellInput: false,
                    messages: [...state.messages, `You exit the shop menu.`]
                }
            }

            if(action.item === 'underwater-breathing-apparatus'){
                return{
                    ...state,
                    awaitingSellInput: true,
                    player: {
                        ...player,
                        gold: player.gold + 30,
                        inv: removeFirstFoundItem(player.inv, action.item)
                    },
                    messages: [...state.messages, `The shopkeeper looks at the item with confusion for a minute.\nHe eventually says, I've never seen something of the like, I'll give you 30 gold for it.`]
                }
            }

            if(player.inv.includes(action.item)){
                const itemMap = {...weaponMap, ...armorMap, ...foodMap, ...potionMap, ...keyMap}
                const updatePlayer = {
                    ...player,
                    inv: removeFirstFoundItem(player.inv, action.item),
                    gold: player.gold + itemMap[action.item].sellValue
                }
                return{
                    ...state,
                    awaitingSellInput: true,
                    player: updatePlayer,
                    messages: [...state.messages, `You sell the ${action.item}`]
                }
            }
            else{
                return{
                    ...state,
                    awaitingSellInput: true,
                    messages: [...state.messages, `You cannot sell ${action.item}`]
                }
            }
        }

        case 'UNLOCK_ROOM': {
            const lockedRoom = locationMap[player.location].lockedRooms[0]
            const key = locationMap[player.location].lockedRooms[1]
            const roomIsLocked = locationMap[player.location].lockedRooms[2]

            if(lockedRoom){
                if(roomIsLocked){
                    if(player.inv.includes(key)){
                        const updatePlayer = {
                            ...player,
                            inv: removeFirstFoundItem(player.inv, key)
                        }
                        const updateLocation = {
                            ...locationMap[player.location],
                            exits: lockedRoom === 'church' ? locationMap[player.location].exits : locationMap[player.location].exits.concat(lockedRoom),
                            lockedRooms: [
                                locationMap[player.location].lockedRooms[0],
                                locationMap[player.location].lockedRooms[1],
                                false
                            ]
                        }
                        const updateLocationMap = {
                            ...locationMap,
                            [player.location]: updateLocation
                        }

                        return{
                            ...state,
                            player: updatePlayer,
                            locationMap: updateLocationMap,
                            messages: [...state.messages, `You unlock the ${lockedRoom}`]
                        }
                    }
                    else{
                        return{
                            ...state,
                            messages: [...state.messages, `You don't have the required key.`]
                        }
                    }
                }
                else{
                    return{
                        ...state,
                        messages: [...state.messages, `The room is already unlocked.`]
                    }
                }
            }
            else{
                return{
                    ...state,
                    messages: [...state.messages, `There is nothing to unlock here.`]
                }
            }
        }

        case 'SEARCH': {
            if(player.location === 'waterfall' && !locationMap[player.location].exits.includes('hidden-cave')){
                return{
                    ...state,
                    locationMap: {
                        ...locationMap,
                        [player.location]: {
                            ...locationMap[player.location],
                            exits: locationMap[player.location].exits.concat('hidden-cave')
                        }
                    },
                    messages: [...state.messages, `You find a small cave tucked away behind the waterfall.`]
                }
            }
            return{
                ...state,
                messages: [...state.messages, `You search the area but find nothing of value.`]
            }
        }

        case 'REST': {
            if(player.location === 'house'){
                const updatePlayer = {
                    ...player,
                    currentHP: player.maxHp
                }

                return{
                    ...state,
                    player: updatePlayer,
                    messages: [...state.messages, `You are restored to max HP.`]
                }
            }
            else{
                return{
                    ...state,
                    messages: [...state.messages, `You cannot rest here.`]
                }
            }
        }

        case 'RETURN': {
            if(player.location === 'mermaid-house'){
                if(player.gold >= 20){
                    return{
                        ...state,
                        player: {
                            ...player,
                            gold: player.gold - 20,
                            location: 'lake'
                        },
                        messages: [...state.messages, `The mermaids thank you for your business as they carry you up through the rushing currents back to the lake surface.`]
                    }
                }
                else{
                    return{
                        ...state,
                        messages: [...state.messages, `You don't have enough gold.`]
                    }
                }
            }
            else{
                return{
                    ...state,
                    messages: [...state.messages, `There is nowhere to return to.`]
                }
            }
        }

        case 'OPEN_COFFIN': {
            if(player.location === 'burial-chamber'){
                if(player.weapon !== ''){
                    const updateLocation = {
                        ...locationMap[player.location],
                        enemies: locationMap[player.location].enemies.concat(action.randomMummy)
                    }

                    const updateLocationMap = {
                        ...locationMap,
                        [player.location]: updateLocation
                    }

                    return{
                        ...state,
                        locationMap: updateLocationMap,
                        inCombat: true,
                        enemyName: action.randomMummy,
                        enemyHP: enemyMap[action.randomMummy].hp,
                        messages: [...state.messages, `${action.randomMummy} is attacking!\n` +
                            `Choose an attack strength (light, medium, heavy) or (l, m, h)`
                        ]
                    }
                }
                else{
                    return{
                        ...state,
                        messages: [...state.messages, `You should probably equip a weapon first.`]
                    }
                }
            }
            else{
                return{
                    ...state,
                    messages: [...state.messages, `There is nothing to open here.`]
                }
            }
        }

        case 'JUMP': {
            if(player.location === 'cliff'){
                const updatePlayer = {
                    ...player,
                    currentHP: 1,
                    location: 'woods',
                    inv: player.inv.concat('green-key')
                }

                return{
                    ...state,
                    player: updatePlayer,
                    messages: [...state.messages, `You jump off the cliff, barely surviving the fall. You pick up an intriguing looking 'green-key' laying on the ground.`]
                }
            }
            else{
                return{
                    ...state,
                    messages: [...state.messages, `There is nowhere to jump to.`]
                }
            }
        }

        case 'FISH': {
            if(!['river', 'cove', 'lake'].includes(player.location)){
                return{
                    ...state,
                    messages: [...state.messages, `You cannot fish here.`]
                }
            }

            const msg = action.fishCaught === '' ? `Unfortunatly, you catch nothing.` : `You caught a ${action.fishCaught}!`
            
            return{
                ...state,
                player: {
                    ...player,
                    inv: action.fishCaught === '' ? player.inv : player.inv.concat(action.fishCaught)
                },
                messages: [...state.messages, msg]
            }
        }

        //TODO: these are violating the pure reducer principle
        //fix it
        case 'SAVE': {
            return{
                ...state,
                awaitingSaveConfirm: true,
                messages: [...state.messages, 'Do you want to save the game? (y/n)']
            }
        }
        
        case 'SAVE_STEP_2': {
            const saveMsg = ['yes', 'y'].includes(action.cmd) ? 'You save the game.' :
                (['no', 'n'].includes(action.cmd) ? 'You cancel the save.' :
                    'Not a valid command.')

            if(['yes', 'y'].includes(action.cmd)){
                state.awaitingSaveConfirm = false
                save(state)
            }
            
            return{
                ...state,
                awaitingSaveConfirm: ['yes', 'y', 'no', 'n'].includes(action.cmd) ? false : true,
                messages: [...state.messages, saveMsg]
            }
        }

        case 'LOAD': {
            return{
                ...state,
                awaitingLoadConfirm: true,
                messages: [...state.messages, 'Do you want to load the game? (y/n)']
            }
        }

        case 'LOAD_STEP_2': {
            //this is an example of the if/else if/else chain i mentioned. i think this is harder to read & maintain.
            if(['yes', 'y'].includes(action.cmd)){
                const loadedState = load()
                const loadMsg = loadedState === -1 ? 'You do not have a save point yet.' : 'You reload to the last save point.'

                return{
                    ...loadedState === -1 ? state : loadedState,
                    awaitingLoadConfirm: false,
                    messages: [...state.messages, loadMsg]
                }
            }
            else if(['no', 'n'].includes(action.cmd)){
                return{
                    ...state,
                    awaitingLoadConfirm: false,
                    messages: [...state.messages, 'You cancel the load.']
                }
            }
            else{
                return{
                    ...state,
                    messages: [...state.messages, 'Not a valid command.']
                }
            }
        }

        case 'DELETE': {
            return{
                ...state,
                awaitingDeleteConfirm: true,
                messages: [...state.messages, 'Do you want to delete your save file? (y/n)']
            }
        }

        case 'DELETE_STEP_2': {
            //wanted to try this out instead of the if/else if/else chain. is it cleaner? i personally like it a lot more
            const deleteMsg = ['yes', 'y'].includes(action.cmd) ? 'You delete the save file.' :
                (['no', 'n'].includes(action.cmd) ? 'You cancel the delete.' : 
                    'Not a valid command.')

            if(['yes', 'y'].includes(action.cmd)){
                deleteData()
            }

            return{
                ...state,
                awaitingDeleteConfirm: ['yes', 'y', 'no', 'n'].includes(action.cmd) ? false : true,
                messages: [...state.messages, deleteMsg]
            }
        }

        case 'ATTACK': {
            if(locationMap[player.location].enemies.includes(action.enemy)){
                if(action.enemy === 'wise-bear'){
                    return{
                        ...state,
                        inCombat: true,
                        enemyName: 'wise-bear',
                        messages: [...state.messages, `Choose an attack strength (light, medium, heavy) or (l, m, h)\nThe bear looks at you the same way a person who is curious about insects would look at an ant bringing food back to its colony.`]
                    }
                }
                else if(player.weapon !== ''){
                    return{
                        ...state,
                        inCombat: true,
                        enemyHP: enemyMap[action.enemy].hp,
                        enemyName: action.enemy,
                        messages: [...state.messages, `Attacking ${action.enemy}\n` +
                            `Choose an attack strength (light, medium, heavy) or (l, m, h)`
                        ]
                    }
                }
                else{
                    return{
                        ...state,
                        inCombat: false,
                        messages: [...state.messages, `You don't have a weapon equiped.`]
                    }
                }
            }
            else{
                return{
                    ...state,
                    inCombat: false,
                    messages: [...state.messages, `${action.enemy} does not exist at this location.`]
                }
            }
        }

        /////DO THIS INSTEAD (for attack strengths)
        //   each armor will have a base armor rating - flat damge reduction
        //   + an attack type it is strong against and weak against, third will have no modifier
        //   EX: steel-platemail:
        //           14 armor rating
        //           heavy attacks deal 50% damage
        //           medium attacks deal 100% damage
        //           light attacks deal 150% damage
        //
        //   Enemies weaknesses will be randomized each fight


        ///// ATTACK LIST 1
        // would be nice to have a range of damage: + or - 20% of final damage is random (80-120%)
        ////SCRAP THIS - need to add in attack speed based on the attack strength lv chosen for that turn
                            //instead of this, i can give the opponent's next turn buffs/debuffs
                            //// <UNIT A> USES LIGHT ATTACK - <UNIT B> takes increased damage on <UNIT A>'s next hit, and <UNIT B> does less damage on their next hit
                            //// <UNIT A> USES HEAVY ATTACK - <UNIT B> gets 100% hit chance and crit buffed to 250% for their next hit

        //attacks will be based off of a base weapon damamge stat
        //the damage will then be modified by your strength stat
        //each attack will have a chance to critically strike
        //you can further choose a light, medium, or heavy attack
            //light: you will be able to attack twice before the enemy attacks once (also deal reduced damage (60% of normal), and have less hit chance (70% of normal))
            //medium: average attack, no speed, damage, crit, or hit chance modifiers
            //heavy: higher base damage (200% of normal), higher crit chance (120% of normal), higher chance to hit (130% of normal), but enemy can attack twice before your next attack
        case 'COMBAT_ROUND': {
            const playerAttackStrength = action.playerAttackStrength
            if(['light', 'medium', 'heavy'].includes(playerAttackStrength)){
                if(state.enemyName === 'wise-bear'){
                    const updatePlayer = {
                        ...player,
                        inv: action.bearMsg.startsWith('Almost') ? player.inv.concat('vaal-axe') : player.inv
                    }

                    return{
                        ...state,
                        inCombat: false,
                        player: updatePlayer,
                        bearMessages: action.bearMsg.startsWith('Almost') ? removeFirstFoundItem(state.bearMessages, action.bearMsg) : state.bearMessages,
                        messages: [...state.messages, `You attempt to swing at the bear with ${playerAttackStrength} strength.\n` + action.bearMsg]
                    }
                }

                let playerTurn = true
                const playerBaseDamage = weaponMap[player.weapon].damage + Math.round(player.strength * player.strengthToBaseDamageScaling)
                const [damageToEnemy, playerHitIsACrit, playerWeaknessIndex] = action.playerHits ?
                calculateDamage(player, playerBaseDamage, playerAttackStrength, enemyMap[state.enemyName].weakness, playerTurn, action.playerCrits) :
                [-1, false]

                const playerWeaknessMsg = ['(enemy weakness)', '(neutral)', '(enemy is strong against)'][playerWeaknessIndex]
                const playerHitMessage = damageToEnemy === -1 ? 
                `Your attack misses.\n` :
                (playerHitIsACrit ?
                    `You CRIT the ${state.enemyName} with a ${playerAttackStrength} attack ${playerWeaknessMsg}, dealing ${damageToEnemy} damage.\n` :
                    `You deal ${damageToEnemy} damage to the ${state.enemyName} using a ${playerAttackStrength} attack ${playerWeaknessMsg}.\n`)

                if(state.enemyHP - damageToEnemy <= 0){
                    const gold = enemyMap[state.enemyName].gold
                    var drops = enemyMap[state.enemyName].itemDrops
                    const mummies = ['gnome-mummy', 'hobbit-mummy', 'average-mummy', 'ronnie-mummy', 'andre-the-giant-mummy']
                    var updateLocationMap = {
                        ...locationMap
                    }

                    var brownKeyDropped = state.brownKeyDropped
                    if(mummies.includes(state.enemyName)){
                        if(action.dropKey){
                            drops = drops.concat('brown-key')
                            brownKeyDropped = true
                        }
                        //remove mummy
                        const updateLocation = {
                            ...locationMap[player.location],
                            enemies: removeFirstFoundItem(locationMap[player.location].enemies, state.enemyName)
                        }
                        updateLocationMap = {
                            ...locationMap,
                            [player.location]: updateLocation
                        }
                    }
                    else if(state.enemyName === 'fish' && action.fishKilled !== ''){
                        drops = drops.concat(action.fishKilled)
                    }

                    const updatePlayer = {
                        ...player,
                        gold: player.gold + gold,
                        inv: player.inv.concat(drops)
                    }

                    let addTownMessage = ''
                    if(enemyMap[state.enemyName].isBoss){
                        [updateLocationMap, addTownMessage] = addLocationToExits(player, updateLocationMap, 'town')
                    }
                    updateLocationMap = removeEnemy(player, updateLocationMap, state.enemyName)

                    const dropsString = drops.length > 0 ? ` and${drops.map(d => ' ' + d)}\n` : ``

                    return{
                        ...state,
                        inCombat: false,
                        player: updatePlayer,
                        locationMap: updateLocationMap,
                        brownKeyDropped: brownKeyDropped,
                        messages: [...state.messages, playerHitMessage +
                            `You have killed the ${state.enemyName}.\n` +
                            `You gain ${gold} gold` + dropsString + addTownMessage
                        ]
                    }
                }

                // ---enemy turn----
                playerTurn = false
                const [damageToPlayer, enemyCrits, enemyWeaknessIndex] = action.enemyHits ? 
                calculateDamage(player, enemyMap[state.enemyName].damage, action.enemyAttackStrength, armorMap[player.armorPiece].weakness, playerTurn, action.enemyCrits) :
                [-1, false]
                
                const enemyWeaknessMsg = ['(your weakness)', '(neutral)', '(you are strong against)'][enemyWeaknessIndex]
                const enemyHitMessage = damageToPlayer === -1 ? 
                `The ${state.enemyName} misses you.\n` :
                (enemyCrits ? 
                    `The ${state.enemyName} CRITS you with a ${action.enemyAttackStrength} attack ${enemyWeaknessMsg}, dealing ${damageToPlayer} damage.\n`:
                    `The ${state.enemyName} hits you with a ${action.enemyAttackStrength} attack ${enemyWeaknessMsg}, dealing ${damageToPlayer} damage.\n`)
                

                if(player.currentHP - damageToPlayer <= 0){
                    return{
                        ...cloneDeep(initialState),
                        messages: [enemyHitMessage + `You have died. :(\nType 'help' or 'h' for a list of commands`],
                    }
                }

                const updatePlayer = {
                    ...player,
                    currentHP: damageToPlayer > 0 ? player.currentHP - damageToPlayer : player.currentHP
                }

                return{
                    ...state,
                    player: updatePlayer,
                    inCombat: true,
                    enemyHP: state.enemyHP - damageToEnemy,
                    messages: [...state.messages, playerHitMessage + enemyHitMessage]
                }
            }
            else{
                return{
                    ...state,
                    inCombat: true,
                    messages: [...state.messages, `${playerAttackStrength} is not an attack strength.`]
                }
            }
        }

        case 'ADD_MESSAGE': {
            return {
                ...state,
                messages: [...state.messages, action.message]
            }
        }

        default:
            return state
    }
}