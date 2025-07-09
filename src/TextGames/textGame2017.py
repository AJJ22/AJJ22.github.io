#put limits on how long you an work
#so you can't just work 500 seconds
#at start and be done with it
#DONT MAKE THEM WAIT, SHOULD TAKE AWAY HP

#make armour slot, or other gear slot

#attack error handling // think i fixed this by putting the if blocks into the try

#create hit and miss and crits
#add examine feature for enemies

#add dog names Monte, make him drop no exalts
#add Abdi to walmart, weapon is calves, drops lag-switch

#save functionality

#make stat command [hp, weapon, weapon damage]

import time
import random
import math

locations = {"bar": ["A bunch of drunk people"],
             "walmart": ["Save money. Live better."],
             "house": ["Home sweet home"],
             "job": ["Work..."],
             "woods": ["Spooky"],
             "swamp": ["Eerie place with lots of fog. Something bad is here."]}

exits = {"bar": ["house", "woods", "job"],
         "walmart": ["house"],
         "house": ["bar", "woods", "walmart"],
         "job": ["bar"],
         "woods": ["house", "swamp"],
         "swamp": [""]}

items = {"bar": ["glass", "broom", "stick"],
         "walmart": ["twinkie"],
         "house": ["pizza", "cake", "apple"],
         "job": ["knife", "laptop"],
         "woods": ["sword"],
         "swamp": ["dead-cat", "broken-guitar", "car-tire"]}

food = {"bread": 2,
        "twinkie": 3,
        "cheerios": 3,
        "chips": 2,
        "pizza": 4,
        "cake": 4,
        "apple": 2,
        "bacon": 5,
        "expensive-milk": 4,
        "cookies": 3,
        "rat-meat": 3,
        "wolf-meat": 5}

weapons = {"knife": 3,
           "glass": 2,
           "gun": 8,
           "sword": 4,
           "broom": 1,
           "stick": 2,
           "machete": 5,
           "brass-knuckles": 6,
           "master-sword": 420,
           "exalt": 500}

#FORMAT FOR PURCHASES DICTIONARY
#purchases= {"location": {"item": price,
#                         "item": price},
#            "location": {"item": price,
#                         "item": price,
#                         "item": price,
#                         "item": price},
#            "location": {"item": price,
#                         "item": price}}

purchases = {"bar": {"beer": .59,
                     "vodka": 1.75,
                     "rum": 1.2,
                     "love": 2000.0},
             
             "walmart": {"expensive-milk": .75,
                               "bacon": .99,
                               "cookies": .59,
                               "gun": 24.99,
                               "chips": 1.25,
                               "cheerios": 3.49,
                               "bread": 1.99}}

drank = {"vodka": 3,
         "beer": 1,
         "rum": 2,
         "martini": 4,
         "turd": 150}

enemies = {"bar": ["drunk", "bartender", "ryan", "bouncer"],
           "woods": ["rat", "wolf", "big-boss"],
           "walmart": ["clerk", "manager", "customer"],
           "swamp": ["shrek", "donkey", "puss-in-boots", "dasuki"]}

enemyHP = {"drunk": 3,
           "bartender": 5,
           "ryan": 10,
           "bouncer": 6,
           "rat": 2,
           "wolf": 6,
           "big-boss": 13,
           "clerk": 4,
           "manager": 5,
           "customer": 3,
           "shrek": 1000,
           "donkey": 422,
           "dasuki": 850,
           "puss-in-boots": 842}

enemyDmg = {"drunk": 2,
           "bartender": 3,
            "ryan": 4,
           "bouncer": 4,
           "rat": 1,
           "wolf": 4,
           "big-boss": 7,
           "clerk": 3,
           "manager": 4,
           "customer": 3,
           "shrek": 60,
           "donkey": 35,
           "dasuki": 50,
           "puss-in-boots": 45}

enemyItems = {"drunk": ["beer", "rum", "knife", "$1"],
              "bartender": ["martini", "machete"],
              "ryan": ["camo-pants"],
              "bouncer": ["sunglasses", "protien-powder", "brass-knuckles", "$5"],
              "rat": ["rat-meat"],
              "wolf": ["wolf-meat"],
              "big-boss": ["master-sword", "$35"],
              "clerk": ["sponge", "$20"],
              "manager": ["clipboard", "ninja-headband", "$10"],
              "customer": ["shopping-bag", "cake", "bacon"],
              "shrek": ["love", "$1000"],
              "donkey": ["turd"],
              "dasuki": ["exalt", "cake"],
              "puss-in-boots": ["boots"]}

