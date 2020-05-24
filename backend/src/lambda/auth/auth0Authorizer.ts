import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'
import { certToPEM } from '../utils'
const logger = createLogger('auth')

const jwksUrl = 'https://dev-4ievb3ih.auth0.com/.well-known/jwks.json'

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    console.log(event.authorizationToken)
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info(`User was authorized ${JSON.stringify(jwtToken)}`)
    console.log(jwtToken)
    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt

  if(!jwt || !jwt.header || jwt.header.alg !== 'RS256'){
    throw new Error('invalid token')
  }


  try {
    const response = await Axios.get(jwksUrl);
    logger.info(`Receiving the Response ${JSON.stringify(response.data)}`)
    const { keys } = response.data
    const signingKeys = keys
      .filter(key => key.use === 'sig' // JWK property `use` determines the JWK is for signing
        && key.kty === 'RSA' // We are only supporting RSA (RS256)
        && key.kid           // The `kid` must be present to be useful for later
        && ((key.x5c && key.x5c.length) || (key.n && key.e)) // Has useful public keys
      ).map(key => {
        return { kid: key.kid, nbf: key.nbf, publicKey: certToPEM(key.x5c[0]) };
      });

    const signingKey = signingKeys.find(key => key.kid === jwt.header.kid);
    logger.info(`Signed Key ${JSON.stringify(signingKey)}`)
    if (!signingKey) {
      throw new Error(`Unable to find a signing key that matches '${jwt.header.kid}'`);
    }
    const verifedToken = verify(token,signingKey.publicKey,{algorithms:['RS256']})

    logger.info(`Verfied Token ${JSON.stringify(verifedToken)}`)
    return verifedToken as JwtPayload
  } catch (error) {
    logger.error(`${error.message}`);
    return undefined
  }
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
