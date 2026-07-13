import { useEffect, useState, type ReactNode } from 'react';
import { refreshSession } from '../../api/client';
import { captureTokensFromHash, getRefresh, getToken, isExpired, redirectToLogin } from '../../lib/auth';

interface AuthGateProps {
  children: ReactNode;
}


export function AuthGate({ children }: AuthGateProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    (async () => {
      captureTokensFromHash();

      if (!isExpired(getToken())) {
        if (active) setReady(true);
        return;
      }

      if (getRefresh() && (await refreshSession())) {
        if (active) setReady(true);
        return;
      }

      redirectToLogin();
    })();

    return () => {
      active = false;
    };
  }, []);

  if (!ready) {
    return (
      <div className="flex items-center justify-center h-[100dvh] text-sm text-muted">
        Connexion en cours…
      </div>
    );
  }

  return <>{children}</>;
}
