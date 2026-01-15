import {gql} from '@apollo/client';

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

export const ADD_USER = gql`
    mutation AddUser($username: String!, $password: String!, $passwordRepeat: String!, $email: String!) {
        addUser(username: $username, password: $password, passwordRepeat: $passwordRepeat, email: $email) {
            id
            name
            email
        }
    }
`;

export const UPDATE_PASSWORD = gql`
    mutation UpdatePassword($oldPassword: String!, $password: String!, $passwordRepeat: String!) {
        updatePassword(oldPassword: $oldPassword, password: $password, passwordRepeat: $passwordRepeat){
            id
            name
            email
        }
    }
`;

export const UPDATE_EMAIL = gql`
    mutation UpdateEmail($email: String!) {
        updateEmail(email: $email) {
            id
            name
            email
        }
    }
`;

export const UPDATE_USER_STATUS = gql`
    mutation UpdateUserStatus($id: ID!) {
        updateUserStatus(userId: $id,) {
            id
            name
            email
            is_enabled
        }
    }
`;

// Article Mutations

export const ADD_ARTICLE = gql`
    mutation AddArticle($title: String!, $content: String!, $categoryIds: [ID!], $images: [Upload!], $publish: Boolean) {
        createArticle(title: $title, content: $content, categoryIds: $categoryIds, images: $images, publish: $publish) {
            id
            title
            content
            published
            categories {
                id
                name
            }
            images {
                path
            }
        }
    }
`;

export const EDIT_ARTICLE = gql`
    mutation EditArticle($id: ID!, $title: String!, $content: String!, $categoryIds: [ID!], $images: [Upload]) {
        editArticle(id: $id, title: $title, content: $content, categoryIds: $categoryIds, images: $images) {
            id
            title
            content
            categories {
                id
                name
            }
            images {
                path
            }
        }
    }
`;

export const DELETE_IMAGE = gql`
    mutation DeleteImage($imageId: ID!) {
        deleteImage(id: $imageId) {
            id
        }
    }
`;

export const TOGGLE_ARTICLE_FAVORITE = gql`
    mutation ToggleArticleFavorite($articleId: ID!) {
        addFavoriteArticle(articleId: $articleId) {
            id
            isFavorite
        }
    }
`;

export const ADD_LAST_READ_ARTICLE = gql`
    mutation addLastReadArticle($articleId: ID!) {
        addLastReadArticle(articleId: $articleId) {
            id
        }
    }
`;

export const TOOGLE_PUBLISH_STATUS = gql`
    mutation TogglePublishStatus($articleId: ID!, $publish: Boolean!) {
        togglePublishStatus(articleId: $articleId, publish: $publish) {
            id
            published
        }
    }
`;



// Comments Mutations

export const ADD_COMMENT = gql`
    mutation AddComment($articleId: ID!, $content: String!) {
        addComment(articleId: $articleId, content: $content) {
            id
            content
        }
    }
`;

//categories mutation

export const ADD_CATEGORY = gql`
    mutation AddCategory($name: String!) {
        addCategory(name: $name) {
            id
            name
        }
    }
`;

export const DELETE_CATEGORY = gql`
    mutation DeleteCategory($categoryId: ID!) {
        deleteCategory(id: $categoryId) {
            id
        }
    }
`;