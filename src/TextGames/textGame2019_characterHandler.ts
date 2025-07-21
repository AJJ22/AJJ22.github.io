import { player, helpMsg, weaponMap, armorMap, foodMap, potionMap, keyMap, locationMap, enemyMap } from './textGame2019_objectCreation.ts';

export const initialState = {
    player, //new Character(15, 7/10, 7, 10, 5, 10, "town", ["apple", "sword", "apple", "dex-pot", "brass-dome", "str-pot", "hp-pot", "armor-pot", "leather-armor"]),
    locationMap,
    messages: ["Type 'help' for a list of commands"],
    awaitingBuyInput: false,
    awaitingSellInput: false,
    inCombat: false,
    enemyName: '',
    enemyHP: 0,
    playerDead: false
};

export function gameReducer(state, action) {
    const { player, locationMap } = state

    //#region Helper Functions
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

    function shuffle(array) {
        let currentIndex = array.length;

        // While there remain elements to shuffle...
        while (currentIndex !== 0) {

            // Pick a remaining element...
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
    }

    function pickRandomItemWithWeights(items, weights) {
        var i;

        for (i = 1; i < weights.length; i++)
            weights[i] += weights[i - 1];
        
        var random = Math.random() * weights[weights.length - 1];
        
        for (i = 0; i < weights.length; i++)
            if (weights[i] > random)
                break;
        
        return items[i];
    }
    //#endregion

    //#region Update Player Stats

    //when you change something that affects a stat, these should be used
    //such as changing weapons/armor or increasing strength/dexterity/hp/armor with pots
    function updateArmor(player){
        return {
            ...player,
            armor: player.armorStat + armorMap[player.armorPiece].armorValue
        }
    }

    function updateHP(player){
        return {
            ...player,
            maxHp: player.baseHP + Math.round(player.strength * (player.baseHP / (player.initialBaseHP * player.healthScaling)))
        }
    }

    function updateChanceToHit(player){
        if(player.weapon !== ""){
            return{
                ...player,
                totalChanceToHit: Math.round((player.baseChanceToHit * weaponMap[player.weapon].chanceToHit) * 100) / 100
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
                totalCrit: Math.round(((player.baseCrit * ((player.strength/player.initialStrength)/player.strengthToCritScaling)) * weaponMap[player.weapon].critChance) * 100) / 100
            }
        }
        else{
            return{
                ...player,
                totalCrit: Math.round(player.baseCrit * ((player.strength/player.initialStrength)/player.strengthToCritScaling) * 100) / 100
            }
        }
    }
    //#endregion

    //#region Update State Functions
    function addTownToExits(){
        const updateLocation = {
            ...locationMap[player.location],
            exits: locationMap[player.location].exits.concat('town')
        }
        const updateLocationMap = {
            ...locationMap,
            [player.location]: updateLocation
        }

        return{
            ...state,
            locationMap: updateLocationMap,
            messages: [...state.messages, `You can now travel to town from this location.`]
        }
    }

    function removeBoss(enemyName){
        const updateLocation = {
            ...locationMap[player.location],
            enemies: removeFirstFoundItem(locationMap[player.location].enemies, enemyName)
        }
        const updateLocationMap = {
            ...locationMap,
            [player.location]: updateLocation
        }

        return{
            ...state,
            locationMap: updateLocationMap
        }
    }
    //#endregion

    //#region CalculateDamage
    function calculateDamage(baseDamage, attackStrength, critChance, enemyName, weakness, playerTurn){
        //these wil be changed based on what attack strength the current person used
        //////[increase dmg taken, reduce dmg given, accuracy, crit]
        // Heavy: opponent gets 100% accuracy & 250% increased crit
        // light: opponent takes 130% increased damage for your next hit & opponent deals 80% damage on their next hit

        if(!hit(attackStrength, playerTurn, enemyName)){
            console.log(`player turn: ${playerTurn}`)
            console.log('MISSssss')
            return 0
        }

        const increasedDmgBasedOnType = {
            "heavy": 1.3,
            "medium": 1,
            "light": .8
        }

        //calculate multiplier for: weakness to attack type
        //if enemy is weak to light attack and this attack is light, 1.55 dmg boost
        let weakMult
        const index = weakness.indexOf(attackStrength)
        // if player is not wearing armor, weak to all attack types
        if (!playerTurn && player.armorPiece === ""){
            weakMult = [1.55, 1.55, 1.55]
        }
        else{
            weakMult = [1.55, 1, .6]
        }
        const weaknessMultiplier = weakMult[index]

        //add crit onto damage before returning final number
        let finalDamage = Math.round(weaknessMultiplier * crit(baseDamage * increasedDmgBasedOnType[attackStrength], critChance, attackStrength))
        finalDamage = !playerTurn ? finalDamage - player.armor : finalDamage

        return finalDamage < 0 ? 0 : finalDamage
    }

    function crit(baseDamage, critChance, attackStrength){
        const critChanceBasedOnAttackStrength = {
            "heavy": 1.15,
            "medium": 1,
            "light": .85
        }

        if(critChance * critChanceBasedOnAttackStrength[attackStrength] >= Math.random()){
            //console.log('CRIT!')
            return baseDamage * 1.75
        }
        return baseDamage
    }

    //calculate if hit or miss
    // player can increase their dodge chance by increasing dex
    //   currently at 1% dodge chance / 1 dex (maybe think about reducing this to 1% / 2 dex)
    function hit(attackStrength, playerTurn, enemyName){
        ////// CHANCE TO HIT MODIFIERS - based on attack strength
        // heavy: 120%
        // medium: 100%
        // light: 80%
        const hitChanceBasedOnAttackStrength = {
            "heavy": .75,
            "medium": 1,
            "light": 1.25
        }
        
        const genericChanceToHit = playerTurn ? player.totalChanceToHit : enemyMap[enemyName].chanceToHit * (1 - (.01*player.dex))
        const hitChanceForCurrentAttack = genericChanceToHit * hitChanceBasedOnAttackStrength[attackStrength]
        
        return hitChanceForCurrentAttack > Math.random()
    }
    //#endregion



    //#region Command Logic
    switch (action.type) {
        case 'HELP': {
            return {
                ...state,
                messages: [...state.messages, helpMsg]
            }
        }

        case 'LOOK': {
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
                    `Crit Chance: ${player.totalCrit * 100}%`,
                    `Chance to Hit: ${player.totalChanceToHit * 100}%`,
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
                    let updatePlayer = {
                        ...player,
                        dex: player.dex + potionMap[action.item].potionValue,
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
                        strength: player.strength + potionMap[action.item].potionValue,
                        inv: removeFirstFoundItem(player.inv, action.item)
                    }
                    updatePlayer = updateHP(updatePlayer)
                    updatePlayer = updateCritChance(updatePlayer)

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
            const itemsHere = locationMap[player.location].floorItems;
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

        case 'DROP': {
            const itemsHere = locationMap[player.location].floorItems;
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
                };
            }

            let newInv = player.inv.filter(i => i !== action.item);

            // If swapping, add the old item back to inventory
            if (itemIsWeapon && player.weapon !== '') {
                newInv = newInv.concat(player.weapon);
            }
            if (itemIsArmor && player.armorPiece !== '') {
                newInv = newInv.concat(player.armorPiece);
            }

            let updatePlayer = {
                ...player,
                inv: newInv,
                weapon: itemIsWeapon ? action.item : player.weapon,
                armorPiece: itemIsArmor ? action.item : player.armorPiece
            };

            // Update stats
            if (itemIsWeapon) {
                updatePlayer = updateCritChance(updatePlayer);
                updatePlayer = updateChanceToHit(updatePlayer);
            }
            if (itemIsArmor) {
                updatePlayer = updateArmor(updatePlayer);
            }

            return {
                ...state,
                player: updatePlayer,
                messages: [...state.messages, `You equip the ${action.item}`]
            };
        }

        case 'BUY_STEP_1': {
            let items = locationMap[player.location].itemsForSale
            if(items){
                //i wrote this one myself (after looking at the example one in sell)
                items = items.map(i => `${i.split(' ')[0]}: ${i.split(' ')[1]}`).join('\n')
                return{
                    ...state,
                    awaitingBuyInput: true,
                    messages: [...state.messages, `What would you like to buy?\n` + items ]
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
            if(['quit', 'exit', 'leave', 'q'].includes(action.item)){
                return{
                    ...state,
                    awaitingBuyInput: false,
                    messages: [...state.messages, `You exit the shop menu.`]
                }
            }

            //TODO: learn what reduce does, what is acc, what is the {}); at the bottom??
            const saleItems = locationMap[player.location].itemsForSale.reduce((acc, itemStr) => {
                const [name, price] = itemStr.split(' ');
                acc[name] = Number(price);
                return acc;
            }, {});

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
                    sellItems += `${player.inv[i]}: ${itemMap[player.inv[i]].sellValue}\n`
                }

                //better way of doing the same thing. lambda functions are much more elegant
                //const sellItems = player.inv.map(item => `${item}: ${itemMap[item]?.sellValue ?? 'Unknown'}`).join('\n');
                
                return{
                    ...state,
                    awaitingSellInput: true,
                    messages: [...state.messages, `What would you like to sell?\n` + sellItems ]
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
            if(['quit', 'exit', 'leave', 'q'].includes(action.item)){
                return{
                    ...state,
                    awaitingSellInput: false,
                    messages: [...state.messages, `You exit the shop menu.`]
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
            const roomIsLocked = locationMap[player.location].lockedRooms[2]
            const key = locationMap[player.location].lockedRooms[1]

            if(lockedRoom){
                if(roomIsLocked){
                    if(player.inv.includes(key)){
                        const updatePlayer = {
                            ...player,
                            inv: removeFirstFoundItem(player.inv, key)
                        }
                        const updateLocation = {
                            ...locationMap[player.location],
                            exits: locationMap[player.location].exits.concat(lockedRoom),
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

        case 'OPEN_COFFIN': {
            if(player.location === 'burial-chamber'){
                if(player.weapon !== ''){
                    const coffinMummies = ['gnome-mummy', 'hobbit-mummy', 'average-mummy', 'ronnie-mummy', 'andre-the-giant-mummy']
                    const randomMummy = coffinMummies[Math.floor(Math.random() * coffinMummies.length)]

                    const updateLocation = {
                        ...locationMap[player.location],
                        enemies: locationMap[player.location].enemies.concat(randomMummy)
                    }

                    const updateLocationMap = {
                        ...locationMap,
                        [player.location]: updateLocation
                    }

                    //TODO: force an attack here with the randomMummy. probably change the inCombat flag to true, and provide the mummy name
                    //TODO: the attack function also has to handle removing the mummy after its been defeated. and adding the key to player.inv based on random number
                    return{
                        ...state,
                        locationMap: updateLocationMap,
                        messages: [...state.messages, `${randomMummy} is attacking!`]
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

        case 'ATTACK': {
            if(locationMap[player.location].enemies.includes(action.enemy)){
                if(player.weapon !== ''){
                    return{
                        ...state,
                        inCombat: true,
                        enemyHP: enemyMap[action.enemy].hp,
                        enemyName: action.enemy,
                        messages: [...state.messages, `Attacking ${action.enemy}\n` +
                            `Choose an attack strength (light, medium, heavy)`
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
            if(['light', 'medium', 'heavy'].includes(action.attackStrength)){
                const enemyWeakness = ["light", "medium", "heavy"]
                //TODO: get rid of the need for a shuffle here.
                //it would be more fun for the player if the enemies had a set weakness, so they can learn how to fight more efficently
                shuffle(enemyWeakness)
                let playerTurn = true
                const damageToEnemy = calculateDamage(weaponMap[player.weapon].damage, action.attackStrength, player.totalCrit, state.enemyName, enemyWeakness, playerTurn)

                if(state.enemyHP - damageToEnemy <= 0){
                    const gold = enemyMap[state.enemyName].gold
                    const drops = enemyMap[state.enemyName].itemDrops

                    const updatePlayer = {
                        ...player,
                        gold: player.gold + gold,
                        inv: player.inv.concat(drops)
                    }

                    if(enemyMap[state.enemyName].isBoss){
                        addTownToExits()
                        removeBoss(state.enemyName)
                    }

                    return{
                        ...state,
                        inCombat: false,
                        player: updatePlayer,
                        messages: [...state.messages, `You deal ${damageToEnemy} damage to the ${state.enemyName}\n` +
                            `You have killed the ${state.enemyName}.\n` +
                            `You gain ${gold} gold and ${drops}`
                        ]
                    }
                }

                // ---enemy turn----
                playerTurn = false
                const enemyAttackStrength = pickRandomItemWithWeights(enemyMap[state.enemyName].damageType, [.7, .1, .1])
                const enemyDamage = calculateDamage(enemyMap[state.enemyName].damage, enemyAttackStrength, enemyMap[state.enemyName].critChance, state.enemyName, armorMap[player.armorPiece].weakness, playerTurn)
                
                if(player.currentHP - enemyDamage <= 0){
                    return{
                        //TODO: reset the game to the initial state
                        ...state,
                        inCombat: false,
                        playerDead: true,
                        messages: [...state.messages, `The ${state.enemyName} hits you with a ${enemyAttackStrength} attack, dealing ${enemyDamage} damage to you\n` +
                            `You have died. :(`]
                    }
                }

                const updatePlayer = {
                    ...player,
                    currentHP: player.currentHP - enemyDamage
                }

                return{
                    ...state,
                    player: updatePlayer,
                    inCombat: true,
                    enemyHP: state.enemyHP - damageToEnemy,
                    messages: [...state.messages, `You deal ${damageToEnemy} damage to the ${state.enemyName}\n` +
                        `The ${state.enemyName} hits you with a ${enemyAttackStrength} attack, dealing ${enemyDamage} damage to you`
                    ]
                }
            }
            else{
                return{
                    ...state,
                    inCombat: true,
                    messages: [...state.messages, `${action.attackStrength} is not an attack strength.`]
                }
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
    //#endregion
}