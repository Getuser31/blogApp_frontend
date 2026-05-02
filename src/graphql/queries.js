import {gql} from '@apollo/client';

// Article Queries

export const GET_ARTICLES = gql`
    query GetArticles($category_id: ID, $page: Int) {
        publishedArticles(
            page: $page,
            category_id: $category_id
        ) {
            data {
                id
                title
                content
                created_at
                images {
                    id
                    path
                }
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

export const GET_LAST_ARTICLES = gql`
    query GetLastArticles($category_id: ID) {
        publishedLastArticles(category_id: $category_id){
            articles {
                id
                title
                content
                created_at
                images {
                    id
                    path
                }
            }
            hasMore
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
            images {
                id
                path
            }
            comments {
                id
                content
                created_at
                user {
                    id
                    name
                }
            }
            isFavorite
        }
    }
`;

export const SEARCH_ARTICLES = gql`
    query SearchArticles($query: String!) {
        searchArticles(search: $query) {
            data {
                id
                title
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

export const GET_USERS = gql`
    query users {
        users {
            id
            name
            email
            role {
                name
            }
            is_enabled
        }
    }
`;

export const USER_DATA = gql`
    query UserData($userId: ID!) {
        getUserData(id: $userId){
            id
            name
            email
            articles(
                orderBy: [{column: "created_at", order: DESC}]
            ){
                id
                title
                content
                created_at
                published
            }
            commentedArticles {
                id
                title
                comments(
                    limit: 5
                    orderBy: [{column: "created_at", order: DESC}]
                ) {
                    id
                    content
                    created_at
                }
            }
            favoriteArticles {
                id
                title
            }
            lastReadArticles {
                id
                title
            }
        }
    }
`

export const USER_ARTICLES = gql`
    query GetUserArticles {
        userArticles {
            id
            name
            articles(
                orderBy: [{column: "created_at", order: DESC}]
            ){
                id
                title
                content
                created_at
                published
                categories {
                    id
                    name
                }
                images {
                    id
                    path
                }
            }
        }
    }
`

export const GET_FAVORITE_ARTICLES = gql`
    query GetFavoriteArticles {
        getFavoriteArticles {
            id
            favoriteArticles {
                id
                title
            }
        }
    }
`

export const GET_ADMIN_USER_PROFILE = gql`
    query GetAdminUserProfile($userId: ID!) {
        getUserData(id: $userId) {
            id
            name
            email
            role {
                id
                name
            }
            created_at
            is_enabled
        }
    }
`;

export const GET_AUTHOR_PROFILE = gql`
    query GetAuthorProfile($author: String!, $page: Int = 1) {
        userByName(name: $author) {
            id
            name
            created_at
            paginatedArticles(first: 10, page: $page) {
                data {
                    id
                    title
                    content
                    created_at
                    published
                    categories {
                        id
                        name
                    }
                    images {
                        id
                        path
                    }
                }
                paginatorInfo {
                    total
                    currentPage
                    lastPage
                    hasMorePages
                }
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

//Role Queries
export const GET_ROLES = gql`
    query GetRoles {
        getRoles {
            id
            name
        }
    }
`;