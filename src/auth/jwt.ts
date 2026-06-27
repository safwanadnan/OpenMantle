import { SignJWT, jwtVerify } from "jose";

export interface SessionClaims {
  userId: string;
  organizationId: string;
  role: string;
}

function key(secret: string): Uint8Array {
  return new TextEncoder().encode(secret);
}

export async function signSession(claims: SessionClaims, secret: string, issuer: string): Promise<string> {
  return new SignJWT({ organizationId: claims.organizationId, role: claims.role })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(claims.userId)
    .setIssuer(issuer)
    .setAudience("openmantle-dashboard")
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(key(secret));
}

export async function verifySession(token: string, secret: string, issuer: string): Promise<SessionClaims> {
  const { payload } = await jwtVerify(token, key(secret), {
    issuer,
    audience: "openmantle-dashboard",
    algorithms: ["HS256"],
  });
  if (!payload.sub || typeof payload.organizationId !== "string" || typeof payload.role !== "string") {
    throw new Error("Invalid session claims");
  }
  return { userId: payload.sub, organizationId: payload.organizationId, role: payload.role };
}
