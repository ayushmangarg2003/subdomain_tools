"use client";

import { useSearchParams } from 'next/navigation';
import Loader from '../../components/Loader';

export default function LoaderPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';
  const onComplete = searchParams.get('onComplete') ? 
    () => {
      try {
        // Execute the onComplete function if provided
        const fn = new Function('return ' + searchParams.get('onComplete'))();
        if (typeof fn === 'function') {
          // Get the current state from localStorage if available
          const currentState = localStorage.getItem('currentState');
          if (currentState) {
            const state = JSON.parse(currentState);
            // Execute the function with the current state
            fn(state);
          } else {
            fn();
          }
        }
      } catch (e) {
        console.error('Error executing onComplete function:', e);
      }
    } : 
    undefined;

  return <Loader redirectUrl={redirectUrl} onComplete={onComplete} />;
} 