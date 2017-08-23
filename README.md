# Cillionaire

Cillionaire (*C*rypto M*illionaire*) is an Ethereum based lottery where people can participate until a pre-defined pot limit is reached. Then, a random participant is chosen to be the winner. This is inspired by a reddit game called _Let's make a millionaire_, where everybody pledges to contribute 1 USD to make someone a millionaire. Cillionaire aims to be a proof of concept of how to implement this game in a transparent, trustless way.

Randomness is achieved by XOR'ing the following two numbers:
- ownerRandomNumber ... a random number supplied by the contract owner and submitted upon `start` as a hash, much like a concealed bid in an auction.
- minerRandomNumber ... timestamp of the block that contains the last participant's `particpate` transaction.
Neither can the owner know the minerRandomNumber, nor can the miner know the ownerRandomNumber (unless the owner supplies a breakable hash, e.h. keccak256(1)).

A number of safeguards are in place to prevent loss of participants' stakes and ensure fairness:
- The owner can `cancel`, in which case participants must be refunded. Anyone can invoke the refund function.
- If the owner does not end the game via `chooseWinner` within 24 hours after PARTICIPATION `state` ended, then anyone can `cancel`.
- The contract has no `kill` function which would allow the owner to run off with the pot.
- Game parameters cannot be changed when a game is ongoing
- Logging of relevant events to increase transparency

# How to play

## Using Cillionaire Web

Cillionaire Web is a web frontent for the Cillionaire Smart contract. Its purpose is to make the game more accessible and easy to use. To get an idea how it looks, please see screenshot_web_1.0.png.

1. Download cillionaire_web_1.0.zip and unzip. 
To download: Click on the zip-file in the file listing above and on the next screen click "Download".

2. Open index.html in your browser. The contract's data is updated every minute.

3. Use the actions to generate MyEtherWallet transactions that you can sign using your preferred method.

4. Wait for the game to end. The game ends once the pot target is reached, or if it is cancelled. In either case, use the withdraw-function to receive funds (winnings or refunds).

## In MyEtherWallet only

1. In myetherwallet.com, go to "Contracts" and enter "cillionaire.eth" (without quotes; Contract Address is 0x4f6fe3bbefdb17e23d6e74a33482413c961569c3) into "Contract Address".
It's also on the Kovan testnet under 0x13171fF9F5De1904509F08cdc3b7Ae2087931e43

2. In "ABI / JSON Interface" enter the following:
```
[{"constant":false,"inputs":[{"name":"_ownerRandomHash","type":"bytes32"}],"name":"start","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_count","type":"uint256"}],"name":"refund","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"ownerRandomHash","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"participants","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"stake","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"withdrawFees","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"pot","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_potTarget","type":"uint256"},{"name":"_stake","type":"uint256"},{"name":"_fee","type":"uint256"}],"name":"setParams","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"ownerRandomNumber","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_ownerRandomNumber","type":"string"},{"name":"_ownerRandomSecret","type":"string"}],"name":"chooseWinner","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"lastRefundedIndex","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"potTarget","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"minerRandomNumber","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"fees","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"setContractOwner","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"state","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"participate","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"fee","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"winner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"funds","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"cancel","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"participationEndTimestamp","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newState","type":"uint8"}],"name":"StateChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"participant","type":"address"},{"indexed":false,"name":"total","type":"uint256"},{"indexed":false,"name":"stakeAfterFee","type":"uint256"},{"indexed":false,"name":"refundNow","type":"uint256"}],"name":"NewParticipant","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"number","type":"uint256"}],"name":"MinerRandomNumber","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"number","type":"uint256"}],"name":"OwnerRandomNumber","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"randomNumber","type":"uint256"}],"name":"RandomNumber","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"winnerIndex","type":"uint256"}],"name":"WinnerIndex","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_winner","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Winner","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"participant","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Refund","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"cancelledBy","type":"address"}],"name":"Cancelled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newPotTarget","type":"uint256"},{"indexed":false,"name":"newStake","type":"uint256"},{"indexed":false,"name":"newFee","type":"uint256"}],"name":"ParametersChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newOwner","type":"address"}],"name":"ContractOwnershipTransferred","type":"event"}]
```
3. Under *Read / Write Contract* select `state` and make sure it is 1. This means that a game is ongoing and participations are possible.

4. Select `stake` to see how much ETH is required for participation. The value is in Wei, and one Ether is 10**18 Wei. So, for example, if the stake is 100000000000000000 then this means 0.01 ETH must be sent. In the event that the game is cancelled, the stake is refunded. 

5. Select `fee` to see how much ETH is taken from the stake and given to the contract owner. In the event that the game is cancelled, then the `fee` is also refunded. As of now, there is no fee, so this should be 0.

6. Select `participate` and then *WRITE*. Send exactly the amount specified by `stake`. If you send more than is required, the surplus will be sent back immediately. Note that the transaction will fail after the participation phase has ended (i.e. when the `potTarget` is reached). In this case, your ETH is not accepted, but you lose the gas cost though. 
Now, wait until the game has ended. 

7. End of game
- (i) If the game is concluded properly, then a winner is chosen. In this case, `state` is 0 (ENDED) and `winner` contains the winner's address. Use the `withdraw` function to receive the winnings.

- (ii) If the game is cancelled, then all participants must be refunded using the `refund` function repeatedly before a new game can be started. The `refund` function can be called by anybody. Refunds include fees. Use the `withdraw` function to receive the refund. A game can be cancelled by the owner, or by anybody 24h after the participation phase has ended and no winner was chosen. 

# Donate

If you like Cillionaire, please consider donating some Ether to `0x3baAdba0dA3f22e5b86581D686a2bDE9a54Aa0b4`.
Thanks!