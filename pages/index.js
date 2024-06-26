import { useState, useEffect } from "react";
import { ethers } from "ethers";
import bookStoreAbi from "../artifacts/contracts/BookStore.sol/BookStore.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [bookStore, setBookStore] = useState(undefined);
  const [bookDetails, setBookDetails] = useState({ name: "", stock: 0 });
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 
  const bookStoreABI = bookStoreAbi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
    } else {
      setAccount(undefined);
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    try {
      const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
      handleAccount(accounts);
      getBookStoreContract();
    } catch (error) {
      setMessage("Error connecting account: " + (error.message || error));
    }
  };

  const getBookStoreContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const bookStoreContract = new ethers.Contract(contractAddress, bookStoreABI, signer);

    setBookStore(bookStoreContract);
  };

  const fetchBookDetails = async () => {
    if (bookStore) {
      const name = await bookStore.bookName();
      const stock = await bookStore.stock();
      setBookDetails({ name, stock: stock.toNumber() });
    }
  };

  const buyBook = async () => {
    setMessage("");
    if (bookStore && account) {
      try {
        const totalCost = ethers.utils.parseEther((quantity * 0.01).toString());
        const tx = await bookStore.buyBook(quantity, { value: totalCost });
        await tx.wait();
        fetchBookDetails();
        setMessage("Book(s) purchased successfully!");
      } catch (error) {
        if (error.code === "ACTION_REJECTED") {
          setMessage("Book Purchase Failed: Unable to complete transaction!     ");
        } else {
          setMessage("Book Purchase Failed: Unable to purchase books.");
        }
      }
    }
  };
  
  const returnBook = async () => {
    setMessage("");
    if (bookStore && account) {
      try {
        const gasLimit = 100000;    
        const tx = await bookStore.returnBook(quantity, {
          gasLimit: ethers.BigNumber.from(gasLimit),
        });
        await tx.wait();
        fetchBookDetails();
        setMessage("Book(s) returned successfully!");
      } catch (error) {
        if (error.code === "ACTION_REJECTED") {
          setMessage("Book Return Failed: Unable to complete transaction!");
        } else {
          setMessage("Book Return Failed: Unable to return books.");
        }
      }
    }
  };  

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install MetaMask to use this bookstore.</p>;
    }

    if (!account) {
      return (
        <button onClick={connectAccount}>Connect MetaMask Wallet</button>
      );
    }

    if (bookDetails.stock === 0) {
      fetchBookDetails();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Book: {bookDetails.name}</p>
        <p>Stock: {bookDetails.stock}</p>
        <div className="button-container">
          <input 
            type="number" 
            value={quantity} 
            onChange={(e) => setQuantity(Number(e.target.value))} 
            min="1" 
            max={bookDetails.stock} 
          />
          <button onClick={buyBook}>Buy Book(s)</button>
          <button onClick={returnBook}>Return Book(s)</button>
        </div>
        {message && <p><strong>{message}</strong></p>}
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Book Portal: Step Into a World of Books </h1>
      </header>
      {initUser()}
      <style jsx>{`
.container {
    text-align: center;
    background-size: cover;
    background-position: center;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #333;
    font-family: 'Roboto', sans-serif;
    background-color:#98FF98;
    padding: 20px;
  }
  
  header h1 {
    font-size: 3rem; /* Increased font size for emphasis */
    font-weight: bold;
    text-shadow: 1px 2px 4px rgba(0, 0, 0, 0.2); /* Enhanced text shadow for depth */
    margin-bottom: 20px; /* Slightly reduced margin for better spacing */
    color: #333; /* Changed color for better contrast */
    letter-spacing: 0.5px; /* Slightly reduced letter spacing for readability */
    text-transform: uppercase; /* Added uppercase transformation for emphasis */
    font-family: 'Arial', sans-serif; /* Ensured font consistency */
  }
  
  
  .button-container {
    margin-top: 30px;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
  }
  
  button {
    padding: 15px 30px;
    font-size: 18px;
    color: #fff;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
    max-width: 300px;
    width: 100%;
    background-image: linear-gradient(45deg, #42a5f5 0%, #1976d2 100%);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
    position: relative;
    overflow: hidden;
  }
  
  button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);
    transition: left 0.3s ease;
  }
  
  button:hover::before {
    left: 100%;
  }
  
  button:hover {
    transform: scale(1.05);
    background-image: linear-gradient(45deg, #1976d2 0%, #42a5f5 100%);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
  }
  
  button:active {
    transform: scale(0.95);
  }
  
  input {
    padding: 10px;
    font-size: 18px;
    border-radius: 8px;
    border: 1px solid #ccc;
    width: 60px;
    text-align: center;
    margin-right: 10px;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }
  
  input:focus {
    border-color: #42a5f5;
    box-shadow: 0 0 5px rgba(66, 165, 245, 0.5);
    outline: none;
  }
  
  p {
    margin: 15px 0;
    font-size: 1.4rem;
    line-height: 1.8;
    color: #333;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  p:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  }
  
  .message {
    margin-top: 25px;
    padding: 15px 25px;
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.95);
    color: #333;
    font-weight: bold;
    max-width: 400px;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .message:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }
  
  /* Responsive Design */
  @media (max-width: 768px) {
    header h1 {
      font-size: 2rem;
    }
  
    button {
      font-size: 16px;
      padding: 12px 24px;
    }
  
    p {
      font-size: 1.2rem;
    }
  
    .message {
      font-size: 1rem;
      padding: 10px 20px;
    }
  }
  
  
  
`}</style>
    </main>
  );
}
