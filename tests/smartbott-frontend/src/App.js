import logo from './logo.svg';
import { useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import idl from './idl.json';
import './App.css';

const programID = new PublicKey('J6b6rA5UJxmcuJTm1NVyegP5n6wc9brs9NAwE36W6BKQ');
const network = 'https://api.devnet.solana.com';
const opts = {
  preflightCommitment: 'processed',
};

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [program, setProgram] = useState(null);
  const [output, setOutput] = useState('');

  const getProvider = async () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new AnchorProvider(connection, window.solana, opts);
    return provider;
  };

  const connectWallet = async () => {
    if ('solana' in window) {
      const resp = await window.solana.connect();
      setWalletAddress(resp.publicKey.toString());

      const provider = await getProvider();
      const program = new Program(idl, programID, provider);
      setProgram(program);
    } else {
      alert('Install Phantom Wallet');
    }
  };

  const initialize = async () => {
    try {
      const tx = await program.methods.initialize().rpc();
      setOutput(`✅ Initialize complete! Tx: ${tx}`);
    } catch (err) {
      console.error(err);
      setOutput('❌ Initialization failed');
    }
  };

  useEffect(() => {
    const checkWallet = async () => {
      try {
        const { solana } = window;
        if (solana && solana.isPhantom) {
          const response = await solana.connect({ onlyIfTrusted: true });
          setWalletAddress(response.publicKey.toString());

          const provider = await getProvider();
          const program = new Program(idl, programID, provider);
          setProgram(program);
        }
      } catch (err) {
        console.error(err);
      }
    };
    checkWallet();
  }, []);

  return (
    <div className="App" style={{ padding: '2rem' }}>
      <h1>🚀 SmartBott Frontend</h1>

      {!walletAddress ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <>
          <p>Connected: {walletAddress}</p>
          <button onClick={initialize}>Run initialize()</button>
        </>
      )}

      <p>{output}</p>
    </div>
  );
}

export default App;
