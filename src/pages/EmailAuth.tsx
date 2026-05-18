import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ChevronLeft, Loader2 } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import { emailLogin, signUp } from '../lib/auth';
import { applyUserMeToStores } from '../lib/userProfileSync';
import { useAuthStore } from '../store/useAuthStore';
import { useUserProfileStore } from '../store/useUserProfileStore';
import { ApiError } from '../lib/api';

type Mode = 'login' | 'signup';

const EmailAuth = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const switchMode = (next: Mode) => {
    setMode(next);
    setErrorMsg(null);
    setPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      let result;
      if (mode === 'login') {
        result = await emailLogin({ email, password });
      } else {
        result = await signUp({ email, password, nickname });
      }

      setAuth({
        method: 'email',
        email,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user,
      });
      applyUserMeToStores(result.user);
      if (mode === 'signup' && nickname.trim()) {
        useUserProfileStore.getState().setNickname(nickname.trim());
      }
      navigate('/home', { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ background: 'linear-gradient(180deg, #9388FA 0%, #E0A1CD 100%)' }}
    >
      <div
        className="relative flex min-h-[852px] w-[393px] flex-col overflow-hidden rounded-3xl shadow-[0_24px_64px_rgba(147,136,250,0.35)]"
        style={{ background: 'linear-gradient(180deg, #9388FA 0%, #E0A1CD 100%)' }}
      >
        {/* 글로우 */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-white/30 blur-[64px]" />
          <div className="absolute top-[32%] -right-28 h-[300px] w-[300px] rounded-full bg-[#E0A1CD]/50 blur-[72px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.14] via-transparent to-white/[0.1] backdrop-blur-[2px]" />
        </div>

        <header className="relative z-10 pt-2">
          <StatusBar />
          <div className="px-5 pt-2">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-white/90 backdrop-blur-sm"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="text-[13px] font-medium">로그인</span>
            </button>
          </div>
        </header>

        <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-14">
          {/* 탭 */}
          <div className="mb-8 flex w-full max-w-[320px] rounded-[16px] bg-white/15 p-1 backdrop-blur-sm">
            {(['login', 'signup'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                className={`flex-1 rounded-[12px] py-2.5 text-[14px] font-semibold transition ${
                  mode === m ? 'bg-white text-[#9388FA] shadow-sm' : 'text-white/80'
                }`}
              >
                {m === 'login' ? '로그인' : '회원가입'}
              </button>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-[320px] flex-col gap-3"
          >
            {/* 이메일 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-white/80">
                이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="example@email.com"
                className="h-[50px] w-full rounded-[16px] bg-white/90 px-4 text-[14px] text-[#333] outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#9388FA]/60"
              />
            </div>

            {/* 닉네임 (회원가입만) */}
            {mode === 'signup' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-white/80">
                  닉네임 <span className="text-white/55">(2~10자)</span>
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  required
                  minLength={2}
                  maxLength={10}
                  placeholder="사용할 닉네임"
                  className="h-[50px] w-full rounded-[16px] bg-white/90 px-4 text-[14px] text-[#333] outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#9388FA]/60"
                />
              </div>
            )}

            {/* 비밀번호 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-white/80">
                비밀번호{' '}
                {mode === 'signup' && (
                  <span className="text-white/55">(8~20자)</span>
                )}
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  maxLength={20}
                  placeholder="비밀번호 입력"
                  className="h-[50px] w-full rounded-[16px] bg-white/90 px-4 pr-12 text-[14px] text-[#333] outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#9388FA]/60"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* 에러 메시지 */}
            {errorMsg && (
              <p className="rounded-[12px] bg-white/20 px-3 py-2 text-[12px] text-white">
                {errorMsg}
              </p>
            )}

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-[52px] items-center justify-center rounded-[20px] bg-white text-[16px] font-semibold text-[#9388FA] shadow-[0_12px_32px_rgba(147,136,250,0.35)] transition active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : mode === 'login' ? (
                '로그인'
              ) : (
                '회원가입'
              )}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default EmailAuth;
