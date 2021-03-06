import { Anvil, Bot, createBot } from "../node_modules/mineflayer/index";
import { reloadView, renderLog } from "./main";
import { sleep } from "./util";
const viewer = require("prismarine-viewer").mineflayer
import { once } from 'events';

class MinerBot {
    bot: Bot;
    shouldContinue: boolean = true;
    yaw: number;
    settings: {"autocx": boolean, "autofix": boolean, "autodrop": boolean} = {
        "autocx": true,
        "autofix": true,
        "autodrop": true
    }
    nextMinute: Date;

    mainloop = async (username: string, password: string, host: string) => {


        renderLog("Łączenie.")
        try {
            this.bot = createBot({
                "host": host,
                "username": username,
                "password": password,
                "hideErrors": false,
                "auth": "microsoft",
            });
        } catch {
            renderLog("Nie udało się połączyć.")
        }

        this.bot.on("error", (error) => {
            console.log("Error: ", error.stack)
            renderLog("Error: " + error.stack)
        })

         // Accept the resourcepack
        this.bot.on("resourcePack", (url: any, hash: any) => {
            renderLog("Akceptowanie resourcepacka!")
            this.bot.acceptResourcePack()
        })

        await once(this.bot, 'spawn')  
        renderLog("Dołączono do świata.")
    
        // Launch the viewer
        this.launchViewer()
        reloadView()

        // Handle kick
        this.bot.on("kicked", (reason: any, loggedIn: any) => {
            console.log("kick")
            renderLog("Kick with reason: ")
            renderLog(reason)
            stop()
        })
       

        // Handle death
        this.bot.on("death", () => {
            console.log("death")
            renderLog("Bot zginął!")
            stop()
        })           

        // renderLog("Ładowanie chunków!")
        // await this.bot.waitForChunksToLoad()


        // The tick
        this.bot.on("physicsTick", () => {
            let targetBlock = this.bot.targetDigBlock
            if (targetBlock !== null) {

                // Prevent mining throught walls
                const block = this.bot.blockAtCursor(5)
                if (block === null) return;
                
            
                if (! block.position.equals( targetBlock.position)) {
                    this.bot.stopDigging()
                }
            }
        })    
        
        this.yaw = this.bot.entity.yaw

        
        await this.bot.look(this.yaw, 0, false)

        this.nextMinute = new Date()
        this.updateDate()
        
        renderLog("Zaczynam kopać!")
        while (this.shouldContinue) {
            await this.tick()
            await sleep(0.05)
        }
        // @ts-ignore
        this.bot.viewer.close()
        this.bot.end()
        renderLog("Stoop! :)")

    }

    tick = async () => {      
    
        // Repqir a pickaxe if needed.
        const held = this.bot.heldItem
        if (this.settings.autofix && held !== null && held.type === 721 && 1561 - held.durabilityUsed <= 100) {
            this.fixPick()
        }

        // Make cobblex
        if (this.settings.autocx && this.bot.inventory.count(21, null) >= 640) {
            this.makeCobblex()
        }

        // If minute passed do periodical things
        if (this.settings.autodrop) {

            if (new Date() > this.nextMinute) {
                let pos = this.bot.entity.position.clone()
                pos.y += -1
                if (this.bot.blockAt(pos).type === 349) {
                    await this.emptyInventory()
                    this.updateDate()
                }
            }
            
        }

        // Mine
        const block = this.bot.blockAtCursor(5)
        if (block !== null) {
            try {
                await this.bot.dig(block, "ignore", "raycast")
            } catch (error) {

            }

        }   
        

    }

    stop = () => {
        this.shouldContinue = false;
    }

    updateSettings = (settings: {"autocx": boolean, "autofix": boolean, "autodrop": boolean}) => {
        this.settings = settings
        renderLog("Zaktualizowano ustawienia.")
    }

    launchViewer = () => {
        try {
            viewer(this.bot, {"port": 3001, "firstPerson": true})
        } catch (error) {
            renderLog("Nie udało się włączyć podglądu. Jest już włączony?")
        }
        renderLog("Uruchomiono podgląd.")
    }

