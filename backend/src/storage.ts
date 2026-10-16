import { randomUUID, createHash } from 'node:crypto';
import { mkdir, writeFile, readFile, unlink } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { ApiError } from './db.js';

export interface ProofStore {
  put(key: string, bytes: Buffer): Promise<void>;
  read(key: string): Promise<Buffer>;
  remove(key: string): Promise<void>;
}
export class LocalProofStore implements ProofStore {
  private readonly root: string;
  constructor(directory: string) { this.root=resolve(directory); }
  private path(key: string) {
    if (!/^[0-9a-f-]{36}$/.test(key)) throw new Error('Invalid storage key');
    return join(this.root,key);
  }
  async put(key: string, bytes: Buffer) { await mkdir(this.root,{recursive:true}); await writeFile(this.path(key),bytes,{flag:'wx',mode:0o600}); }
  async read(key: string) { return readFile(this.path(key)); }
  async remove(key: string) { await unlink(this.path(key)); }
}
export function proofBytes(base64: string, mime: string) {
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(base64)) throw new ApiError(400,'INVALID_PROOF');
  const bytes=Buffer.from(base64,'base64');
  if (bytes.length<8 || bytes.length>2097152) throw new ApiError(400,'INVALID_PROOF_SIZE');
  const png=bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  const jpg=bytes[0]===255 && bytes[1]===216 && bytes[2]===255;
  if (!(mime==='image/png' && png) && !(mime==='image/jpeg' && jpg)) throw new ApiError(400,'INVALID_PROOF_TYPE');
  return { key: randomUUID(), bytes, hash: createHash('sha256').update(bytes).digest('hex') };
}
