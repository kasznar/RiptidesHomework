/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query GetUserDetailedContributions(\n    $username: String!\n    $from: DateTime!\n    $to: DateTime!\n  ) {\n    user(login: $username) {\n      contributionsCollection(from: $from, to: $to) {\n        issueContributions {\n          totalCount\n        }\n        pullRequestContributions {\n          totalCount\n        }\n        pullRequestReviewContributions {\n          totalCount\n        }\n      }\n    }\n  }\n": typeof types.GetUserDetailedContributionsDocument,
    "\n  query GetUserContributions($login: String!) {\n    user(login: $login) {\n      contributionsCollection {\n        contributionCalendar {\n          weeks {\n            contributionDays {\n              date\n              contributionCount\n            }\n          }\n        }\n      }\n    }\n  }\n": typeof types.GetUserContributionsDocument,
    "\n  query GetUserRepos(\n    $login: String!\n    $first: Int\n    $after: String\n    $last: Int\n    $before: String\n  ) {\n    user(login: $login) {\n      repositories(\n        first: $first\n        after: $after\n        last: $last\n        before: $before\n        orderBy: { field: UPDATED_AT, direction: DESC }\n        ownerAffiliations: [OWNER]\n      ) {\n        nodes {\n          id\n          name\n          description\n          url\n          isFork\n          updatedAt\n          stargazerCount\n          issues {\n            totalCount\n          }\n          pullRequests {\n            totalCount\n          }\n          defaultBranchRef {\n            target {\n              ... on Commit {\n                history(first: 1) {\n                  edges {\n                    node {\n                      committedDate\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n        pageInfo {\n          startCursor\n          endCursor\n          hasNextPage\n          hasPreviousPage\n        }\n      }\n    }\n  }\n": typeof types.GetUserReposDocument,
};
const documents: Documents = {
    "\n  query GetUserDetailedContributions(\n    $username: String!\n    $from: DateTime!\n    $to: DateTime!\n  ) {\n    user(login: $username) {\n      contributionsCollection(from: $from, to: $to) {\n        issueContributions {\n          totalCount\n        }\n        pullRequestContributions {\n          totalCount\n        }\n        pullRequestReviewContributions {\n          totalCount\n        }\n      }\n    }\n  }\n": types.GetUserDetailedContributionsDocument,
    "\n  query GetUserContributions($login: String!) {\n    user(login: $login) {\n      contributionsCollection {\n        contributionCalendar {\n          weeks {\n            contributionDays {\n              date\n              contributionCount\n            }\n          }\n        }\n      }\n    }\n  }\n": types.GetUserContributionsDocument,
    "\n  query GetUserRepos(\n    $login: String!\n    $first: Int\n    $after: String\n    $last: Int\n    $before: String\n  ) {\n    user(login: $login) {\n      repositories(\n        first: $first\n        after: $after\n        last: $last\n        before: $before\n        orderBy: { field: UPDATED_AT, direction: DESC }\n        ownerAffiliations: [OWNER]\n      ) {\n        nodes {\n          id\n          name\n          description\n          url\n          isFork\n          updatedAt\n          stargazerCount\n          issues {\n            totalCount\n          }\n          pullRequests {\n            totalCount\n          }\n          defaultBranchRef {\n            target {\n              ... on Commit {\n                history(first: 1) {\n                  edges {\n                    node {\n                      committedDate\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n        pageInfo {\n          startCursor\n          endCursor\n          hasNextPage\n          hasPreviousPage\n        }\n      }\n    }\n  }\n": types.GetUserReposDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetUserDetailedContributions(\n    $username: String!\n    $from: DateTime!\n    $to: DateTime!\n  ) {\n    user(login: $username) {\n      contributionsCollection(from: $from, to: $to) {\n        issueContributions {\n          totalCount\n        }\n        pullRequestContributions {\n          totalCount\n        }\n        pullRequestReviewContributions {\n          totalCount\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetUserDetailedContributions(\n    $username: String!\n    $from: DateTime!\n    $to: DateTime!\n  ) {\n    user(login: $username) {\n      contributionsCollection(from: $from, to: $to) {\n        issueContributions {\n          totalCount\n        }\n        pullRequestContributions {\n          totalCount\n        }\n        pullRequestReviewContributions {\n          totalCount\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetUserContributions($login: String!) {\n    user(login: $login) {\n      contributionsCollection {\n        contributionCalendar {\n          weeks {\n            contributionDays {\n              date\n              contributionCount\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetUserContributions($login: String!) {\n    user(login: $login) {\n      contributionsCollection {\n        contributionCalendar {\n          weeks {\n            contributionDays {\n              date\n              contributionCount\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetUserRepos(\n    $login: String!\n    $first: Int\n    $after: String\n    $last: Int\n    $before: String\n  ) {\n    user(login: $login) {\n      repositories(\n        first: $first\n        after: $after\n        last: $last\n        before: $before\n        orderBy: { field: UPDATED_AT, direction: DESC }\n        ownerAffiliations: [OWNER]\n      ) {\n        nodes {\n          id\n          name\n          description\n          url\n          isFork\n          updatedAt\n          stargazerCount\n          issues {\n            totalCount\n          }\n          pullRequests {\n            totalCount\n          }\n          defaultBranchRef {\n            target {\n              ... on Commit {\n                history(first: 1) {\n                  edges {\n                    node {\n                      committedDate\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n        pageInfo {\n          startCursor\n          endCursor\n          hasNextPage\n          hasPreviousPage\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetUserRepos(\n    $login: String!\n    $first: Int\n    $after: String\n    $last: Int\n    $before: String\n  ) {\n    user(login: $login) {\n      repositories(\n        first: $first\n        after: $after\n        last: $last\n        before: $before\n        orderBy: { field: UPDATED_AT, direction: DESC }\n        ownerAffiliations: [OWNER]\n      ) {\n        nodes {\n          id\n          name\n          description\n          url\n          isFork\n          updatedAt\n          stargazerCount\n          issues {\n            totalCount\n          }\n          pullRequests {\n            totalCount\n          }\n          defaultBranchRef {\n            target {\n              ... on Commit {\n                history(first: 1) {\n                  edges {\n                    node {\n                      committedDate\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n        pageInfo {\n          startCursor\n          endCursor\n          hasNextPage\n          hasPreviousPage\n        }\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;