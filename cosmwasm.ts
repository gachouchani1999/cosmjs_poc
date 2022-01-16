import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { calculateFee, GasPrice } from "@cosmjs/stargate";
import * as fs from "fs";

const rpcEndpoint = "https://rpc.sandynet.cosmwasm.com/";

// Example user from scripts/wasmd/README.md
const alice = {
  mnemonic: "someone mask hotel cousin imitate sing man cause squirrel orbit false festival seat hedgehog fish robot tray seed mercy betray please panic foster hard",
  address0: "wasm1lw3m4fyqyk5uqvyswa6ndwcehq87xyjxs4hl8r",
};

async function main(hackatomWasmPath: string) {
  const gasPrice = GasPrice.fromString("0.025ubay");
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(alice.mnemonic, { prefix: "wasm" });
  const client = await SigningCosmWasmClient.connectWithSigner(rpcEndpoint, wallet);

  // Upload contract
  const wasm = fs.readFileSync(hackatomWasmPath);
  const uploadFee = calculateFee(1_500_000, gasPrice);
  const uploadReceipt = await client.upload(alice.address0, wasm, uploadFee, "Upload hackatom contract");
  console.info("Upload succeeded. Receipt:", uploadReceipt);

  // Instantiate
  const instantiateFee = calculateFee(500_000, gasPrice);
  // This contract specific message is passed to the contract
  const msg = {
    count: 32
  };
  const { contractAddress } = await client.instantiate(
    alice.address0,
    uploadReceipt.codeId,
    msg,
    "My instance",
    instantiateFee,
    { memo: `Create a hackatom instance` },
  );
  console.info(`Contract instantiated at: `, contractAddress);

  // Execute contract
  const executeFee = calculateFee(300_000, gasPrice);
  const result = await client.execute(alice.address0, contractAddress, { increment: {} }, executeFee);
  const wasmEvent = result.logs[0].events.find((e) => e.type === "wasm");
  console.info("The `wasm` event emitted by the contract execution:", wasmEvent);
}

const repoRoot = process.cwd() + ""; 
const hackatom = `${repoRoot}/project_name.wasm`;
main(hackatom).then(resp => {
  console.log(resp);
}).catch(err => {
  console.log(err);
})
console.info("The show is over.");

