import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { ApiError, Tx } from './db.js';

export interface Identity { uid: string; email?: string; name?: string; emailVerified: boolean }
export interface IdentityVerifier { verify(token: string): Promise<Identity> }
export function firebaseVerifier(projectId: string): IdentityVerifier {
  if (!projectId) throw new Error('FIREBASE_PROJECT_ID is required');
  const app = initializeApp({ projectId, credential: applicationDefault() });
  return { async verify(token) {
    const claims = await getAuth(app).verifyIdToken(token, true);
    return { uid: claims.uid, email: claims.email, name: claims.name, emailVerified: claims.email_verified === true };
  } };
}
export async function authenticate(header: string | undefined, verifier: IdentityVerifier): Promise<Identity> {
  const match = /^Bearer ([^\s]{1,8192})$/.exec(header ?? '');
  if (!match) throw new ApiError(401, 'UNAUTHENTICATED');
  try {
    const identity = await verifier.verify(match[1]);
    if (!identity.uid || !identity.emailVerified) throw new Error('Unverified identity');
    return identity;
  } catch { throw new ApiError(401, 'UNAUTHENTICATED', 'A valid, verified sign-in is required.'); }
}
export async function resolveUser(tx: Tx, identity: Identity): Promise<string> {
  // Serialize first login for the same UID without linking identities by email.
  await tx.rows('SELECT pg_advisory_xact_lock(hashtextextended($1, 1))', [identity.uid]);
  const existing = await tx.one(`SELECT u.id,u.disabled_at FROM identities i JOIN users u ON u.id=i.user_id
    WHERE i.provider='FIREBASE' AND i.subject=$1`, [identity.uid]);
  if (existing) {
    if (existing.disabled_at) throw new ApiError(403, 'ACCOUNT_DISABLED');
    return existing.id;
  }
  const user = (await tx.one(`INSERT INTO users(display_name,email) VALUES($1,$2) RETURNING id`,
    [(identity.name || 'Participant').slice(0,120), identity.email ?? null]))!;
  await tx.rows("INSERT INTO identities(provider,subject,user_id) VALUES('FIREBASE',$1,$2)", [identity.uid, user.id]);
  return user.id;
}
