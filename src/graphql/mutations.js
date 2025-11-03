import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
        }
    }
`;

export const ADD_ARTICLE = gql`
    mutation AddArticle($title: String!, $content: String!) {
        createArticle(title: $title, content: $content) {
            id
            title
            content
        }
    }
`;