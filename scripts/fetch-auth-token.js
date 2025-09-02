import fs from 'fs';
import path from 'path';
import 'dotenv/config';

/**
 * This script programmatically logs in to the GraphQL API,
 * fetches a new JWT, and saves it to a .env.local file.
 * This token is then used by WebStorm's GraphQL plugin for schema introspection.
 */

const main = async () => {
    const email = process.env.VITE_TEST_USER_EMAIL;
    const password = process.env.VITE_TEST_USER_PASSWORD;
    const endpoint = process.env.VITE_GRAPHQL_ENDPOINT;

    if (!email || !password || !endpoint) {
        console.error('Error: Please set VITE_TEST_USER_EMAIL, VITE_TEST_USER_PASSWORD, and VITE_GRAPHQL_ENDPOINT in your .env.development file.');
        process.exit(1);
    }

    const loginMutation = {
        query: `
            mutation Login($email: String!, $password: String!) {
                login(email: $email, password: $password) {
                    token
                }
            }
        `,
        variables: { email, password },
    };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginMutation),
        });

        // Check if the request was successful before trying to parse JSON
        if (!response.ok) {
            // If not, read the response as text to see the HTML error page
            const errorText = await response.text();
            console.error(`❌ API request failed with status ${response.status}.`);
            console.error('Response body:', errorText);
            throw new Error(`API returned status ${response.status}`);
        }

        const jsonResponse = await response.json();

        // Debug log to inspect the full API response
        // console.log('Full API Response:', JSON.stringify(jsonResponse, null, 2));

        // Correctly access the token from the nested GraphQL response structure
        const token = jsonResponse.data.login.token;
        const tokenLine = `GRAPHQL_IDE_TOKEN="Bearer ${token}"`;

        fs.writeFileSync(path.resolve('.env.local'), tokenLine);
        console.log('✅ Successfully fetched and saved new auth token to .env.local');
    } catch (error) {
        console.error('❌ Failed to fetch auth token:', error);
        process.exit(1);
    }
};

main();