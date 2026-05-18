import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ProfileGender = '여자' | '남자';

interface UserProfileState {
  name: string;
  nickname: string;
  gender: ProfileGender;
  setName: (name: string) => void;
  setNickname: (nickname: string) => void;
  setGender: (gender: ProfileGender) => void;
}

export const useUserProfileStore = create<UserProfileState>()(
  persist(
    (set) => ({
      name: '',
      nickname: '',
      gender: '여자',
      setName: (name) => set({ name }),
      setNickname: (nickname) => set({ nickname }),
      setGender: (gender) => set({ gender }),
    }),
    {
      name: 'user-profile',
    },
  ),
);
