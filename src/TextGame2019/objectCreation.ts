import data from './data/data.json'
////TODO: BUFF flat enemy dmg, nerf range of chance-based damage. like extra crit dmg, dmgBasedOnType, & weakness dmg
////      The enemies should have a smaller range of damage, 
//             EX: right now a rat can do 0 dmg or 20 dmg. the rat should do 7-10 dmg every hit
//only allow TROOM & hidden room enemies to be killed once. too easy to farm for gold


////// CRITICAL STRIKE CHANCE
// modified by weapon crit chance

////// CHANCE TO HIT
// modified by weapon chance to hit (weapon chanceToHit * base chanceToHit)
// and dexterity (0.05% / 10 dex)

////// BASE DAMAGE
// modified by weapon chance to hit (weapon chanceToHit * base chanceToHit)
// and strength (weapon baseDamge + (strength * strengthToBaseDamageScaling))

////// HP
// modified by stat pots (2 HP / pot)
// and strength (4 HP / 10 strength)

////// ARMOR
// modified by armorPiece and pots

interface Character{
    initialBaseHP: number //this is used for the maxHP calculation. we need to know what HP the player start with so the player can get bigger HP increases as the game goes on
    baseHP: number //need this so i don't stack strength bonuses on top of eachother
    //i want the baseHP to affect the strength bonus health. (the more baseHP you have, the more benefit you get from strength) 
    maxHp: number  //this.baseHP + Math.round(strength * (this.baseHP / this.initialBaseHP))
    currentHP: number //this will be how i track hp in battles, if you take damage, remove from here

    strength: number //used for damage modifier and health
    strengthToBaseDamageScaling: number

    totalCrit: number //chance to critically strike after everything has been factored in
    baseCrit: number //only modified by stat pots and temporary bosts

    dex: number //used for dodging & chance to hit (+ 0.05% chanceToHit / 10 dex) added before weapons
                    //dodge is currently at 1% dodge chance / 1 dex (maybe nerf this)

    baseChanceToHit: number //Math.round((.7 + this.dex * .005) * 100) / 100 //base % chance attack will hit, before weapon modifier
    totalChanceToHit: number //chanceToHit after all modifiers

    armorStat: number //damage reduction stat can be increased with potions
    armorPiece: string //what armor piece you are currently wearing
    armor: number //this.armorStat + armorMap[this.armorPiece] //total damage reduction for calculating hits

    weapon: string
    
    location: string
    inv: string[]
    gold: number
}

//#region Item Classes
interface Item{
    name: string
    sellValue: number
}

interface Weapon extends Item{
    damage: number
    critChance: number
    chanceToHit: number
}

interface Armor extends Item{
    weakness: string[]
    armorValue: number
}

interface Food extends Item{
    healAmount: number
    increaseStat: string
    increaseStatAmount: number
}

interface Potion extends Item{
    potionType: string
    potionValue: number
    
}

interface Key extends Item{
    name: string
    sellValue: number
}
//#endregion

//#region Location Classes
interface Location{
    name: string
    exits: string[]
    floorItems: string[]
    enemies: string[]
    lockedRooms: any[]
    underwater?: boolean
    itemsForSale?: string[]
}
/*
export interface Store extends Location{
    itemsForSale: Record<string, number>
}*/
//#endregion

//#region Enemy Classes
interface Enemy{
    name: string
    damage: number
    critChance: number
    chanceToHit: number
    hp: number
    gold: number
    itemDrops: string[]
    attackStrength: string[]
    weakness: string[]
    isBoss: boolean
}
//#endregion


//#region Map JSON data to arrays of interfaceName[]
const weapons: Weapon[] = data.weapons
export const weaponMap: Record<string, Weapon> = Object.fromEntries(weapons.map(w => [w.name, w]))

const armorList: Armor[] = data.armor
export const armorMap: Record<string, Armor> = Object.fromEntries(armorList.map(a => [a.name, a]))

const food: Food[] = data.food
export const foodMap: Record<string, Food> = Object.fromEntries(food.map(f => [f.name, f]))

const potions: Potion[] = data.potions
export const potionMap: Record<string, Potion> = Object.fromEntries(potions.map(p => [p.name, p]))

const keys: Key[] = data.keys
export const keyMap: Record<string, Key> = Object.fromEntries(keys.map(k => [k.name, k]))

const locations: Location[] = data.locations
export const locationMap: Record<string, Location> = Object.fromEntries(locations.map(l => [l.name, l]))

