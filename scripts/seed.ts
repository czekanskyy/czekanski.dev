import { getPayload } from 'payload'
import config from '@payload-config'

const seed = async () => {
  const payload = await getPayload({ config })

  // Create first admin user
  await payload.create({
    collection: 'users',
    data: {
      email: 'admin@czekanski.dev',
      password: 'Admin123!',
      name: 'Admin',
    },
  })

  console.log('✅ Admin user created successfully!')
  console.log('Email: admin@czekanski.dev')
  console.log('Password: Admin123!')

  process.exit(0)
}

seed().catch((error) => {
  console.error('Error seeding database:', error)
  process.exit(1)
})
