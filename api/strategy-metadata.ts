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
  try {
    await requireAuthNode(req);
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const method = (req.method || 'GET').toUpperCase();

  try {
    if (method === 'GET') {
      const strategyId = (req.query.strategyId as string) || '';
      if (!strategyId) return res.status(400).json({ error: 'strategyId is required' });

      // Fetch core strategy (name) and metadata
      const [strategy, metadata] = await Promise.all([
        prisma.strategy.findUnique({ where: { id: strategyId } }),
        prisma.strategyMetadata.findMany({
          where: { strategy_id: strategyId },
          orderBy: { updated_at: 'desc' },
        }),
      ]);

      const items = (metadata.length ? metadata : [undefined]).map((m) => ({
        name: strategy?.name ?? null,
        strategy_id: strategyId,
        company_name: m?.company_name ?? null,
        website_url: m?.website_url ?? null,
        product_description: m?.product_description ?? null,
        product_url: m?.product_url ?? null,
        additional_info: m?.additional_info ?? null,
        id: m?.id ?? null,
        created_at: m?.created_at ?? null,
        updated_at: m?.updated_at ?? null,
      }));

      return res.status(200).json({ items });
    }

    if (method === 'POST') {
      const { strategyId, name, company_name, website_url, product_description, product_url, additional_info } = req.body || {};
      if (!strategyId) return res.status(400).json({ error: 'strategyId is required' });

      // Ensure Strategy exists and update name if provided
      await prisma.strategy.upsert({
        where: { id: strategyId },
        update: { name: name ?? undefined },
        create: { id: strategyId, name: name ?? null },
      });

      const item = await prisma.strategyMetadata.upsert({
        where: { strategy_id: strategyId },
        update: {
          company_name: company_name ?? null,
          website_url: website_url ?? null,
          product_description: product_description ?? null,
          product_url: product_url ?? null,
          additional_info: additional_info ?? null,
        },
        create: {
          strategy_id: strategyId,
          company_name: company_name ?? null,
          website_url: website_url ?? null,
          product_description: product_description ?? null,
          product_url: product_url ?? null,
          additional_info: additional_info ?? null,
        },
      });
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', 'GET,POST');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
