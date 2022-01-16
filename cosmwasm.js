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
var cosmwasm_stargate_1 = require("@cosmjs/cosmwasm-stargate");
var proto_signing_1 = require("@cosmjs/proto-signing");
var stargate_1 = require("@cosmjs/stargate");
var fs = require("fs");
var rpcEndpoint = "https://rpc.sandynet.cosmwasm.com/";
// Example user from scripts/wasmd/README.md
var alice = {
    mnemonic: "someone mask hotel cousin imitate sing man cause squirrel orbit false festival seat hedgehog fish robot tray seed mercy betray please panic foster hard",
    address0: "wasm1lw3m4fyqyk5uqvyswa6ndwcehq87xyjxs4hl8r"
};
function main(hackatomWasmPath) {
    return __awaiter(this, void 0, void 0, function () {
        var gasPrice, wallet, client, wasm, uploadFee, uploadReceipt, instantiateFee, msg, contractAddress, executeFee, result, wasmEvent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    gasPrice = stargate_1.GasPrice.fromString("0.025ubay");
                    return [4 /*yield*/, proto_signing_1.DirectSecp256k1HdWallet.fromMnemonic(alice.mnemonic, { prefix: "wasm" })];
                case 1:
                    wallet = _a.sent();
                    return [4 /*yield*/, cosmwasm_stargate_1.SigningCosmWasmClient.connectWithSigner(rpcEndpoint, wallet)];
                case 2:
                    client = _a.sent();
                    wasm = fs.readFileSync(hackatomWasmPath);
                    uploadFee = (0, stargate_1.calculateFee)(1500000, gasPrice);
                    return [4 /*yield*/, client.upload(alice.address0, wasm, uploadFee, "Upload hackatom contract")];
                case 3:
                    uploadReceipt = _a.sent();
                    console.info("Upload succeeded. Receipt:", uploadReceipt);
                    instantiateFee = (0, stargate_1.calculateFee)(500000, gasPrice);
                    msg = {
                        count: 32
                    };
                    return [4 /*yield*/, client.instantiate(alice.address0, uploadReceipt.codeId, msg, "My instance", instantiateFee, { memo: "Create a hackatom instance" })];
                case 4:
                    contractAddress = (_a.sent()).contractAddress;
                    console.info("Contract instantiated at: ", contractAddress);
                    executeFee = (0, stargate_1.calculateFee)(300000, gasPrice);
                    return [4 /*yield*/, client.execute(alice.address0, contractAddress, { increment: {} }, executeFee)];
                case 5:
                    result = _a.sent();
                    wasmEvent = result.logs[0].events.find(function (e) { return e.type === "wasm"; });
                    console.info("The `wasm` event emitted by the contract execution:", wasmEvent);
                    return [2 /*return*/];
            }
        });
    });
}
var repoRoot = process.cwd() + "";
var hackatom = "".concat(repoRoot, "/project_name.wasm");
main(hackatom).then(function (resp) {
    console.log(resp);
})["catch"](function (err) {
    console.log(err);
});
console.info("The show is over.");