examine = {"love": "While holding love in your hands, speak the ancient words: \"i call upon the sacred power of love to destroy all evil in the world\", and evil shall never be seen again.",
           "glass": "To hold your twinkies while you eat your beer",
           "machete": "Ooh, big knife",
           "brass-knuckles": "This looks like it would hurt",
           "master-sword": "An ancient sword with weird engravings on the blade. Looks sharp.",
           "gun": "What kind of gun, I don't know. Why are you asking me?",
           "broom": "Whack...",
           "stick": "It's a stick. whatdoya what from me?",
           "twinkie": "I WANT MY TWINKIE",
           "pizza": "Nothing like a good ole pizza",
           "cake": "It's a lie",
           "apple": "The one that fell on Newton's head. You sure you want to eat this?",
           "knife": "Stabby stab",
           "laptop": "I could make a text game with this",
           "sword": "Oooh, shiny",
           "dead-cat": "please don't make me pick that up...",
           "broken-guitar": "You can try and play it",
           "car-tire": "You could throw it?",
           "bread": "If your Italian, you know what this means",
           "cheerios": "With a loooooong E",
           "chips": "America'a favroite pastime",
           "bacon": "America's other favroite pastime",
           "expensive-milk": "Why are you spending this much on milk?",
           "cookies": "Omm nom nom nom",
           "rat-meat": "Gross",
           "wolf-meat": "Slightly less gross",
           "vodka": "Grants a 3 health boost",
           "beer": "Grants a 1 health boost",
           "rum": "Grants a 2 health boost",
           "turd": "Grants a 150 health boost",
           "martini": "Grants a 4 health boost",
           "camo-pants": "Grants you invisibility for one fight"}

moneyDrop = {"$1": 1,
             "$5": 5,
             "$10": 10,
             "$20": 20,
             "$35": 35,
             "$1000": 1000}

location = "house"
inv = {}
hp=10
maxHP=15
weapon = ""
money = 0.0

def help():
    print("quit")
    print("inv")
    print("goto [area]")
    print("attack [enemy]")
    print("take [item]")
    print("eat [item] [number]")
    print("drink [item] [number]")
    print("look")
    print("equip [weapon]")
    print("unequip")
    print("weapon")
    print("work [seconds]")
    print("buy [item] [number]")
    print("examine [item]")

def attack(enemy):
    global hp
    
    
    thisEnemyHP = enemyHP[enemy]
    weaponDmg = weapons[weapon]
    thisEnemyDmg = enemyDmg[enemy]

    #initialize dmg variables
    turnEnemyDmg=thisEnemyDmg
    turnWeaponDmg=weaponDmg

    while hp>0 and thisEnemyHP>0:
        #calculate whether we will be adding or
        #subtracting the bonus dmg from the hit
        playerPosNeg = random.randint(0,1)
        enemyPosNeg = random.randint(0,1)
        
        #find offset for player and enemy dmg
        playerRange=weaponDmg * .75
        playerRange=math.ceil(playerRange)
        playerBonusDmg=random.randint(0, playerRange)
        
        enemyRange=thisEnemyDmg * .75
        enemyRange=math.ceil(enemyRange)
        enemyBonusDmg=random.randint(0, enemyRange)
        
        #calculate total enemy dmg
        if(enemyPosNeg==1):
            turnEnemyDmg += enemyBonusDmg
        elif(enemyPosNeg==0):
            turnEnemyDmg -= enemyBonusDmg

        #calculate total player dmg
        if(playerPosNeg==1):
            turnWeaponDmg += playerBonusDmg
        elif(playerPosNeg==0):
            turnWeaponDmg -= playerBonusDmg

        if(turnEnemyDmg <= 0):
            turnEnemyDmg=1
        if(turnWeaponDmg <= 0):
            turnWeaponDmg=1
        
        hp-=turnEnemyDmg
        thisEnemyHP-=turnWeaponDmg

        print("Enemy damage: ", turnEnemyDmg, ", Player HP: ", hp)
        print("Player damage: ", turnWeaponDmg, ", Enemy HP: ", thisEnemyHP)
        print()

    if hp<=0:
        print("You have died, fool")
    
    elif thisEnemyHP<=0:
        for item in enemyItems[enemy]:
            items[location].append(item)
        enemies[location].remove(enemy)
        print("You win!")
        print("HP: ", hp)

def goto(location1):
    global location
    if location1 in exits[location]:
        location = location1
        print("Moved to", location)
    else:
        print("Cannot go there")

