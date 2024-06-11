// 'use client';

// import {
//   CheckCircleIcon,
//   ExclamationCircleIcon,
//   ExclamationTriangleIcon,
//   InformationCircleIcon,
// } from '@heroicons/react/24/outline';
// import { createContext, useContext, useEffect, useState } from 'react';

// export const AlertContext = createContext<{
//   // alerts: [{ type: string; text: string }];
//   alert: { type: string; text: string } | null;
// }>({ alert: null });

// const ALERT_ICON = {
//   info: InformationCircleIcon,
//   warning: ExclamationTriangleIcon,
//   error: ExclamationCircleIcon,
//   success: CheckCircleIcon,
// };

// export const PlatformAlert = ({
//   type = 'info',
//   text = '',
//   duration = 1000,
// }: {
//   type?: 'success' | 'error' | 'warning' | 'info';
//   text: string;
//   duration?: number;
// }) => {
//   const Icon = ALERT_ICON[type];
//   const { alert } = useContext(AlertContext);

//   return (
//     <>
//       {alert && (
//         <div className='toast toast-end toast-top'>
//           <div role='alert' className={`alert alert-${alert.type}`}>
//             <Icon width={16} />
//             <span>{alert.text}</span>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };
