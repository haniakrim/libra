/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * admin-roles.ts
 * Copyright (C) 2025 Nextify Limited
 *
 * Admin role definitions for the better-auth admin plugin.
 */

import { role } from "better-auth/plugins";

const adminStatements = {
    user: [
        "create",
        "list",
        "set-role",
        "ban",
        "impersonate",
        "delete",
        "set-password",
        "set-email",
        "get",
        "update",
    ],
    session: ["list", "revoke", "delete"],
} as const;

const superadminStatements = {
    user: [
        "create",
        "list",
        "set-role",
        "ban",
        "impersonate",
        "impersonate-admins",
        "delete",
        "set-password",
        "set-email",
        "get",
        "update",
    ],
    session: ["list", "revoke", "delete"],
} as const;

export const authRoles = {
    user: role({ user: [], session: [] }),
    admin: role(adminStatements),
    superadmin: role(superadminStatements),
};
