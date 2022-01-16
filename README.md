# cosmjs_poc
CosmJS Proof of Concept for writing Typescript that can upload smart contract, instantiate and execute from script.

## Uploading Code 
Line of codes :
```
async function main(hackatomWasmPath: string) {
  const gasPrice = GasPrice.fromString("0.025ubay");
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(alice.mnemonic, { prefix: "wasm" });
  const client = await SigningCosmWasmClient.connectWithSigner(rpcEndpoint, wallet);

  // Upload contract
  const wasm = fs.readFileSync(hackatomWasmPath);
  const uploadFee = calculateFee(1_500_000, gasPrice);
  const uploadReceipt = await client.upload(alice.address0, wasm, uploadFee, "Upload hackatom contract");
  console.info("Upload succeeded. Receipt:", uploadReceipt);
```
These lines create a wallet variable from a mnemonic key and are able to connect with signer as a client to upload the wasm file to the Cosmwasm RPC endpoint.
F.Y.I: We connect to a Cosmwasm RPC endpoint with a created wallet (using wasmd) and send it tokens using the faucet to be able to pay for the fees of the transactions.

Result: Launching the TypeScript code returns a receipt: 
```
Upload succeeded. Receipt: {
  originalSize: 129936,
  originalChecksum: '3aa550708788e934c115a0dce0362a58cc8a7c11414f1f0326ddff44c51338f9',
  compressedSize: 47799,
  compressedChecksum: '298f9fa6a48e0793e2fbb3659b3f72bbfc698012234037667cc1241e7279fae5',
  codeId: 327,
  logs: [ { msg_index: 0, log: '', events: [Array] } ],
  transactionHash: 'D64BFCF623C8D32B31783377DE80BAECDAA488CDF95571499B0150FC37073662'
}
```

## Instantiation
In instantiation, we use the code id to instantiate a contract to be able to execute and query files.
The contract we instantiated has an address of : `wasm1pagdhn3r0syy35ywe4y9nt80tc8jh8ryuxlvcc`
We give it a message of `{count: 32}` at instantiation as this smart contract requires it.


## Execution
Execution of the smart contract is done using: 
```
  const executeFee = calculateFee(300_000, gasPrice);
  const result = await client.execute(alice.address0, contractAddress, { increment: {} }, executeFee);
  const wasmEvent = result.logs[0].events.find((e) => e.type === "wasm");
  console.info("The `wasm` event emitted by the contract execution:", wasmEvent);
```
Which calls the Increment Msg from the smart contract that increments the count by 1.
We receive a reciept of: 
```
The `wasm` event emitted by the contract execution: {
  type: 'wasm',
  attributes: [
    {
      key: '_contract_address',
      value: 'wasm1pagdhn3r0syy35ywe4y9nt80tc8jh8ryuxlvcc'
    },
    { key: 'method', value: 'try_increment' }
  ]
}
```
