// App.js
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contractAbi, contractAddress } from './Constant/constant'; // Import your contract ABI and address
import VotingContract from './VotingContract'; // Assume you have a component for interacting with the contract
import './App.css';

function App() {
    const [provider, setProvider] = useState(null);
    const [account, setAccount] = useState(null);
    const [connected, setConnected] = useState(false);
    const [votingContract, setVotingContract] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [votingStatus, setVotingStatus] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0);
    const [winner, setWinner] = useState(null);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        connectToWallet();
    }, [connectToWallet]);
    useEffect(() => {
      async function fetchData() {
          await fetchCandidates();
          await fetchVotingStatus();
          await fetchRemainingTime();
  
          // Call fetchWinner when voting ends
          if (!votingStatus) {
              await fetchWinner();
          }
      }
  
      fetchData();
  }, [provider, votingStatus, fetchCandidates, fetchVotingStatus, fetchRemainingTime, fetchWinner]);
  


    async function connectToWallet() {
        if (window.ethereum) {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const accounts = await provider.send('eth_requestAccounts', []);
                const signer = provider.getSigner();
                setProvider(provider);
                setAccount(accounts[0]);
                setConnected(true);
                const contract = new ethers.Contract(contractAddress, contractAbi, signer);
                setVotingContract(contract);
                checkOwner(contract, accounts[0]);
            } catch (error) {
                console.error('Error connecting to wallet:', error);
            }
        } else {
            console.error('MetaMask not detected');
        }
    }

    async function checkOwner(contract, account) {
        const owner = await contract.getOwner();
        setIsOwner(owner.toLowerCase() === account.toLowerCase());
    }

    async function fetchCandidates() {
        const candidates = await votingContract.getAllVotesOfCandidates();
        setCandidates(candidates);
    }

    async function fetchVotingStatus() {
        const status = await votingContract.getVotingStatus();
        setVotingStatus(status);
    }

    async function fetchRemainingTime() {
        const time = await votingContract.getRemainingTime();
        setRemainingTime(time);
    }

    async function fetchWinner() {
        const [name, voteCount] = await votingContract.getWinner();
        setWinner({ name, voteCount });
    }

    async function startVoting() {
        try {
            await votingContract.startVoting();
            await fetchVotingStatus();
            await fetchRemainingTime();
        } catch (error) {
            console.error('Error starting voting:', error);
        }
    }

    async function vote(candidateIndex) {
        try {
            await votingContract.vote(candidateIndex);
            await fetchCandidates();
        } catch (error) {
            console.error('Error voting:', error);
        }
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>Voting App</h1>
                {connected && <p>Connected Account: {account}</p>}
                {isOwner && <button onClick={startVoting}>Start Voting</button>}
                <VotingContract
                    candidates={candidates}
                    votingStatus={votingStatus}
                    remainingTime={remainingTime}
                    winner={winner}
                    onVote={vote}
                />
            </header>
        </div>
    );
}

export default App;
