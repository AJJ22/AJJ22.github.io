import random
import pickle

####################
###### DATA ########
locations = ["town", "house", "ryan-store",
             "desert", "abdi-store", "room-room", "pyramid", "sandstorm", "dark-hall", "dank-hall", "stair-a", "dim-room", "light-room", "black-room", "stair-c", "gold-room", "stair-b", "TDWL-room", "burial-chamber", "stair-d",
             "lake", "danou-store",
             "woods", "tony-store", "path", "tree-house", "cave", "underground-lake", "lit-hall", "???room", "green-room", "beaten-path", "swamp", "darker-swamp", "shreks-place", "mud-pit", "jungle", "green-path", "cliff", "clearing",
             "church", "joe-store",]
exits = {
    #general areas
    "town": ["ryan-store", "house", "desert", "woods", "lake", "church"],
    "ryan-store": ["town"],
    "house": ["town"],

    ###DESERT###
    "desert": ["town", "pyramid", "sandstorm"],
    #pyramid
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
    #sandstorm
    "sandstorm": ["desert"],
    

    ###WOODS###
    "woods":["town", "path", "beaten-path"],
    #path
    "path":["woods", "tree-house", "cave"],
    "tree-house":["path", "tony-store"],
    "tony-store":["tree-house"],
    "cave":["path", "underground-sea", "lit-hall"],
    "underground-sea":["cave"],
    "lit-hall":["cave", "???rooom"],
    "???room":["lit-hall"],
    "green-room":["???room"],
    #beaten-path
    "beaten-path":["woods", "swamp", "mud-pit"],
    "swamp":["beaten-path", "darker-swamp"],
    "darker-swamp":["swamp", "shreks-place"],
    "shreks-place":["darker-swamp"],
    "mud-pit":["beaten-path", "jungle"],
    "jungle":["mud-pit", "green-path", "cliff"],
    "green-path":["jungle", "clearing"],
    "cliff":["jungle"],
    "clearning":["green-path"],


    ###LAKE###


    ###CHURCH###
}

# secret roooms to be unlocked with a key
rooms = {
    #location: [location that is unlocked, key required to unlock]
    "stair-d": ["room-room", "brown-key", False],
    "???rooom": ["green-room", "green-key", False],
}

