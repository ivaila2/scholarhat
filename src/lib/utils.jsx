export const today = new Date();
today.setHours(0, 0, 0, 0);

export function SvgIcon({ svg, size = 20, color }) {
  if (!svg) return null;
  return (
    <span
      dangerouslySetInnerHTML={{ __html: svg }}
      className={color ? undefined : 'text-[#16a37e] dark:text-[#22d3a5]'}
      style={{ display: 'inline-flex', width: size, height: size, verticalAlign: 'middle', flexShrink: 0, ...(color ? { color } : {}) }}
    />
  );
}
