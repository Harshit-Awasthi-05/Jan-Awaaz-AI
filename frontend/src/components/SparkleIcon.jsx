export default function SparkleIcon({ className = 'w-5 h-5' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="aiSparkle" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="50%" stopColor="#14B8A6" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      
      <path
        d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
        fill="url(#aiSparkle)"
      />
      
      <path
        d="M19 2L19.5 4L21.5 4.5L19.5 5L19 7L18.5 5L16.5 4.5L18.5 4L19 2Z"
        fill="url(#aiSparkle)"
        opacity="0.7"
      />
      
      <path
        d="M20 15L20.4 16.5L22 17L20.4 17.5L20 19L19.6 17.5L18 17L19.6 16.5L20 15Z"
        fill="url(#aiSparkle)"
        opacity="0.5"
      />
    </svg>
  );
}
