# Changelog

## [ProfileTesting] - 2025-05-05
### Fixed
package.json in client folder had an extra comma and was throwing errors 

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

