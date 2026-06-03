import { useCallback } from 'react';
import { useLocation, useNavigate, type NavigateFunction } from 'react-router-dom';

/**
 * 직전 화면으로 이동. 브라우저 히스토리가 없을 때만 fallback 사용.
 * (갑작스럽게 홈으로 튀는 하드코딩 navigate 방지)
 */
export function goBackWithFallback(
  navigate: NavigateFunction,
  locationKey: string,
  fallback: string,
) {
  if (locationKey !== 'default') {
    navigate(-1);
    return;
  }
  navigate(fallback);
}

export function useGoBack(fallback = '/app') {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(() => {
    goBackWithFallback(navigate, location.key, fallback);
  }, [navigate, location.key, fallback]);
}
