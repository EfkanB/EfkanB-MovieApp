// Bu dosya sadece MovieList içinde tetiklenen global event’i yakalamak için örnektir.
export function attachOpenAuthListener(onOpenAuth) {
  if (typeof window === 'undefined') return () => {};

  const handler = () => {
    if (typeof onOpenAuth === 'function') onOpenAuth();
  };

  window.addEventListener('open-auth', handler);
  return () => window.removeEventListener('open-auth', handler);
}

