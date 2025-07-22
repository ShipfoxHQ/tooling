import {randomBytes} from 'node:crypto';
import {addDays} from 'date-fns';
import {md, pki} from 'node-forge';

interface GenerateCertificateParams {
  publicKey: pki.PublicKey;
  privateKey: pki.rsa.PrivateKey;
}

export function generateCertificate(params: GenerateCertificateParams) {
  const cert = pki.createCertificate();
  cert.publicKey = params.publicKey;
  cert.serialNumber = `00${randomBytes(16).toString('hex')}`;

  const now = new Date();
  cert.validity.notBefore = now;
  cert.validity.notAfter = addDays(now, 1);

  cert.setSubject([
    {name: 'commonName', value: 'Shipfox runner proxy CA'},
    {name: 'countryName', value: 'FR'},
    {name: 'stateOrProvinceName', value: 'Paris'},
    {name: 'localityName', value: 'Paris'},
    {name: 'organizationName', value: 'Shipfox SAS'},
  ]);

  cert.setIssuer([
    {name: 'commonName', value: 'Shipfox runner proxy CA'},
    {name: 'countryName', value: 'FR'},
    {name: 'stateOrProvinceName', value: 'Paris'},
    {name: 'localityName', value: 'Paris'},
    {name: 'organizationName', value: 'Shipfox SAS'},
  ]);

  cert.setExtensions([
    {
      name: 'basicConstraints',
      critical: true,
      cA: true,
    },
    {
      name: 'keyUsage',
      critical: true,
      keyCertSign: true,
    },
  ]);

  cert.sign(params.privateKey, md.sha256.create());
  return pki.certificateToPem(cert);
}
