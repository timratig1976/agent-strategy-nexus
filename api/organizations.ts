import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@clerk/backend';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (!globalForPrisma.prisma) globalForPrisma.prisma = prisma;

async function requireAuthNode(req: any): Promise<string> {
  const authHeader = (req.headers['authorization'] as string) || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
  if (!token) throw new Error('Unauthorized');

  const secret = process.env.CLERK_SECRET_KEY;
  if (!secret) throw new Error('Missing CLERK_SECRET_KEY');

  const verification = await verifyToken(token, { secretKey: secret });
  if (!verification || !verification.sub) {
    throw new Error('Unauthorized');
  }
  return verification.sub; // userId
}

export default async function handler(req: any, res: any) {
  let userId: string;
  try {
    userId = await requireAuthNode(req);
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const method = (req.method || 'GET').toUpperCase();

  try {
    if (method === 'GET') {
      const memberships = await prisma.orgMembership.findMany({
        where: { user_id: userId },
        include: { organization: true },
        orderBy: { updated_at: 'desc' },
      });

      const organizations = memberships.map((m) => ({
        id: m.organization.id,
        name: m.organization.name,
        slug: m.organization.slug,
        logo_url: m.organization.logo_url,
        created_at: m.organization.created_at,
        updated_at: m.organization.updated_at,
        is_primary: m.is_primary,
        role: m.role,
      }));

      const current = organizations.find((o) => o.is_primary) || organizations[0] || null;

      return res.status(200).json({ organizations, currentOrganization: current });
    }

    if (method === 'POST') {
      const { action } = req.query;

      if (action === 'setPrimary') {
        const { organizationId } = req.body || {};
        if (!organizationId) return res.status(400).json({ error: 'organizationId is required' });

        await prisma.$transaction([
          prisma.orgMembership.updateMany({ where: { user_id: userId }, data: { is_primary: false } }),
          prisma.orgMembership.updateMany({ where: { user_id: userId, organization_id: organizationId }, data: { is_primary: true } }),
        ]);
        return res.status(200).json({ ok: true });
      }

      // create organization
      const { name, slug, logo_url } = req.body || {};
      if (!name || !slug) return res.status(400).json({ error: 'name and slug are required' });

      const org = await prisma.organization.create({ data: { name, slug, logo_url: logo_url ?? null } });
      await prisma.orgMembership.create({ data: { user_id: userId, organization_id: org.id, role: 'owner', is_primary: true } });

      return res.status(201).json({ organization: org });
    }

    if (method === 'PATCH') {
      const { id, data } = req.body || {};
      if (!id || !data) return res.status(400).json({ error: 'id and data are required' });

      const updated = await prisma.organization.update({ where: { id }, data: {
        name: data.name ?? undefined,
        slug: data.slug ?? undefined,
        logo_url: data.logo_url ?? undefined,
      }});

      return res.status(200).json({ organization: updated });
    }

    res.setHeader('Allow', 'GET,POST,PATCH');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error(err);
    if (err?.code === 'P2002') {
      return res.status(409).json({ error: 'Unique constraint violation' });
    }
    return res.status(500).json({ error: 'Server error' });
  }
}
