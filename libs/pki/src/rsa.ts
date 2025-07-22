import {pki} from 'node-forge';

export function generateRsaKeyPair() {
  const keys = pki.rsa.generateKeyPair(2048);
  return {
    publicKey: keys.publicKey,
    publicKeyPem: pki.publicKeyToPem(keys.publicKey),
    privateKey: keys.privateKey,
    privateKeyPem: pki.privateKeyToPem(keys.privateKey),
  };
}
