import { Pool } from "pg";

export async function runMigrations(): Promise<void> {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.warn("[migrate] DATABASE_URL not set — skipping migrations");
    return;
  }

  const pool = new Pool({ connectionString });

  try {
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS taqyeem_users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          name VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL DEFAULT 'user',
          review_count INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS taqyeem_businesses (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          slug VARCHAR(255) NOT NULL UNIQUE,
          name VARCHAR(255) NOT NULL,
          name_ar VARCHAR(255),
          sector VARCHAR(100),
          city VARCHAR(100),
          address TEXT,
          lat NUMERIC(10,7),
          lng NUMERIC(10,7),
          geofence_radius INTEGER NOT NULL DEFAULT 200,
          phone VARCHAR(50),
          website VARCHAR(500),
          status VARCHAR(50) NOT NULL DEFAULT 'pending',
          tier VARCHAR(50) NOT NULL DEFAULT 'free',
          owner_id UUID REFERENCES taqyeem_users(id),
          overall_score NUMERIC(4,2) NOT NULL DEFAULT 0,
          review_count INTEGER NOT NULL DEFAULT 0,
          verified BOOLEAN NOT NULL DEFAULT false,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS taqyeem_reviews (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          business_id UUID NOT NULL REFERENCES taqyeem_businesses(id),
          user_id UUID NOT NULL REFERENCES taqyeem_users(id),
          overall_rating INTEGER NOT NULL,
          service_rating INTEGER NOT NULL DEFAULT 0,
          staff_rating INTEGER NOT NULL DEFAULT 0,
          cleanliness_rating INTEGER NOT NULL DEFAULT 0,
          value_rating INTEGER NOT NULL DEFAULT 0,
          wait_time_rating INTEGER NOT NULL DEFAULT 0,
          text TEXT,
          geo_verified BOOLEAN NOT NULL DEFAULT false,
          status VARCHAR(50) NOT NULL DEFAULT 'approved',
          helpful_count INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS taqyeem_responses (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          review_id UUID NOT NULL REFERENCES taqyeem_reviews(id),
          business_id UUID NOT NULL REFERENCES taqyeem_businesses(id),
          text TEXT NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS taqyeem_reg_requests (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          business_name VARCHAR(255) NOT NULL,
          business_name_ar VARCHAR(255),
          sector VARCHAR(100),
          city VARCHAR(100),
          contact_email VARCHAR(255) NOT NULL,
          contact_phone VARCHAR(50),
          owner_name VARCHAR(255),
          tier VARCHAR(50) NOT NULL DEFAULT 'free',
          status VARCHAR(50) NOT NULL DEFAULT 'pending',
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `);
      console.log("[migrate] Tables created/verified successfully");
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("[migrate] Migration failed:", err);
  } finally {
    await pool.end();
  }
}
