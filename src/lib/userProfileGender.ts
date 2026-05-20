import type { ProfileGender } from '../store/useUserProfileStore';
import type { ApiGender } from './testsSessionApi';

/** UI 성별 → `PATCH /users/me` · `POST /tests/start` (`M` | `F`) */
export function profileGenderToApi(gender: ProfileGender): ApiGender {
  return gender === '남자' ? 'M' : 'F';
}

export function apiGenderToProfile(gender: string | null | undefined): ProfileGender | null {
  if (!gender) return null;
  const g = gender.trim().toUpperCase();
  if (g === 'M' || g === 'MALE') return '남자';
  if (g === 'F' || g === 'FEMALE') return '여자';
  return null;
}

export function profileGenderToSimulator(gender: ProfileGender): 'male' | 'female' {
  return gender === '남자' ? 'male' : 'female';
}
