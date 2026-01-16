import React, {useState} from "react";
import {useParams} from "react-router-dom";
import {useMutation, useQuery} from "@apollo/client/react";
import {GET_ADMIN_USER_PROFILE, GET_ROLES} from "../../../graphql/queries.js";
import {UPDATE_USER_ROLE} from "../../../graphql/mutations.js";

const AdminUserProfile = () => {
    const {id: userId} = useParams();
    const [message, setMessage] = useState(null)

    const {loading, error, data} = useQuery(GET_ADMIN_USER_PROFILE, {
        variables: {userId: userId}
    });

    const {loading: loadingRole, error: errorRole, data: roleData} = useQuery(GET_ROLES);
    const [roleUpdate, {loading: roleLoading, error: roleError}] = useMutation(UPDATE_USER_ROLE)

    const roles = roleData?.getRoles;

    if (loading || loadingRole) return (
        <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">Loading user profile...</div>
        </div>
    );

    if (error) return (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md m-4">
            Error: {error.message}
        </div>
    );

    const user = data?.getUserData;

    if (!user) return (
        <div className="p-4 text-center text-gray-500">
            User not found.
        </div>
    );

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const newRole = formData.get('role');
        console.log(newRole)

        if (newRole) {
            try {
                await roleUpdate({variables: {userId: userId, roleId: newRole}});
                setMessage('Role updated successfully');

            } catch (error) {
                console.error('Error updating role:', error);
            }
        }
    }

    return (
        <div className="bg-gray-900 min-h-screen text-white font-sans pt-10">
            <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl border border-gray-100">
                <div className="border-b pb-4 mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">User Profile</h1>
                    <p className="text-gray-500 mt-1">Manage user details and permissions</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Name</p>
                        <p className="text-lg font-medium text-gray-900">{user.name}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email</p>
                        <p className="text-lg font-medium text-gray-900">{user.email}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Role</p>
                        <span
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {user.role?.name}
                    </span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Created At</p>
                        <p className="text-lg font-medium text-gray-900">{user.created_at}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Status</p>
                        <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${user.is_enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {user.is_enabled ? 'Enabled' : 'Disabled'}
                    </span>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Update Role</h2>
                    <form className="flex flex-col sm:flex-row items-start sm:items-end gap-4" onSubmit={handleFormSubmit}>
                        <div className="w-full sm:w-auto flex-grow">
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Select New
                                Role</label>
                            <select
                                id="role"
                                name="role"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border bg-white text-gray-900"
                                defaultValue={user.role?.id || ""}
                            >
                                <option value="" disabled>Select a role</option>
                                {roles?.map(role => (
                                    <option key={role.id} value={role.id}>{role.name}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-2.5 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors font-medium shadow-sm"
                        >
                            Update Role
                        </button>
                    </form>
                    {message && <p className="text-green-500 mt-2">{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default AdminUserProfile;