export class Character{
    constructor(maxHp_input, strength_input, dex_input, armorStat_input, loc_input, inv_input, gold_input){
        this.maxHp = maxHp_input + Math.round(strength_input * .4) //the final health pool used after the strength stat has been added
        this.baseHP = this.maxHp //need this so i don't stack strength bonuses on top of eachother
        this.currentHP = this.maxHp //this will be how i track hp in battles, if you take damage, remove from here
        //beforeStrengthHP = hp #initial HP pool that will be added to with potions
        this.strength = strength_input //used for damage modifier and health

        this.totalCrit = .2 //chance to critically strike after everything has been factored in
        this.baseCrit = .2 //only modified by stat pots and temporary bosts

        this.dex = dex_input //used for dodging & chance to hit (+ 0.05% chanceToHit / 10 dex) added before weapons
                       //dodge is currently at 1% dodge chance / 1 dex (maybe nerf this)

        this.baseChanceToHit = Math.round(.7 + this.dex * .005, 2) //base % chance attack will hit, before weapon modifier
        this.totalChanceToHit = this.baseChanceToHit //chanceToHit after all modifiers

        this.armorStat = armorStat_input //damage reduction stat
        this.armorPiece = "" //what armor piece you are currently wearing
        this.armor = this.armorStat //store total value of armor for damage reductions

        this.weapon = "sword"
        
        this.location = loc_input
        this.inv = inv_input
        this.gold = gold_input
        //playing = true //remove since we are not using a game loop. its just a browser 
        //itemsInLocations = items //remove these because they are unnecessary if not using save files??
        //exits = exits
    }
}

export const helpMsg = "#### COMMANDS ####\n" +
                "  l:                (look)\n" +
                "  s:                (status)\n" +
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

export const items = {
    "house": ["pizza", "knife", "cake", "dex-pot", "clothes", "str-pot", "hp-pot"],
    "town": [],
    "ryan-store": ["sword"],

    //###DESERT###
    "desert": ["taco"],
    //#pyramid
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
    //#sandstorm
    "sandstorm":["hp-pot", "battle-axe"],


    //###WOODS###
    "woods":[],
    //#path
    "path":[],
    "tree-house":[],
    "tony-store":[],
    "cave":[],
    "underground-sea":[],
    "lit-hall":[],
    "???room":[],
    "green-room":[],
    //#beaten-path
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
    //#general areas
    "town": ["ryan-store", "house", "desert", "woods", "lake", "church"],
    "ryan-store": ["town"],
    "house": ["town"],

    //###DESERT###
    "desert": ["town", "pyramid", "sandstorm"],
    //#pyramid
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
    //#sandstorm
    "sandstorm": ["desert"],
    

    //###WOODS###
    "woods":["town", "path", "beaten-path"],
    //#path
    "path":["woods", "tree-house", "cave"],
    "tree-house":["path", "tony-store"],
    "tony-store":["tree-house"],
    "cave":["path", "underground-sea", "lit-hall"],
    "underground-sea":["cave"],
    "lit-hall":["cave", "???rooom"],
    "???room":["lit-hall"],
    "green-room":["???room"],
    //#beaten-path
    "beaten-path":["woods", "swamp", "mud-pit"],
    "swamp":["beaten-path", "darker-swamp"],
    "darker-swamp":["swamp", "shreks-place"],
    "shreks-place":["darker-swamp"],
    "mud-pit":["beaten-path", "jungle"],
    "jungle":["mud-pit", "green-path", "cliff"],
    "green-path":["jungle", "clearing"],
    "cliff":["jungle"],
    "clearning":["green-path"],


    //###LAKE###


    //###CHURCH###
}