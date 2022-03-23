import MinerBot from "./bot";
import { sleep } from "./util";

function log(message: string) {
    document.getElementById("log").innerHTML += "\n" + message;
}

// Get login data
const username = prompt("Podaj email: ")
const password = prompt("Podaj hasło: ")
// username = "WinterWolf"
// password = ""


const cobblex = confirm("Czy mam automatycznie tworzyć CobbleX ?")
// Cobblex

// Import
const mineflayer = require("mineflayer")
const viewer = require("prismarine-viewer").mineflayer

// Bot creation
console.log("Tworzenie bota.")
const minerBot = new MinerBot(username, password, "localhost")
console.log("Bot utworzony")

// Launch the viewer
minerBot.launchViewer()

// Handle kick
minerBot.bot.on("kicked", (reason, loggedIn) => {
    console.log("Kick with reason: ")
    console.log(reason)
    stop()
})

// Accept the resourcepack
minerBot.bot.on("resourcePack", (url, hash) => {
    console.log("Akceptowanie resourcepacka!")
    minerBot.bot.acceptResourcePack()
})

// Handle death
minerBot.bot.on("death", () => {
    console.log("Bot zginął!")
    stop()
})

const stop = () => {
    console.log("Stop!")
    minerBot.bot.quit()
}
    


// Wait to make sure everything is loaded.
sleep(2)


// The tick
minerBot.bot.on("physicsTick", () => {
    let targetBlock = minerBot.bot.targetDigBlock
    if (targetBlock) {

        // Prevent mining throught walls
        const block = minerBot.bot.blockAtCursor(5)
        if (block == null) return;
        
        let miningBlock = minerBot.bot.targetDigBlock
        if (! miningBlock) return;

        if (block.position.toString() != miningBlock.position.toString()) {
            minerBot.bot.stopDigging()
        }
    }
})    

let minPassed: boolean = false

setInterval(() => {
    minPassed = true
}, 60*1000)

console.log("Zaczynam kopać!")

const yaw = minerBot.bot.entity.yaw
minerBot.bot.look(yaw, 0, false)

// minerBot.enchant()

while (true) {

    let targetBlock = minerBot.bot.targetDigBlock
    if (! targetBlock) {
        // Equip new pick if needed
        let held = minerBot.bot.heldItem
        if (held == null) {
            minerBot.equipPick()
        } else if (held["type"] != 721) {
            minerBot.bot.tossStack(held)
            minerBot.equipPick()
        } else {
            if (1561 - held.durabilityUsed <= 100) {
                if (! minerBot.repairPick()) {
                    minerBot.bot.look(yaw, 0, false)
                    stop()
                }
            }
        }
        // Make cobblex
        if (minerBot.bot.inventory.count(21) >= 640) {
            minerBot.makeCobblex()
        }
        // If minute passed do periodical things
        if (minPassed) {

            // Empty inventory
            minerBot.emptyInventory(cobblex)

            // minerBot.enchant()

            minPassed = false
        }
        // Mine
        let block = minerBot.bot.blockAtCursor(5)
        if (block == null)
            continue

    
        minerBot.bot.dig(block, "ignore", "raycast")
        
    }

    sleep(0.05)

    // input = input("Wpisz stop aby zakończyć kopanie!: \n")
    // if input == "stop":
    //     minerBot.bot.quit()
    //     exit(0)

}