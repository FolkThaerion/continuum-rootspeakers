const fs = require("fs");
const path = require("path");
const solc = require("solc");

const file = "contracts/GenesisRootspeakers.sol";
const source = fs.readFileSync(file, "utf8");

function findImports(importPath) {
  try {
    const fullPath = path.resolve("node_modules", importPath);
    return { contents: fs.readFileSync(fullPath, "utf8") };
  } catch (e) {
    try {
      return { contents: fs.readFileSync(importPath, "utf8") };
    } catch (err) {
      return { error: "File not found: " + importPath };
    }
  }
}

const input = {
  language: "Solidity",
  sources: {
    [file]: { content: source },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode"],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

if (output.errors) {
  for (const err of output.errors) {
    console.log(err.formattedMessage);
  }
}

const contract = output.contracts[file]["GenesisRootspeakers"];
fs.mkdirSync("build", { recursive: true });
fs.writeFileSync("build/GenesisRootspeakers.abi.json", JSON.stringify(contract.abi, null, 2));
fs.writeFileSync("build/GenesisRootspeakers.bytecode.txt", contract.evm.bytecode.object);

console.log("Compiled successfully");
