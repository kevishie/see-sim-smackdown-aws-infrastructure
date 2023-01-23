import { DynamoDB } from 'aws-sdk';

export const handler = async (event: any) => {
  const body = `
client
dev tun
proto udp
remote 54.198.179.83 1194
resolv-retry infinite
nobind
persist-key
persist-tun
remote-cert-tls server
auth SHA512
auth-user-pass
cipher AES-256-CBC
ignore-unknown-option block-outside-dns
verb 3
<ca>
-----BEGIN CERTIFICATE-----
MIIDSzCCAjOgAwIBAgIUEfHMstIdajgWrC/LYiPosqqSk14wDQYJKoZIhvcNAQEL
BQAwFjEUMBIGA1UEAwwLRWFzeS1SU0EgQ0EwHhcNMjMwMTIyMTgwMDQ4WhcNMzMw
MTE5MTgwMDQ4WjAWMRQwEgYDVQQDDAtFYXN5LVJTQSBDQTCCASIwDQYJKoZIhvcN
AQEBBQADggEPADCCAQoCggEBAKu981rbvB9sXbCNOF3RS0VYl0ZLfNVM9TNY49j/
pCg6tCMMuXYwQBj9uvdmI80HNh1kKSnQE/EgoyNIoYe8p9mCAqr1lk6ibc6tIQEP
u1RbxW6dr6DGX3EXErGr0Oyo3nRWoHn9dapxvwekz64AOTMVl20W4IV5CgxCzMoL
/V2kgXFqvdhDkzUXPopA8OaOvTWTXcR+xyToswmstGQNrEQOr/Tcm5d9w3cpEUY4
1TxXOfyPKwpiPFFVeYtpNKpX/1z45OrWldbeeWjqRb8O7Qn7+4C/Pkw2RO+JteLg
axZaVwaUDwRbyY4cj0Um5pxFCN8ETPUHw63ZeO2iugpvlxUCAwEAAaOBkDCBjTAM
BgNVHRMEBTADAQH/MB0GA1UdDgQWBBRHzFAYOX25eZCyE3uIjrfWSiNhhzBRBgNV
HSMESjBIgBRHzFAYOX25eZCyE3uIjrfWSiNhh6EapBgwFjEUMBIGA1UEAwwLRWFz
eS1SU0EgQ0GCFBHxzLLSHWo4Fqwvy2Ij6LKqkpNeMAsGA1UdDwQEAwIBBjANBgkq
hkiG9w0BAQsFAAOCAQEAAjmD+BsDE1tspqE/8IjMvF778UWFQtCIaCj7q5xTccGD
WP5U/RtvjrJdPGDtWV4s09DIo2PmTnkT2n79lGUmmesEzP3AkFOuOpRR2RXcbeQb
gGTqCmnmzCzGLdpgmlZzL3lPpr7WjGrnIJ5WMGTvILykOf7Q9wOaK6V6rozggNoh
K4Ttj5aqo0A2Gp60QZgSeXnMG9/cBSUIPnzPXfVhR5zjU9otz2suT5KpOnQV2O9J
GM0NhRg5muKo9ZKROtsV+V9noGRsVzl85qw+Id5k1e8O1SWLNrhruw7eJl6pRxeb
bW9863INkHvvprTXCjOltBNhsnEIXNsRO8LUwgze4g==
-----END CERTIFICATE-----
</ca>
<tls-crypt>
-----BEGIN OpenVPN Static key V1-----
e8f09a157c1765ffbbfba33b9cb61074
5b955cb38d47383c4de7d19082daed77
4bce94180414b4e9aaf7d5e6966c855a
3f790690c218dde1d8f97f27ae910c47
a66f556eccf7f8b06d4516842c1cdbb3
4349a4b41cabad4bf12df46fef2398b6
a533433c53277b5bf53d5bf65390753b
d44ff3d351ef83f1216d58f62467d4e5
12a17036106d7eb1aa1ec845d81eff82
5f4893bed7a0bfd7d3d9c8159ea97009
fcb393020c30568c3315b09e2c4ea35a
07ae22c8c897d32f9baa3faf920d8371
d4a71c5cb825df4be1d2da6ec564db19
ba02ab829f5eeb068e990e05b6e42172
a2560a708bae8ffbfdcc8df8ffd37a26
5afcce2f8ecd4b4b691dac19371314a0
-----END OpenVPN Static key V1-----
</tls-crypt>
`;
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
    body,
  };
};
