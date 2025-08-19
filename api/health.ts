export default function handler(_req: any, res: any) {
  const now = new Date().toISOString();
  const body = { ok: true, service: 'api/health', time: now };
  return res.status(200).json(body);
}
