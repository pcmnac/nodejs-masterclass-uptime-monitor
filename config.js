/**
 * create and export environment variables
 */

 // container for all environments
 const environments = {};

 // staging (default) environment

 environments.staging = {
   httpPort: 3000,
   httpsPort: 3001,
   envName: 'staging',
 };
 
 // production environment

 environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: 'production',
 };

 
 module.exports = environments[process.env.NODE_ENV] || environments.staging;