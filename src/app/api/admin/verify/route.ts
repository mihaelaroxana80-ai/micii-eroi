import { isValidAdminPassword } from "@/lib/admin-auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const ok = isValidAdminPassword(body?.password);
  return Response.json({ ok }, { status: ok ? 200 : 401 });
}
