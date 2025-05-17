"use client";

import { useState, useEffect } from 'react';

export default function ModalLoader({ onComplete }) {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onComplete) {
            onComplete();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <>
      <style jsx>{`
        #modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: #fff;
          z-index: 9999;
        }
        #modal-content {
          width: 100vw;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        #modal-top {
          width: 100vw;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 16px;
        }
        #modal-countdown {
          font-size: 1.25rem;
          font-weight: 500;
          color: #333;
          margin-bottom: 4px;
        }
        #modal-bar-bg {
          width: 120px;
          height: 6px;
          background: #e5e7eb;
          border-radius: 3px;
          overflow: hidden;
        }
        #modal-bar {
          height: 100%;
          background: linear-gradient(90deg, #6366f1, #a21caf, #ec4899);
          border-radius: 3px;
          transition: width 1s linear;
        }
      `}</style>
      <div id="modal-overlay">
        <div id="modal-content">
          <div id="modal-top">
            <div id="modal-countdown">{countdown} seconds remaining</div>
            <div id="modal-bar-bg">
              <div
                id="modal-bar"
                style={{ width: `${(countdown / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 