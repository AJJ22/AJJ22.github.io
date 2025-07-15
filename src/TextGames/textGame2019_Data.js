////// CRITICAL STRIKE CHANCE
// modified by weapon crit chance only

////// CHANCE TO HIT
// modified by weapon chance to hit (weapon chanceToHit * base chanceToHit)
// and dexterity (0.05% / 10 dex)

////// HP
// modified by stat pots (2 HP / pot)
// and strength (4 HP / 10 strength)

////// ARMOR
// modified by armorPiece only
// maybe by pots, do not currently have armor pots available. have code to support them

export class Character{
    constructor(baseHp_input, healthScaling_input, strength_input, dex_input, armorStat_input, loc_input, inv_input, gold_input){
        this.initialBaseHP = baseHp_input //this is used for the maxHP calculation. we need to know what HP the player start with so the player can get bigger HP increases as the game goes on
        this.baseHP = baseHp_input //need this so i don't stack strength bonuses on top of eachother
        this.healthScaling = healthScaling_input //the smaller this is, the faster HP will grow
        //i want the baseHP to affect the strength bonus health. (the more baseHP you have, the more benefit you get from strength) 
        this.maxHp = this.baseHP + Math.round(strength_input * (this.baseHP / (this.initialBaseHP * this.healthScaling)))
        this.currentHP = this.maxHp /2 //this will be how i track hp in battles, if you take damage, remove from here
        //beforeStrengthHP = hp //initial HP pool that will be added to with potions
        this.strength = strength_input //used for damage modifier and health

        this.totalCrit = .2 //chance to critically strike after everything has been factored in
        this.baseCrit = .2 //only modified by stat pots and temporary bosts

        this.dex = dex_input //used for dodging & chance to hit (+ 0.05% chanceToHit / 10 dex) added before weapons
                       //dodge is currently at 1% dodge chance / 1 dex (maybe nerf this)

        this.baseChanceToHit = Math.round((.7 + this.dex * .005) * 100) / 100 //base % chance attack will hit, before weapon modifier
        this.totalChanceToHit = this.baseChanceToHit //chanceToHit after all modifiers

        this.armorStat = armorStat_input //damage reduction stat
        this.armorPiece = "" //what armor piece you are currently wearing
        this.armor = this.armorStat //store total value of armor for damage reductions

        this.weapon = ""
        
        this.location = loc_input
        this.inv = inv_input
        this.gold = gold_input
        //playing = true //remove since we are not using a game loop. its just a browser 
        //itemsInLocations = items //remove these because they are unnecessary if not using save files??
        //exits = exits
    }
}

export const helpMsg = "---- COMMANDS ----\n" +
                "  l                 (look)\n" +
                "  s                 (status)\n" +
                "  inv               (show inventory)\n" +
                "  buy / sell        (when in store)\n" +
                "  open-coffin       (where applicable)\n" +
                "  unlock            (when near hidden room)\n" +
                "  rest              (when in house)\n" +
                "  jump              (where applicable)\n" +
                
                "  mv    <location>: (move)\n" +
                "  t     <item>:     (take)\n" +
                "  d     <item>:     (drop)\n" +
                "  e     <item>:     (equip)\n" +
                "  a     <enemy>:    (attack)\n" +
                "  eat   <food>\n" +
                "  drink <potion>"

export const locations = ["town", "house", "ryan-store",
             "desert", "abdi-store", "room-room", "pyramid", "sandstorm", "dark-hall", "dank-hall", "stair-a", "dim-room", "light-room", "black-room", "stair-c", "gold-room", "stair-b", "TDWL-room", "burial-chamber", "stair-d",
             "lake", "danou-store",
             "woods", "tony-store", "path", "tree-house", "cave", "underground-lake", "lit-hall", "???room", "green-room", "beaten-path", "swamp", "darker-swamp", "shreks-place", "mud-pit", "jungle", "green-path", "cliff", "clearing",
             "church", "joe-store",]