const enemies: Enemy[] = data.enemies
export const enemyMap: Record<string, Enemy> = Object.fromEntries(enemies.map(e => [e.name, e]))



const strength = 5 //used for damage modifier and health
const strengthToBaseDamageScaling = 1/2 //we multiply strength by this fraction, then add it to the baseDamage of an attack (smaller the fraction, less bonus damage player gets)
const initialBaseHP = 15 //this is used for the maxHP calculation. we need to know what HP the player start with so the player can get bigger HP increases as the game goes on
const baseHP = initialBaseHP //need this so i don't stack strength bonuses on top of eachother
//i want the baseHP to affect the strength bonus health. (the more baseHP you have, the more benefit you get from strength)
const maxHp = baseHP + Math.round(strength * (baseHP / initialBaseHP))
const currentHP = maxHp //this will be how i track hp in battles, if you take damage, remove from here

const totalCrit = .2 //chance to critically strike after everything has been factored in
const baseCrit = .2 //only modified by stat pots and temporary bosts

const armorStat = 0 //damage reduction stat can be increased with potions
const armorPiece = "clothes" //what armor piece you are currently wearing
const armor = armorStat + armorMap[armorPiece].armorValue //total damage reduction for calculating hits

const weapon: string = "knife"

const location = "town"
const inv = []
const gold = 10

const dex = 5 //used for dodging & chance to hit (+ 0.05% chanceToHit / 10 dex) added before weapons
                //dodge is currently at 1% dodge chance / 1 dex (maybe nerf this)

const baseChanceToHit = Math.round((.6 + dex * .005) * 100) / 100 //base % chance attack will hit, before weapon modifier
const totalChanceToHit = weapon !== "" ? Math.round((baseChanceToHit * weaponMap[weapon].chanceToHit) * 100) / 100 : Math.round((baseChanceToHit) * 100) / 100 //chanceToHit after all modifiers


export const player: Character = {initialBaseHP, baseHP, maxHp, currentHP, strength, strengthToBaseDamageScaling, totalCrit, 
    baseCrit, dex, baseChanceToHit, totalChanceToHit, armorStat, armorPiece, armor, weapon, location, inv, gold}
//#endregion

export const helpMsg = "---- COMMANDS ----\n" +
                "  l                 (look)\n" +
                "  s                 (status)\n" +
                "  inv               (show inventory)\n" +
                "----\n" +
                "  buy / sell        (open store menu, while at store location)\n" +
                "  -<item>           (buy / sell item)\n" +
                "  -'quit', 'exit', 'leave', 'q' (exit store menu)\n" +
                "----\n" +
                "  o (open-coffin - where applicable)\n" +
                "  u (unlock - when near hidden room)\n" +
                "  r (rest - when at home)\n" +
                "  j (jump - where applicable)\n" +
                " ----\n" +
                "  m     <location>  (move)\n" +
                "  t     <item>      (take)\n" +
                "  d     <item>      (drop)\n" +
                "  e     <item>      (equip)\n" +
                "  a     <enemy>     (attack)\n" +
                "  eat   <food>\n" +
                "  drink <potion>\n" +
                " ----\n" +
                "  save (save the current game state)\n" +
                "  load (reload back to your last save)\n" +
                "  delete (delete your save state)"

export const bearMessages = [
    "He catches your hand like it was a child's while gazing at you with a calm interest.\n" +
    "I have some information you may be want to hear in, he says.\n" +
    "I heard the pirates have developed something allowing them to breathe underwater, like the merfolk.\n" +
    "You stop your fruitless attack and thank him for the information, as it is clear this bear is not something to be taken lightly.",
    
    "He doges your attack and performs a flawless leg sweep before you even realize your blade didn't connect.\n" +
    "You cannot continue attacking, as the wind has been thoroughly knocked out of you. So you listen instead.\n" +
    "The bear says he has seen a unique looking cave near the waterfall. You should be able to find it if you Search. It might be worth a trip.",

    "Almost as if he can see into the future, the bear's large paw blocks the hilt of your sword before you have even drawn it.\n" +
    "Before you can do anything else, he speaks. Let me give you something that may prove useful on your journey around my lake.\n" +
    "He picks up something that looks like a toothpick in his paws and presents it to you with what seems to be a smile.\n" +
    "It's a vaal axe. A weapon said to be quite rare nowadays. You take it and thank him for his generosity."
]

export const ripCurrentMsg = `You enter the current and are immediately sucked downwards.\n
                              You spin uncontrollably for minutes, though luckily for you, you are able to breath underwater.\n
                              You are eventually spit out into a large underwater-cavern.`