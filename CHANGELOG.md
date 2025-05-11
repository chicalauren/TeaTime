# Changelog

## [ProfileTesting] - 2025-05-05
### Fixed
package.json in client folder had an extra comma and was throwing errors 
TODO: "dashboad" to dashboard in the client code 

auth.ts:
Returns { user } from authMiddleware so your resolvers can use context.user
Maps _id to id in signToken() to match GraphQL convention
Uses environment variable for JWT_SECRET safely
Includes type safety with TypeScript interfaces

TODO:
The Apollo authLink isn't being used at all — likely because the Apollo Client in main.tsx is not running when you're navigating to /profile.

TODO:
every time I clone the repo and spin up the code I have to npm i in the root, the server folder and the client folder; that seems wrong

✅ What we now know:

    🔐 The Authorization header is being sent correctly with your token.

    ✅ The Apollo authLink is working.

    ❌ But your GET_ME query still returns { me: null }, causing the "User not found" message.

💥 So the problem is 100% on the backend now.

The token is getting to the server — but the server is either:

    Not verifying the token, or

    Not attaching context.user, or

    The me resolver is not using context.user properly.

### Added
Updated seed file with a test user as well 


### Changed
MONGODB_URI=mongodb://127.0.0.1:27017/tea-time
was listed as local host and I was getting errors 
server/ 
typeDefs.ts - was throwing a syntax error with NPM run dev; changed _id to id: ID!
resolvers.ts   - updated the ID fields here as well 

client/
mutations.ts also updated the ID fields 

Updated server.ts with working JWT auth and logs
Fixed :Profile page returning "User not found" despite valid token


* Updated `signToken()` in `utils/auth.ts` to preserve MongoDB's `_id` field in JWT payload

  ```ts
  const payload = { _id, email, username };
  jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  ```

* Updated `ApolloServer` context in `server.ts` to extract and attach `req.user = decoded.data`

* Added console logs to `resolvers.ts` for tracing token verification and user lookup

  ```ts
  console.log('🔍 Looking up user by ID:', user._id);
  ```

* Ensured `me` resolver checks `context.req.user` and uses `_id` to find user

* Fixed TypeScript error by adding missing comma in resolver object

* Cleared stale `id_token` from `localStorage` in browser to ensure new token with `_id` is used
