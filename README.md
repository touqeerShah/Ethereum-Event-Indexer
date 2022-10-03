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
4. Run `node index.js` it will start node server and you can connect it with REST API's

```
## getTotalAmount
curl --location --request GET 'http://localhost:8080/api/getTotalAmount'
## verifyHashDB This will check from Database which we store with program blockchain that transaction hash exist
curl --location --request GET 'http://localhost:8080/api/verifyHashDB?transactionHash=0x320b95cef4c3cfe7ffca91f8bd9e5734cdba99cafc430004a50b9f553194929b'

## verifyHash This will check from real blockchain that transaction hash exist
curl --location --request GET 'http://localhost:8080/api/verifyHash?transactionHash=0x320b95cef4c3cfe7ffca91f8bd9e5734cdba99cafc430004a50b9f553194929b'
```

## Project Overview

1. `config` it carry all the configration of the project like ABI , it signature which is used to create tables and indexing on DB and all ENV values
2. `constants` it will carry all the dynamic schema of data based whihc we used to do all the operation on DB like Create table , Insert data, Get data , Indexing and Function (which help as dynamic)
3. `controller` it have API endpoint logic
4. `event` it have logic related to Convert ABI to it signature ,Get event logs from blockchain Decode the logs values and store them into DB
5. `module` it have logic related to DB connection and Query Execution.
6. `utils` it have logic related setup everything like create ABI signature and used that ABI signature to create table, index and function.
7. `pg-compose` this where we have compose file of DB with docker
