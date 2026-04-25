import React from "react";
import {useMutation, useQuery} from "@apollo/client/react";
import {USER_DATA} from "../../graphql/queries.js";
import {useAuth} from "../../AuthContext.jsx";
import {Link} from "react-router-dom";
import {UPDATE_EMAIL, UPDATE_PASSWORD} from "../../graphql/mutations.js";

const Card = ({title, children}) => (
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 min-h-[474px] flex flex-col">
        <h2 className="text-2xl mb-6 font-bold text-gray-900">{title}</h2>
        {children}
    </div>
);

const UserProfile = () => {
    const {user, loading: authLoading} = useAuth();
    const [isPasswordFormHidden, setIsPasswordFormHidden] = React.useState(true);
    const [isEmailFormHidden, setIsEmailFormHidden] = React.useState(true);
    const [userPasswordForm, setUserPasswordForm] = React.useState({
        oldPassword: '',
        password: '',
        passwordRepeat: ''
    });
    const [userEmailForm, setUserEmailForm] = React.useState({
        email: ''
    })
    const [formErrors, setFormErrors] = React.useState({});
    const [successMessage, setSuccessMessage] = React.useState('');

    const {loading, error, data} = useQuery(USER_DATA, {
        variables: {userId: user?.id},
        skip: authLoading || !user,
    });

    const [userPassword, {loading: passwordLoading}] = useMutation(UPDATE_PASSWORD);
    const [userEmail, {loading: emailLoading}] = useMutation(UPDATE_EMAIL)

    const userData = data?.getUserData;
    const favoriteArticles = userData?.favoriteArticles;
    const lastReadArticles = userData?.lastReadArticles;

    if (loading || authLoading || !userData) {
        return <div className="p-8 font-sans text-gray-900 text-center font-medium">Loading...</div>;
    }

    if (error) {
        return <div className="p-8 font-sans text-red-600 text-center font-medium">Error: {error.message}</div>;
    }

    const handlePasswordChange = (e) => {
        const {name, value} = e.target;
        setUserPasswordForm(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field when user types
        if (formErrors[name]) {
            setFormErrors(prev => {
                const newErrors = {...prev};
                delete newErrors[name];
                return newErrors;
            });
        }
        if (formErrors.form) {
            setFormErrors(prev => {
                const newErrors = {...prev};
                delete newErrors.form;
                return newErrors;
            });
        }
        if (successMessage) setSuccessMessage('');
    };

    const handleEmailChange = (e) => {
        const {name, value} = e.target;
        setUserEmailForm(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field when user types
        if (formErrors[name]) {
            setFormErrors(prev => {
                const newErrors = {...prev};
                delete newErrors[name];
                return newErrors;
            });
        }
        if (formErrors.emailForm) {
            setFormErrors(prev => {
                const newErrors = {...prev};
                delete newErrors.emailForm;
                return newErrors;
            });
        }
        if (successMessage) setSuccessMessage('');
    };

    const validatePasswordForm = () => {
        const errors = {};
        if (!userPasswordForm.oldPassword) errors.oldPassword = "Current password is required";
        if (!userPasswordForm.password) errors.password = "New password is required";
        if (!userPasswordForm.passwordRepeat) errors.passwordRepeat = "Confirm password is required";
        if (userPasswordForm.password && userPasswordForm.passwordRepeat && userPasswordForm.password !== userPasswordForm.passwordRepeat) {
            errors.passwordRepeat = "Passwords do not match";
        }
        return errors;
    };

    const validateEmailForm = () => {
        const errors = {};
        if (!userEmailForm.email) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(userEmailForm.email)) {
            errors.email = "Email is invalid";
        }
        return errors;
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        const errors = validatePasswordForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            await userPassword({
                variables: {
                    oldPassword: userPasswordForm.oldPassword,
                    password: userPasswordForm.password,
                    passwordRepeat: userPasswordForm.passwordRepeat
                }
            });
            setSuccessMessage("Password updated successfully!");
            setUserPasswordForm({oldPassword: '', password: '', passwordRepeat: ''});
            setFormErrors({});
            setTimeout(() => {
                setIsPasswordFormHidden(true);
                setSuccessMessage('');
            }, 2000);
        } catch (e) {
            console.error('Password update failed:', e.message);
            setFormErrors({form: e.message});
        }
    }

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        const errors = validateEmailForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            await userEmail({
                variables: {
                    email: userEmailForm.email
                }
            })
            setSuccessMessage("Email updated successfully!");
            setUserEmailForm({email: ''});
            setFormErrors({});
            setTimeout(() => {
                setIsEmailFormHidden(true);
                setSuccessMessage('');
            }, 2000);
        } catch (e) {
            console.error('Email update failed:', e.message);
            setFormErrors({emailForm: e.message});
        }

    }

    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Profile Card */}
                <Card title="Profile">
                    <div className="text-lg mb-8 flex-grow text-gray-700">
                        <p className="mb-4"><span className="font-bold text-gray-900">Username:</span> {userData.name}</p>
                        <p><span className="font-bold text-gray-900">Email:</span> {userData.email}</p>
                    </div>

                    <form hidden={isPasswordFormHidden} onSubmit={handlePasswordSubmit}
                          className="mb-6 p-6 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                        <div className="space-y-4">
                            {formErrors.form && <div className="text-red-600 text-sm font-medium mb-2">{formErrors.form}</div>}
                            {successMessage && <div className="text-green-600 text-sm font-medium mb-2">{successMessage}</div>}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Enter your current
                                    Password</label>
                                <input
                                    type='password'
                                    name="oldPassword"
                                    value={userPasswordForm.oldPassword}
                                    onChange={handlePasswordChange}
                                    className={`w-full px-4 py-2 border ${formErrors.oldPassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
                                />
                                {formErrors.oldPassword &&
                                    <p className="text-red-500 text-xs font-medium mt-1">{formErrors.oldPassword}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Enter your new
                                    Password</label>
                                <input
                                    type='password'
                                    name="password"
                                    value={userPasswordForm.password}
                                    onChange={handlePasswordChange}
                                    className={`w-full px-4 py-2 border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
                                />
                                {formErrors.password &&
                                    <p className="text-red-500 text-xs font-medium mt-1">{formErrors.password}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Confirm your new
                                    Password</label>
                                <input
                                    type='password'
                                    name="passwordRepeat"
                                    value={userPasswordForm.passwordRepeat}
                                    onChange={handlePasswordChange}
                                    className={`w-full px-4 py-2 border ${formErrors.passwordRepeat ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
                                />
                                {formErrors.passwordRepeat &&
                                    <p className="text-red-500 text-xs font-medium mt-1">{formErrors.passwordRepeat}</p>}
                            </div>
                            <button type="submit" disabled={passwordLoading}
                                    className="w-full bg-indigo-600 text-white font-bold px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50">
                                {passwordLoading ? 'Validating...' : 'Validate'}
                            </button>
                        </div>
                    </form>

                    <form hidden={isEmailFormHidden}
                          onSubmit={handleEmailSubmit}
                          className="mb-6 p-6 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                        <div className="space-y-4">
                            {formErrors.emailForm && <div className="text-red-600 text-sm font-medium mb-2">{formErrors.emailForm}</div>}
                            {successMessage && <div className="text-green-600 text-sm font-medium mb-2">{successMessage}</div>}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Enter your new
                                    Email</label>
                                <input type='email'
                                       name="email"
                                       value={userEmailForm.email}
                                       onChange={handleEmailChange}
                                       className={`w-full px-4 py-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}/>
                                {formErrors.email && <p className="text-red-500 text-xs font-medium mt-1">{formErrors.email}</p>}
                            </div>
                            <button type="submit" disabled={emailLoading}
                                    className="w-full bg-indigo-600 text-white font-bold px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50">
                                {emailLoading ? 'Validating...' : 'Validate'}
                            </button>
                        </div>
                    </form>
                    <div className="mt-auto flex flex-col md:flex-row gap-4">
                        <button
                            onClick={() => setIsPasswordFormHidden(!isPasswordFormHidden)}
                            className="bg-indigo-600 text-white px-6 py-3 text-sm font-bold hover:bg-indigo-700 transition-colors w-full md:w-auto rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm">
                            Update Password
                        </button>
                        <button
                            onClick={() => setIsEmailFormHidden(!isEmailFormHidden)}
                            className="bg-indigo-600 text-white px-6 py-3 text-sm font-bold hover:bg-indigo-700 transition-colors w-full md:w-auto rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm">
                            Update Email
                        </button>
                    </div>
                </Card>

                {/* Previously in... Card */}
                <Card title="Previously in...">
                    <div className="text-lg space-y-6 flex-grow">
                        <div>
                            <h3 className="mb-3 font-bold text-gray-500 uppercase text-xs tracking-wider border-b border-gray-100 pb-2">Last
                                articles read</h3>
                            {lastReadArticles?.length > 0 ? (
                                <ul className="space-y-3">
                                    {lastReadArticles.map((article) => (
                                        <li key={article.id} className="flex items-center">
                                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></span>
                                            <Link to={`/article/${article.id}`} className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">{article.title}</Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-sm">No articles read recently.</p>
                            )}
                        </div>
                        <div className="mt-8">
                            <h3 className="mb-3 font-bold text-gray-500 uppercase text-xs tracking-wider border-b border-gray-100 pb-2">Recent
                                interactions</h3>
                            {userData.commentedArticles?.length > 0 ? (
                                <ul className="space-y-3">
                                    {userData.commentedArticles?.map((comment) => (
                                        <li key={comment.id} className="flex items-center">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                                            <span className="text-gray-700 font-medium">{comment.title}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-sm">No recent interactions.</p>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Your Writing Card 1 */}
                <Card title="Your writing">
                    <div className="text-lg space-y-6 flex-grow">
                        <div>
                            <h3 className="mb-3 font-bold text-gray-500 uppercase text-xs tracking-wider border-b border-gray-100 pb-2">Published
                                articles</h3>
                            {userData.articles?.filter((article) => article.published).length > 0 ? (
                                <ul className="space-y-3">
                                    {userData.articles?.filter((article) => article.published).slice(0, 5).map((article) => (
                                        <li key={article.id} className="flex items-center justify-between group">
                                            <div className="flex items-center truncate mr-4">
                                                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2 flex-shrink-0"></span>
                                                <Link to={`/article/${article.id}`} className="text-gray-700 hover:text-indigo-600 font-medium transition-colors truncate">{article.title}</Link>
                                            </div>
                                            <span className="text-xs text-gray-400 group-hover:text-indigo-400 whitespace-nowrap transition-colors">View &rarr;</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-sm">No published articles yet.</p>
                            )}
                        </div>
                        <div className="mt-8">
                            <h3 className="mb-3 font-bold text-gray-500 uppercase text-xs tracking-wider border-b border-gray-100 pb-2">Draft
                                articles</h3>
                            {userData.articles?.filter((article) => !article.published).length > 0 ? (
                                <ul className="space-y-3">
                                    {userData.articles?.filter((article) => !article.published).slice(0, 5).map((draft) => (
                                        <li key={draft.id} className="flex items-center justify-between group">
                                            <div className="flex items-center truncate mr-4">
                                                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2 flex-shrink-0"></span>
                                                <Link to={`/article/${draft.id}`} className="text-gray-700 hover:text-indigo-600 font-medium transition-colors truncate">{draft.title}</Link>
                                            </div>
                                            <span className="text-xs text-gray-400 group-hover:text-indigo-400 whitespace-nowrap transition-colors">Edit &rarr;</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-sm">No drafts currently.</p>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-4 border-t border-gray-100">
                        <Link
                            className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-4 py-3 text-sm font-bold hover:bg-indigo-100 transition-colors flex-1 text-center rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            to="/userArticles">
                            Manage All Articles
                        </Link>
                    </div>
                </Card>

                {/* Your Favorite articles */}
                <Card title="Favorite articles">
                    <div className="text-lg space-y-4 flex-grow">
                        <div>
                            <h3 className="mb-3 font-bold text-gray-500 uppercase text-xs tracking-wider border-b border-gray-100 pb-2">Recently
                                saved</h3>
                            {favoriteArticles?.length > 0 ? (
                                <ul className="space-y-3">
                                    {favoriteArticles?.slice(0, 5).map((article) => (
                                        <li key={article.id} className="flex items-center group">
                                            <span className="text-yellow-400 mr-2 text-xl group-hover:scale-110 transition-transform">★</span>
                                            <Link to={`/article/${article.id}`} className="text-gray-700 hover:text-indigo-600 font-medium transition-colors truncate">{article.title}</Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-8">
                                    <span className="text-gray-300 text-4xl block mb-2">☆</span>
                                    <p className="text-gray-500 text-sm">You haven't saved any articles yet.</p>
                                </div>
                            )}
                            
                        </div>
                    </div>
                    {favoriteArticles?.length > 0 && (
                        <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-4 border-t border-gray-100">
                            <Link
                                className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-4 py-3 text-sm font-bold hover:bg-indigo-100 transition-colors flex-1 text-center rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                to="/favoriteArticle">
                                View All Favorites
                            </Link>
                        </div>
                    )}
                </Card>

            </div>
        </div>
    )
}

export default UserProfile;