import React from "react";

/**
 * Componente FullscreenLoader
 * Props:
 * - visible: boolean (muestra u oculta el loader)
 * - message: string (texto opcional bajo el spinner)
 */
export default function FullscreenLoader({ visible = true, message = "Cargando..." }) {
  if (!visible) return null;

  const overlayStyle = {
    position: "fixed",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
    zIndex: 9999,
    padding: 20,
  };

  const boxStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    color: "#fff",
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  };

  const textStyle = {
    fontSize: 14,
    opacity: 0.95,
  };

  return (
    <div style={overlayStyle} role="status" aria-live="polite" aria-label="Cargando">
      <div style={boxStyle}>
        <svg width="64" height="64" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="40" stroke="#ffffff33" strokeWidth="10" fill="none" />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="#ffffff"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray="62.8 188.4"
            fill="none"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 50"
              to="360 50 50"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
        <div style={textStyle}>{message}</div>
      </div>
    </div>
  );
}