def take(item):
    global money
    if item in moneyDrop:
        money+=moneyDrop[item]
    else:
        try:
            inv[item]+=1
        except:
            inv[item] = 1
    items[location].remove(item)
    print(item, "taken")

def invn():
    for key in inv:
        if key == list(inv.keys())[-1]:
            print(key, " x", inv[key], end='\n')
        else:
            print(key, " x", inv[key], end=', ')
    print("You have $%.2f" % money)

def look():
    print("Current location:", location)
    for value in locations[location]:
        print("Description:",value)
            
    print("Exits: ", end='')
    for value in exits[location]:
        if value == exits[location][len(exits[location])-1]:
            print(value, end='\n')
        else:
            print(value, end=', ')
            
    if items[location] == []:
        print("Items:")
    else:    
        print("Items: ", end='')
        
    for value in items[location]:
        if value == items[location][len(items[location])-1]:
            print(value, end='\n')
        else:
            print(value, end=', ')

    if location in enemies:
        if enemies[location] != []:
            print("Enemies:", end=' ')
            for enemy in enemies[location]:
                if enemy == enemies[location][len(enemies[location])-1]:
                    print(enemy, end='\n')
                else:
                    print(enemy, end=', ')
    
    if location in purchases:
        #print(list(purchases[location].keys())[len(purchases[location].keys())-1])
        print("Purchases:", end=' ')
        for item in purchases[location]:
            if item == list(purchases[location].keys())[-1]:
                print(item,"$%.2f" % purchases[location][item], end='\n')
            else:
                print(item,"$%.2f" % purchases[location][item], end=', ')

def drink(item, num):
    global maxHP
    global hp
    count = 0
    itemCounter = inv[item]
    
    if num > itemCounter:
        print("You do not have that many ", item)
    else:
        inv[item]-=num
        hp-=num
        maxHP+=drank[item]*num

        print("HP: ", hp)
        print("Max HP: ", maxHP)

    if inv[item] == 0:
        del inv[item]
    
def eat(item, num):
    global hp
    count = 0
    itemCounter = inv[item]
    
    if num > itemCounter:
        print("You do not have that many", item)
    else:
        if hp+food[item]*num > maxHP:
            if hp==maxHP:
                print("STOP EATING")
            else:
                numNeededToGetFullHP = math.ceil((maxHP-hp)/food[item])
                inv[item]-=numNeededToGetFullHP
                print("Regained",maxHP-hp,"health")
                hp=maxHP
        else:
            inv[item]-=num
            hp+=food[item]*num
            print("Regained" , food[item]*num , "health")
        print("HP:",hp)
        
    if inv[item] == 0:
            del inv[item]

def equip(weapon1):
    global weapon
    del inv[weapon1]
    weapon = weapon1
    print(weapon,"equipped")

def unequip():
    global weapon
    print("Unequipped",weapon)
    inv[weapon] = 1
    weapon = ""

def buy(item, num):
    global money
    count = 0
    if location in purchases:
        moneySpent = num*purchases[location][item]
        
        if moneySpent > money:
            print("You don't have enough money, fool")
        else:
            if item in purchases[location] and purchases[location][item] <= money:
                money-=moneySpent
                print("You have $%.2f" % money)
                try:
                    inv[item] += num
                except:
                    inv[item] = num
            elif item not in purchases[location]:
                print("Cannot buy that")
            elif purchases[location][item] > money:
                print("You don't have enough money to buy that")
            else:
                print("???")
    else:
        print("Nothing to buy here")