export const items = {
    "house": ["pizza", "knife", "cake", "dex-pot", "clothes", "str-pot", "hp-pot"],
    "town": [],
    "ryan-store": ["sword"],

    ////////DESERT//////
    "desert": ["taco"],
    ////pyramid
    "pyramid": [],
    "dark-hall": [""],
    "abdi-store": ["dex-pot"],
    "stair-a": [""],
    "dim-room": ["apple"],
    "light-room": ["hp-pot"],
    "stair-c": [""],
    "gold-room": ["apple", "str-pot"],
    "black-room": ["forbidden-fruit", "str-pot"],
    "dank-hall": ["mushroom"],
    "stair-b": [""],
    "burial-chamber": ["gingerbread"],
    "TDWL-room": ["skooma"],
    "stair-d": [""],
    "room-room": ["forbidden-fruit", "hp-pot", "dex-pot"],
    ////sandstorm
    "sandstorm":["hp-pot", "battle-axe"],


    ////////WOODS//////
    "woods":[],
    ////path
    "path":[],
    "tree-house":[],
    "tony-store":[],
    "cave":[],
    "underground-sea":[],
    "lit-hall":[],
    "???room":[],
    "green-room":[],
    ////beaten-path
    "beaten-path":[],
    "swamp":[],
    "darker-swamp":[],
    "shreks-place":[],
    "mud-pit":[],
    "jungle":[],
    "green-path":[],
    "cliff":[],
    "clearning":[],
}

export const exits = {
    ////general areas
    "town": ["ryan-store", "house", "desert", "woods", "lake", "church"],
    "ryan-store": ["town"],
    "house": ["town"],

    ////////DESERT//////
    "desert": ["town", "pyramid", "sandstorm"],
    ////pyramid
    "pyramid": ["desert", "dark-hall", "dank-hall"],
    "dark-hall": ["pyramid", "abdi-store", "stair-a"],
    "abdi-store": ["dark-hall"],
    "stair-a": ["dark-hall", "dim-room", "light-room", "black-room"],
    "dim-room": ["stair-a"],
    "light-room": ["stair-a", "stair-c",],
    "stair-c": ["light-room", "gold-room"],
    "gold-room": ["stair-c"],
    "black-room": ["stair-a"],
    "dank-hall": ["pyramid", "stair-b", "TDWL-room"],
    "stair-b": ["dank-hall", "burial-chamber"],
    "burial-chamber": ["stair-b"],
    "TDWL-room": ["dank-hall", "stair-d"],
    "stair-d": ["TDWL-room"],
    "room-room": ["stair-d"],
    ////sandstorm
    "sandstorm": ["desert"],
    

    ////////WOODS//////
    "woods":["town", "path", "beaten-path"],
    ////path
    "path":["woods", "tree-house", "cave"],
    "tree-house":["path", "tony-store"],
    "tony-store":["tree-house"],
    "cave":["path", "underground-sea", "lit-hall"],
    "underground-sea":["cave"],
    "lit-hall":["cave", "???rooom"],
    "???room":["lit-hall"],
    "green-room":["???room"],
    ////beaten-path
    "beaten-path":["woods", "swamp", "mud-pit"],
    "swamp":["beaten-path", "darker-swamp"],
    "darker-swamp":["swamp", "shreks-place"],
    "shreks-place":["darker-swamp"],
    "mud-pit":["beaten-path", "jungle"],
    "jungle":["mud-pit", "green-path", "cliff"],
    "green-path":["jungle", "clearing"],
    "cliff":["jungle"],
    "clearning":["green-path"],


    ////////LAKE//////


    ////////CHURCH//////
}

// secret roooms to be unlocked with a key
export const rooms = {
    //location: [location that is unlocked, key required to unlock]
    "stair-d": ["room-room", "brown-key", false],
    "???rooom": ["green-room", "green-key", false],
}

export const itemSellValue = {
    ////// WEAPONS VALUE //////
    "knife": 1,
    "dagger": 4,
    "bayonet": 6,
    "machete": 9,
    "cutlass": 14,
    
    "sword": 2,
    "nice-sword": 4,
    "longsword": 8,
    "rapier": 11,
    "scimitar": 15,

    "hammer": 1,
    "hand-axe": 4,
    "battle-axe": 7,
    "vaal-axe": 10,
    "atziri-disfavour": 15,

    "undisputed-best-axe": 30,
    "mehrunes-razor": 28,
    "excalibur": 29,


    ////// ARMOR VALUE //////
    "clothes": 2,
    "leather-armor": 6,
    "dragon-hide": 15,

    "light-chainmail": 2,
    "heavy-chainmail": 6,
    "golden-chainmail": 16,
    
    "steel-platemail": 4,
    "rune-platemail": 8,
    "brass-dome": 17,


    ////// FOOD VALUE //////
    "pizza": 2,
    "taco": 3,
    "cake": 3,
    "forbidden-fruit": 15,
    "gingerbread": 6,
    "skooma": 8,
    "mushroom": 9,
    "apple": 4,
    

    ////// POT VALUES //////
    "armor-pot": 8,
    "str-pot": 9,
    "dex-pot": 9,
    "hp-pot": 12,


    ////// KEYS //////
    "brown-key": 7,
    "green-key": 8,
}

