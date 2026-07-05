// Temporary single-workspace constant (no auth yet — see PROJECT_MEMORY.md).
// Every model/query in this app is scoped by workspaceId so multi-tenancy
// later (real auth, Sprint 9+) is a matter of deriving this value from the
// authenticated user/company instead of importing this constant.
export const DEFAULT_WORKSPACE_ID = 'demo-workspace'
