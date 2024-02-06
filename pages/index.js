import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [password, setPassword] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({method: "eth_accounts"});
      handleAccount(accounts);
    }
  }

  const handleAccount = (accounts) => {
    if (accounts.length > 0) {
      console.log ("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  }

  const getBalance = async() => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }

  const deposit = async() => {
    if (atm) {
      if (password === "ghjk") {
        let tx = await atm.deposit(1);
        setTransactionStatus(`Deposit Transaction Sent: ${tx.hash}`);
        await tx.wait()
        getBalance();
      } else {
        setTransactionStatus("Incorrect password. Deposit transaction cancelled.");
      }
    }
  }

  const withdraw = async() => {
    if (atm) {
      if (password === "ghjk") {
        let tx = await atm.withdraw(1);
        setTransactionStatus(`Withdraw Transaction Sent: ${tx.hash}`);
        await tx.wait()
        getBalance();
      } else {
        setTransactionStatus("Incorrect password. Withdraw transaction cancelled.");
      }
    }
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  }
// Your existing React code with other functions and states

const changePassword = async () => {
  if (atm) {
    if (password === "ghjk") {
      let tx = await atm.changePassword(newPassword);
      setTransactionStatus(`Change Password Transaction Sent: ${tx.hash}`);
      await tx.wait();
      setPassword(""); // Clear current password
      setNewPassword(""); // Clear new password field
    } else {
      setTransactionStatus("Incorrect password. Change password transaction cancelled.");
    }
  }
}

// Your existing React code with other functions and states


  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <input type="password" placeholder="Enter password" value={password} onChange={handlePasswordChange} />
        <input type="password" placeholder="Enter new password" value={newPassword} onChange={handleNewPasswordChange} />
        <button onClick={deposit}>Deposit 1 ETH</button>
        <button onClick={withdraw}>Withdraw 1 ETH</button>
        <button onClick={changePassword}>Change Password</button>
        <p>{transactionStatus}</p>
      </div>
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main className="container">
      <header><h1>Welcome to the Metacrafters ATM!</h1></header>
      {initUser()}
      <div className="keyboard">
        {Array.from("abcdefghijklmnopqrstuvwxyz").map((char, index) => (
          <button key={index} onClick={() => setPassword(prevPassword => prevPassword + char)} style={{fontSize: "20px"}}>{char}</button>
        ))}
      </div>
      <footer>
        <p>Owner Details:</p>
        <p>Name: Pushpa</p>
        <p>Age: 21</p>
        <p>Country: India</p>
        <p>Religion: Hindu</p>
        <p>Annual Income: $67,948</p>
        <p>Investment: $5,000</p>
      </footer>
      <style jsx>{`
        .container {
          text-align: center;
          background-color: brown;
          padding-bottom: 20px;
        }
        .keyboard {
          margin-top: 20px;
        }
        footer {
          background-color: #fff;
          padding: 10px;
          border-radius: 5px;
          margin-top: 20px;
        }
      `}
      </style>
    </main>
  )
}
