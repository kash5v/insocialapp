import {
  KeyHelper,
  SessionBuilder,
  SessionCipher,
  SignalProtocolAddress,
} from "@privacyresearch/libsignal-protocol-typescript";
import { SignalProtocolStore } from "./signal-store";

export class SigmaEncryption {
  private store: SignalProtocolStore;

  constructor(userId: string) {
    this.store = new SignalProtocolStore(userId);
  }

  async generateIdentityKeys() {
    const identityKeyPair = await KeyHelper.generateIdentityKeyPair();
    const registrationId = await KeyHelper.generateRegistrationId();
    
    await this.store.put("identityKey", identityKeyPair);
    await this.store.put("registrationId", registrationId);
    
    return { identityKeyPair, registrationId };
  }

  async generatePreKeys(count: number = 100) {
    const preKeys = await KeyHelper.generatePreKeys(1, count);
    
    for (const preKey of preKeys) {
      await this.store.storePreKey(preKey.keyId, preKey.keyPair);
    }
    
    return preKeys;
  }

  async generateSignedPreKey() {
    const identityKeyPair = await this.store.getIdentityKeyPair();
    const signedPreKey = await KeyHelper.generateSignedPreKey(
      identityKeyPair,
      1
    );
    
    await this.store.storeSignedPreKey(signedPreKey.keyId, signedPreKey.keyPair);
    
    return signedPreKey;
  }

  async createSession(recipientId: string, deviceId: number, preKeyBundle: any) {
    const recipientAddress = new SignalProtocolAddress(recipientId, deviceId);
    const sessionBuilder = new SessionBuilder(this.store, recipientAddress);
    
    await sessionBuilder.processPreKey(preKeyBundle);
  }

  async encrypt(recipientId: string, deviceId: number, message: string) {
    const recipientAddress = new SignalProtocolAddress(recipientId, deviceId);
    const sessionCipher = new SessionCipher(this.store, recipientAddress);
    
    const ciphertext = await sessionCipher.encrypt(Buffer.from(message, "utf-8"));
    return ciphertext;
  }

  async decrypt(senderId: string, deviceId: number, ciphertext: any) {
    const senderAddress = new SignalProtocolAddress(senderId, deviceId);
    const sessionCipher = new SessionCipher(this.store, senderAddress);
    
    const plaintext = await sessionCipher.decryptPreKeyWhisperMessage(
      ciphertext.body,
      "binary"
    );
    
    return Buffer.from(plaintext).toString("utf-8");
  }

  async getPreKeyBundle() {
    const identityKeyPair = await this.store.getIdentityKeyPair();
    const registrationId = await this.store.get("registrationId");
    const preKeys = await this.store.get("preKeys") || [];
    const signedPreKey = await this.store.get("signedPreKey");
    
    const preKey = preKeys[0];
    
    return {
      identityKey: identityKeyPair.pubKey,
      registrationId,
      preKey: {
        keyId: preKey.keyId,
        publicKey: preKey.keyPair.pubKey,
      },
      signedPreKey: {
        keyId: signedPreKey.keyId,
        publicKey: signedPreKey.keyPair.pubKey,
        signature: signedPreKey.signature,
      },
    };
  }
}
