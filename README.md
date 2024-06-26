# Book Store

This project implements a decentralized book store smart contract on the Ethereum blockchain using Solidity and Hardhat.

## Features 
#### Buy Book:&nbsp; Purchase books from the store.
#### Return Book\: Return books previously purchased.
#### Get Book Details\: Retrieve details about the available stock.
#### Get Owner Details\: Retrieve the owner's address of the book store.

## Prerequisites
#### Node.js and npm installed
#### Metamask extension installed in your browser
#### Basic knowledge of Ethereum, Solidity, and JavaScript

### Executing the program
To run this program, you can use Remix, an online Solidity IDE. Follow these steps:

Navigate to Remix: Open your web browser and go to Remix Ethereum.

Create a New File: In the Remix IDE, create a new file by clicking the "+" icon in the left-hand sidebar. Save the file with a .sol extension, for example, ShoppingPlatform.sol.

Copy and Paste the Code: Copy the provided smart contract code and paste it into the new file. solidity Copy code

```js
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
After creating this file we will have to deploy it using hardhat so we follow the following instructions:

1. Inside the project directory, in the terminal type: npm i
2. Open two additional terminals in your VS code
3. In the second terminal type: npx hardhat node
4. In the third terminal, type: npx hardhat run --network localhost scripts/deploy.js
5. Back in the first terminal, type npm run dev to launch the front-end.

After this, the project will be running on your localhost. 
Typically at http://localhost:3000/

We will note down the deployed contract address and after that we will create a frontend for the project and then create a connection with the metamask wallet ans then direct the user to the wallet page whenever any transaction is to be made.

## Authors
Yukta
[@Chandigarh University](https://www.linkedin.com/in/yukta-/)
## License
This project is licensed under the MIT License - see the LICENSE file for details.
