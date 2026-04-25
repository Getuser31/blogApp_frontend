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
            <div className="text-lg text-gray-600 font-medium">Loading user profile...</div>
        </div>
    );

    if (error) return (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md m-4 font-medium">
            Error: {error.message}
        </div>
    );

    const user = data?.getUserData;

    if (!user) return (
        <div className="p-4 text-center text-gray-500 font-medium">
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
        <div className="bg-gray-50 min-h-screen font-sans py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto p-8 bg-white shadow-sm border border-gray-200 rounded-xl">
                <div className="border-b border-gray-100 pb-5 mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">User Profile</h1>
                    <p className="text-gray-500 font-medium mt-2">Manage user details and permissions</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Name</p>
                        <p className="text-lg font-bold text-gray-900">{user.name}</p>
                    </div>
                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email</p>
                        <p className="text-lg font-bold text-gray-900">{user.email}</p>
                    </div>
                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Role</p>
                        <span
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                        {user.role?.name}
                    </span>
                    </div>
                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Created At</p>
                        <p className="text-lg font-bold text-gray-900">{user.created_at}</p>
                    </div>
                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Status</p>
                        <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border ${user.is_enabled ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
                        {user.is_enabled ? 'Enabled' : 'Disabled'}
                    </span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 border-b border-gray-100 pb-2">Update Role</h2>
                    <form className="flex flex-col sm:flex-row items-start sm:items-end gap-4 mt-4" onSubmit={handleFormSubmit}>
                        <div className="w-full sm:w-auto flex-grow">
                            <label htmlFor="role" className="block text-sm font-bold text-gray-700 mb-2">Select New
                                Role</label>
                            <select
                                id="role"
                                name="role"
                                className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 bg-white text-gray-900 font-medium transition-colors"
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
                            className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors font-bold shadow-sm"
                        >
                            Update Role
                        </button>
                    </form>
                    {message && <div className="mt-4 p-3 bg-green-50 text-green-700 text-sm font-medium rounded-md border border-green-200">{message}</div>}
                </div>
            </div>
        </div>
    );
};

export default AdminUserProfile;