    makeCobblex = () => {
        // Send /cx command that creates cobbleX
        this.bot.chat("/cx")
    }

    fixPick = () => {
        this.bot.chat("/naprawkilof")
        renderLog("Naprawiono kilof.")
    }

    updateDate = () => {
        this.nextMinute.setMinutes(this.nextMinute.getMinutes() + 1)
    }

    emptyInventory = async () => {

        const random = Math.random() * 0.03

        // Ids of items to drop
        const ids = [684, 585, 692, 696, 687, 686, 792, 235, 734, 234]

        // If bot doesn't make cobblex then it should also drop cobblestone
        if (! this.settings.autocx) {
            ids.push(21)
        }

        // Get all items to drop
        let toDrop: any[] = this.bot.inventory.items()
        toDrop = toDrop.filter((item) => ids.includes(item.type))
    

        // If there is anython to drop than drop it
        if (toDrop.length !== 0) {

            renderLog("Wyrzucanie itemków.")

            const yaw = this.bot.entity.yaw
            // Look down
            await this.bot.look(yaw, -1.57 + random, false)

            await sleep(1.5)

            // Drop items
            for (const item of toDrop) {
                await this.bot.tossStack(item)
                // if (item.type === 686) {
                //     if (item.count >= 5)
                //         await this.bot.toss(686, null, item.count - 4)
                // } else {
                //     await this.bot.tossStack(item)
                // }
                await sleep(1)
                
            }
            // Look up (forward)
            await this.bot.look(yaw, 0 + random, false)
            // await sleep(1)
     
           renderLog("Wyrzucono wszystkie itemki.")
        }

    }


    // repairPick = async () => {
    //     renderLog("Próbuję naprawić kilof.")
    //     const yaw = this.bot.entity.yaw
    //     const pitch = this.bot.entity.pitch
    //     let diamonds = this.bot.inventory.findInventoryItem(686)
    //     if (!diamonds)
    //         return
    //     const block = this.bot.findBlock({"matching": [341, 340, 339], "maxDistance": 5})
    //     if (block) {
    //         const anvil: Anvil = await this.bot.openAnvil(block)
    //         try {
    //             await anvil.combine(this.bot.heldItem, diamonds)
    //         } catch {
    //             renderLog("Nie udało się naprawić kilofa.")
    //             await this.bot.look(yaw, pitch, true)
    //             return false
    //         }
    //         renderLog("Naprawiono kilof.")
    //         anvil.close()
    //         await this.equipPick()
    //         await this.bot.look(yaw, pitch, true)
    //         await sleep(1)
    //         return true
    //     } else {
    //         renderLog("Brak kowadła, nie naprawiono kilofa.")
    //         return false
    //     }

    // }

    enchant = async () => {

        renderLog("Próbuję enchantować!")

        // Check if there is enought xp
        if (this.bot.experience.level < 30)
            return
        renderLog("Wystarczająco xp")

        // Find encahnting table
        const block = this.bot.findBlock({"matching": 268, "maxDistance": 5})
        // Return if theres no one
        if (!block)
            return
        renderLog("Jest stół")

        // Ids of items to enchant (iron armour)
        const ids = [746, 747, 748, 749]

        // Get all items to enchant
        let toEnchant = this.bot.inventory.items()
        toEnchant = toEnchant.filter( (item: any) => ids.includes(item["type"]))

        // If there is no items to enchant return
        if (!toEnchant)
            return
        renderLog("Są itemy")

        // Open enchanting table
        const etable = await this.bot.openEnchantmentTable(block)
        renderLog("Otworzono stół")

        // Wait for enchantments to populate
        // once(etable, "ready")
        // renderLog("Ready")

        await sleep(5)
        renderLog("Sleeped")

        // Put first item in etable
        await etable.putTargetItem(toEnchant[0])
        renderLog("Wsadzono itemek")

        // renderLog enchants
        renderLog(etable.enchantments.toString())

        
    }

}

export default MinerBot