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
      const module = (req.query.module as string) || '';
      if (!module) return res.status(400).json({ error: 'module is required' });

      const prompt = await prisma.aiPrompt.findUnique({ where: { module } });
      return res.status(200).json({
        system_prompt: prompt?.system_prompt ?? '',
        user_prompt: prompt?.user_prompt ?? '',
      });
    }

    if (method === 'POST') {
      const { module, system_prompt, user_prompt } = req.body || {};
      if (!module) return res.status(400).json({ error: 'module is required' });

      await prisma.aiPrompt.upsert({
        where: { module },
        update: { system_prompt: system_prompt ?? null, user_prompt: user_prompt ?? null },
        create: { module, system_prompt: system_prompt ?? null, user_prompt: user_prompt ?? null },
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