export const listOfStores = ["abdi-store", "ryan-store", "joe_store", "tony_store", "danou_store"]
//items you can buy at the store; value is the price in gold
export const ryan_store = {
    "sword": 3,
    "taco": 4,
    "apple": 5,
    "steel-platemail": 6,
    "light-chainmail": 4,
    "hp-pot": 15,
}

export const abdi_store = {
    "cake": 4,
    "taco": 3,
    "hand-axe": 5,
    "pizza": 4,
    "nice-sword": 5,
    "leather-armor": 7,
    "dex-pot": 10,
    "str-pot": 10
}

export const tony_store = {
    
}

export const danou_store = {
    
}

export const joe_store = {
    
}

//[Damage, Crit Chance, Chance to Hit]
export const weapons = {
    "knife": [3, .6, .8],
    "dagger": [5, .8, .9],
    "bayonet": [8, 1, 1.1],
    "machete": [11, 1.5, 1.6],
    "cutlass": [15, 1.8, 2],

    "sword": [5, .8, .9],
    "nice-sword": [7, 1, 1.05],
    "longsword": [10, 1.2, 1.15],
    "rapier": [15, 1.25, 1.2],
    "scimitar": [22, 1.3, 1.4],

    "hammer": [5, .8, 1.1],
    "hand-axe": [6, 1.2, .9],
    "battle-axe": [9, 1.2, .9],
    "vaal-axe": [25, 1.1, 1],
    "atziri-disfavour": [34, 1, 1],

    // "endgame" weapons
    "undisputed-best-axe": [45, .9, .9], // super high damage, less crit and hit chance
    "mehrunes-razor": [23, 2.5, 2.5], // super high crit and chance to hit, less damage
    "excalibur": [32, 1.5, 1.6], // all around good
}

//name & armor value
export const armorPieces = {
    "": 0,

    "clothes": 4,
    "leather-armor": 8,
    "dragon-hide": 12,
    
    "light-chainmail": 7,
    "heavy-chainmail": 11,
    "golden-chainmail": 17,

    "steel-platemail": 10,
    "rune-platemail": 17,
    "brass-dome": 25,
}

//[weak to, neutral, strong against]
export const armorWeakness = {
    "": ["heavy","medium","light"],

    "clothes":        ["heavy","medium","light"],
    "leather-armor":  ["heavy","medium","light"],
    "dragon-hide":    ["heavy","medium","light"],
    
    "light-chainmail": ["light","heavy","medium"],
    "heavy-chainmail": ["light","heavy","medium"],
    "golden-chainmail":["light","heavy","medium"],

    "steel-platemail":["medium","light","heavy"],
    "rune-platemail":     ["medium","light","heavy"],
    "brass-dome":     ["medium","light","heavy"],
}

//how much they increase corosponding stat
export const potions = {
    "dex-pot": 5,
    "str-pot": 2,
    "hp-pot": 4,
    "armor-pot": 2 // maybe?
}

//[HP Heal, Stat to Increase, Amount to Increase]
export const food = {
    "pizza": [10, "strength", 5],
    "cake": [7, "strength", 7],
    "forbidden-fruit": [25, "strength", 20],

    "taco": [5, "dex", 6],
    "gingerbread": [8, "dex", 4],
    "skooma": [12, "dex", 10],
    
    "mushroom": [6, "hp", 9],
    "apple": [8, "hp", 5],
}

