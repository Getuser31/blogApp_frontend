import { gql } from '@apollo/client';

// Article Queries

export const GET_ARTICLES = gql`
    query GetArticles {
        articles {
            data {
                id
                title
                content
                created_at
            }
            paginatorInfo {
                currentPage
                lastPage
                hasMorePages
                total
            }
        }
    }
`;

export const GET_ARTICLE = gql`
    query GetArticle($id: ID!) {
        article(id: $id) {
            id
            title
            content
            created_at
            author {
                id
                name
            }
            categories {
                id
                name
            }
        }
    }
`;

// User Queries

export const ME_QUERY = gql`
     query Me {
         me {
             id
             name
             role {
                 name
             }
         }
     }
 `;

// Category Queries

export const GET_CATEGORIES = gql`
    query GetCategories {
        getCategories {
            id
            name
        }
    }
`;