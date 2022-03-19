const mineflayer = require('mineflayer');

import { sleep } from "./util";

class MinerBot {
    bot: any;

    constructor( username: string, password: string, host: string) {
        try {
            this.bot = mineflayer.createBot(
                {
                    "host": host,
                    "port": 25565,
                    "username": username,
                    "password": password,
                    "hideErrors": false,
                    "auth": "microsoft",
                }
            )
        } catch {
            console.log("Z jakiegoś powodu nie udało się połączyć!")
        }
    }

    launchViewer = () => {
        const viewer = require("prismarine-viewer").mineflayer
        viewer(this.bot, {"port": 3000, "firstPerson": true})
        console.log("Podgląd włączony.")
    }

    equipPick = () => {
        const tool = this.bot.inventory.findInventoryItem(721)
        if (tool) {
            this.bot.equip(tool, "hand")
        }
    }

    makeCobblex = () => {
        // Send /cx command that creates cobbleX
        this.bot.chat("/cx")
    }

    emptyInventory = (cobblex) => {

        console.log("Dropping inventory!")

        // Ids of items to drop
        const ids = [684, 585, 692, 696, 687, 686, 792, 235, 734, 234]

        // If bot doesn't make cobblex then it should also drop cobblestone
        if (!cobblex) {
            ids.push(21)
        }

        // Get all items to drop
        let toDrop: any[] = this.bot.inventory.items()
        toDrop.filter((item) => ids.includes(item["type"]))
    

        // If there is anython to drop than drop it
        if (toDrop.length !== 0) {
            // Get bot yaw
            const yaw = this.bot.entity.yaw

            // Look down
            this.bot.look(yaw, -Math.PI / 2, true)
            sleep(1)

            // Drop items
            for (const item of toDrop) {
                if (item["type"] === 686) {
                    if (item.count >= 5)
                        this.bot.toss(686, null, item.count - 4)
                } else {
                    this.bot.tossStack(item)
                }
                sleep(0.3)
                
            }
            // Look up (forward)
            this.bot.look(yaw, 0, true)
            sleep(1)
     
           console.log("Dropped all items!")
        }

    }

    repairPick = () => {
        console.log("Próbuję naprawić kilof.")
        const yaw = this.bot.entity.yaw
        const pitch = this.bot.entity.pitch
        let diamonds = this.bot.inventory.findInventoryItem(686)
        if (!diamonds)
            return
        const block = this.bot.findBlock({"matching": [341, 340, 339], "maxDistance": 5})
        if (block) {
            const anvil = this.bot.openAnvil(block)
            try {
                anvil.combine(this.bot.heldItem, diamonds)
            } catch {
                console.log("Nie udało się naprawić kilofa.")
                this.bot.look(yaw, pitch, true)
                return false
            }
            console.log("Naprawiono kilof.")
            anvil.close()
            this.equipPick()
            this.bot.look(yaw, pitch, true)
            sleep(1)
            return true
        } else {
            console.log("Brak kowadła, nie naprawiono kilofa.")
            return false
        }

    }
    enchant = () => {

        console.log("Próbuję enchantować!")

        // Check if there is enought xp
        if (this.bot.experience.level < 30)
            return
        console.log("Wystarczająco xp")

        // Find encahnting table
        const block = this.bot.findBlock({"matching": 268, "maxDistance": 5})
        // Return if theres no one
        if (!block)
            return
        console.log("Jest stół")

        // Ids of items to enchant (iron armour)
        const ids = [746, 747, 748, 749]

        // Get all items to enchant
        let toEnchant = this.bot.inventory.items()
        toEnchant = toEnchant.filter( (item) => ids.includes(item["type"]))

        // If there is no items to enchant return
        if (!toEnchant)
            return
        console.log("Są itemy")

        // Open enchanting table
        const etable = this.bot.openEnchantmentTable(block)
        console.log("Otworzono stół")

        // Wait for enchantments to populate
        // once(etable, "ready")
        // console.log("Ready")

        sleep(5)
        console.log("Sleeped")

        // Put first item in etable
        etable.putTargetItem(toEnchant[0])
        console.log("Wsadzono itemek")

        // console.log enchants
        console.log(etable.enchantments)

        
    }
}

export {MinerBot}