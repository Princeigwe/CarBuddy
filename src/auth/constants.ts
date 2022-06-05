// documentation said this must be secret in production environments

export const jwtConstants = { secret: process.env.JWT_SECRET} // secret key to sign the jwt that will be given