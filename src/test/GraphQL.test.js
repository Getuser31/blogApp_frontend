import { describe, it, expect } from 'vitest';
import {
  GET_ARTICLES,
  GET_ARTICLE,
  SEARCH_ARTICLES,
  ME_QUERY,
  GET_USERS,
  USER_DATA,
  USER_ARTICLES,
  GET_FAVORITE_ARTICLES,
  GET_ADMIN_USER_PROFILE,
  GET_AUTHOR_PROFILE,
  GET_CATEGORIES,
  GET_ROLES,
} from '../graphql/queries.js';

import {
  LOGIN_MUTATION,
  ADD_USER,
  UPDATE_PASSWORD,
  UPDATE_EMAIL,
  UPDATE_USER_STATUS,
  UPDATE_USER_ROLE,
  ADD_ARTICLE,
  EDIT_ARTICLE,
  DELETE_IMAGE,
  TOGGLE_ARTICLE_FAVORITE,
  ADD_LAST_READ_ARTICLE,
  TOOGLE_PUBLISH_STATUS,
  ADD_COMMENT,
  ADD_CATEGORY,
  DELETE_CATEGORY,
} from '../graphql/mutations.js';

describe('GraphQL Queries', () => {
  it('GET_ARTICLES is a valid gql query with necessary fields', () => {
    const queryStr = GET_ARTICLES.loc.source.body;
    expect(queryStr).toContain('GetArticles');
    expect(queryStr).toContain('publishedArticles');
    expect(queryStr).toContain('category_id');
    expect(queryStr).toContain('page');
    expect(queryStr).toContain('paginatorInfo');
    expect(queryStr).toContain('currentPage');
    expect(queryStr).toContain('hasMorePages');
  });

  it('GET_ARTICLE includes author, categories, comments, images', () => {
    const queryStr = GET_ARTICLE.loc.source.body;
    expect(queryStr).toContain('GetArticle');
    expect(queryStr).toContain('author');
    expect(queryStr).toContain('categories');
    expect(queryStr).toContain('comments');
    expect(queryStr).toContain('images');
    expect(queryStr).toContain('isFavorite');
  });

  it('SEARCH_ARTICLES has search query parameter', () => {
    const queryStr = SEARCH_ARTICLES.loc.source.body;
    expect(queryStr).toContain('SearchArticles');
    expect(queryStr).toContain('$query');
    expect(queryStr).toContain('searchArticles');
  });

  it('ME_QUERY fetches user role', () => {
    const queryStr = ME_QUERY.loc.source.body;
    expect(queryStr).toContain('Me');
    expect(queryStr).toContain('role');
    expect(queryStr).toContain('name');
  });

  it('GET_USERS fetches users with role and status', () => {
    const queryStr = GET_USERS.loc.source.body;
    expect(queryStr).toContain('users');
    expect(queryStr).toContain('email');
    expect(queryStr).toContain('is_enabled');
  });

  it('USER_DATA fetches comprehensive user data', () => {
    const queryStr = USER_DATA.loc.source.body;
    expect(queryStr).toContain('UserData');
    expect(queryStr).toContain('articles');
    expect(queryStr).toContain('commentedArticles');
    expect(queryStr).toContain('favoriteArticles');
    expect(queryStr).toContain('lastReadArticles');
  });

  it('USER_ARTICLES fetches user articles with categories and images', () => {
    const queryStr = USER_ARTICLES.loc.source.body;
    expect(queryStr).toContain('GetUserArticles');
    expect(queryStr).toContain('published');
    expect(queryStr).toContain('categories');
    expect(queryStr).toContain('images');
  });

  it('GET_FAVORITE_ARTICLES query is valid', () => {
    const queryStr = GET_FAVORITE_ARTICLES.loc.source.body;
    expect(queryStr).toContain('GetFavoriteArticles');
    expect(queryStr).toContain('favoriteArticles');
  });

  it('GET_ADMIN_USER_PROFILE includes role and is_enabled', () => {
    const queryStr = GET_ADMIN_USER_PROFILE.loc.source.body;
    expect(queryStr).toContain('GetAdminUserProfile');
    expect(queryStr).toContain('is_enabled');
    expect(queryStr).toContain('created_at');
  });

  it('GET_AUTHOR_PROFILE has paginated articles', () => {
    const queryStr = GET_AUTHOR_PROFILE.loc.source.body;
    expect(queryStr).toContain('GetAuthorProfile');
    expect(queryStr).toContain('paginatedArticles');
    expect(queryStr).toContain('paginatorInfo');
  });

  it('GET_CATEGORIES returns id and name', () => {
    const queryStr = GET_CATEGORIES.loc.source.body;
    expect(queryStr).toContain('GetCategories');
    expect(queryStr).toContain('id');
    expect(queryStr).toContain('name');
  });

  it('GET_ROLES returns role data', () => {
    const queryStr = GET_ROLES.loc.source.body;
    expect(queryStr).toContain('GetRoles');
    expect(queryStr).toContain('id');
    expect(queryStr).toContain('name');
  });
});

