/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gray100: '#E7E7E7',
        gray200: '#AAAAAA',
        gray400: '#72726F',
        blackBg: '#202020',
        // 이전에 제안했던 토큰 이름들도 함께 지원
        primaryBlack: '#202020',
        primaryGray: '#AAAAAA',
        lightGray: '#E7E7E7',
        mutedGray: '#72726F',
        kakaoBg: '#FEE500',
        kakaoText: '#381F1F',
        gray500: '#595959',
      },
      backgroundImage: {
        // 홈/로그인 등에서 사용하는 감성 그라데이션
        'emotion-blend':
          'radial-gradient(120% 90% at 20% 10%, rgba(147, 136, 250, 0.95) 0%, rgba(147, 136, 250, 0.55) 35%, rgba(224, 161, 205, 0.75) 70%, rgba(224, 161, 205, 0.95) 100%)',
        'radial-purple':
          'radial-gradient(circle at center, #9388FA 0%, #FFFFFF 70%)',
        'radial-blue':
          'radial-gradient(circle at center, #AEB2F5 0%, #F2F7FB 100%)',
        'radial-pink':
          'radial-gradient(circle at center, #E0A1CD 0%, #F9F9F9 70%)',
        'linear-green':
          'linear-gradient(to right, #EBF4E0 0%, #C9F595 100%)',
        'radial-deep-pink':
          'radial-gradient(circle at center, #F053AF 0%, #FFFEFE 69%)',
        // Figma 로그인 배경(node 1:617) 전용: 위쪽은 연분홍, 아래쪽은 연보라
        'login-soft':
          'radial-gradient(120% 120% at 15% 0%, #E0A1CD 0%, rgba(224,161,205,0.4) 35%, rgba(255,255,255,0.9) 60%, #C9C8F7 90%)',
      },
    },
  },
  plugins: [],
};

