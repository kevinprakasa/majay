'use client';

import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

const ALERT_ICON = {
  info: InformationCircleIcon,
  warning: ExclamationTriangleIcon,
  error: ExclamationCircleIcon,
  success: CheckCircleIcon,
};

export const PlatformAlert = ({
  type,
  text = '',
  duration = 3000,
}: {
  type: 'success' | 'error' | 'warning' | 'info';
  text: string;
  duration?: number;
}) => {
  const Icon = ALERT_ICON['error'];
  const [alert, setAlert] = useState<{ type: string; text: string } | null>(
    null
  );
  const [showing, setShowing] = useState(false);

  useEffect(() => {
    if (text && type) {
      setAlert({ type, text });
      setShowing(true);
    }
    const timer = setTimeout(() => {
      setAlert(null);
    }, duration + 1000);
    const timerShowing = setTimeout(() => {
      setShowing(false);
    }, duration);

    return () => {
      clearTimeout(timer);
      clearTimeout(timerShowing);
    };
  }, [text, type, duration]);

  return (
    <>
      <div
        className={`toast toast-end toast-top ${!showing && `opacity-0`} transition-all duration-500`}
      >
        {alert && (
          <div role='alert' className={`alert alert-${alert.type} flex`}>
            <Icon width={22} />
            <span className='max-w-[130px] text-wrap sm:max-w-full'>
              {alert.text}
            </span>
          </div>
        )}
      </div>
    </>
  );
};
