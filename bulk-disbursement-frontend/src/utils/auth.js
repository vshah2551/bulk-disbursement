export function getRolesFromToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    return [];
  }

  try {
    const payload = JSON.parse(
      atob(token.split(".")[1])
    );

    return payload?.realm_access?.roles || [];

  } catch (error) {
    console.error("Unable to read roles from token:", error);
    return [];
  }
}

export function hasRole(role) {
  return getRolesFromToken().includes(role);
}

export function isOperator() {
  return hasRole("DISBURSEMENT_OPERATOR");
}

export function isApprover() {
  return hasRole("DISBURSEMENT_APPROVER");
}

export function isAdmin() {
  return hasRole("ADMIN");
}