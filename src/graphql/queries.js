import { gql } from '@apollo/client';

// Article Queries

export const GET_ARTICLES = gql`
    query GetArticles {
        articles {
            data {
                id
                title
                content
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