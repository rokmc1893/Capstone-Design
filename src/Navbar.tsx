export const Navbar = () => {
  return (
    <nav style={{ padding: '20px', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between' }}>
      <h1 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>결혼·출산 건강 점수</h1>
      <div style={{ display: 'flex', gap: '15px' }}>
        <span>홈</span>
        <span>점수 확인</span>
        <span>커뮤니티</span>
      </div>
    </nav>
  );
};
