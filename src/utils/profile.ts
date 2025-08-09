import { UserProfile } from '@/types/models';

export function calculateProfileCompleteness(p: Partial<UserProfile>): number {
  if (!p) return 0;
  let score = 0;
  const checks = [
    Boolean(p.name),
    Boolean(p.age),
    Boolean(p.gender),
    Boolean(p.occupation),
    Boolean(p.bio && p.bio.length >= 20),
    Boolean(p.photoUrls && p.photoUrls.length >= 3),
    Boolean(p.preferences),
    Boolean(p.verification && (p.verification.idUploaded || p.verification.workVerified))
  ];
  score = (checks.filter(Boolean).length / checks.length) * 100;
  return Math.round(score);
}


