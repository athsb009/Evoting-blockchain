// VotingContract.js
import React, { useState, useEffect } from 'react';

function VotingContract({ candidates, votingStatus, remainingTime, winner, onVote }) {
    const [selectedCandidateIndex, setSelectedCandidateIndex] = useState(null);

    useEffect(() => {
        // Additional initialization or data fetching can be done here
    }, []);

    function handleVote() {
        if (selectedCandidateIndex !== null) {
            onVote(selectedCandidateIndex);
            setSelectedCandidateIndex(null);
        } else {
            alert('Please select a candidate to vote for.');
        }
    }

    return (
        <div>
            <h2>Voting Contract Information</h2>
            <p>Voting Status: {votingStatus ? 'Voting in progress' : 'Voting ended'}</p>
            <p>Remaining Time: {remainingTime} seconds</p>
            <h3>Candidates:</h3>
            <ul>
                {candidates.map((candidate, index) => (
                    <li key={index}>
                        {candidate.name} - Votes: {candidate.voteCount}
                        <button onClick={() => setSelectedCandidateIndex(index)}>Vote</button>
                    </li>
                ))}
            </ul>
            {votingStatus && (
                <button onClick={handleVote}>Vote</button>
            )}
            {!votingStatus && winner && (
                <p>Winner: {winner.name} - Votes: {winner.voteCount}</p>
            )}
        </div>
    );
}

export default VotingContract;
