module.exports = {
  solidityLog: {
    displayPrefix: "[LOG] ",
    preventConsoleLogMigration: true
  },
  networks: {
    // development: {
    //   host: "127.0.0.1",
    //   port: 7545,
    //   network_id: "*"
    // },
    reserved: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    }
  },
  contracts_directory: "./contracts",
  contracts_build_directory: "./src/artifacts",
  migrations_directory: "./migrations", 
  compilers: {
    solc: {
      version: "0.8.19",
      language: "Solidity",
      debug: {
        revertStrings: "debug",
        debugInfo: ["location", "snippet"]
      },
      settings: {
        optimizer: {
          enabled: true,
          details: {
            peephole: true,
            inliner: true,
            jumpdestRemover: true,
            orderLiterals: true,
            deduplicate: true,
            cse: true,
            constantOptimizer: true,
            yul: true,
            yulDetails: {
              stackAllocation: true,
              optimizerSteps: "dhfoDgvulfnTUtnIf"
            }
          }
        }
      }
    }
  }
};