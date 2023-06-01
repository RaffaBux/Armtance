# Recommended Node version for the project

`node v16.0.0`

## Available Scripts

In the project directory, you can run: </br>

### `npm start`

Downloads all the dependencies. </br>
Runs the app in the development mode: open [http://localhost:3000](http://localhost:3000) to view it in your browser. </br>

The page will reload when you make changes. </br>
You may also see any lint errors in the console. </br>

### `npm run hardhat`

Runs a Hardhat network. </br>

### `npm run compileAll`

Compiles all the Solidity contracts. </br>

# Code implementation choices

* In reality, we assume that the SelfSovereignIdentity contract has already be deployed and it is always up as well as a trusted Verifiable Credential releasers 
    official blockchain has already be recorded in it. To simulate this scenario, at code startup i reserve the first Hardhat node address to deploy SSI contract
    and addresses from fourth to sixth to record a simulated Verifiable Credential releasers test blockchain. </br>

* In reality, we assume that every time a customer decides to plan between who to split his inheritance a new Inheritance contract is deployed (a contract
    per inheritance policy). Until the moment a Verifiable Credential is given to certify the inheritance owner death, the Inheritance contract instance is stored 
    somewhere (eg. database). To simulate this scenario, at code startup i reserve the second Hardhat node address to deploy the Inheritance contract
    and the third address as the inheritance owner account. The Inheritance contract instance is saved in a state variable inside the Router component. </br>