import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoBack } from '../hooks/useGoBack';
import { ChevronLeft, Settings as SettingsIcon } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';

type NotifKey = 'mission' | 'regular' | 'partner' | 'community';

const LABELS: Record<NotifKey, string> = {
  mission: '미션 알림',
  regular: '정기 검사 알림',
  partner: '파트너 활동 알림',
  community: '커뮤니티 알림',
};

type IosSwitchProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  id?: string;
};

function IosSwitch({ checked, onChange, disabled, id }: IosSwitchProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => {
        if (!disabled) onChange(!checked);
      }}
      className={[
        'relative h-[31px] w-[51px] shrink-0 rounded-full transition-colors duration-200',
        checked ? 'bg-[#9388FA]' : 'bg-gray200',
        disabled ? 'cursor-not-allowed opacity-55' : 'cursor-pointer active:scale-[0.98]',
      ].join(' ')}
    >
      <span
        className={[
          'pointer-events-none absolute left-[2px] top-[2px] h-[27px] w-[27px] rounded-full bg-white shadow-md ring-1 ring-black/5 transition-transform duration-200',
          checked ? 'translate-x-[20px]' : 'translate-x-0',
        ].join(' ')}
      />
    </button>
  );
}

const NotificationSettings = () => {
  const navigate = useNavigate();
  const goBack = useGoBack('/settings');

  const [individual, setIndividual] = useState<Record<NotifKey, boolean>>({
    mission: true,
    regular: true,
    partner: true,
    community: true,
  });

  const setOne = (key: NotifKey, next: boolean) => {
    setIndividual((prev) => ({ ...prev, [key]: next }));
  };

  const allOn = (Object.values(individual) as boolean[]).every(Boolean);

  const setAll = (next: boolean) => {
    setIndividual({
      mission: next,
      regular: next,
      partner: next,
      community: next,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div
        className="relative w-[390px] h-[844px] flex flex-col overflow-hidden rounded-[28px] shadow-xl"
        style={{ background: 'linear-gradient(to bottom, #9388FA 0%, #E0A1CD 100%)' }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-[-40px] h-[240px] w-[240px] rounded-full bg-white/20 blur-[30px]" />
          <div className="absolute top-[220px] right-[-70px] h-[260px] w-[260px] rounded-full bg-[#E0A1CD]/30 blur-[40px]" />
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
        </div>

        <header className="relative z-10 px-6 pb-2">
          <StatusBar />
          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={goBack}
              className="flex items-center gap-2 rounded-full px-2 py-1"
              aria-label="설정(마이페이지)으로 돌아가기"
            >
              <ChevronLeft size={22} strokeWidth={2} className="text-white" />
              <span className="type-card-title">알림 설정</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/settings')}
              aria-label="설정"
              className="relative h-[46px] w-[46px] rounded-full bg-white/95 shadow-[0px_10px_24px_rgba(16,24,40,0.14)] ring-1 ring-white/60"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <SettingsIcon size={20} className="text-blackBg" />
              </div>
            </button>
          </div>
        </header>

        <main className="premium-scroll relative z-10 flex-1 px-6 pb-10">
          <section className="pt-2">
            <div className="rounded-[20px] bg-white/65 backdrop-blur-md border border-white/45 px-4 py-4 shadow-[0px_10px_24px_rgba(16,24,40,0.10)] flex items-center justify-between min-h-[56px]">
              <span className="type-ink-button-lg text-blackBg">전체 알림</span>
              <IosSwitch checked={allOn} onChange={setAll} />
            </div>
          </section>

          <div className="my-6 h-px w-full bg-white/35" aria-hidden />

          <section>
            <p className="mb-1 type-caption text-white/80">알림 유형</p>
            <p className="mb-3 text-[11px] leading-[1.5] text-white/75">
              아래 알림을 각각 선택할 수 있고,{' '}
              <span className="font-semibold text-white/95">전체 알림</span>을 끄면
              모든 알림이 함께 꺼져요.
            </p>
            <div className="flex flex-col gap-3">
              {(Object.keys(LABELS) as NotifKey[]).map((key) => (
                <div
                  key={key}
                  className={[
                    'rounded-[20px] bg-white/65 backdrop-blur-md border border-white/45 px-4 py-4 shadow-[0px_10px_24px_rgba(16,24,40,0.10)] flex items-center justify-between min-h-[56px]',
                    allOn ? '' : '',
                  ].join(' ')}
                >
                  <span className="type-ink-button-lg text-blackBg pr-3">
                    {LABELS[key]}
                  </span>
                  <IosSwitch
                    checked={individual[key]}
                    onChange={(next) => setOne(key, next)}
                  />
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default NotificationSettings;
