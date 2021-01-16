export const config =
  "postgres://cloudfunctions:DgDfQBRTL9fP4MMatMoR@free-tier.gcp-us-central1.cockroachlabs.cloud:26257/fancy-zebra-218.groupifier?sslmode=verify-full&sslrootcert=certs/cc-ca.crt";
export const smtpConfig = {
  port: 587,
  host: "smtp-relay.sendinblue.com",
  secure: false,
  pool: true,
  auth: {
    user: "jonathan@jpapineau.ca",
    pass:
      "xsmtpsib-929efb5c16e1ec55acf538c9d01e767b8c0930e262bb72aa96a8f2ce5c089cdd-DY7aVZJrThQcIdpL",
  },
};
