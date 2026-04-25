import React from "react";
import {GET_USERS} from "../../../graphql/queries.js";
import {useMutation, useQuery} from "@apollo/client/react";
import {UPDATE_USER_STATUS} from "../../../graphql/mutations.js";
import { FaPen } from "react-icons/fa";
import {Link} from "react-router-dom";

const UsersList = () => {
    const {loading, error, data} = useQuery(GET_USERS);
    const [userStatus, {loading: statusLoading, error: statusError}] = useMutation(UPDATE_USER_STATUS)
    if (loading) return <div className="flex justify-center items-center h-64"><p className="text-gray-600 font-medium">Loading users...</p></div>
    if (error) return <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md m-4 font-medium">Error: {error.message}</div>

    const handleUserStatus = async (id) => {
        try {
            await userStatus({variables: {id}});
        } catch (error) {
            console.error('Error updating user status:', error);
        }
    }


    return (
        <div className="bg-gray-50 min-h-screen font-sans py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Users Management</h1>
                </div>
                <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                            {data && data.users.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">#{user.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200">
                                                <span className="text-xs font-bold text-indigo-700">{user.name.charAt(0).toUpperCase()}</span>
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-bold text-gray-900">{user.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                            {user.role.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button 
                                            onClick={() => handleUserStatus(user.id)} 
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${user.is_enabled ? 'bg-green-100 text-green-800 hover:bg-green-200 focus:ring-green-500' : 'bg-red-100 text-red-800 hover:bg-red-200 focus:ring-red-500'}`}
                                            title={user.is_enabled ? "Click to disable" : "Click to enable"}
                                        >
                                            {user.is_enabled ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link to={`/admin/user/${user.id}`} className="inline-flex items-center justify-center text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-lg transition-colors">
                                            <FaPen className="w-4 h-4" />
                                            <span className="sr-only">Edit</span>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        {(!data || !data.users || data.users.length === 0) && (
                            <div className="text-center py-12">
                                <p className="text-gray-500 font-medium text-lg">No users found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UsersList;
