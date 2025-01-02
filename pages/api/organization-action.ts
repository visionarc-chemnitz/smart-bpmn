import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, teamMemberEmails } = req.body

    try {
      const organization = await prisma.organization.create({
        data: {
          name,
          users: {
            create: teamMemberEmails.map((email: string) => ({
              email,
              // Add other user fields as necessary
            })),
          },
        },
      })
      res.status(200).json(organization)
    } catch (error) {
      console.error('Error creating organization:', error)
      res.status(500).json({ error: 'Error creating organization' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}