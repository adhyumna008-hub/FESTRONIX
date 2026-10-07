---
name: auth-rbac-security
description: Evaluate FESTRONIX authentication, scoped permissions, and secure admin workflows when security architecture is authorized.
---

# Authentication and authorization

Read `docs/AI_HANDOFF.md` first and honor phase limits. Keep provider choice open until an explicit architecture decision; this skill does not select or configure an auth provider.

- Define actors, resources, actions, and permission scope from confirmed workflows. Separate global roles from resource-scoped permissions.
- Apply least privilege and server-side authorization to every protected operation. Never rely on hidden UI controls as authorization.
- Model faculty approval requirements, coordinator event scope, and edition-scoped student access explicitly; clarify expiry and revocation.
- Prevent privilege escalation through role assignment, editable ownership fields, resource identifiers, and cross-edition access. Recheck authorization against authoritative state.
- Validate client input, including identifiers, allowed fields, state transitions, and requested scopes. Treat client-supplied roles and approval claims as untrusted.
- Identify sensitive actions and design secure admin workflows with appropriate confirmation, reauthentication, approval, or separation of duties based on actual risk and requirements.
- Record attributable audit events for permission changes, approvals, and sensitive operations; avoid logging credentials or unnecessary personal data.
- Review session lifecycle, revoked access, direct API calls, and access to other users' resources when evaluating a design.

Document the permission matrix and unresolved policy choices before implementation. Coordinate persistence invariants with data modeling without duplicating its schema methodology.
