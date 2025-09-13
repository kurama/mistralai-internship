import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import pkg from 'pg'

const { Pool } = pkg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function GET() {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await pool.connect()
    try {
      // Get user ID
      const userRes = await client.query('SELECT id FROM users WHERE email = $1', [session.user.email])
      if (userRes.rowCount === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      const userId = userRes.rows[0].id

      // Get API key
      const apiKeyRes = await client.query('SELECT api_key FROM user_api_keys WHERE user_id = $1', [userId])

      if (apiKeyRes.rowCount === 0) {
        return NextResponse.json({ apiKey: null })
      }

      return NextResponse.json({ apiKey: apiKeyRes.rows[0].api_key })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error fetching API key:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { apiKey } = await request.json()

    if (!apiKey || typeof apiKey !== 'string') {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 400 })
    }

    const client = await pool.connect()
    try {
      // Get user ID
      const userRes = await client.query('SELECT id FROM users WHERE email = $1', [session.user.email])
      if (userRes.rowCount === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      const userId = userRes.rows[0].id

      // Upsert API key
      await client.query(
        `
        INSERT INTO user_api_keys (user_id, api_key, updated_at) 
        VALUES ($1, $2, CURRENT_TIMESTAMP)
        ON CONFLICT (user_id) 
        DO UPDATE SET api_key = $2, updated_at = CURRENT_TIMESTAMP
      `,
        [userId, apiKey]
      )

      return NextResponse.json({ success: true })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error saving API key:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
