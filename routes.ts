
/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 * The route logged in users will redirect to when trying to access authRoutes
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/settings";

/**
 * The default redirect path logged in users will redirect to when trying to access authRoutes
 * @type {string}
 */
export const DEFAULT_LOGIN_AUTH_ROUTE_REDIRECT = "/settings";

/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * Both logged in and out users can access to these routes
 * @type {string[]}
 */

export const publicRoutes = [
  "/",
  "/auth/new-verification"
];

/**
 * An array of routes that are used for authentication
 * Logged out users will access these routes
 * Logged in users will redirect to the DEFAULT_LOGIN_REDIRECT
 * @type {string[]}
 */
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password"
];
