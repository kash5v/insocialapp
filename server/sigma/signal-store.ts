import { Direction, SessionRecord, SignedPublicPreKeyType } from "@privacyresearch/libsignal-protocol-typescript";

export class SignalProtocolStore {
  private store: Map<string, any> = new Map();
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  async get(key: string, defaultValue?: any): Promise<any> {
    const value = this.store.get(key);
    return value !== undefined ? value : defaultValue;
  }

  async put(key: string, value: any): Promise<void> {
    this.store.set(key, value);
  }

  async remove(key: string): Promise<void> {
    this.store.delete(key);
  }

  async getIdentityKeyPair(): Promise<any> {
    return this.get("identityKey");
  }

  async getLocalRegistrationId(): Promise<number> {
    return this.get("registrationId");
  }

  async isTrustedIdentity(
    identifier: string,
    identityKey: ArrayBuffer,
    direction: Direction
  ): Promise<boolean> {
    const trusted = await this.get(`identity_${identifier}`);
    if (trusted === undefined) {
      return true;
    }
    return this.arrayBufferEquals(identityKey, trusted);
  }

  async saveIdentity(identifier: string, identityKey: ArrayBuffer): Promise<boolean> {
    const existing = await this.get(`identity_${identifier}`);
    await this.put(`identity_${identifier}`, identityKey);
    
    if (existing && !this.arrayBufferEquals(identityKey, existing)) {
      return true;
    }
    return false;
  }

  async loadPreKey(keyId: number): Promise<any> {
    const preKey = await this.get(`prekey_${keyId}`);
    if (!preKey) {
      throw new Error(`PreKey ${keyId} not found`);
    }
    return preKey;
  }

  async storePreKey(keyId: number, keyPair: any): Promise<void> {
    await this.put(`prekey_${keyId}`, keyPair);
  }

  async removePreKey(keyId: number): Promise<void> {
    await this.remove(`prekey_${keyId}`);
  }

  async loadSignedPreKey(keyId: number): Promise<any> {
    const signedPreKey = await this.get(`signed_prekey_${keyId}`);
    if (!signedPreKey) {
      throw new Error(`SignedPreKey ${keyId} not found`);
    }
    return signedPreKey;
  }

  async storeSignedPreKey(keyId: number, keyPair: any): Promise<void> {
    await this.put(`signed_prekey_${keyId}`, keyPair);
  }

  async removeSignedPreKey(keyId: number): Promise<void> {
    await this.remove(`signed_prekey_${keyId}`);
  }

  async loadSession(identifier: string): Promise<SessionRecord | undefined> {
    return this.get(`session_${identifier}`);
  }

  async storeSession(identifier: string, record: SessionRecord): Promise<void> {
    await this.put(`session_${identifier}`, record);
  }

  async removeSession(identifier: string): Promise<void> {
    await this.remove(`session_${identifier}`);
  }

  async removeAllSessions(identifier: string): Promise<void> {
    for (const key of this.store.keys()) {
      if (key.startsWith(`session_${identifier}`)) {
        await this.remove(key);
      }
    }
  }

  private arrayBufferEquals(a: ArrayBuffer, b: ArrayBuffer): boolean {
    const aView = new Uint8Array(a);
    const bView = new Uint8Array(b);
    
    if (aView.length !== bView.length) {
      return false;
    }
    
    for (let i = 0; i < aView.length; i++) {
      if (aView[i] !== bView[i]) {
        return false;
      }
    }
    
    return true;
  }
}
