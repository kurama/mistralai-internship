import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import pkg from 'pg'

const { Pool } = pkg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development', // Add debug logs
  callbacks: {
    async signIn({ user }) {
      console.log('🔍 Login attempt for:', user.email)

      if (!user.email) {
        console.log('❌ No email provided')
        return false
      }

      // Database connection test
      let client
      try {
        console.log('📡 Connecting to database...')
        client = await pool.connect()
        console.log('✅ DB connection successful')

        const res = await client.query('SELECT id FROM users WHERE email=$1', [user.email])
        console.log('🔎 User found:', (res.rowCount ?? 0) > 0)

        if (res.rowCount === 0) {
          console.log('👤 Creating new user:', user.email)
          await client.query('INSERT INTO users (email, name, image) VALUES ($1, $2, $3)', [user.email, user.name, user.image])
          console.log('✅ User created successfully')
        }
      } catch (error) {
        console.error('❌ Database error:', error)
        return false // Login fails if DB problem
      } finally {
        if (client) {
          client.release()
        }
      }

      console.log('✅ Login authorized for:', user.email)
      return true
    },
  },
})

export { handler as GET, handler as POST }
