import React from "react";
import {GET_USERS} from "../../../graphql/queries.js";
import {useMutation, useQuery} from "@apollo/client/react";
import {UPDATE_USER_STATUS} from "../../../graphql/mutations.js";

const UsersList = () => {
    const {loading, error, data} = useQuery(GET_USERS);
    const [userStatus, {loading: statusLoading, error: statusError}] = useMutation(UPDATE_USER_STATUS)
    if (loading) return <p className="text-white">Loading...</p>
    if (error) return <p className="text-red-500">Error: {error.message}</p>

    const handleUserStatus = async (id) => {
        try {
            await userStatus({variables: {id}});
        } catch (error) {
            console.error('Error updating user status:', error);
        }
    }


    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans p-8">
            <div className="container mx-auto">
                <h1 className="text-4xl font-extrabold text-indigo-400 mb-8">Users List</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                        <thead className="bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Enabled</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                        {data && data.users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-700 transition-colors duration-200">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.role.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    <span onClick={() => handleUserStatus(user.id)} 
                                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${user.is_enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {user.is_enabled ? 'Yes' : 'No'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default UsersList;