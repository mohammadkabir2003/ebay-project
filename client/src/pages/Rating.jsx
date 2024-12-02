import React from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import Auth from './Authentication'
import { useEffect } from 'react'
import { useState } from 'react'

const Rating = () => {
    const [pendingUsers, setPendingUsers] = useState([]);

    // Fetch pending users on component mount
    useEffect(() => {
        fetch('http://localhost:3000/users')
        .then((res) => res.json())
        .then((data) => setPendingUsers(data))
        .catch((err) => console.error('Error fetching users:', err));
    }, []);
    return (
        <>
            <Navbar />
            
                <div className="bg-gradient-to-r from-[#CADCFC] to-[#89ABE3] h-screen flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        <h2 className="text-2xl font-bold text-center mb-6">Rate Buyers</h2>

                        <table className="min-w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 p-2 text-left">Name</th>
                                <th className="border border-gray-300 p-2 text-left">Username</th>
                                <th className="border border-gray-300 p-2 text-left">Email</th>
                                <th className="border border-gray-300 p-2 text-center">Rate</th>
                            </tr>
                        </thead>

                        <tbody>
                        {pendingUsers.map((user) => (
                            <tr key={user.id} className="bg-gray-50">
                                <td className="border border-gray-300 p-2">{user.name}</td>
                                <td className="border border-gray-300 p-2">{user.username}</td>
                                <td className="border border-gray-300 p-2">{user.email}</td>
                                <td className="border border-gray-300 p-2 text-center space-x-2">
                                    <select defaultValue={0}>
                                        <option value={0} disabled></option>
                                        <option value = {1}>1</option>
                                        <option value = {2}>2</option>
                                        <option value = {3}>3</option>
                                        <option value = {4}>4</option>
                                        <option value = {5}>5</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                        {pendingUsers.length === 0 && (
                            <tr>
                            <td
                                colSpan="4"
                                className="border border-gray-300 p-2 text-center text-gray-500"
                            >
                                No pending users
                            </td>
                            </tr>
                        )}
                        </tbody>
                        </table >

                        <h2 className="text-2xl font-bold text-center mb-6 pt-10">Rate Sellers</h2>

                        <table className="min-w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 p-2 text-left">Name</th>
                                <th className="border border-gray-300 p-2 text-left">Username</th>
                                <th className="border border-gray-300 p-2 text-left">Email</th>
                                <th className="border border-gray-300 p-2 text-center">Rate</th>
                            </tr>
                        </thead>

                        <tbody>
                        {pendingUsers.map((user) => (
                            <tr key={user.id} className="bg-gray-50">
                                <td className="border border-gray-300 p-2">{user.name}</td>
                                <td className="border border-gray-300 p-2">{user.username}</td>
                                <td className="border border-gray-300 p-2">{user.email}</td>
                                <td className="border border-gray-300 p-2 text-center space-x-2">
                                    <select defaultValue={0}>
                                        <option value={0} disabled></option>
                                        <option value = {1}>1</option>
                                        <option value = {2}>2</option>
                                        <option value = {3}>3</option>
                                        <option value = {4}>4</option>
                                        <option value = {5}>5</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                        {pendingUsers.length === 0 && (
                            <tr>
                            <td
                                colSpan="4"
                                className="border border-gray-300 p-2 text-center text-gray-500"
                            >
                                No pending users
                            </td>
                            </tr>
                        )}
                        </tbody>
                        </table >
                    </div>
                    </div>

                    
                
                
        
        </>
    )
    }

export default Rating