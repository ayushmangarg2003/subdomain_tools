export default function BackgroundPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <svg className="absolute top-0 left-[max(50%,25rem)] h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
        aria-hidden="true">
        <defs>
          <pattern id="grid" width="128" height="128" x="50%" y="-1" patternUnits="userSpaceOnUse">
            <path d="M128 0L0 0 0 128" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" strokeWidth="0" fill="url(#grid)" />
        <svg x="50%" y="-1" className="overflow-visible fill-gray-50">
          <path d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z" strokeWidth="0" />
        </svg>
        <rect width="100%" height="100%" strokeWidth="0" fill="url(#grid)" />
      </svg>
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-gray-50"></div>
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-gray-50"></div>
    </div>
  );
} 