import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoBack } from '../hooks/useGoBack';
import {
  ChevronLeft,
  Settings as SettingsIcon,
  ChevronRight,
  User,
  X,
  Mail,
} from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import { ApiError } from '../lib/api';
import { deleteUserMe, fetchUserMe, patchUserMe } from '../lib/homeMissionsApi';
import { applyUserMeToStores } from '../lib/userProfileSync';
import {
  apiGenderToProfile,
  profileGenderToApi,
  profileGenderToSimulator,
} from '../lib/userProfileGender';
import { useSimulatorStore } from '../store/useSimulatorStore';
import { useUserProfileStore } from '../store/useUserProfileStore';
import { getDisplayName } from '../lib/displayName';
import { useAuthStore } from '../store/useAuthStore';


const Settings = () => {
  const navigate = useNavigate();
  const goBack = useGoBack('/home');
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [usageNoticeModalOpen, setUsageNoticeModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);
  const [profileEditModalOpen, setProfileEditModalOpen] = useState(false);
  const [profileEditingField, setProfileEditingField] = useState<
    null | 'name' | 'nickname' | 'gender'
  >(null);
  const [profileDraft, setProfileDraft] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const hasApiBase = Boolean(import.meta.env.VITE_API_BASE_URL);
  const accessToken = useAuthStore((s) => s.accessToken);
  const authUser = useAuthStore((s) => s.user);

  const profileName = useUserProfileStore((s) => s.name);
  const profileNickname = useUserProfileStore((s) => s.nickname);
  const displayName = getDisplayName(
    authUser?.nickname,
    profileNickname,
    profileName,
  );
  const profileGender = useUserProfileStore((s) => s.gender);
  const setProfileName = useUserProfileStore((s) => s.setName);
  const setProfileNickname = useUserProfileStore((s) => s.setNickname);
  const setProfileGender = useUserProfileStore((s) => s.setGender);
  const loginMethod = useAuthStore((s) => s.loginMethod);
  const loginEmail = useAuthStore((s) => s.email);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (
      !termsModalOpen &&
      !usageNoticeModalOpen &&
      !logoutModalOpen &&
      !deleteAccountModalOpen &&
      !profileEditModalOpen
    )
      return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [
    termsModalOpen,
    usageNoticeModalOpen,
    logoutModalOpen,
    deleteAccountModalOpen,
    profileEditModalOpen,
  ]);

  useEffect(() => {
    if (!profileEditModalOpen) {
      setProfileEditingField(null);
      setProfileDraft('');
      setProfileMessage(null);
    }
  }, [profileEditModalOpen]);

  const loadUserMe = useCallback(async () => {
    if (!hasApiBase || !accessToken) return;
    setProfileLoading(true);
    setProfileMessage(null);
    try {
      const me = await fetchUserMe();
      applyUserMeToStores(me);
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : '내 정보를 불러오지 못했어요.';
      setProfileMessage(msg);
    } finally {
      setProfileLoading(false);
    }
  }, [hasApiBase, accessToken]);

  useEffect(() => {
    void loadUserMe();
  }, [loadUserMe]);

  const openProfileEdit = (field: 'name' | 'nickname' | 'gender') => {
    setProfileEditingField(field);
    if (field === 'name') setProfileDraft(profileName);
    else if (field === 'nickname') setProfileDraft(profileNickname);
    else setProfileDraft(profileGender);
  };

  const saveProfileEdit = async () => {
    if (!profileEditingField) return;
    const t = profileDraft.trim();

    if (profileEditingField === 'name') {
      if (t.length > 20) {
        setProfileMessage('표시 이름은 20자 이하로 입력해 주세요.');
        return;
      }
      if (hasApiBase && accessToken) {
        setProfileSaving(true);
        setProfileMessage(null);
        try {
          const updated = await patchUserMe({
            displayName: t.length > 0 ? t : null,
          });
          applyUserMeToStores(updated);
          setProfileName(updated.displayName?.trim() ?? (t.length > 0 ? t : ''));
          setProfileMessage(
            t.length > 0 ? '표시 이름이 저장되었어요.' : '표시 이름을 삭제했어요.',
          );
        } catch (err) {
          if (t.length > 0) setProfileName(t);
          const msg =
            err instanceof ApiError ? err.message : '표시 이름 저장에 실패했어요.';
          setProfileMessage(msg);
        } finally {
          setProfileSaving(false);
        }
      } else {
        if (t.length > 0) setProfileName(t);
        else setProfileName('');
        setProfileMessage(
          t.length > 0 ? '표시 이름이 저장되었어요.' : '표시 이름을 비웠어요.',
        );
      }
      setProfileEditingField(null);
      setProfileDraft('');
      return;
    }

    if (profileEditingField === 'gender') {
      const nextGender = profileDraft === '남자' ? '남자' : '여자';
      if (hasApiBase && accessToken) {
        setProfileSaving(true);
        setProfileMessage(null);
        try {
          const updated = await patchUserMe({ gender: profileGenderToApi(nextGender) });
          applyUserMeToStores(updated);
          const synced = apiGenderToProfile(updated.gender) ?? nextGender;
          setProfileGender(synced);
          useSimulatorStore.getState().setGender(profileGenderToSimulator(synced));
          setProfileMessage('성별이 저장되었어요. 검사 시작 시 이 성별이 사용됩니다.');
        } catch (err) {
          setProfileGender(nextGender);
          useSimulatorStore.getState().setGender(profileGenderToSimulator(nextGender));
          const msg =
            err instanceof ApiError ? err.message : '성별 저장에 실패했어요.';
          setProfileMessage(msg);
        } finally {
          setProfileSaving(false);
        }
      } else {
        setProfileGender(nextGender);
        useSimulatorStore.getState().setGender(profileGenderToSimulator(nextGender));
        setProfileMessage('성별이 저장되었어요.');
      }
      setProfileEditingField(null);
      setProfileDraft('');
      return;
    }

    if (profileEditingField === 'nickname') {
      if (!t) {
        setProfileMessage('닉네임을 입력해 주세요.');
        return;
      }
      if (t.length < 2 || t.length > 10) {
        setProfileMessage('닉네임은 2~10자로 입력해 주세요.');
        return;
      }

      if (hasApiBase && accessToken) {
        setProfileSaving(true);
        setProfileMessage(null);
        try {
          const updated = await patchUserMe({ nickname: t });
          applyUserMeToStores(updated);
          setProfileMessage('닉네임이 저장되었어요.');
        } catch (err) {
          const msg =
            err instanceof ApiError ? err.message : '닉네임 저장에 실패했어요.';
          setProfileMessage(msg);
          setProfileSaving(false);
          return;
        } finally {
          setProfileSaving(false);
        }
      } else {
        setProfileNickname(t);
        setProfileMessage('닉네임이 저장되었어요.');
      }
    }

    setProfileEditingField(null);
    setProfileDraft('');
  };

  const handleDeleteAccount = async () => {
    if (deleteSubmitting) return;
    setDeleteSubmitting(true);
    try {
      if (hasApiBase && accessToken) {
        await deleteUserMe();
      }
      logout();
      navigate('/login', { replace: true });
    } catch (err) {
      setDeleteSubmitting(false);
      setDeleteAccountModalOpen(false);
      const msg =
        err instanceof ApiError ? err.message : '회원 탈퇴에 실패했어요. 잠시 후 다시 시도해 주세요.';
      setProfileMessage(msg);
    }
  };

  const cancelProfileEdit = () => {
    setProfileEditingField(null);
    setProfileDraft('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div
        className="relative w-[390px] h-[844px] flex flex-col overflow-hidden rounded-[28px] shadow-xl"
        style={{ background: 'linear-gradient(to bottom, #9388FA 0%, #E0A1CD 100%)' }}
      >
        {/* Soft glow layers */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-[-40px] h-[240px] w-[240px] rounded-full bg-white/20 blur-[30px]" />
          <div className="absolute top-[220px] right-[-70px] h-[260px] w-[260px] rounded-full bg-[#E0A1CD]/30 blur-[40px]" />
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
        </div>

        {/* Top navigation */}
        <header className="relative z-10 px-6 pb-2">
          <StatusBar />
          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={goBack}
              className="flex items-center gap-2 rounded-full px-2 py-1"
              aria-label="홈으로 돌아가기"
            >
              <ChevronLeft size={22} strokeWidth={2} className="text-white" />
              <span className="type-card-title">마이페이지</span>
            </button>

            <button
              type="button"
              onClick={() => {}}
              aria-label="설정"
              className="relative h-[46px] w-[46px] rounded-full bg-white/95 shadow-[0px_10px_24px_rgba(16,24,40,0.14)] ring-1 ring-white/60"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <SettingsIcon size={20} className="text-blackBg" />
              </div>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="premium-scroll relative z-10 flex-1 px-6 pb-10">
          {/* Profile */}
          <section className="pt-3">
            <div className="flex items-center gap-4">
              <div className="relative flex h-[56px] w-[56px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/70 backdrop-blur-md ring-1 ring-white/50 shadow-sm">
                {authUser?.profileImageUrl ? (
                  <img
                    src={authUser.profileImageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User size={24} className="text-blackBg" />
                )}
              </div>
              <div className="min-w-0">
                <p className="type-ink-title-sm text-white tracking-[-0.2px] whitespace-nowrap">
                  {displayName} 님
                </p>
                <p className="mt-1 type-body-sm text-white/80">
                  {profileLoading ? '불러오는 중…' : profileNickname}
                </p>
              </div>
            </div>
            {profileMessage && !profileEditModalOpen ? (
              <p className="mt-3 rounded-[12px] bg-black/20 px-3 py-2 type-caption text-white">
                {profileMessage}
              </p>
            ) : null}
          </section>

          {/* Section 1 */}
          <section className="mt-6">
            <p className="type-caption text-white/80 mb-3">앱 설정</p>
            <div className="space-y-3">
              {[
                { title: '알림 설정', key: 'notify' },
                { title: '내 정보 수정', key: 'profile' },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    if (item.key === 'notify') navigate('/settings/notifications');
                    if (item.key === 'profile') setProfileEditModalOpen(true);
                  }}
                  className="w-full rounded-[20px] bg-white/65 backdrop-blur-md border border-white/45 px-4 py-4 flex items-center justify-between shadow-[0px_10px_24px_rgba(16,24,40,0.10)]"
                >
                  <span className="type-ink-list-row">
                    {item.title}
                  </span>
                  <ChevronRight size={20} className="text-blackBg/60" />
                </button>
              ))}
            </div>
          </section>

          {/* Section 2 */}
          <section className="mt-7 pb-2">
            <p className="type-caption text-white/80 mb-3">
              약관 및 정책
            </p>
            <div className="space-y-3">
              {[
                { title: '약관 및 개인정보 활용', key: 'terms_privacy' },
                { title: '앱 사용 시 주의사항', key: 'usage_notice' },
                { title: '로그아웃', key: 'logout' },
                { title: '회원 탈퇴', key: 'delete_account' },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    if (item.key === 'terms_privacy') setTermsModalOpen(true);
                    if (item.key === 'usage_notice') setUsageNoticeModalOpen(true);
                    if (item.key === 'logout') setLogoutModalOpen(true);
                    if (item.key === 'delete_account') setDeleteAccountModalOpen(true);
                  }}
                  className="w-full rounded-[20px] bg-white/65 backdrop-blur-md border border-white/45 px-4 py-4 flex items-center justify-between shadow-[0px_10px_24px_rgba(16,24,40,0.10)]"
                >
                  <span className="type-ink-list-row">
                    {item.title}
                  </span>
                  <ChevronRight size={20} className="text-blackBg/60" />
                </button>
              ))}
            </div>
          </section>
        </main>

        {/* 약관 및 개인정보 활용 모달 */}
        {termsModalOpen && (
          <div
            className="absolute inset-0 z-[60] flex items-center justify-center p-5"
            role="dialog"
            aria-modal="true"
            aria-labelledby="terms-modal-title"
          >
            {/* Dim + strong blur (설정 화면 뒤) */}
            <button
              type="button"
              aria-label="닫기"
              className="absolute inset-0 bg-black/45 backdrop-blur-[28px] backdrop-saturate-50"
              onClick={() => setTermsModalOpen(false)}
            />

            <div
              className="relative z-10 flex w-full max-w-[340px] max-h-[min(560px,78%)] flex-col overflow-hidden rounded-[28px] bg-white shadow-[0px_24px_48px_rgba(16,24,40,0.22)] ring-1 ring-black/5"
            >
              {/* Header */}
              <div className="shrink-0 border-b border-gray100/80 px-5 pt-5 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2
                      id="terms-modal-title"
                      className="type-ink-title-sm"
                    >
                      약관
                    </h2>
                    <p className="mt-1 type-ink-caption">
                      약관 내용
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTermsModalOpen(false)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray400 transition hover:bg-gray100 hover:text-blackBg"
                    aria-label="모달 닫기"
                  >
                    <X size={22} strokeWidth={2} />
                  </button>
                </div>
              </div>

              {/* Scrollable body */}
              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
                <h3 className="type-ink-list-row font-semibold">
                  개인정보 활용
                </h3>
                <p className="mt-3 type-ink-body-sm text-gray400">
                  개인정보 활용 관련 내용
                </p>
                <p className="mt-4 type-ink-body-sm text-gray400">
                  본 서비스는 서비스 제공 및 품질 개선을 위해 필요한 범위에서만
                  개인정보를 수집·이용합니다. 수집 항목, 이용 목적, 보관 기간은
                  관련 법령 및 내부 정책에 따라 안전하게 관리됩니다.
                </p>
                <p className="mt-4 type-ink-body-sm text-gray400">
                  이용자는 언제든지 개인정보 열람·정정·삭제·처리 정지를 요청할 수
                  있으며, 요청 시 지체 없이 조치합니다. 자세한 내용은 개인정보
                  처리방침 전문을 참고해 주세요.
                </p>
                <p className="mt-4 type-ink-body-sm text-gray400">
                  앱 사용 중 문의사항이 있으면 고객센터를 통해 연락해 주시기
                  바랍니다. 본 약관은 서비스 운영 정책에 따라 변경될 수 있으며,
                  변경 시 앱 내 공지를 통해 안내합니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 앱 사용 시 주의사항 모달 */}
        {usageNoticeModalOpen && (
          <div
            className="absolute inset-0 z-[60] flex items-center justify-center p-5"
            role="dialog"
            aria-modal="true"
            aria-labelledby="usage-notice-modal-title"
          >
            <button
              type="button"
              aria-label="닫기"
              className="absolute inset-0 bg-black/40 backdrop-blur-[24px] backdrop-saturate-50"
              onClick={() => setUsageNoticeModalOpen(false)}
            />

            <div
              className="relative z-10 flex w-full max-w-[340px] max-h-[min(440px,58%)] flex-col overflow-hidden rounded-[24px] bg-white shadow-[0px_20px_40px_rgba(16,24,40,0.18)] ring-1 ring-black/5"
            >
              <div className="shrink-0 border-b border-gray100/80 px-5 pt-5 pb-4">
                <div className="flex items-start justify-between gap-3">
                  <h2
                    id="usage-notice-modal-title"
                    className="type-ink-title-sm pr-2"
                  >
                    앱에 관하여
                  </h2>
                  <button
                    type="button"
                    onClick={() => setUsageNoticeModalOpen(false)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray400 transition hover:bg-gray100 hover:text-blackBg"
                    aria-label="모달 닫기"
                  >
                    <X size={22} strokeWidth={2} />
                  </button>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
                <p className="text-left type-ink-body-sm text-gray400 whitespace-pre-line">
                  {`본 어플은
더 나은 임신을 위한 건강 기록 및 관리를 위해 만들어진
생활 습관 개선 어플입니다
보다 더 정밀한 검사를 위해서는,
병원을 방문해주세요`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 내 정보 수정 모달 */}
        {profileEditModalOpen && (
          <div
            className="absolute inset-0 z-[60] flex items-center justify-center p-5 pointer-events-none"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-edit-modal-title"
          >
            {/* 배경은 클릭 가능, 카드는 그 위 레이어에서 포인터 수신 */}
            <button
              type="button"
              aria-label="닫기"
              className="absolute inset-0 z-0 bg-black/42 backdrop-blur-[26px] backdrop-saturate-50 pointer-events-auto"
              onClick={() => setProfileEditModalOpen(false)}
            />

            <div
              className="relative z-[70] flex w-full max-w-[340px] max-h-[min(520px,72%)] flex-col overflow-hidden rounded-[26px] bg-white shadow-[0px_22px_46px_rgba(16,24,40,0.2)] ring-1 ring-black/5 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="shrink-0 border-b border-gray100/80 px-5 pt-4 pb-3">
                <div className="flex items-center justify-between gap-3">
                  <h2
                    id="profile-edit-modal-title"
                    className="type-ink-list-row font-semibold"
                  >
                    내 정보 수정
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileEditModalOpen(false);
                      cancelProfileEdit();
                    }}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray400 transition hover:bg-gray100 hover:text-blackBg"
                    aria-label="모달 닫기"
                  >
                    <X size={22} strokeWidth={2} />
                  </button>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-2 pb-6">
                {hasApiBase && accessToken ? (
                  <p className="mb-4 type-ink-caption-sm">
                    표시 이름·닉네임·성별은 서버에 저장됩니다. 성별은 다음 «검사하기» 시작 시
                    API에 반영돼요.
                  </p>
                ) : null}
                {profileMessage && profileEditModalOpen ? (
                  <p className="mb-4 rounded-[10px] bg-gray100 px-3 py-2 type-ink-caption">
                    {profileMessage}
                  </p>
                ) : null}
                {[
                  {
                    label: '표시 이름',
                    value: profileName || '—',
                    key: 'name' as const,
                    hint: hasApiBase && accessToken ? '홈 인사말 · 서버' : undefined,
                  },
                  {
                    label: '현재 닉네임',
                    value: profileNickname,
                    key: 'nickname' as const,
                    hint: hasApiBase && accessToken ? '서버 저장' : undefined,
                  },
                  {
                    label: '성별',
                    value: profileGender,
                    key: 'gender' as const,
                    hint: hasApiBase && accessToken ? '검사 시작 · 서버' : undefined,
                  },
                ].map((row, idx) => (
                  <div key={row.key}>
                    {idx > 0 && <div className="my-5 h-px w-full bg-gray100" />}
                    <div>
                      <p className="type-ink-caption">
                        {row.label}
                        {'hint' in row && row.hint ? (
                          <span className="ml-1.5 font-normal text-gray400/80">({row.hint})</span>
                        ) : null}
                      </p>
                      {profileEditingField === row.key ? (
                        <div className="mt-3 space-y-3">
                          {row.key === 'gender' ? (
                            <div className="flex gap-2">
                              {(['여자', '남자'] as const).map((g) => (
                                <button
                                  key={g}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setProfileDraft(g);
                                  }}
                                  className={`flex-1 rounded-[12px] border py-2.5 type-ink-button-lg transition ${
                                    profileDraft === g
                                      ? 'border-[#9388FA] bg-[#9388FA]/15 text-[#9388FA]'
                                      : 'border-gray100 bg-gray100/50 text-gray400'
                                  }`}
                                >
                                  {g}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <input
                              type="text"
                              value={profileDraft}
                              onChange={(e) => setProfileDraft(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              maxLength={row.key === 'nickname' ? 10 : undefined}
                              className="w-full rounded-[12px] border border-gray100 bg-white px-3 py-3 type-ink-body outline-none ring-1 ring-gray100 focus:border-[#9388FA] focus:ring-[#9388FA]/30"
                              placeholder={
                                row.key === 'name'
                                  ? '표시 이름 (1~20자, 비우면 삭제)'
                                  : '닉네임 (2~10자)'
                              }
                              autoFocus
                            />
                          )}
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                cancelProfileEdit();
                              }}
                              className="flex-1 rounded-[12px] bg-gray100 py-2.5 type-ink-button text-gray400"
                            >
                              취소
                            </button>
                            <button
                              type="button"
                              disabled={profileSaving}
                              onClick={(e) => {
                                e.stopPropagation();
                                void saveProfileEdit();
                              }}
                              className="flex-1 rounded-[12px] bg-[#9388FA] py-2.5 type-ink-button text-white shadow-sm disabled:opacity-50"
                            >
                              {profileSaving ? '저장 중…' : '저장'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-2 flex items-center justify-between gap-3">
                          <span className="type-ink-body">{row.value}</span>
                          <button
                            type="button"
                            className="shrink-0 min-h-[44px] min-w-[72px] inline-flex items-center justify-end rounded-lg px-2 py-2 type-ink-button text-[#9388FA] transition hover:bg-[#9388FA]/10 active:opacity-80"
                            onClick={(e) => {
                              e.stopPropagation();
                              openProfileEdit(row.key);
                            }}
                          >
                            변경하기
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 로그아웃 확인 모달 */}
        {logoutModalOpen && (
          <div
            className="absolute inset-0 z-[60] flex items-center justify-center p-5"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-modal-title"
          >
            <button
              type="button"
              aria-label="닫기"
              className="absolute inset-0 bg-black/45 backdrop-blur-[24px] backdrop-saturate-50"
              onClick={() => setLogoutModalOpen(false)}
            />

            <div
              className="relative z-10 flex w-full max-w-[340px] flex-col overflow-hidden rounded-[24px] bg-white shadow-[0px_20px_44px_rgba(16,24,40,0.2)] ring-1 ring-black/5"
            >
              <div className="px-5 pt-6 pb-2">
                <h2
                  id="logout-modal-title"
                  className="type-inspect-cta text-blackBg"
                >
                  로그아웃 하시겠습니까?
                </h2>
                <p className="mt-4 text-center type-ink-body-sm text-gray400 whitespace-pre-line">
                  {`로그아웃을 진행해주세요!
다음 로그인 시, 아래 계정으로 로그인할 수 있어요.`}
                </p>
              </div>

              <div className="mx-5 mt-5 mb-5 flex items-center gap-3 rounded-[16px] bg-gray100/90 px-4 py-3 ring-1 ring-gray100">
                {loginMethod === 'kakao' ? (
                  <>
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-kakaoBg">
                      <img
                        alt="카카오 로그인"
                        src="/kakao-talk.png"
                        className="absolute inset-0 m-auto size-[24px] object-contain"
                      />
                    </div>
                    <span className="type-ink-button-lg text-blackBg">
                      카카오계정
                    </span>
                  </>
                ) : (
                  <>
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
                      <Mail className="size-[18px] text-gray400" aria-hidden />
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="type-ink-caption">
                        이메일 계정
                      </span>
                      <span className="mt-0.5 truncate type-ink-list-row font-semibold">
                        {loginEmail ?? 'example@email.com'}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-3 border-t border-gray100/90 px-5 pb-5 pt-4">
                <button
                  type="button"
                  onClick={() => setLogoutModalOpen(false)}
                  className="flex-1 rounded-[14px] bg-gray100 py-3.5 type-ink-button-lg text-gray400 transition active:scale-[0.98]"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLogoutModalOpen(false);
                    logout();
                    navigate('/login', { replace: true });
                  }}
                  className="flex-1 rounded-[14px] bg-[#9388FA] py-3.5 type-card-title shadow-[0px_8px_20px_rgba(147,136,250,0.45)] transition active:scale-[0.98]"
                >
                  로그아웃
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 회원 탈퇴 확인 모달 */}
        {deleteAccountModalOpen && (
          <div
            className="absolute inset-0 z-[60] flex items-center justify-center p-5"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-account-modal-title"
          >
            <button
              type="button"
              aria-label="닫기"
              className="absolute inset-0 bg-black/50 backdrop-blur-[26px] backdrop-saturate-50"
              onClick={() => setDeleteAccountModalOpen(false)}
            />

            <div
              className="relative z-10 flex w-full max-w-[340px] flex-col overflow-hidden rounded-[24px] bg-white shadow-[0px_20px_44px_rgba(16,24,40,0.22)] ring-1 ring-black/5"
            >
              <div className="px-5 pt-6 pb-5">
                <h2
                  id="delete-account-modal-title"
                  className="type-inspect-cta text-blackBg"
                >
                  정말 탈퇴하시겠어요?
                </h2>
                <p className="mt-4 text-center type-ink-body-sm text-gray400 whitespace-pre-line">
                  {`탈퇴 버튼 선택 시,
계정은 삭제되며 복구되지 않습니다.`}
                </p>
              </div>

              <div className="flex gap-3 border-t border-gray100/90 px-5 pb-5 pt-4">
                <button
                  type="button"
                  onClick={() => setDeleteAccountModalOpen(false)}
                  className="flex-1 rounded-[14px] bg-gray100 py-3.5 type-ink-button-lg text-gray400 transition active:scale-[0.98]"
                >
                  취소
                </button>
                <button
                  type="button"
                  disabled={deleteSubmitting}
                  onClick={() => void handleDeleteAccount()}
                  className="flex-1 rounded-[14px] bg-[#9388FA] py-3.5 type-card-title shadow-[0px_8px_20px_rgba(147,136,250,0.45)] transition active:scale-[0.98] disabled:opacity-50"
                >
                  {deleteSubmitting ? '처리 중…' : '확인'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;