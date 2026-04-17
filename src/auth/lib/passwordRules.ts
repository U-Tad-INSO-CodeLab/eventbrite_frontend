export type PasswordChecks = {
  minLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasSymbol: boolean;
};

export function getPasswordChecks(password: string): PasswordChecks {
  return {
    minLength: password.length >= 8,
    hasUpper: /[\p{Lu}]/u.test(password),
    hasLower: /[\p{Ll}]/u.test(password),
    hasSymbol: /[\p{P}\p{S}]/u.test(password),
  };
}

export function isPasswordPolicyMet(password: string): boolean {
  const c = getPasswordChecks(password);
  return c.minLength && c.hasUpper && c.hasLower && c.hasSymbol;
}
