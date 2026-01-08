import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

interface PasswordCriteria {
  label: string;
  test: (password: string) => boolean;
}

const passwordCriteria: PasswordCriteria[] = [
  { label: 'At least 8 characters', test: (pwd) => pwd.length >= 8 },
  { label: 'Contains uppercase letter', test: (pwd) => /[A-Z]/.test(pwd) },
  { label: 'Contains lowercase letter', test: (pwd) => /[a-z]/.test(pwd) },
  { label: 'Contains number', test: (pwd) => /\d/.test(pwd) },
  { label: 'Contains special character', test: (pwd) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd) },
];

const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
  const passedCriteria = passwordCriteria.filter(criterion => criterion.test(password)).length;

  if (passedCriteria <= 2) return { score: 1, label: 'Weak', color: 'bg-red-500' };
  if (passedCriteria <= 3) return { score: 2, label: 'Fair', color: 'bg-yellow-500' };
  if (passedCriteria <= 4) return { score: 3, label: 'Good', color: 'bg-blue-500' };
  return { score: 4, label: 'Strong', color: 'bg-green-500' };
};

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
  className = ''
}) => {
  const strength = getPasswordStrength(password);

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Strength Bar */}
      <div className="flex space-x-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-2 flex-1 rounded-full transition-colors ${
              level <= strength.score ? strength.color : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Strength Label */}
      <div className="text-sm font-medium text-gray-700">
        Password Strength: <span className={`font-semibold ${
          strength.score === 1 ? 'text-red-600' :
          strength.score === 2 ? 'text-yellow-600' :
          strength.score === 3 ? 'text-blue-600' : 'text-green-600'
        }`}>{strength.label}</span>
      </div>

      {/* Criteria Checklist */}
      <div className="space-y-1">
        {passwordCriteria.map((criterion, index) => {
          const isPassed = criterion.test(password);
          return (
            <div key={index} className="flex items-center space-x-2 text-sm">
              {isPassed ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <X className="w-4 h-4 text-red-500" />
              )}
              <span className={isPassed ? 'text-green-700' : 'text-red-700'}>
                {criterion.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};