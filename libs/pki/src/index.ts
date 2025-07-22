import {generateRsaKeyPair} from './rsa';
import {generateCertificate} from './x509';

export function generateCA(): {
  privateKey: string;
  publicKey: string;
  certificate: string;
} {
  const {privateKey, publicKeyPem, publicKey, privateKeyPem} = generateRsaKeyPair();
  const certificate = generateCertificate({publicKey, privateKey});
  return {privateKey: privateKeyPem, publicKey: publicKeyPem, certificate};
}
