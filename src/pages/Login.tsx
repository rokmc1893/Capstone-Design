import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';
import { KakaoLoginButton } from '../components/KakaoLoginButton';
import { useAuthStore } from '../store/useAuthStore';
import { redirectToKakaoLogin } from '../lib/auth';

const Login = () => {
  const navigate = useNavigate();
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  // 이미 로그인된 경우 홈으로 이동
  const accessToken = useAuthStore((s) => s.accessToken);
  useEffect(() => {
    if (accessToken) navigate('/home', { replace: true });
  }, [accessToken, navigate]);

  useEffect(() => {
    if (!termsModalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [termsModalOpen]);

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{
        background: 'linear-gradient(180deg, #9388FA 0%, #E0A1CD 100%)',
      }}
    >
      <div
        className="relative flex min-h-[852px] w-[393px] flex-col overflow-hidden rounded-3xl shadow-[0_24px_64px_rgba(147,136,250,0.35),0_8px_32px_rgba(224,161,205,0.25)]"
        style={{
          background: 'linear-gradient(180deg, #9388FA 0%, #E0A1CD 100%)',
        }}
      >
        {/* 소프트 글로우 · 부드러운 블렌드 · 살짝 블러 */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-white/30 blur-[64px]" />
          <div className="absolute top-[32%] -right-28 h-[300px] w-[300px] rounded-full bg-[#E0A1CD]/50 blur-[72px]" />
          <div className="absolute -bottom-24 -left-16 h-[260px] w-[260px] rounded-full bg-[#9388FA]/40 blur-[56px]" />
          <div className="absolute top-1/2 left-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-[80px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.14] via-transparent to-white/[0.1] backdrop-blur-[2px]" />
        </div>
        {/* 상단 Status Bar (로그인에서는 뒤로가기 없음) */}
        <header className="relative z-10 pt-2">
          <StatusBar />
        </header>

        {/* 메인 콘텐츠: Figma 로그인 온보딩 구조 */}
        <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-14 text-center">
          <div className="flex max-w-[320px] flex-col items-center">
            <h1 className="type-brand-display">Fertility Helper</h1>
            <p className="type-ink-body-sm mt-5 max-w-[280px] text-[#2d2d2d]/78">
              간편하게 로그인하고
              <br />
              다양한 서비스를 이용해보세요.
            </p>
          </div>

          <div className="mt-14 flex w-full max-w-[320px] flex-col items-center gap-3">
            <KakaoLoginButton
              onClick={() => {
                // 백엔드 카카오 OAuth 엔드포인트로 전체 리다이렉트
                redirectToKakaoLogin();
              }}
            />

            <button
              type="button"
              onClick={() => navigate('/email-auth')}
              className="type-ink-body-sm flex h-[48px] w-full max-w-[320px] items-center justify-center rounded-[20px] bg-[#F2F2F2] text-[#444] shadow-[0_3px_10px_rgba(0,0,0,0.06)] ring-1 ring-white/50 backdrop-blur-sm transition hover:bg-white/90 active:scale-[0.99] active:shadow-[0_2px_6px_rgba(0,0,0,0.05)]"
            >
              이메일로 시작하기
            </button>

            <p className="mt-6 max-w-[280px] text-center text-[11px] leading-[1.6] text-[#2a2a2a]/52">
              로그인 시 서비스 이용약관에 동의하는 것으로 간주됩니다.
              <br />
              <button
                type="button"
                onClick={() => setTermsModalOpen(true)}
                className="mt-1 inline underline decoration-[#2a2a2a]/28 underline-offset-2 transition hover:text-[#2a2a2a]/75 hover:decoration-[#2a2a2a]/45"
              >
                이용 약관 보기
              </button>
            </p>
          </div>
        </main>

        {/* 이용 약관 모달 */}
        {termsModalOpen && (
          <div
            className="absolute inset-0 z-[60] flex items-center justify-center p-5 pointer-events-none"
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-terms-title"
          >
            <button
              type="button"
              aria-label="닫기"
              className="absolute inset-0 z-0 bg-black/45 backdrop-blur-[24px] backdrop-saturate-50 pointer-events-auto"
              onClick={() => setTermsModalOpen(false)}
            />

            <div
              className="relative z-[70] flex w-full max-w-[340px] max-h-[min(560px,78%)] flex-col overflow-hidden rounded-[24px] bg-white shadow-[0px_24px_48px_rgba(16,24,40,0.22)] ring-1 ring-black/5 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="shrink-0 border-b border-gray100/80 px-5 pt-4 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <h2
                    id="login-terms-title"
                    className="text-[18px] font-bold leading-tight tracking-[-0.25px] text-blackBg pr-2"
                  >
                    이용 약관
                  </h2>
                  <button
                    type="button"
                    onClick={() => setTermsModalOpen(false)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray400 transition hover:bg-gray100 hover:text-blackBg"
                    aria-label="닫기"
                  >
                    <X size={22} strokeWidth={2} />
                  </button>
                </div>
                <p className="mt-1 text-left text-[11px] text-gray400">
                  시행일: 2025.03.01
                </p>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 text-left">
                <div className="space-y-4 text-[13px] leading-[1.65] text-gray400">
                  <section>
                    <h3 className="text-[14px] font-semibold text-blackBg">제1조 (목적)</h3>
                    <p className="mt-2">
                      본 약관은 Fertility Helper(이하 &quot;서비스&quot;)가 제공하는 건강 기록·
                      생활 습관 개선 및 관련 부가 기능의 이용과 회원·운영자 간 권리·의무 및
                      책임사항을 규정함을 목적으로 합니다.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-[14px] font-semibold text-blackBg">제2조 (용어의 정의)</h3>
                    <p className="mt-2">
                      &quot;회원&quot;이란 본 약관에 동의하고 카카오 등 소셜 로그인을 통해
                      서비스를 이용하는 자를 말합니다. &quot;콘텐츠&quot;란 서비스 내에
                      게시된 문구·이미지·데이터 등 일체를 말합니다.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-[14px] font-semibold text-blackBg">제3조 (약관의 효력 및 변경)</h3>
                    <p className="mt-2">
                      서비스는 필요한 경우 관련 법령을 위배하지 않는 범위에서 약관을
                      변경할 수 있으며, 변경 시 앱 내 공지 등 합리적인 방법으로
                      안내합니다. 변경 후에도 서비스를 계속 이용하는 경우 변경 약관에
                      동의한 것으로 봅니다.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-[14px] font-semibold text-blackBg">제4조 (서비스의 제공)</h3>
                    <p className="mt-2">
                      서비스는 임신·건강 관련 정보 제공, 기록·알림, 시뮬레이터 등 운영
                      정책에 따라 정해진 기능을 제공합니다. 일부 기능은 회원 상태·기기
                      환경에 따라 제한될 수 있습니다.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-[14px] font-semibold text-blackBg">제5조 (회원의 의무)</h3>
                    <p className="mt-2">
                      회원은 타인의 정보를 도용하거나 서비스 운영을 방해하는 행위,
                      불법·음란·명예훼손 등 부적절한 게시, 시스템 무단 접근 등을 하여서는
                      안 됩니다. 위반 시 이용 제한·계약 해지 등 조치가 있을 수 있습니다.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-[14px] font-semibold text-blackBg">제6조 (의료 행위의 부인)</h3>
                    <p className="mt-2">
                      서비스에서 제공하는 정보는 일반적인 건강·생활 정보에 해당하며,
                      의료법상의 진단·치료를 대체하지 않습니다. 질병의 진단·치료·처방이
                      필요한 경우 반드시 의료기관을 방문하시기 바랍니다.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-[14px] font-semibold text-blackBg">제7조 (개인정보의 보호)</h3>
                    <p className="mt-2">
                      개인정보의 수집·이용·제공·파기 등에 관한 사항은 관련 법령 및
                      별도의 개인정보 처리방침에 따릅니다. 회원은 개인정보 제공에 동의하지
                      않을 권리가 있으나, 필수 항목 미동의 시 서비스 이용이 제한될 수
                      있습니다.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-[14px] font-semibold text-blackBg">제8조 (책임의 한계)</h3>
                    <p className="mt-2">
                      천재지변, 통신 장애, 회원의 귀책 사유 등 불가항력으로 인한 서비스
                      중단에 대하여 운영자는 고의 또는 중대한 과실이 없는 한 책임을 지지
                      않습니다. 회원이 서비스를 통해 얻은 정보에 의존하여 내린 결정에
                      대한 결과는 회원 본인의 책임입니다.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-[14px] font-semibold text-blackBg">제9조 (서비스 이용의 종료)</h3>
                    <p className="mt-2">
                      회원은 언제든지 앱 내 탈퇴 등의 절차를 통해 이용계약을 해지할 수
                      있습니다. 운영자는 운영상·기술상 필요 시 서비스를 변경하거나
                      종료할 수 있으며, 사전 또는 사후에 공지합니다.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-[14px] font-semibold text-blackBg">제10조 (준거법 및 분쟁)</h3>
                    <p className="mt-2">
                      본 약관은 대한민국 법령에 따르며, 서비스와 관련하여 분쟁이 발생한
                      경우 관할 법원은 민사소송법 등 관련 법령에 따릅니다.
                    </p>
                  </section>

                  <p className="pb-2 text-[12px] text-gray200">
                    문의: 앱 내 고객센터 또는 운영자가 안내하는 연락처로 연락해 주세요.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
