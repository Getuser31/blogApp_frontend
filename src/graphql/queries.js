import { gql } from '@apollo/client';

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