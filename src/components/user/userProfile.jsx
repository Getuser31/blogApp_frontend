import React from "react";
import {useMutation, useQuery} from "@apollo/client/react";
import {USER_DATA} from "../../graphql/queries.js";
import {useAuth} from "../../AuthContext.jsx";
import {Link} from "react-router-dom";
import {UPDATE_EMAIL, UPDATE_PASSWORD} from "../../graphql/mutations.js";

const Card = ({title, children}) => (
    <div className="bg-white p-8 rounded-lg shadow-lg min-h-[474px] flex flex-col">
        <h2 className="text-2xl mb-6 font-bold text-[#A17141]">{title}</h2>
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
        return <div className="min-h-screen bg-[#A17141] p-8 font-mono text-white">Loading...</div>;
    }

    if (error) {
        return <div className="min-h-screen bg-[#A17141] p-8 font-mono text-white">Error: {error.message}</div>;
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
        <div className="min-h-screen bg-[#A17141] p-8 font-mono">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Profile Card */}
                <Card title="Profile">
                    <div className="text-lg mb-8 flex-grow">
                        <p className="mb-4"><span className="font-semibold">Username:</span> {userData.name}</p>
                        <p><span className="font-semibold">Email:</span> {userData.email}</p>
                    </div>

                    <form hidden={isPasswordFormHidden} onSubmit={handlePasswordSubmit}
                          className="mb-6 p-6 border border-gray-200 rounded-lg bg-gray-50 shadow-inner">
                        <div className="space-y-4">
                            {formErrors.form && <div className="text-red-600 text-sm mb-2">{formErrors.form}</div>}
                            {successMessage && <div className="text-green-600 text-sm mb-2">{successMessage}</div>}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Enter your current
                                    Password</label>
                                <input
                                    type='password'
                                    name="oldPassword"
                                    value={userPasswordForm.oldPassword}
                                    onChange={handlePasswordChange}
                                    className={`w-full px-4 py-2 border ${formErrors.oldPassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#A17141] focus:border-transparent transition-shadow`}
                                />
                                {formErrors.oldPassword &&
                                    <p className="text-red-500 text-xs mt-1">{formErrors.oldPassword}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Enter your new
                                    Password</label>
                                <input
                                    type='password'
                                    name="password"
                                    value={userPasswordForm.password}
                                    onChange={handlePasswordChange}
                                    className={`w-full px-4 py-2 border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#A17141] focus:border-transparent transition-shadow`}
                                />
                                {formErrors.password &&
                                    <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm your new
                                    Password</label>
                                <input
                                    type='password'
                                    name="passwordRepeat"
                                    value={userPasswordForm.passwordRepeat}
                                    onChange={handlePasswordChange}
                                    className={`w-full px-4 py-2 border ${formErrors.passwordRepeat ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#A17141] focus:border-transparent transition-shadow`}
                                />
                                {formErrors.passwordRepeat &&
                                    <p className="text-red-500 text-xs mt-1">{formErrors.passwordRepeat}</p>}
                            </div>
                            <button type="submit" disabled={passwordLoading}
                                    className="w-full bg-[#A17141] text-white font-semibold px-4 py-2 rounded hover:bg-[#8a6036] transition-colors shadow-sm disabled:opacity-50">
                                {passwordLoading ? 'Validating...' : 'Validate'}
                            </button>
                        </div>
                    </form>

                    <form hidden={isEmailFormHidden}
                          onSubmit={handleEmailSubmit}
                          className="mb-6 p-6 border border-gray-200 rounded-lg bg-gray-50 shadow-inner">
                        <div className="space-y-4">
                            {formErrors.emailForm && <div className="text-red-600 text-sm mb-2">{formErrors.emailForm}</div>}
                            {successMessage && <div className="text-green-600 text-sm mb-2">{successMessage}</div>}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Enter your new
                                    Email</label>
                                <input type='email'
                                       name="email"
                                       value={userEmailForm.email}
                                       onChange={handleEmailChange}
                                       className={`w-full px-4 py-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#A17141] focus:border-transparent transition-shadow`}/>
                                {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                            </div>
                            <button type="submit" disabled={emailLoading}
                                    className="w-full bg-[#A17141] text-white font-semibold px-4 py-2 rounded hover:bg-[#8a6036] transition-colors shadow-sm disabled:opacity-50">
                                {emailLoading ? 'Validating...' : 'Validate'}
                            </button>
                        </div>
                    </form>
                    <div className="mt-auto flex flex-col md:flex-row gap-4">
                        <button
                            onClick={() => setIsPasswordFormHidden(!isPasswordFormHidden)}
                            className="bg-[#A17141] text-white px-6 py-3 text-lg hover:bg-[#8a6036] transition-colors w-full md:w-auto rounded">
                            Update Password
                        </button>
                        <button
                            onClick={() => setIsEmailFormHidden(!isEmailFormHidden)}
                            className="bg-[#A17141] text-white px-6 py-3 text-lg hover:bg-[#8a6036] transition-colors w-full md:w-auto rounded">
                            Update Email
                        </button>
                    </div>
                </Card>

                {/* Previously in... Card */}
                <Card title="Previously in...">
                    <div className="text-lg space-y-4 flex-grow">
                        <div>
                            <h3 className="mb-2 font-semibold text-gray-700 uppercase text-sm tracking-wide">Last
                                articles read:</h3>
                            <ul className="list-disc list-inside space-y-1 text-gray-600">
                                {lastReadArticles.map((article) => (
                                    <li key={article.id}>
                                        <Link to={`/article/${article.id}`}>{article.title}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-6">
                            <h3 className="mb-2 font-semibold text-gray-700 uppercase text-sm tracking-wide">Last
                                comments:</h3>
                            <ul className="list-disc list-inside space-y-1 text-gray-600">
                                {userData.commentedArticles?.map((comment) => (
                                    <li key={comment.id}>{comment.title}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </Card>

                {/* Your Writing Card 1 */}
                <Card title="Your writing">
                    <div className="text-lg space-y-4 flex-grow">
                        <div>
                            <h3 className="mb-2 font-semibold text-gray-700 uppercase text-sm tracking-wide">Last
                                articles wrote:</h3>
                            <ul className="list-disc list-inside space-y-1 text-gray-600">
                                {userData.articles?.filter((article) => article.published).slice(0, 5).map((article) => (
                                    <li key={article.id}>{article.title}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-6">
                            <h3 className="mb-2 font-semibold text-gray-700 uppercase text-sm tracking-wide">Actual
                                Draft articles:</h3>
                            <ul className="list-disc list-inside space-y-1 text-gray-600">
                                {userData.articles?.filter((article) => !article.published).slice(0, 5).map((draft) => (
                                    <li key={draft.id}>{draft.title}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 mt-6">
                        <Link
                            className="bg-[#A17141] text-white px-4 py-3 text-lg hover:bg-[#8a6036] transition-colors flex-1 text-center rounded"
                            to="/userArticles">
                            Show All Articles
                        </Link>
                    </div>
                </Card>

                {/* Your Favorite articles */}
                <Card title="Your Favorite articles">
                    <div className="text-lg space-y-4 flex-grow">
                        <div>
                            <h3 className="mb-2 font-semibold text-gray-700 uppercase text-sm tracking-wide">Last
                                articles added to favorites:</h3>
                            <ul className="list-disc list-inside space-y-1 text-gray-600">
                                {favoriteArticles?.slice(0, 5).map((article) => (
                                    <li key={article.id}>
                                        <Link to={`/article/${article.id}`}>{article.title}</Link>
                                    </li>
                                ))}
                            </ul>
                            {favoriteArticles?.length > 5 && (
                                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                                    <Link
                                        className="bg-[#A17141] text-white px-4 py-3 text-lg hover:bg-[#8a6036] transition-colors flex-1 text-center rounded"
                                        to="/favoriteArticle">
                                        Show All Favorite Articles
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                </Card>

            </div>
        </div>
    )
}

export default UserProfile;