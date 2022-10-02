# Ethereum-Event-Indexer

In this Project we are going to get log of ethereum network in real time using websocket with Alchemy, We will try to get event from the logs of any specifiy Smart Contract which is deployed on-Chain and index it data.

```
https://docs.alchemy.com/reference/eth-subscribe
```

## Following are the list what we are going to do in this small project

1. We will connect to Ethereum with help Alchemy RPC (used filter to get only those transation which are belong to contract which we want to track)
2. Connect to DB who have different Table
   2.1 Blockchain Event info (ChainName,ChainID,blockNumber,Total Amount Transfer) `blockNumber it will help us to know where to start get logs and where we left when service close`
   2.2 Tables With Event Name , their fields which we store and Do index on data
3. Once we connect and get logs it time to get event signature and convert the values (data and topics).
4. Time to Store Them into DB and Index the data.
5. Then we will Expose two Endpoint
   5.1 get Contract Blanace (Sum by Total Amount Transfer from start of service).
   5.1 tell that transaction hash belong to that contract or not

## Technology

1. Nodejs (express Server)
2. Postgress Database (with Docker)

## Steps

1. Copy ABI in Config folder.
2. Run postgressDB with Docker

```
cd pg-compose
docker-compose up -d

```

3. Run `node init.js ` inside utils folder it will covert ABI into to ABI siginature in config folder `event_signature.json` and create table for every Event and it Indexing
