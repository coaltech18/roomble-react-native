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
    Boolean(p.photoUrls && p.photoUrls.length >= 1), // Reduced requirement for demo
    Boolean(p.preferences),
    Boolean(p.verification && (p.verification.idUploaded || p.verification.workVerified)),
    Boolean(p.preferences?.budgetRange),
    Boolean(p.preferences?.preferredAreas && p.preferences.preferredAreas.length > 0),
    Boolean(p.preferences?.ageRange),
    Boolean(p.preferences?.lifestyle)
  ];
  score = (checks.filter(Boolean).length / checks.length) * 100;
  return Math.round(score);
}

export function getProfileCompletenessDetails(p: Partial<UserProfile>): { score: number; missing: string[] } {
  if (!p) return { score: 0, missing: [] };
  
  const checks = [
    { name: 'Name', check: Boolean(p.name) },
    { name: 'Age', check: Boolean(p.age) },
    { name: 'Gender', check: Boolean(p.gender) },
    { name: 'Occupation', check: Boolean(p.occupation) },
    { name: 'Bio (20+ characters)', check: Boolean(p.bio && p.bio.length >= 20) },
    { name: 'Profile Photo', check: Boolean(p.photoUrls && p.photoUrls.length >= 1) },
    { name: 'Preferences', check: Boolean(p.preferences) },
    { name: 'Verification', check: Boolean(p.verification && (p.verification.idUploaded || p.verification.workVerified)) },
    { name: 'Budget Range', check: Boolean(p.preferences?.budgetRange) },
    { name: 'Preferred Areas', check: Boolean(p.preferences?.preferredAreas && p.preferences.preferredAreas.length > 0) },
    { name: 'Age Range', check: Boolean(p.preferences?.ageRange) },
    { name: 'Lifestyle', check: Boolean(p.preferences?.lifestyle) }
  ];
  
  const score = Math.round((checks.filter(c => c.check).length / checks.length) * 100);
  const missing = checks.filter(c => !c.check).map(c => c.name);
  
  return { score, missing };
}


