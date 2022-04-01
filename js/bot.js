"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var index_1 = require("../node_modules/mineflayer/index");
var workerBot_1 = require("./workerBot");
var util_1 = require("./util");
var viewer = require("prismarine-viewer").mineflayer;
var events_1 = require("events");
var MinerBot = (function () {
    function MinerBot() {
        var _this = this;
        this.shouldContinue = true;
        this.minPassed = false;
        this.autocx = true;
        this.autofix = true;
        this.autodrop = true;
        this.mainloop = function (username, password, host) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, workerBot_1.renderLog)("Łączenie.");
                        try {
                            this.bot = (0, index_1.createBot)({
                                "host": host,
                                "username": username,
                                "password": password,
                                "hideErrors": false,
                                "auth": "microsoft"
                            });
                        }
                        catch (_b) {
                            (0, workerBot_1.renderLog)("Nie udało się połączyć.");
                        }
                        (0, workerBot_1.renderLog)("Połączono.");
                        this.bot.on("error", function (error) {
                            console.log("Error: ", error.stack);
                            (0, workerBot_1.renderLog)("Error: " + error.stack);
                        });
                        this.bot.on("resourcePack", function (url, hash) {
                            (0, workerBot_1.renderLog)("Akceptowanie resourcepacka!");
                            _this.bot.acceptResourcePack();
                        });
                        return [4, (0, events_1.once)(this.bot, 'spawn')];
                    case 1:
                        _a.sent();
                        (0, workerBot_1.renderLog)("Spawned");
                        this.launchViewer();
                        (0, workerBot_1.reloadView)();
                        this.bot.on("kicked", function (reason, loggedIn) {
                            console.log("kick");
                            (0, workerBot_1.renderLog)("Kick with reason: ");
                            (0, workerBot_1.renderLog)(reason);
                            stop();
                        });
                        this.bot.on("death", function () {
                            console.log("death");
                            (0, workerBot_1.renderLog)("Bot zginął!");
                            stop();
                        });
                        (0, workerBot_1.renderLog)("Ładowanie chunków!");
                        return [4, this.bot.waitForChunksToLoad()];
                    case 2:
                        _a.sent();
                        this.bot.on("physicsTick", function () {
                            var targetBlock = _this.bot.targetDigBlock;
                            if (targetBlock !== null) {
                                var block = _this.bot.blockAtCursor(5);
                                if (block === null)
                                    return;
                                if (block.position !== targetBlock.position) {
                                    _this.bot.stopDigging();
                                }
                            }
                        });
                        setInterval(function () {
                            _this.minPassed = true;
                        }, 60 * 1000);
                        (0, workerBot_1.renderLog)("Zapisuję yaw.");
                        this.yaw = this.bot.entity.yaw;
                        return [4, this.bot.look(this.yaw, 0, false)];
                    case 3:
                        _a.sent();
                        (0, workerBot_1.renderLog)("Zaczynam kopać!");
                        _a.label = 4;
                    case 4:
                        if (!this.shouldContinue) return [3, 6];
                        return [4, this.tick()];
                    case 5:
                        _a.sent();
                        return [3, 4];
                    case 6:
                        this.bot.end();
                        (0, workerBot_1.renderLog)("Stoop! :)");
                        return [2];
                }
            });
        }); };
        this.tick = function () { return __awaiter(_this, void 0, void 0, function () {
            var held, block;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        held = this.bot.heldItem;
                        if (!(held === null)) return [3, 2];
                        return [4, this.equipPick()];
                    case 1:
                        _a.sent();
                        return [3, 6];
                    case 2:
                        if (!(held["type"] !== 721)) return [3, 5];
                        return [4, this.bot.tossStack(held)];
                    case 3:
                        _a.sent();
                        return [4, this.equipPick()];
                    case 4:
                        _a.sent();
                        return [3, 6];
                    case 5:
                        if (1561 - held.durabilityUsed <= 100) {
                            this.fixPick();
                        }
                        _a.label = 6;
                    case 6:
                        if (this.bot.inventory.count(21, null) >= 640) {
                            this.makeCobblex();
                        }
                        if (this.minPassed) {
                            this.emptyInventory();
                            this.minPassed = false;
                        }
                        block = this.bot.blockAtCursor(5);
                        if (!(block !== null)) return [3, 8];
                        return [4, this.bot.dig(block, "ignore", "raycast")];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8: return [2];
                }
            });
        }); };
        this.stop = function () {
            _this.shouldContinue = false;
        };
        this.updateSettings = function (autocx, autofix, autodrop) {
            _this.autocx = autocx;
            _this.autofix = autofix;
            _this.autodrop = autodrop;
        };
        this.launchViewer = function () {
            try {
                viewer(_this.bot, { "port": 3001, "firstPerson": true });
            }
            catch (error) {
                (0, workerBot_1.renderLog)("Nie udało się włączyć podglądu. Jest już włączony?");
            }
            (0, workerBot_1.renderLog)("Podgląd włączony.");
        };
        this.equipPick = function () { return __awaiter(_this, void 0, void 0, function () {
            var tool;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tool = this.bot.inventory.findInventoryItem(721, null, false);
                        if (!(tool !== null)) return [3, 2];
                        return [4, this.bot.equip(tool, "hand")];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2];
                }
            });
        }); };
        this.makeCobblex = function () {
            _this.bot.chat("/cx");
        };
        this.fixPick = function () {
            _this.bot.chat("/naprawkilof");
        };
        this.emptyInventory = function () { return __awaiter(_this, void 0, void 0, function () {
            var ids, toDrop, _i, toDrop_1, item;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, workerBot_1.renderLog)("Dropping inventory!");
                        ids = [684, 585, 692, 696, 687, 686, 792, 235, 734, 234];
                        if (!this.autocx) {
                            ids.push(21);
                        }
                        toDrop = this.bot.inventory.items();
                        toDrop.filter(function (item) { return ids.includes(item["type"]); });
                        if (!(toDrop.length !== 0)) return [3, 10];
                        _i = 0, toDrop_1 = toDrop;
                        _a.label = 1;
                    case 1:
                        if (!(_i < toDrop_1.length)) return [3, 9];
                        item = toDrop_1[_i];
                        if (!(item["type"] === 686)) return [3, 4];
                        if (!(item.count >= 5)) return [3, 3];
                        return [4, this.bot.toss(686, null, item.count - 4)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [3, 6];
                    case 4: return [4, this.bot.tossStack(item)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [4, (0, util_1.sleep)(0.3)];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        _i++;
                        return [3, 1];
                    case 9:
                        (0, workerBot_1.renderLog)("Dropped all items!");
                        _a.label = 10;
                    case 10: return [2];
                }
            });
        }); };
        this.enchant = function () { return __awaiter(_this, void 0, void 0, function () {
            var block, ids, toEnchant, etable;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, workerBot_1.renderLog)("Próbuję enchantować!");
                        if (this.bot.experience.level < 30)
                            return [2];
                        (0, workerBot_1.renderLog)("Wystarczająco xp");
                        block = this.bot.findBlock({ "matching": 268, "maxDistance": 5 });
                        if (!block)
                            return [2];
                        (0, workerBot_1.renderLog)("Jest stół");
                        ids = [746, 747, 748, 749];
                        toEnchant = this.bot.inventory.items();
                        toEnchant = toEnchant.filter(function (item) { return ids.includes(item["type"]); });
                        if (!toEnchant)
                            return [2];
                        (0, workerBot_1.renderLog)("Są itemy");
                        return [4, this.bot.openEnchantmentTable(block)];
                    case 1:
                        etable = _a.sent();
                        (0, workerBot_1.renderLog)("Otworzono stół");
                        return [4, (0, util_1.sleep)(5)];
                    case 2:
                        _a.sent();
                        (0, workerBot_1.renderLog)("Sleeped");
                        return [4, etable.putTargetItem(toEnchant[0])];
                    case 3:
                        _a.sent();
                        (0, workerBot_1.renderLog)("Wsadzono itemek");
                        (0, workerBot_1.renderLog)(etable.enchantments.toString());
                        return [2];
                }
            });
        }); };
    }
    return MinerBot;
}());
exports["default"] = MinerBot;
