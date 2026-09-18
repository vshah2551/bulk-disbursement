import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:8080",
  realm: "bulk-disbursement",
  clientId: "bulk-disbursement-frontend",
});

export default keycloak;