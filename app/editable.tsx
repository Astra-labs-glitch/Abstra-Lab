import type { CSSProperties, ElementType, ReactNode } from "react";

type Lookup = (key: string, fallback: string) => string;

// Text an admin can change in "Edit website" mode. Renders the saved text (or the
// default) and tags the element so the editor knows which key it is.
export function Editable({
  t,
  k,
  d,
  as: Tag = "span",
  className,
  style,
  id,
  children,
}: {
  t: Lookup;
  k: string;
  d: string;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  id?: string;
  children?: ReactNode;
}) {
  return (
    <Tag data-edit-key={k} className={className} style={style} id={id}>
      {t(k, d)}
      {children}
    </Tag>
  );
}
