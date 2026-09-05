import { ButtonHTMLAttributes, ElementType, HTMLAttributes, ReactNode } from "react";

type SurfaceBackground = "surface" | "background-deep" | "tint";
type SurfacePadding = "none" | "sm" | "md";
type SurfaceRounded = "lg" | "xl";
type AccentFocus = "cyan" | "plasma";

interface SurfaceOwnProps {
  as?: ElementType;
  background?: SurfaceBackground;
  tintColor?: string;
  tintAlpha?: { bg: number; border: number };
  padding?: SurfacePadding;
  shadow?: boolean;
  interactive?: boolean;
  /** "inline" (default) row-centers single-line button content for touch-target sizing; "stack" keeps block flow for multi-line content (e.g. an icon+name+value card) and only adds the min-height. */
  contentLayout?: "inline" | "stack";
  accentFocus?: AccentFocus;
  rounded?: SurfaceRounded;
  className?: string;
  children: ReactNode;
}

type SurfaceProps = SurfaceOwnProps &
  Omit<HTMLAttributes<HTMLElement> & ButtonHTMLAttributes<HTMLButtonElement>, keyof SurfaceOwnProps>;

const PADDING_CLASS: Record<SurfacePadding, string> = {
  none: "",
  sm: "px-3.5 py-2",
  md: "p-4",
};

const ROUNDED_CLASS: Record<SurfaceRounded, string> = {
  lg: "rounded-lg",
  xl: "rounded-xl",
};

const FOCUS_RING_CLASS: Record<AccentFocus, string> = {
  cyan: "focus-visible:ring-[color-mix(in_oklch,var(--accent-cyan)_35%,transparent)]",
  plasma: "focus-visible:ring-[color-mix(in_oklch,var(--accent-plasma)_35%,transparent)]",
};

const HOVER_BORDER_CLASS: Record<AccentFocus, string> = {
  cyan: "hover:border-[color-mix(in_oklch,var(--accent-cyan)_40%,transparent)]",
  plasma: "hover:border-[color-mix(in_oklch,var(--accent-plasma)_40%,transparent)]",
};

// The single place a surface's depth (background step + border + shadow)
// gets rendered, so a card/pill/button can't silently lose one of the
// three the way ~14 hand-typed Tailwind strings across the app used to
// (see the design-audit findings this component was extracted to fix).
export function Surface({
  as,
  background = "surface",
  tintColor,
  tintAlpha = { bg: 12, border: 30 },
  padding = "md",
  shadow = true,
  interactive = false,
  contentLayout = "inline",
  accentFocus = "cyan",
  rounded = "xl",
  className = "",
  children,
  style,
  ...rest
}: SurfaceProps) {
  const Tag = as ?? "div";

  const backgroundClass =
    background === "surface" ? "bg-surface" : background === "background-deep" ? "bg-background-deep" : "";

  const tintStyle =
    background === "tint" && tintColor
      ? {
          background: `color-mix(in oklch, ${tintColor} ${tintAlpha.bg}%, transparent)`,
          borderColor: `color-mix(in oklch, ${tintColor} ${tintAlpha.border}%, transparent)`,
        }
      : undefined;

  // Only a real <button> is ever focusable/clickable, so touch-target
  // sizing, the press-scale, and the focus ring are scoped to it - a
  // hoverable-but-inert surface like MetricCard gets just the hover
  // border/transition, not affordances implying it does something on
  // click when it doesn't.
  const isButton = Tag === "button";
  const interactiveClass = interactive
    ? [
        "transition-colors duration-150 ease-[var(--ease-standard)]",
        HOVER_BORDER_CLASS[accentFocus],
        isButton && "min-h-11 active:scale-[0.97]",
        isButton && contentLayout === "inline" && "flex items-center justify-center",
        isButton && `focus-visible:outline-none focus-visible:ring-4 ${FOCUS_RING_CLASS[accentFocus]}`,
      ]
        .filter(Boolean)
        .join(" ")
    : "";

  return (
    <Tag
      className={[
        "border border-surface-border",
        backgroundClass,
        ROUNDED_CLASS[rounded],
        PADDING_CLASS[padding],
        shadow ? "shadow-card" : "",
        interactiveClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ ...tintStyle, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
