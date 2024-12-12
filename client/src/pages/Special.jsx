import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { use } from 'react';
const Special = () => {
    const [userCounter, setUserCounter] = useState(0);
    const [userDetails, setUserDetails] = useState(null);
    const [fullInfo, setFullInfo] = useState(null);
    const [isGameLive, setIsGameLive] = useState(false);
    const [vWinner, setVWinner] = useState(0);
    
    const fetchWinner = async () => {
        try {
            const response = await fetch('http://localhost:3001/getVipWinner', {
                method: 'GET',
                credentials: 'include', // Ensures the session cookie is sent with the request
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to get VIP winner.');
            }
            const data = await response.json();
            setVWinner(data);
            //console.log('VIP Winner:', data);  // Check the response data
        } catch (err) {
            console.error('Error fetching VIP winner:', err);
        }
    };
    const startGame = async () => {
        setIsGameLive(true);
        try {
        const response = await fetch('http://localhost:3001/startVIPGame', {
            method: 'PUT',
            credentials: 'include', // Ensures the session cookie is sent with the request
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to start the game.');
        }
        } catch (err) {
        console.error('Error with VIP game table:', err);
        }
    };
    const fetchGameState = async () => {
        try {
            const response = await fetch('http://localhost:3001/gameState', {
            method: 'GET',
            credentials: 'include', // Ensures the session cookie is sent with the request
            });
            if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch game state.');
            }
            const data = await response.json();
            setIsGameLive(data.isLive === 1);  // Update the game live state
        } catch (err) {
            console.error('Error fetching game state:', err);
        }
    };
    useEffect(() => {
        fetchGameState();  // Fetch the game state on component mount
    }, []); // Empty dependency array means it runs once when the component mounts
    const updateWinnerBalance = async (userId, amount) => {
    try {
        const response = await fetch(`http://localhost:3001/updateBalance/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ amount }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update winner balance.');
        }
        console.log('Balance updated successfully for user:', userId);
    } catch (err) {
        console.error('Error updating winner balance:', err);
    }
};
    const endGame = async () => {
    setIsGameLive(false);
    try {
        const response = await fetch('http://localhost:3001/endVIPGame', {
            method: 'PUT',
            credentials: 'include',
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to END the game.');
        }
        const winnerResponse = await fetch('http://localhost:3001/getVipWinner', {
            method: 'GET',
            credentials: 'include',
        });
        if (!winnerResponse.ok) {
            const winnerErrorData = await winnerResponse.json();
            throw new Error(winnerErrorData.error || 'Failed to GET VIP winner.');
        }
        const winnerData = await winnerResponse.json();
        setVWinner(winnerData);
        if (winnerData.counter > 0) {
            await updateWinnerBalance(winnerData.id, 50); // Update the winner's balance
        }
        await fetch('http://localhost:3001/resetCounter', {
            method: 'PUT',
            credentials: 'include',
        });
    } catch (err) {
        console.error('Error ending the game:', err);
    }
};
        
    // Fetch user details
    const fetchUserDetails = async () => {
        try {
        const response = await fetch('http://localhost:3001/ratings/user', {
            method: 'GET',
            credentials: 'include', // Ensures the session cookie is sent with the request
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch user details.');
        }
        const data = await response.json();
        setUserDetails(data);
        } catch (err) {
        console.error('Error fetching user details:', err);
        }
    };
    const fetchFullInfo = async () => {
        try {
        const response = await fetch(`http://localhost:3001/getInfo/${userDetails.id}`, {
            method: 'GET',
            credentials: 'include', // Ensures the session cookie is sent with the request
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch user details.');
        }
        const data = await response.json();
        //console.log(data);
        setFullInfo(data);
        } catch (err) {
        console.error('Error fetching user FULL info:', err);
        }
    };
    // Fetch user counter
    const fetchUserCounters = async (userId) => {
        if (fullInfo.is_vip) {
        try {
        const response = await fetch(`http://localhost:3001/vip/${userId}`, {
            method: 'GET',
            credentials: 'include',
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch VIP counter.');
        }
        const data = await response.json();
        if (data.length > 0) {
            setUserCounter(data.counter || 0);
        }
        } catch (err) {
        console.error('Error fetching user counters:', err);
        }
    }
    
    else {
        setUserCounter(0);
    }
    };
    useEffect(() => {
        fetchUserDetails();
    }, []);
    useEffect(() => {
        fetchWinner();
    }, [fullInfo?.[0]?.counter]);
    useEffect(() => {
        if (userDetails?.id) {
        //fetchUserCounters(userDetails.id);
        fetchFullInfo();
        }
    }, [userDetails]);
    const incrementCounter = async (userId) => {
        try {
        const response = await fetch(`http://localhost:3001/increment-counter/${userId}`, {
            method: 'PUT',
            credentials: 'include',
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch VIP counter.');
        }
        //const data = await response.json();
        //console.log('After increment:', data);
        setFullInfo((prev) => {
            const updatedInfo = [...prev];
            updatedInfo[0].counter += 1; // Increment counter locally
            return updatedInfo;
        });
        } catch (err) {
        console.error('Error fetching user counters:', err);
        }
        setUserCounter((prev) => prev + 1);
    };
    if (!userDetails || !fullInfo) {
        return <div>Loading...
        </div>; // Add loading state while data is being fetched
    }
    //console.log(fullInfo[0].is_vip);
    if (fullInfo && fullInfo[0]?.role === 'admin') {
        return (
            <>
                <Navbar />
                <div className="bg-gradient-to-r from-[#CADCFC] to-[#89ABE3] h-screen flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        <h1 className="text-7xl font-bold mb-14">You are Admin</h1>
                        {/* Display game status */}
                        {isGameLive && <h2 className="text-2xl font-semibold mb-8">The game is now live!</h2>}
                        {/* Start Game Button */}
                        <button
                            onClick={startGame}
                            disabled={isGameLive}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
                        >
                            Start VIP Game
                        </button>
                        {/* End Game Button */}
                        <button
                            onClick={endGame}
                            disabled={!isGameLive}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                            End Game
                        </button>
                        {!isGameLive && vWinner && vWinner.counter > 0 && (
                                <>
                                    <h1 className="text-xl font-bold mb-6 mt-10">
                                        Congratulations, {vWinner.username || 'VIP Winner'}!
                                    </h1>
                                    <p className="text-2xl font-semibold text-green-700">
                                        $50 sent to {vWinner.username}.
                                    </p>
                                </>
                           
                            )}
                    </div>
                </div>
            </>
        );
    }
    //if game not live and not VIP
    if (!isGameLive && fullInfo[0].is_vip !== 1) {
        return (
            <>
            <Navbar />
            <div className="bg-gradient-to-r from-[#CADCFC] to-[#89ABE3] h-screen flex items-center justify-center">  
                <div className="flex flex-col items-center">
                <h1 className="text-7xl text-black font-bold mb-14">Game is Not Live. Please Come back Later</h1>
                </div>
            </div>
            </>
        )
    }
    //if not VIP
    if (!fullInfo[0].is_vip) {
        
        return (
            <>
            <Navbar />
            <div className="bg-gradient-to-r from-[#CADCFC] to-[#89ABE3] h-screen flex items-center justify-center">
                <div className="flex flex-col items-center">
                <h1 className="text-7xl text-red-800 font-bold mb-14">Error: You are not VIP</h1>
             
                
                </div>
            </div>
            </>
        );
    }
    //if vip
    return (
        <>
        <Navbar />
        <div className="bg-gradient-to-r from-[#CADCFC] to-[#89ABE3] h-screen flex items-center justify-center">
            <div className="flex flex-col items-center">
            <h1 className="text-7xl font-bold mb-14">Welcome to VIP-Special</h1>
            {isGameLive && <h2 className="text-lg font-semibold mb-8">The game is now live! Get the highest counter to earn $50</h2>}
            {/* Display the counter */}
            {isGameLive && (
                <>
                    <h3 className="text-xl font-bold mt-6">Counter: {fullInfo[0].counter}</h3>
                    {/* Button to increase the counter */}
                    <button
                        onClick={ () => incrementCounter(fullInfo[0].id)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                    >
                        Increment Counter
                    </button>
                </>
                )
            }
             
            
            </div>
        </div>
        </>
    );
    };
    
export default Special;