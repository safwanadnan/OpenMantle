import "fastify";
import type { SessionClaims } from "../auth/jwt.js";

declare module "fastify" {
  interface FastifyRequest {
    auth: SessionClaims | null;
  }
}
