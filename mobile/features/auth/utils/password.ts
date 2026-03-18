export const SIGNUP_PASSWORD_MIN_LENGTH = 6;

export type SignupPasswordRule = {
  key: 'minLength';
  label: string;
  isSatisfied: boolean;
};

export type SignupPasswordValidationResult = {
  isValid: boolean;
  rules: SignupPasswordRule[];
};

export function validateSignupPassword(password: string): SignupPasswordValidationResult {
  const rules: SignupPasswordRule[] = [
    {
      key: 'minLength',
      label: `${SIGNUP_PASSWORD_MIN_LENGTH}文字以上`,
      isSatisfied: password.length >= SIGNUP_PASSWORD_MIN_LENGTH,
    },
  ];

  return {
    isValid: rules.every((rule) => rule.isSatisfied),
    rules,
  };
}
