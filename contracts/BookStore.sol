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

