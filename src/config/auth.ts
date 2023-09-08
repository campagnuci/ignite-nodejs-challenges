export default {
  jwt: {
    secret: process.env.JWT_SECRET ?? 'senhasupersecretablablabla',
    expiresIn: '1d'
  }
}