////TODO: BUFF flat enemy dmg, nerf range of chance-based damage. like extra crit dmg, dmgBasedOnType, & weakness dmg
////      The enemies should have a smaller range of damage, 
//             EX: right now a rat can do 0 dmg or 20 dmg. the rat should do 7-10 dmg every hit
//only allow TROOM & hidden room enemies to be killed once. too easy to farm for gold
//[Damage, Crit Chance, Chance to Hit, HP, gold drop]
export const enemies = {
    //generic enemies
    "rat":    [8, .3, .7, 20, 3],
    "bird":   [5, .2, .75, 6, 1],
    "slime":  [],

    //ninjas
    "ninja":  [10, .4, .95, 20, 11],
    "gold-ninja": [],
    "challenger-ninja":[],
    "zed": [],
    
    //desert
    "mummy1": [3, .15, .5, 8, 5],
    "mummy2": [5, .25, .6, 13, 7],
    "mummy3": [8, .35, .7, 18, 9],
    "mummy4": [10, .45, .8, 23, 11],
    "mummy5": [13, .6, .9, 29, 13],
    "zombie": [6, .2, .65, 30, 4],
    "bat":    [4, .4, .85, 10, 2],
    "ghost":  [3, .65, .9, 8, 2],
    "spirit": [3, .2, .6, 6, 35], // hidden room enemy
    "izaro":  [11, .4, .8, 35, 15], // desert troom boss
    "argus":  [15, .45, .7, 50, 25], // desert boss
    
    //woods
    "monkey":  [6, .35, .85, 20, 4],
    "snake":   [10, .5, .9, 13, 5],
    "boar":    [11, .25, .75, 25, 6],
    "rhoa":    [11, .35, .85, 30, 8],
    "tiger":   [14, .4, .85, 40, 13],
    "shrek":   [17, .4, .85, 50, 30], //mini-boss
    "deer-god":[20, .25, .8, 100, 40], //boss
}

export const enemyDrops = {
    //generic
    "rat":    ["taco"],
    "bird":   [],
    "slime":  [],
    
    //ninjas
    "ninja":  ["leather-armor"],

    //desert
    "mummy1": [],
    "mummy2": [],
    "mummy3": ["leather-armor"],
    "mummy4": ["bayonet"],
    "mummy5": ["cake", "longsword"],
    "zombie": ["sword"],
    "bat":    [],
    "ghost":  ["clothes"],
    "spirit": ["steel-platemail"], // hidden room enemy
    "izaro":  ["heavy-chainmail"], // desert troom boss
    "argus":  ["skooma"], // desert boss
    
    //woods
    "monkey":  [],
    "snake":   [],
    "boar":    [],
    "rhoa":    [],
    "tiger":   [],
    "shrek":   [], //mini-boss
    "deer-god":[], //boss
}

//the first element will be chosen 60% of the time. the 2nd and 3rd are both 15%
//[0.6, 0.15, 0.15] //attackTypeWeights
export const enemyDmgType = {
    //generic
    "rat": ["medium","heavy","light"],
    "bird": ["light","medium","heavy"],
    "slime": ["light","medium","heavy"],

    //ninja
    "ninja": ["medium","heavy","light"],

    //desert
    "mummy1": ["heavy","medium","light"],
    "mummy2": ["medium","light","heavy"],
    "mummy3": ["light","medium","heavy"],
    "mummy4": ["heavy","medium","light"],
    "mummy5": ["medium","heavy","light"],
    "zombie": ["medium","heavy","light"],
    "bat": ["light","medium","heavy"],
    "ghost": ["light","medium","heavy"],
    "spirit": ["light","medium","heavy"], // hidden room enemy
    "izaro": ["heavy","medium","light"], // desert troom boss
    "argus": ["medium","heavy","light"], // desert boss

    //woods
    "monkey":  [],
    "snake":   [],
    "boar":    [],
    "rhoa":    [],
    "tiger":   [],
    "shrek":   [], //mini-boss
    "deer-god":[], //boss
}

export const bosses = ["argus", "deer-god", "", "", ""]

export const enemiesLocation = {
    "town": ["rat"],
    "house": ["bird"],
    "ryan-store": [],
    
    ////////DESERT//////
    "desert": ["zombie"],
    //pyramid
    "pyramid": ["bat"],
    "dark-hall": ["ghost", "rat"],
    "abdi-store": [],
    "stair-a": ["rat"],
    "dim-room": ["ghost", "bat"],
    "light-room": [],
    "stair-c": ["bat"],
    "gold-room": ["izaro"],
    "black-room": ["argus"],
    "dank-hall": [],
    "stair-b": ["bat"],
    "burial-chamber": ["rat"],
    "TDWL-room": ["zombie", "ghost"],
    "stair-d": [],
    "room-room": ["spirit"],
    //sandstorm
    "sandstorm":["ninja"],


    ////////WOODS//////
    "woods":["snake"],
    //path
    "path":[],
    "tree-house":[],
    "tony-store":[],
    "cave":[],
    "underground-sea":[],
    "lit-hall":[],
    "???room":[],
    "green-room":[],
    //beaten-path
    "beaten-path":[],
    "swamp":[],
    "darker-swamp":[],
    "shreks-place":[],
    "mud-pit":[],
    "jungle":[],
    "green-path":[],
    "cliff":[],
    "clearning":[],
}