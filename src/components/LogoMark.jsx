export default function LogoMark({ size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 3.4 22 7.8 12 12.2 2 7.8 12 3.4Z" fill="currentColor" />
      <path
        d="M6.6 10v4.9c0 1.9 2.4 3.4 5.4 3.4s5.4-1.5 5.4-3.4V10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M21.4 8.6v4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="21.4" cy="14.4" r="1.25" fill="currentColor" />
    </svg>
  )
}
