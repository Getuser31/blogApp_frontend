import { gql } from '@apollo/client';

// User Mutations

export const LOGIN_MUTATION = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                id
                name
                role {
                    name
                }
            }
        }
    }
`;

// Article Mutations

export const ADD_ARTICLE = gql`
    mutation AddArticle($title: String!, $content: String!) {
        createArticle(title: $title, content: $content) {
            id
            title
            content
        }
    }
`;

export const EDIT_ARTICLE = gql`
    mutation EditArticle($id: ID!, $title: String!, $content: String!) {
        editArticle(id: $id, title: $title, content: $content) {
            id
            title
            content
        }
    }
`;