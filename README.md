
## ETH_Module_2
## Decentralized Book Store
The Decentralized Book Store project implements a smart contract on the Ethereum blockchain using Solidity and Hardhat. It allows users to buy and return books while managing the available stock securely. The contract owner can also retrieve the book and owner details.

## Description
The Decentralized Book Store smart contract is designed to create a decentralized platform where users can purchase and return books. The contract includes functionalities for retrieving book and owner details, managed securely by the contract owner.
## Getting Started
### Installing

1. Clone the project repository from GitHub.
2. Navigate to the project directory.
3. Run the following command to install necessary dependencies:
``
   npm i
``

## Sample Smart Contract Code

``` javascript
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BookStore {
    string public bookName;
    uint public stock;
    address public owner;

    mapping(address => uint) public userPurchases; 

    
    constructor(string memory _bookName, uint _stock) {
        bookName = _bookName;
        stock = _stock;
        owner = msg.sender;
    }

   
    function buyBook(uint _quantity) public {
        require(_quantity > 0, "Quantity must be greater than zero");
        require(_quantity <= stock, "Not enough stock available");

        stock -= _quantity;
        userPurchases[msg.sender] += _quantity;
    }

  
    function returnBook(uint _quantity) public {
        require(_quantity > 0, "Quantity must be greater than zero");
        require(userPurchases[msg.sender] >= _quantity, "You have not bought enough books to return");

        stock += _quantity;
        userPurchases[msg.sender] -= _quantity;

        
        emit ReturnSuccessful("Return successful, refund initiated");
    }

    
    function getBookDetails() public view returns (string memory, uint) {
        return (bookName, stock);
    }

  
    function getOwnerDetails() public view returns (address) {
        return owner;
    }

    
    event ReturnSuccessful(string message);
}

```


## Executing program

1. Open three terminals in your VS Code and navigate to the project directory in each terminal.
2. In the first terminal, start the local blockchain node:


   ``
    npx hardhat node
   ``
4. In the second terminal, deploy the contract to the local blockchain network:


   ``
    npx hardhat run --network localhost scripts/deploy.js
   ``
6. Again in the first terminal, launch the front-end of the project:


   ``
    npm run dev
   ``

   
The project should now be running on your localhost, typically at http://localhost:3000/.


## Working

After deploying the contract, document the deployed contract address and place it in the required parts of the project files. Develop the project’s frontend to establish a connection with the MetaMask wallet, directing the user to the wallet page for transaction approvals. Users will be able to buy and return books, which will redirect them to MetaMask to authorize transactions.

## Help
If you encounter any issues or need further assistance, refer to the help command within the project.


``
    npx hardhat help
``
## Authors

Contributors names and contact info:

Yukta[https://www.linkedin.com/in/yukta-/]

## License
This project is licensed under the MIT License - see the LICENSE.md file for details.
