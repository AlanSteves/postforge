export interface SafeUser {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SafeLinkedInAccount {
  id: string;
  userId: string;
  linkedinId: string;
  name: string | null;
  email: string | null;
  isConnected: boolean;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Strips passwordHash from user records before returning to client.
 */
export function sanitizeUser(user: any): SafeUser {
  if (!user) return user;
  const { passwordHash, ...safeUser } = user;
  return safeUser as SafeUser;
}

/**
 * Strips accessToken and refreshToken from LinkedInAccount records.
 * Returns only safe account information and connection status flag.
 */
export function sanitizeLinkedInAccount(account: any): SafeLinkedInAccount {
  if (!account) return account;
  const { accessToken, refreshToken, ...safeAccount } = account;
  return {
    ...safeAccount,
    isConnected: Boolean(accessToken && accessToken.length > 0),
  } as SafeLinkedInAccount;
}
