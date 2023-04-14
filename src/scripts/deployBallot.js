async function main() {
  const MyContract = await ethers.getContractFactory('MyContract');
  const myContract = await MyContract.deploy('Parallelepipedo');
  console.log('The contract \'MyContract\' (Parallelepipedo) deployed to:', myContract.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
});