print("Type help for a list of commands")
print("Try examining love first")
cmd = input(">")
while cmd!="quit" and hp>0:
    if cmd=="help":
        help()
        
    elif cmd=="look":
        look()

    elif cmd == "inv":
        invn()

    elif cmd=="weapon":
        if weapon=="":
            print("Nothing is currently equipped")
        else:
            print(weapon,"is currently equipped")
        
    elif cmd.startswith("take "):
        cmd = cmd.split(" ")
        item=cmd[1]
        if item in items[location]:
            take(item)
        else:
            print("Cannot take that")
    
    elif cmd.startswith("goto "):
        cmdList = cmd.split(" ")
        newLoc = cmdList[1:]

        if newLoc==["swamp"]:
            if weapon == "master-sword":
                print("Once you enter the swamp, you cannot leave.")
                print("Are you sure you want to enter? (yes/no)")
                choice = input()
                if choice == "yes":
                    print("You use the master sword to open the sacred way")
                    goto("swamp")
                else:
                    print("Cmon, what're you afraid of?")
            else:
                print("Cannot open the sacred way without wielding the master sword, idiot")
        else:
            if len(newLoc) > 1:
                newLoc1 = ""
                for item in newLoc:
                    if item == newLoc[0]:
                        newLoc1 = item
                    else:
                        newLoc1=newLoc1 + " " + item
                goto(newLoc1)
            else:
                newLoc = newLoc[0]
                goto(newLoc)

    elif cmd.startswith("drink "):
        cmd=cmd.split(" ")
        item=cmd[1]
        
        if item in drank and item in inv:
            try:
                number=cmd[2]
                number=int(number)
                drink(item, number)
                if(hp<=0):
                    print("You have died from alcohol poisioning.")
                    print("Please drink responsibly next time.")
                    break
            except:
                number=1
                drink(item, number)
                if(hp<=0):
                    print("You have died from alcohol poisioning.")
                    print("Please drink responsibly next time.")
                    break
                
        elif item not in drank:
            print("Not drinkable")
        elif item not in inv:
            print("You don't have that item")
        else:
            print("???")
        
    elif cmd.startswith("eat "):
        cmd=cmd.split(" ")
        item = cmd[1]
        
        if item in inv and item in food:
            try:
                number=cmd[2]
                number=int(number)
                eat(item, number)
            except:
                number=1
                eat(item, number)
        elif item in inv and item not in food:
            print("Thats not food")
        elif item not in inv:
            print("You don't have that item")
        else:
            print("???")

    elif cmd.startswith("attack "):
        cmd=cmd.split(" ")
        #try:
        enemy=cmd[1]
        if enemy in enemies[location] and weapon!="":
            attack(enemy)
            if(hp<=0):
                break
            
        elif weapon == "":
            print("No weapon equipped")
        elif enemy not in enemies[location]:
            print("No such enemy")
        else:
            print("???")
        #except:
            #print("Cannot attack that")
            
    elif cmd.startswith("equip "):
        cmd=cmd.split(" ")
        weaponToEquip = cmd[1]
        if weapon=="":
            if weaponToEquip in weapons and weaponToEquip in inv:
                equip(weaponToEquip)
            elif weaponToEquip not in weapons:
                print("Thats not a weapon")
            elif weaponToEquip not in inv:
                print("You don't have that item")
            else:
                print("???")
        else:
            print("You already have a weapon equipped")

    elif cmd=="unequip":
        if weapon=="":
            print("No weapon equipped")
        else:
            unequip()
            
    elif cmd.startswith("work "):
        cmd=cmd.split(" ")
        
        if location=="job":
            try:
                WRKtime = int(cmd[1])
                if WRKtime==1337:
                    print("IT'S OVER 9000!!!")
                    money+=9001
                else:
                    time.sleep(WRKtime)
                    moneyEarned = WRKtime
                    print("You worked for %d seconds, you have earned $%.2f" % (WRKtime, moneyEarned))
                    money+=moneyEarned
            except:
                print("That is not a valid ammount of time")
        else:
            print("You are not at your job")

    elif cmd.startswith("buy "):
        cmd=cmd.split(" ")
        item = cmd[1]

        if len(cmd) == 3:
            if item in purchases[location]:
                number=int(cmd[2])
                buy(item, number)
            else:
                print("No such purchase available")
        else:
            if location in purchases:
                if item in purchases[location]:
                    number=1
                    buy(item, number)
                else:
                    print("No such purchase available")
            else:
                print("Nothing avaliable for purchase here")

    #there is no examine function, i just print the dictionary value here
    elif cmd.startswith("examine "):
        cmd=cmd.split(" ")
        try:
            item=cmd[1]
            if item=="love":
                print(examine[item])
            else:
                if item in inv and item in examine:
                    print(examine[item])
                elif item not in inv:
                    print("You don't have that item")
                elif item not in examine:
                    print("That is not an examinable item")
                else:
                    print("???")
        except:
            print("Please specify an item")

    elif cmd=="i call upon the sacred power of love to destroy all evil in the world":
        if "love" in inv:
            print("Using the power of love, you have defeated all the evil in the world for good!")
            print("Congratulations! You have won the game!")
            break
        else:
            print("Fool, you do not have the power of love")
            print("Evil will reign over this world forever!")
    
    else:
        print("Not a valid command")
    
    cmd=input(">")

print("We hope you kept your appendages attached throughout the entire flight. \nThank you and have a great day.")