describe('GraphQL Mutations', () => {
  it('LOGIN_MUTATION expects email and password', () => {
    const queryStr = LOGIN_MUTATION.loc.source.body;
    expect(queryStr).toContain('Login');
    expect(queryStr).toContain('$email');
    expect(queryStr).toContain('$password');
    expect(queryStr).toContain('token');
    expect(queryStr).toContain('user');
  });

  it('ADD_USER mutation has all registration fields', () => {
    const queryStr = ADD_USER.loc.source.body;
    expect(queryStr).toContain('AddUser');
    expect(queryStr).toContain('$username');
    expect(queryStr).toContain('$email');
    expect(queryStr).toContain('$password');
    expect(queryStr).toContain('$passwordRepeat');
  });

  it('UPDATE_PASSWORD needs old and new passwords', () => {
    const queryStr = UPDATE_PASSWORD.loc.source.body;
    expect(queryStr).toContain('UpdatePassword');
    expect(queryStr).toContain('$oldPassword');
    expect(queryStr).toContain('$password');
    expect(queryStr).toContain('$passwordRepeat');
  });

  it('UPDATE_EMAIL mutation takes email input', () => {
    const queryStr = UPDATE_EMAIL.loc.source.body;
    expect(queryStr).toContain('UpdateEmail');
    expect(queryStr).toContain('$email');
  });

  it('UPDATE_USER_STATUS mutation takes user ID', () => {
    const queryStr = UPDATE_USER_STATUS.loc.source.body;
    expect(queryStr).toContain('UpdateUserStatus');
    expect(queryStr).toContain('$id');
  });

  it('UPDATE_USER_ROLE mutation takes userId and roleId', () => {
    const queryStr = UPDATE_USER_ROLE.loc.source.body;
    expect(queryStr).toContain('updateRole');
    expect(queryStr).toContain('$userId');
    expect(queryStr).toContain('$roleId');
  });

  it('ADD_ARTICLE mutation creates article with all fields', () => {
    const queryStr = ADD_ARTICLE.loc.source.body;
    expect(queryStr).toContain('AddArticle');
    expect(queryStr).toContain('$title');
    expect(queryStr).toContain('$content');
    expect(queryStr).toContain('$categoryIds');
    expect(queryStr).toContain('$images');
    expect(queryStr).toContain('$publish');
  });

  it('EDIT_ARTICLE mutation updates an article', () => {
    const queryStr = EDIT_ARTICLE.loc.source.body;
    expect(queryStr).toContain('EditArticle');
    expect(queryStr).toContain('$id');
    expect(queryStr).toContain('$title');
    expect(queryStr).toContain('$content');
  });

  it('DELETE_IMAGE mutation deletes an image', () => {
    const queryStr = DELETE_IMAGE.loc.source.body;
    expect(queryStr).toContain('DeleteImage');
    expect(queryStr).toContain('$imageId');
  });

  it('TOGGLE_ARTICLE_FAVORITE toggles favorite status', () => {
    const queryStr = TOGGLE_ARTICLE_FAVORITE.loc.source.body;
    expect(queryStr).toContain('ToggleArticleFavorite');
    expect(queryStr).toContain('$articleId');
    expect(queryStr).toContain('isFavorite');
  });

  it('ADD_LAST_READ_ARTICLE tracks article reads', () => {
    const queryStr = ADD_LAST_READ_ARTICLE.loc.source.body;
    expect(queryStr).toContain('addLastReadArticle');
    expect(queryStr).toContain('$articleId');
  });

  it('TOOGLE_PUBLISH_STATUS toggles publish state', () => {
    const queryStr = TOOGLE_PUBLISH_STATUS.loc.source.body;
    expect(queryStr).toContain('TogglePublishStatus');
    expect(queryStr).toContain('$articleId');
    expect(queryStr).toContain('$publish');
  });

  it('ADD_COMMENT mutation adds comment to article', () => {
    const queryStr = ADD_COMMENT.loc.source.body;
    expect(queryStr).toContain('AddComment');
    expect(queryStr).toContain('$articleId');
    expect(queryStr).toContain('$content');
  });

  it('ADD_CATEGORY mutation creates a category', () => {
    const queryStr = ADD_CATEGORY.loc.source.body;
    expect(queryStr).toContain('AddCategory');
    expect(queryStr).toContain('$name');
  });

  it('DELETE_CATEGORY mutation deletes a category', () => {
    const queryStr = DELETE_CATEGORY.loc.source.body;
    expect(queryStr).toContain('DeleteCategory');
    expect(queryStr).toContain('$categoryId');
  });
});