#items laying around that you can take for free
items = {
    "house": ["pizza", "knife", "cake", "dex-pot", "clothes", "str-pot", "hp-pot"],
    "town": [],
    "ryan-store": ["sword"],

    ###DESERT###
    "desert": ["taco"],
    #pyramid
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
    #sandstorm
    "sandstorm":["hp-pot", "battle-axe"],


    ###WOODS###
    "woods":[],
    #path
    "path":[],
    "tree-house":[],
    "tony-store":[],
    "cave":[],
    "underground-sea":[],
    "lit-hall":[],
    "???room":[],
    "green-room":[],
    #beaten-path
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

itemSellValue = {
    ### WEAPONS VALUE ###
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


    ### ARMOR VALUE ###
    "clothes": 2,
    "leather-armor": 6,
    "dragon-hide": 15,

    "light-chainmail": 2,
    "heavy-chainmail": 6,
    "golden-chainmail": 16,
    
    "steel-platemail": 4,
    "rune-platemail": 8,
    "brass-dome": 17,


    ### FOOD VALUE ###
    "pizza": 2,
    "taco": 3,
    "cake": 3,
    "forbidden-fruit": 15,
    "gingerbread": 6,
    "skooma": 8,
    "mushroom": 9,
    "apple": 4,
    

    ### POT VALUES ###
    "armor-pot": 8,
    "str-pot": 9,
    "dex-pot": 9,
    "hp-pot": 12,


    ### KEYS ###
    "brown-key": 7,
    "green-key": 8,
}

listOfStores = ["abdi-store", "ryan-store", "joe_store", "tony_store", "danou_store"]
#items you can buy at the store; value is the price in gold
ryan_store = {
    "sword": 3,
    "taco": 4,
    "apple": 5,
    "steel-platemail": 6,
    "light-chainmail": 4,
    "hp-pot": 15,
}

abdi_store = {
    "cake": 4,
    "taco": 3,
    "hand-axe": 5,
    "pizza": 4,
    "nice-sword": 5,
    "leather-armor": 7,
    "dex-pot": 10,
    "str-pot": 10
}

tony_store = {
    
}

danou_store = {
    
}

joe_store = {
    
}

#[Damage, Crit Chance, Chance to Hit]
weapons = {
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

    # "endgame" weapons
    "undisputed-best-axe": [45, .9, .9], # super high damage, less crit and hit chance
    "mehrunes-razor": [23, 2.5, 2.5], # super high crit and chance to hit, less damage
    "excalibur": [32, 1.5, 1.6], # all around good
}

#name & armor value
armorPieces = {
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

#[weak to, neutral, strong against]
armorWeakness = {
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

#how much they increase corosponding stat
potions = {
    "dex-pot": 1,
    "str-pot": 2,
    "hp-pot": 4,
    "armor-pot": 2 # maybe?
}

#[HP Heal, Stat to Increase, Amount to Increase]
food = {
    "pizza": [10, "strength", 5],
    "cake": [7, "strength", 7],
    "forbidden-fruit": [25, "strength", 20],

    "taco": [5, "dex", 6],
    "gingerbread": [8, "dex", 4],
    "skooma": [12, "dex", 10],
    
    "mushroom": [6, "hp", 9],
    "apple": [8, "hp", 5],
}

####TODO: BUFF flat enemy dmg, nerf range of chance-based damage. like extra crit dmg, dmgBasedOnType, & weakness dmg
####      The enemies should have a smaller range of damage, 
#             EX: right now a rat can do 0 dmg or 20 dmg. the rat should do 7-10 dmg every hit
#only allow TROOM & hidden room enemies to be killed once. too easy to farm for gold
#[Damage, Crit Chance, Chance to Hit, HP, gold drop]
enemies = {
    #generic enemies
    "rat":    [8, .3, .7, 20, 3],
    "bird":   [5, .2, .75, 6, 1],
    "slime":  [],

    #ninjas
    "ninja":  [10, .4, .95, 20, 11],
    "gold-ninja": [],
    "challenger-ninja":[],
    "zed": [],
    
    #desert
    "mummy1": [3, .15, .5, 8, 5],
    "mummy2": [5, .25, .6, 13, 7],
    "mummy3": [8, .35, .7, 18, 9],
    "mummy4": [10, .45, .8, 23, 11],
    "mummy5": [13, .6, .9, 29, 13],
    "zombie": [6, .2, .65, 30, 4],
    "bat":    [4, .4, .85, 10, 2],
    "ghost":  [3, .65, .9, 8, 2],
    "spirit": [3, .2, .6, 6, 35], # hidden room enemy
    "izaro":  [11, .4, .8, 35, 15], # desert troom boss
    "argus":  [15, .45, .7, 50, 25], # desert boss
    
    #woods
    "monkey":  [6, .35, .85, 20, 4],
    "snake":   [10, .5, .9, 13, 5],
    "boar":    [11, .25, .75, 25, 6],
    "rhoa":    [11, .35, .85, 30, 8],
    "tiger":   [14, .4, .85, 40, 13],
    "shrek":   [17, .4, .85, 50, 30], #mini-boss
    "deer-god":[20, .25, .8, 100, 40], #boss
}

enemyDrops = {
    #generic
    "rat":    ["taco"],
    "bird":   [],
    "slime":  [],
    
    #ninjas
    "ninja":  ["leather-armor"],

    #desert
    "mummy1": [],
    "mummy2": [],
    "mummy3": ["leather-armor"],
    "mummy4": ["bayonet"],
    "mummy5": ["cake", "longsword"],
    "zombie": ["sword"],
    "bat":    [],
    "ghost":  ["clothes"],
    "spirit": ["steel-platemail"], # hidden room enemy
    "izaro":  ["heavy-chainmail"], # desert troom boss
    "argus":  ["skooma"], # desert boss
    
    #woods
    "monkey":  [],
    "snake":   [],
    "boar":    [],
    "rhoa":    [],
    "tiger":   [],
    "shrek":   [], #mini-boss
    "deer-god":[], #boss
}

#the first element will be chosen 60% of the time. the 2nd and 3rd are both 15%
#[0.6, 0.15, 0.15] //attackTypeWeights
enemyDmgType = {
    #generic
    "rat": ["medium","heavy","light"],
    "bird": ["light","medium","heavy"],
    "slime": ["light","medium","heavy"],

    #ninja
    "ninja": ["medium","heavy","light"],

    #desert
    "mummy1": ["heavy","medium","light"],
    "mummy2": ["medium","light","heavy"],
    "mummy3": ["light","medium","heavy"],
    "mummy4": ["heavy","medium","light"],
    "mummy5": ["medium","heavy","light"],
    "zombie": ["medium","heavy","light"],
    "bat": ["light","medium","heavy"],
    "ghost": ["light","medium","heavy"],
    "spirit": ["light","medium","heavy"], # hidden room enemy
    "izaro": ["heavy","medium","light"], # desert troom boss
    "argus": ["medium","heavy","light"], # desert boss

    #woods
    "monkey":  [],
    "snake":   [],
    "boar":    [],
    "rhoa":    [],
    "tiger":   [],
    "shrek":   [], #mini-boss
    "deer-god":[], #boss
}

bosses = ["argus", "deer-god", "", "", ""]

enemiesLocation = {
    "town": ["rat"],
    "house": ["bird"],
    "ryan-store": [],
    
    ###DESERT###
    "desert": ["zombie"],
    #pyramid
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
    #sandstorm
    "sandstorm":["ninja"],


    ###WOODS###
    "woods":["snake"],
    #path
    "path":[],
    "tree-house":[],
    "tony-store":[],
    "cave":[],
    "underground-sea":[],
    "lit-hall":[],
    "???room":[],
    "green-room":[],
    #beaten-path
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

####### DATA #######
####################






##### CRITICAL STRIKE CHANCE
# modified by weapon crit chance only

##### CHANCE TO HIT
# modified by weapon chance to hit (weapon chanceToHit * base chanceToHit)
# and dexterity (0.05% / 10 dex)

##### HP
# modified by stat pots (2 HP / pot)
# and strength (4 HP / 10 strength)

#### ARMOR
# modified by armorPiece only
# maybe by pots, do not currently have armor pots available. have code to support them

#######################################
######## CHARACTER / FUNCTIONS ########
class Character:
    def __init__(self, maxHp, strength, dex, armorStat, loc, inv, gold, items, rooms, exits):
        self.maxHp = maxHp + round(strength * .4) #the final help pool used after the strength stat has been added
        self.baseHP = maxHp #need this so i don't stack strength bonuses on top of eachother
        self.currentHP = maxHp + round(strength * .4) #this will be how i track hp in battles, if you take damage, remove from here
        #self.beforeStrengthHP = hp #initial HP pool that will be added to with potions
        self.strength = strength #used for damage modifier and health

        self.totalCrit = .2 #chance to critically strike after everything has been factored in
        self.baseCrit = .2 #only modified by stat pots and temporary bosts

        self.dex = dex #used for dodging & chance to hit (+ 0.05% chanceToHit / 10 dex) added before weapons
                       #dodge is currently at 1% dodge chance / 1 dex (maybe nerf this)

        self.baseChanceToHit = round(.7 + dex * .005, 2) #base % chance attack will hit, before weapon modifier
        self.totalChanceToHit = self.baseChanceToHit #chanceToHit after all modifiers

        self.armorStat = armorStat #damage reduction stat
        self.armorPiece = "" #what armor piece you are currently wearing
        self.armor = self.armorStat #store total value of armor for damage reductions

        self.weapon = "sword" #what weapon you currently have equiped
        
        self.location = loc #where you currently are
        self.inv = inv #what the player is carrying
        self.gold = gold #duh
        self.playing = True
        self.itemsInLocations = items
        self.secretRooms = rooms
        self.exits = exits

    #when you change something that affects a stat, these should be used
    #such as changing weapons/armor or increasing strength/dexterity/hp with pots
    def updateArmor(self):
        self.armor = self.armorStat + armorPieces[self.armorPiece]

    def updateHP(self):
        self.maxHp = self.baseHP + round(self.strength * .4)
    
    def updateChanceToHit(self):
        #print("updateChanceToHit weapon: ", self.weapon)
        if self.weapon != "":
            self.totalChanceToHit = round(self.baseChanceToHit * weapons[self.weapon][2], 2)
        else:
            self.totalChanceToHit = self.baseChanceToHit
    
    def updateCritChance(self):
        #print("updateCritChance weapon: ", self.weapon)
        if self.weapon != "":
            self.totalCrit = round(self.baseCrit * weapons[self.weapon][1], 2)
        else:
            self.totalCrit = self.baseCrit

    #eating will restore HP
    #possibly grant temporary stat buffs
    def eat(self, item):
        #for now, only restoring health.
        if item in food:
            if item in self.inv:
                if self.currentHP < self.maxHp:
                    if self.currentHP + food[item][0] > self.maxHp:
                        print("Regained", self.maxHp - self.currentHP, "health")
                        self.currentHP += (self.maxHp - self.currentHP)
                    else:
                        self.currentHP += food[item][0]
                        print("Regained", food[item][0], "health")
                    self.inv.remove(item)
                else:
                    print("Already at maximum HP")
            else:
                print("Don't have that item")
        else:
            print("Can't eat that!")

    #drinking potions will increase the corosponding stat
    #BUG: drink STR-POT fully restores HP
    def drink(self, pot):
        if pot in self.inv:
            if pot == "dex-pot":
                self.dex += potions[pot]
                self.baseChanceToHit = round(.7 + self.dex * .005, 2)
                self.updateChanceToHit()
            elif pot == "str-pot":
                self.strength += potions[pot]
                self.updateHP()
                self.currentHP = self.baseHP + round(self.strength * .4)
            elif pot == "hp-pot":
                self.baseHP += potions[pot]
                self.updateHP()
                self.currentHP += potions[pot]
            elif pot == "armor-pot":
                self.armorStat += potions[pot]
                self.armor = self.armorStat
            else:
                print("Not a potion")
                return 0
            self.inv.remove(pot)
            print(pot,"drank")
        else:
            print("Don't have that")

    def move(self, loc):
        if loc in exits[self.location] and loc in locations:
            if loc == "sandstorm":
                self.currentHP -= 10
                print("You take 10 damage as you pass through the whirling sand")
            self.location = loc
            print("moved to:", loc)
        else:
            print("Can't move there")

    def drop(self, item):
        if item in self.inv:
            self.inv.remove(item)
            items[self.location].append(item)
            print(item, "dropped")
        else:
            print("Cannot drop that!")
            
    def help(self):
        print("#### COMMANDS ####")
        print("  l:                (look)")
        print("  s:                (status)")
        print("  inv               (show inventory)")
        print("  buy / sell        (when in store)")
        print("  open-coffin       (where applicable)")
        print("  unlock            (when near hidden room)")
        print("  rest              (when in house)")
        print("  jump              (where applicable)")
        print()
        print("  mv    <location>: (move)")
        print("  t     <item>:     (take)")
        print("  d     <item>:     (drop)")
        print("  e     <item>:     (equip)")
        print("  a     <enemy>:    (attack)")
        print("  eat   <food>")
        print("  drink <potion>")
        print()
        print("  save")
        print("  quit")

    def inventory(self):
        print("Inventory:",self.inv)
        print("Gold:",self.gold)

    def status(self):
        print("HP:", self.currentHP,"/",self.maxHp)
        print("Strength:", self.strength)
        print("Dexterity:",self.dex)
        print("Armor:",self.armor)
        print("Crit Chance:",self.totalCrit)
        print("Chance to Hit:",self.totalChanceToHit)
        print("Weapon Equiped:",self.weapon)
        print("Armor Equiped:",self.armorPiece)

    def look(self):
        print ("Currently in:",self.location)
        print ("Takeable Items:",items[self.location])
        print ("Places to go:",exits[self.location])
        if len(enemiesLocation[self.location]) > 0:
            print("Enemies to Fight:")
            for enemyName in enemiesLocation[self.location]:
                print("    {:6} - Damage: {} {:13} HP: {}".format(enemyName, enemies[enemyName][0], "\n", enemies[enemyName][3]))

    def take(self, item):
        if item in items[self.location]:
            self.inv.append(item)
            items[self.location].remove(item)
            print(item, "taken")
        else:
            print("Can't take that")

    def equip(self, item):
        if item in self.inv and item in weapons:
            if self.weapon != "":
                self.inv.append(self.weapon)
            self.weapon = item
            self.inv.remove(item)
            self.updateCritChance()
            self.updateChanceToHit()
            print(item,"equiped")
        
        elif item in self.inv and item in armorPieces:
            if self.armorPiece != "":
                self.inv.append(self.armorPiece)
            self.armorPiece = item
            self.inv.remove(item)
            self.updateArmor()
            print(item,"equiped")
        else:
            print("Can't equip that")

    def buy(self):
        storeName = self.location
        print("You are in", storeName+". Here are the items available for purchase:")
        storeName=storeName.split("-")
        items = eval(storeName[0] + "_" + storeName[1])
        for pair in items:
            print(pair+":", items[pair])

        item = input("What would you like to buy? ")
        while item != "":
            if item in items:
                if self.gold >= items[item]:
                    self.inv.append(item)
                    self.gold -= items[item]
                    print("You have",self.gold,"gold left")
                else:
                    print("Get outta here! You ain't got enough money, foo")
            else:
                print("We don't carry that item, but we can order it for you (;")
            item = input("What would you like to buy? ")
    

    def sell(self):
        if self.location in listOfStores:
            item = input("What would you like to sell? ")
            while item != "":
                if item in self.inv:
                    self.inv.remove(item)
                    self.gold += itemSellValue[item]
                    print("You gained", itemSellValue[item], "gold! Total:", self.gold)
                else:
                    print("You don't have that item!")
                item = input("What would you like to sell? ")

    #if you are in a room with a hidden room requiring a key, unlock it with this
    def unlockRoom(self, exits):
        if self.location in self.secretRooms:
            if self.secretRooms[self.location][2] == False:
                if self.secretRooms[self.location][1] in self.inv:
                    print("Room unlocked!")
                    exits[self.location].append(self.secretRooms[self.location][0])
                    self.secretRooms[self.location][2] = True
                else:
                    print("Do not have the required key")
            else:
                print("This room has already been unlocked")
        else:
            print("Cannot unlock anything here")

    def rest(self):
        if self.location == "house":
            self.currentHP = self.maxHp
            print("Feeling much better!")
        else:
            print("Can only rest at home!")
    
    # randomly choose mummy enemy from list and fight it
    def openCoffin(self):
        if self.location == "burial-chamber":
            coffinMummies = ["mummy1","mummy2","mummy3","mummy4","mummy5"]
            mummy = random.choice(coffinMummies)
            
            #print(mummy)
            #print(enemies[mummy])
            
            enemiesLocation[self.location].append(mummy)
            self.attack(mummy)
            enemiesLocation[self.location].remove(mummy)

            if 10 >= random.randint(0, 100):
                #award key
                self.inv.append("brown-key")
                print("The Brown Key has been added to your inventory! Go find the secret it unlocks!")
        else:
            print("Nothing to open here")

    def jump(self):
        if self.location == "cliff":
            self.currentHP = 1
            self.location = "woods"
            self.inv.append("green-key")
            print("Fell to \"woods\"")
            print("You barely survive the fall, but get a secret key for your bravery!")
        else:
            print("Nowhere to jump")

    def addTownToExits(self):
        exits[self.location].append("town")
        print("You can now travel back to \"town\" from this location")
        return

    #remove enemy from map after it is defeated
    def removeBoss(self, enemy):
        enemiesLocation[self.location].remove(enemy)
       
    #when the player kills an enemy, give any items and gold the enemy had to the player
    def reward(self, enemy):
        self.gold += enemies[enemy][4]
        self.inv += [drop for drop in enemyDrops[enemy]]



    ####DO THIS INSTEAD (for attack strengths)
    #   each armor will have a base armor rating - flat damge reduction
    #   + an attack type it is strong against and weak against, third will have no modifier
    #   EX: steel-platemail:
    #           14 armor rating
    #           heavy attacks deal 50% damage
    #           medium attacks deal 100% damage
    #           light attacks deal 150% damage
    #
    #   Enemies weaknesses will be randomized each fight


    ### ATTACK LIST 1
    # would be nice to have a range of damage: + or - 20% of final damage is random (80-120%)
    #####SCRAP THIS - need to add in attack speed based on the attack strength lv chosen for that turn
                        ##instead of this, i can give the opponent's next turn buffs/debuffs
                        #### <UNIT A> USES LIGHT ATTACK - <UNIT B> takes increased damage on <UNIT A>'s next hit, and <UNIT B> does less damage on their next hit
                        #### <UNIT A> USES HEAVY ATTACK - <UNIT B> gets 100% hit chance and crit buffed to 250% for their next hit

    #attacks will be based off of a base weapon damamge stat
    #the damage will then be modified by your strength stat
    #each attack will have a chance to critically strike
    #you can further choose a light, medium, or heavy attack
        #light: you will be able to attack twice before the enemy attacks once (also deal reduced damage (60% of normal), and have less hit chance (70% of normal))
        #medium: average attack, no speed, damage, crit, or hit chance modifiers
        #heavy: higher base damage (200% of normal), higher crit chance (120% of normal), higher chance to hit (130% of normal), but enemy can attack twice before your next attack
    def attack(self, enemy):
        if enemy not in enemiesLocation[self.location]:
            print("No such enemy!")
            return
        if self.weapon == "":
            print("Please equip a weapon")
            return
        #enemies[Damage, Crit Chance, Chance to Hit, HP, gold drop]
        enemyHP = enemies[enemy][3]
        enemyDmg = enemies[enemy][0]
        playerTurn = True

        enemyWeakness = ["light", "medium", "heavy"]
        random.shuffle(enemyWeakness)

        while enemyHP and self.currentHP > 0:
            if playerTurn: #players turn
                print()
                type = input("Choose an attack strength (light, medium, heavy): ")
                if type == "light" or type == "medium" or type == "heavy":
                    enemyHP -= self.calculateDamage(weapons[self.weapon][0], type, playerTurn, enemy, enemyHP, enemyWeakness)
                else:
                    print("Lost your turn! (^:")

            else: #enemy's turn
                #randomly choose attack strength
                self.currentHP -= self.calculateDamage(enemyDmg, random.choices(enemyDmgType[enemy], [.6, .15, .15])[0], playerTurn, enemy, enemyHP, armorWeakness[self.armorPiece])

            # check if player or enemy is dead
            if enemyHP <= 0:
                self.reward(enemy)
                print("You have vanquished the enemy! Congratulations!")
                if enemy in bosses:
                    self.addTownToExits()
                    self.removeBoss(enemy)
                return True
            elif self.currentHP <= 0:
                print("\nYou have died! Oh no!")
                return False

            #change to other person's turn
            playerTurn = not playerTurn

    #calculate final damage for this attack
    def calculateDamage(self, base, type, playerTurn, enemy, enemyHP, weakness):
        #these wil be changed based on what attack strength the current person used
        #####[increase dmg taken, reduce dmg given, accuracy, crit]
        # Heavy: opponent gets 100% accuracy & 250% increased crit
        # light: opponent takes 130% increased damage for your next hit & opponent deals 80% damage on their next hit
        
        #if the attack misses, return 0 damage
        if self.hit(type, playerTurn, enemy) == False:
            if playerTurn:
                print("Player("+ str(self.currentHP) +"): MISS")
            else:
                print(enemy+"("+ str(enemyHP) +"): MISS")
            return 0

        #damage multi based on attack type
        increasedDmgBasedOnType = {
            "heavy": 1.3,
            "medium": 1,
            "light": .8
        }

        #calculate multiplier for: weakness to attack type
        #if enemy is weak to light attack and this attack is light, 1.4 dmg boost
        ind = weakness.index(type)
        # if player is not wearing armor, weak to all attack types
        if not playerTurn and self.armorPiece == "":
            weakMult = [1.55, 1.55, 1.55]
        else:
            weakMult = [1.55, 1, .6]
        weaknessMultiplier = weakMult[ind]

        #add crit onto damage before returning final number
        if playerTurn:
            final = round(weaknessMultiplier * self.crit(base * increasedDmgBasedOnType[type], playerTurn, enemy, type, enemyHP))
            print("Player("+ str(self.currentHP) +"):", final, "damage was delt")
        else: # enemy turn
            final = round(weaknessMultiplier * self.crit(enemies[enemy][0] * increasedDmgBasedOnType[type], playerTurn, enemy, type, enemyHP) - self.armor)
            if final < 1:
                final = 1
            print(enemy+"("+ str(enemyHP) +"):", final, "damage was delt")
            
        return final
    
    #add in the critical strike damage
    #return new total damage (int) after crit
    def crit(self, base, playerTurn, enemy, type, enemyHP):
        critChanceBasedOnType = {
            "heavy": 1.15,
            "medium": 1,
            "light": .85
        }

        if playerTurn:
            if self.totalCrit*critChanceBasedOnType[type]*100 >= random.randint(0, 100):
                #add crit damage to attack
                print("Player("+ str(self.currentHP) +"): It's super effective!")
                return base * 1.75
        else: # enemy turn
            if enemies[enemy][1]*critChanceBasedOnType[type]*100 > random.randint(0, 100):
                print(enemy+"("+ str(enemyHP) +"): Scored a crit on you!")
                return base * 1.75
        
        return base

    #calculate if hit or miss
    # player can increase their dodge chance by increasing dex
    #   currently at 1% dodge chance / 1 dex (maybe think about reducing this to 1% / 2 dex)
    def hit(self, type, playerTurn, enemy):
        ###### CHANCE TO HIT MODIFIERS - based on attack strength
        # heavy: 120%
        # medium: 100%
        # light: 80%
        hitChanceBasedOnAttackStr = {
            "heavy": .75,
            "medium": 1,
            "light": 1.25
        }
        if playerTurn:
            hitChanceForCurrentAttack = self.totalChanceToHit * hitChanceBasedOnAttackStr[type]
            #print("player HIT CHANCE: ", hitChanceForCurrentAttack)
        else: # enemy turn
            hitChanceForCurrentAttack = enemies[enemy][2] * (1 - (.01*self.dex)) * hitChanceBasedOnAttackStr[type]
            #print("enemy HIT CHANCE: ", hitChanceForCurrentAttack)
        return hitChanceForCurrentAttack * 100 >= random.randint(0, 100)

####### CHARACTER / FUNCTIONS ########
######################################


def save(player, items, exits):
    player.itemsInLocations = items
    player.exits = exits
    file = input("What file would you like to save to? ")
    with open("saved_games/" + file, 'wb') as player_file:
        pickle.dump(player, player_file)
    print("Saved to '" + file + "'")

def load():
    file = input("What file would you like to load? ")
    with open("saved_games/" + file, "rb") as player_file:
        player = pickle.load(player_file)

    print("Loaded from '"+ file + "'")
    return player



##########################
######### SETUP ##########

if input("Would you like to load a saved game? ") != "yes":
                      #HP, strength, dex, armour, location, inventory, gold, itemsOnGround
    player = Character(30, 10,       10,  5,      "town",  [],        10,    items, rooms, exits)
    player.updateChanceToHit()
    player.updateCritChance()
    player.updateArmor()
    player.updateHP()

else:
    player = load()
    items = player.itemsInLocations
    exits = player.exits

print("\nThere is a special key in each dungeon that opens a hidden room. \nEach hidden room contains valuable loot, but you must find the room and its key yourself.\n")

#driver
while player.playing:
    cmd = input(">>>")

    if cmd == "l":
        player.look()
    elif cmd=="inv":
        player.inventory()
    elif cmd=="s":
        player.status()
    elif cmd=="buy" and player.location in listOfStores:
        player.buy()
    elif cmd=="sell" and player.location in listOfStores:
        player.sell()
    elif cmd=="unlock":
        player.unlockRoom(exits)
    elif cmd=="rest":
        player.rest()
    elif cmd=="open-coffin":
        player.openCoffin()
    elif cmd=="save":
        save(player, items, exits)
    elif cmd=="help":
        player.help()
    elif cmd=="quit":
        if input("Would you like to save the game? ") == "yes":
            save()
        break

    else:
        if len(cmd.split()) < 2:
            print("Please try again! (^:")
        else:
            cmd=cmd.split()
            if cmd[0]==("mv"):
                player.move(cmd[1])
            elif cmd[0]==("t"):
                player.take(cmd[1])
            elif cmd[0]==("drink"):
                player.drink(cmd[1])
            elif cmd[0]==("d"):
                player.drop(cmd[1])
            elif cmd[0]==("eat"):
                player.eat(cmd[1])
            elif cmd[0]=="e":
                player.equip(cmd[1])
            elif cmd[0]==("a"):
                if player.attack(cmd[1]) == False:
                    break
    if player.currentHP <= 0:
        break
    print()
print("Thank you for playing! Have a wonderful day (^:")
