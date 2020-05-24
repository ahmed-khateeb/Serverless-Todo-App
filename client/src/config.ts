// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '...'
export const apiEndpoint = `https://z29q5em761.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-4ievb3ih.auth0.com',            // Auth0 domain
  clientId: 'KVSfYMWBZcO3tFKO4trRHEgYUZ2jtldk',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
