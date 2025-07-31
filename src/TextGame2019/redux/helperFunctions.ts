import { weaponMap, armorMap, enemyMap } from '../objectCreation.ts'

//#region Helper Functions
export let removeFirstFoundItem = (arr, item) => {
    const index = arr.indexOf(item)

    if (index === -1) {
        return [...arr]
    }
    return arr.filter((element, i) => i !== index)
}

export let isAPotion = (item) => {
    return (['dex-pot', 'str-pot', 'hp-pot', 'armor-pot'].includes(item))
}

//TODO: remove if unused
/*
function shuffle(array) {
    let currentIndex = array.length

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
    }
}*/

export function pickRandomItemWithWeights(items, weights) {
    var i

    for (i = 1; i < weights.length; i++)
        weights[i] += weights[i - 1]
    
    var random = Math.random() * weights[weights.length - 1]
    
    for (i = 0; i < weights.length; i++)
        if (weights[i] > random)
            break
    
    return items[i]
}

export function pickRandom(list){
    return list[Math.floor(Math.random() * list.length)]
}

export function doesKeyDrop(probability, keyAlreadyDropped){
    return Math.random() < probability && !keyAlreadyDropped
}

export function fish(combatAgainstFish){
    const fishList = ['goober-fish', 'puffer', 'large-mouth-bass', 'eel', 'barracuda', 'shark', 'killer-whale']
    const weights = [15, 13, 9, 6, 4, 2, 1]
    
    if(combatAgainstFish){
        return pickRandomItemWithWeights(fishList, weights)
    }
    return Math.random() < .3 ? pickRandomItemWithWeights(fishList, weights) : ''
}
//#endregion

//#region Save/Load State

export function save(state){
    localStorage.setItem('stateData', JSON.stringify(state))
}

export function load(){
    const playerDataString = localStorage.getItem('stateData')
    return playerDataString === null ? -1 : JSON.parse(playerDataString)
}

export function deleteData(){
    localStorage.removeItem('stateData')
}

//#endregion

//#region Update Player Stats

//when you change something that affects a stat, these should be used
//such as changing weapons/armor or increasing strength/dexterity/hp/armor with pots
export function updateArmor(player){
    return {
        ...player,
        armor: player.armorStat + armorMap[player.armorPiece].armorValue
    }
}

export function updateHP(player){
    return {
        ...player,
        maxHp: player.baseHP + Math.round(player.strength * (player.baseHP / player.initialBaseHP))
    }
}

export function updateChanceToHit(player){
    if(player.weapon !== ""){
        return{
            ...player,
            totalChanceToHit: Math.round((player.baseChanceToHit * weaponMap[player.weapon].chanceToHit) * 100) / 100
        }
    }
    else{
        return{
            ...player,
            totalChanceToHit: Math.round(player.baseChanceToHit * 100) / 100
        }
    }
}

export function updateCritChance(player){
    if (player.weapon !== ""){
        return{
            ...player,
            totalCrit: Math.round((player.baseCrit * weaponMap[player.weapon].critChance) * 100) / 100
        }
    }
    else{
        return{
            ...player,
            totalCrit: Math.round(player.baseCrit * 100) / 100
        }
    }
}
//#endregion

//#region Update State Functions
export function addLocationToExits(player, locationMap, location){
    const updateLocation = {
        ...locationMap[player.location],
        exits: locationMap[player.location].exits.concat(location)
    }
    const updateLocationMap = {
        ...locationMap,
        [player.location]: updateLocation
    }

    return [updateLocationMap, `You can now travel to ${location} from this location.`]
}

export function removeEnemy(player, locationMap, enemyName){
    const updateLocation = {
        ...locationMap[player.location],
        enemies: removeFirstFoundItem(locationMap[player.location].enemies, enemyName)
    }
    const updateLocationMap = {
        ...locationMap,
        [player.location]: updateLocation
    }

    return updateLocationMap
}
//#endregion

//#region CalculateDamage
export function calculateDamage(player, baseDamage, attackStrength, weakness, playerTurn, isACrit){
    //these wil be changed based on what attack strength the current person used
    //////[increase dmg taken, reduce dmg given, accuracy, crit]
    // Heavy: opponent gets 100% accuracy & 250% increased crit
    // light: opponent takes 130% increased damage for your next hit & opponent deals 80% damage on their next hit

    const strengthMultiplier = {
        "heavy": 1.3,
        "medium": 1,
        "light": .8
    }

    //calculate multiplier for: weakness to attack type
    //if enemy is weak to light attack and this attack is light, 1.55 dmg boost
    const weaknessMultiplierArray = [1.55, 1, .7]
    const index = weakness.indexOf(attackStrength)
    const weaknessMultiplier = !playerTurn && player.armorPiece === "" ? 1.55 : weaknessMultiplierArray[index]
    // if player is not wearing armor, weak to all attack types

    const damageAfterCritCalc = isACrit ? 
    Math.round(baseDamage * strengthMultiplier[attackStrength] * weaknessMultiplier * 1.75) : 
    Math.round(baseDamage * strengthMultiplier[attackStrength] * weaknessMultiplier)

    const finalDamage = !playerTurn ? damageAfterCritCalc - player.armor : damageAfterCritCalc
    //TODO: nerf armor values? might be too strong, enemies doing 0 damage often when wearing armor meant for them 
    // (rat - leather armor) rat should be able to deal damage here

    return finalDamage < 0 ? [0, isACrit, index] : [finalDamage, isACrit, index]
}

export function crit(critChance, attackStrength){
    const critChanceBasedOnAttackStrength = {
        "heavy": 1.15,
        "medium": 1,
        "light": .85
    }

    if(critChance * critChanceBasedOnAttackStrength[attackStrength] >= Math.random()){
        return true
    }
    return false
}

//calculate if hit or miss
// player can increase their dodge chance by increasing dex
//   currently at 1% dodge chance / 1 dex (maybe think about reducing this to 1% / 2 dex)
export function hit(player, attackStrength, playerTurn, enemyName){
    ////// CHANCE TO HIT MODIFIERS - based on attack strength
    // heavy: 120%
    // medium: 100%
    // light: 80%
    const playerDodgeChance = (1 - (.01 * player.dex))
    const hitChanceBasedOnAttackStrength = {
        "heavy": .75,
        "medium": 1,
        "light": 1.25
    }
    
    const hitChanceForCurrentAttack = playerTurn ? 
    player.totalChanceToHit         * hitChanceBasedOnAttackStrength[attackStrength] : 
    enemyMap[enemyName].chanceToHit * hitChanceBasedOnAttackStrength[attackStrength] * playerDodgeChance

    return hitChanceForCurrentAttack > Math.random()
}
//#endregion