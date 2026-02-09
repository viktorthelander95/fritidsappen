import { useState, useRef, useMemo } from "react";

// ============================
// KONFIGURATION
// ============================
const ROOMS = [
  { id: "y-rummet", name: "Y-rummet", icon: "🎮", color: "#7C6EE6" },
  { id: "x-rummet", name: "X-rummet", icon: "📚", color: "#9B7FD4" },
  { id: "pysselrummet", name: "Pysselrummet", icon: "✂️", color: "#E88BA7" },
  { id: "byggrummet", name: "Byggrummet", icon: "🧱", color: "#F0A95B" },
  { id: "y-grupprummet", name: "Y-grupprummet", icon: "🗣️", color: "#5CC7A0" },
  { id: "idrottshallen", name: "Idrottshallen", icon: "⚽", color: "#E87070" },
  { id: "utomhus", name: "Utomhus", icon: "🌳", color: "#6BBF6B" },
  { id: "fotbollsplanen", name: "Fotbollsplanen", icon: "⚽", color: "#6BA3D6" },
  { id: "soffan", name: "Soffan", icon: "🛋️", color: "#B08BD6" },
  { id: "dansrummet", name: "Dansrummet", icon: "💃", color: "#E87098" },
];

// Harmonisk, barnvänlig palett
const HAIR_STYLES = ["kort", "lång", "lockar", "keps", "tofs", "mohawk"];
const SKIN_TONES = ["#FDE8D0", "#F5D0A9", "#E8BA89", "#C9956A", "#A0714E", "#7A5438"];
const HAIR_COLORS = ["#3E2723", "#5D4037", "#C0725E", "#E2C08D", "#F5E6CA", "#B85450", "#5B87C2", "#8E68AB"];
const SHIRT_COLORS = ["#E87070", "#F0A95B", "#E8D05B", "#6BBF6B", "#6BA3D6", "#9B7FD4", "#E88BA7", "#5CC7A0", "#8E9AAF", "#4A4A5A"];
const EYE_COLORS = ["#3B3128", "#5B7A4A", "#5B82B5", "#8B6B4A", "#6B5B8A"];
// Unika kännetecken
const ACCESSORIES = ["star", "heart", "moon", "flower", "lightning"];
const ACCESSORY_LABELS = { star: "Stjärna", heart: "Hjärta", moon: "Måne", flower: "Blomma", lightning: "Blixt" };
const MOODS = ["glad", "koncentrerad", "uppmuntrande"];

const DEMO_KIDS = [
  { id: 1, name: "Alice", hair: "lång", skinTone: "#FDE8D0", hairColor: "#E2C08D", shirtColor: "#E88BA7", eyeColor: "#5B82B5", accessory: "star" },
  { id: 2, name: "Erik", hair: "kort", skinTone: "#F5D0A9", hairColor: "#3E2723", shirtColor: "#6BA3D6", eyeColor: "#3B3128", accessory: "lightning" },
  { id: 3, name: "Fatima", hair: "lockar", skinTone: "#C9956A", hairColor: "#3E2723", shirtColor: "#9B7FD4", eyeColor: "#8B6B4A", accessory: "moon" },
  { id: 4, name: "Oscar", hair: "keps", skinTone: "#FDE8D0", hairColor: "#5D4037", shirtColor: "#6BBF6B", eyeColor: "#5B7A4A", accessory: "heart" },
  { id: 5, name: "Lina", hair: "tofs", skinTone: "#E8BA89", hairColor: "#C0725E", shirtColor: "#E8D05B", eyeColor: "#5B82B5", accessory: "flower" },
  { id: 6, name: "Noah", hair: "mohawk", skinTone: "#F5D0A9", hairColor: "#B85450", shirtColor: "#E87070", eyeColor: "#3B3128", accessory: "star" },
];

// ============================
// ACCESSORY SVG HELPERS
// ============================
function AccessoryIcon({ type, x, y, size, color = "#F0D060" }) {
  const s = size;
  if (type === "star") {
    const pts = [];
    for (let i = 0; i < 5; i++) {
      const a1 = (Math.PI / 2) * -1 + (i * 2 * Math.PI) / 5;
      const a2 = a1 + Math.PI / 5;
      pts.push(`${x + Math.cos(a1) * s},${y + Math.sin(a1) * s}`);
      pts.push(`${x + Math.cos(a2) * s * 0.4},${y + Math.sin(a2) * s * 0.4}`);
    }
    return <polygon points={pts.join(" ")} fill={color} stroke="#E8C040" strokeWidth={s * 0.1} />;
  }
  if (type === "heart") {
    return (
      <path
        d={`M${x},${y + s * 0.3} C${x - s * 0.6},${y - s * 0.5} ${x - s * 1.2},${y + s * 0.2} ${x},${y + s} C${x + s * 1.2},${y + s * 0.2} ${x + s * 0.6},${y - s * 0.5} ${x},${y + s * 0.3}Z`}
        fill="#F08080" stroke="#D06060" strokeWidth={s * 0.08}
      />
    );
  }
  if (type === "moon") {
    return (
      <g>
        <circle cx={x} cy={y} r={s} fill="#F0D860" />
        <circle cx={x + s * 0.35} cy={y - s * 0.2} r={s * 0.75} fill={color === "#F0D060" ? "#FDE8D0" : color} opacity={0.95} />
      </g>
    );
  }
  if (type === "flower") {
    return (
      <g>
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <circle key={a} cx={x + Math.cos((a * Math.PI) / 180) * s * 0.55} cy={y + Math.sin((a * Math.PI) / 180) * s * 0.55} r={s * 0.45} fill="#F0A0C0" opacity={0.85} />
        ))}
        <circle cx={x} cy={y} r={s * 0.4} fill="#F0D060" />
      </g>
    );
  }
  if (type === "lightning") {
    return (
      <polygon
        points={`${x - s * 0.3},${y - s} ${x + s * 0.15},${y - s * 0.1} ${x - s * 0.05},${y - s * 0.1} ${x + s * 0.3},${y + s} ${x - s * 0.15},${y + s * 0.1} ${x + s * 0.05},${y + s * 0.1}`}
        fill="#F0D060" stroke="#E0C040" strokeWidth={s * 0.08} strokeLinejoin="round"
      />
    );
  }
  return null;
}

// ============================
// ANIMATED AVATAR SVG – REDESIGNED
// ============================
function AvatarSVG({ hair, skinTone, hairColor, shirtColor, eyeColor = "#3B3128", accessory = "star", mood = "glad", size = 80, animate = true, animDelay = 0 }) {
  const s = size;
  const uid = useMemo(() => `a${Math.random().toString(36).slice(2, 7)}`, []);

  // Proportions – big head, small round body (chibi/Pixar-kid style)
  const cx = s / 2;
  const headR = s * 0.33;
  const headY = s * 0.36;
  const bodyY = headY + headR * 0.75;
  const bodyW = s * 0.52;
  const bodyH = s * 0.30;
  const armLen = s * 0.18;
  const armW = s * 0.09;
  const handR = s * 0.045;

  // Eye proportions – large, expressive
  const eyeSpacing = headR * 0.32;
  const eyeY = headY + headR * 0.02;
  const eyeRx = headR * 0.19;
  const eyeRy = headR * 0.22;
  const pupilR = headR * 0.12;
  const irisR = headR * 0.16;

  // Mood-specific adjustments
  const mouthProps = {
    glad: {
      d: `M${cx - headR * 0.22},${headY + headR * 0.38} Q${cx},${headY + headR * 0.62} ${cx + headR * 0.22},${headY + headR * 0.38}`,
      fill: "none", stroke: "#5A4030", sw: headR * 0.06,
    },
    koncentrerad: {
      d: `M${cx - headR * 0.12},${headY + headR * 0.44} L${cx + headR * 0.12},${headY + headR * 0.44}`,
      fill: "none", stroke: "#5A4030", sw: headR * 0.06,
    },
    uppmuntrande: {
      d: `M${cx - headR * 0.26},${headY + headR * 0.34} Q${cx},${headY + headR * 0.68} ${cx + headR * 0.26},${headY + headR * 0.34}`,
      fill: "#fff", stroke: "#5A4030", sw: headR * 0.05,
    },
  };

  const eyebrowProps = {
    glad: { ly: -0.08, ry: -0.08, curve: 0 },
    koncentrerad: { ly: -0.12, ry: -0.12, curve: 0.03 },
    uppmuntrande: { ly: -0.14, ry: -0.10, curve: -0.02 },
  };

  const eb = eyebrowProps[mood] || eyebrowProps.glad;
  const mo = mouthProps[mood] || mouthProps.glad;

  // Hair paths – softer, rounder
  const hairPaths = {
    kort: `M${cx - headR * 0.88},${headY - headR * 0.12} Q${cx - headR * 0.5},${headY - headR * 1.25} ${cx},${headY - headR * 1.25} Q${cx + headR * 0.5},${headY - headR * 1.25} ${cx + headR * 0.88},${headY - headR * 0.12} Q${cx + headR * 0.6},${headY - headR * 0.6} ${cx},${headY - headR * 0.7} Q${cx - headR * 0.6},${headY - headR * 0.6} ${cx - headR * 0.88},${headY - headR * 0.12}Z`,
    lång: `M${cx - headR * 1.08},${headY + headR * 0.55} Q${cx - headR * 1.15},${headY - headR * 0.5} ${cx},${headY - headR * 1.28} Q${cx + headR * 1.15},${headY - headR * 0.5} ${cx + headR * 1.08},${headY + headR * 0.55} Q${cx + headR * 0.85},${headY + headR * 0.15} ${cx + headR * 0.75},${headY - headR * 0.3} Q${cx},${headY - headR * 0.9} ${cx - headR * 0.75},${headY - headR * 0.3} Q${cx - headR * 0.85},${headY + headR * 0.15} ${cx - headR * 1.08},${headY + headR * 0.55}Z`,
    lockar: (() => {
      const bumps = 8;
      let p = `M${cx - headR * 1.05},${headY + headR * 0.35}`;
      for (let i = 0; i <= bumps; i++) {
        const angle = Math.PI + (Math.PI * i) / bumps;
        const r = headR * 1.15 + Math.sin(i * 2.3) * headR * 0.12;
        const px = cx + Math.cos(angle) * r;
        const py = headY + Math.sin(angle) * r;
        const cpx = cx + Math.cos(angle + 0.2) * (r + headR * 0.15);
        const cpy = headY + Math.sin(angle + 0.2) * (r + headR * 0.15);
        p += ` Q${cpx},${cpy} ${px},${py}`;
      }
      return p + "Z";
    })(),
    keps: `M${cx - headR * 1.35},${headY - headR * 0.16} L${cx + headR * 1.55},${headY - headR * 0.16} Q${cx + headR * 1.35},${headY - headR * 0.22} ${cx + headR * 0.95},${headY - headR * 0.38} Q${cx},${headY - headR * 1.3} ${cx - headR * 0.95},${headY - headR * 0.38} Q${cx - headR * 1.35},${headY - headR * 0.22} ${cx - headR * 1.35},${headY - headR * 0.16}Z`,
    tofs: `M${cx - headR * 0.88},${headY - headR * 0.12} Q${cx},${headY - headR * 1.28} ${cx + headR * 0.88},${headY - headR * 0.12} Q${cx + headR * 0.5},${headY - headR * 0.6} ${cx},${headY - headR * 0.7} Q${cx - headR * 0.5},${headY - headR * 0.6} ${cx - headR * 0.88},${headY - headR * 0.12}Z M${cx + headR * 0.15},${headY - headR * 1.15} Q${cx + headR * 0.7},${headY - headR * 1.7} ${cx + headR * 0.55},${headY - headR * 1.5} Q${cx + headR * 0.9},${headY - headR * 1.4} ${cx + headR * 0.3},${headY - headR * 1.2}`,
    mohawk: `M${cx - headR * 0.18},${headY - headR * 1.55} Q${cx},${headY - headR * 1.75} ${cx + headR * 0.18},${headY - headR * 1.55} L${cx + headR * 0.22},${headY - headR * 0.2} Q${cx},${headY - headR * 0.55} ${cx - headR * 0.22},${headY - headR * 0.2}Z`,
  };

  // Accessory position (on shirt/chest)
  const accX = cx + bodyW * 0.15;
  const accY = bodyY + bodyH * 0.3;
  const accSize = s * 0.04;

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{ overflow: "visible" }}>
      {animate && (
        <defs>
          <style>{`
            @keyframes blink-${uid} {
              0%, 92%, 100% { transform: scaleY(1); }
              96% { transform: scaleY(0.08); }
            }
            @keyframes breathe-${uid} {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(${-s * 0.01}px); }
            }
            @keyframes sway-${uid} {
              0%, 100% { transform: rotate(0deg); }
              30% { transform: rotate(1.5deg); }
              70% { transform: rotate(-1.5deg); }
            }
            @keyframes wave-${uid} {
              0%, 30%, 100% { transform: rotate(0deg); }
              10% { transform: rotate(-20deg); }
              20% { transform: rotate(12deg); }
            }
            @keyframes float-${uid} {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(${-s * 0.015}px); }
            }
          `}</style>
          {/* Soft shadow filter */}
          <filter id={`shadow-${uid}`}>
            <feDropShadow dx="0" dy={s * 0.01} stdDeviation={s * 0.015} floodColor="#00000015" />
          </filter>
          {/* Soft inner glow for head */}
          <radialGradient id={`headGrad-${uid}`} cx="40%" cy="35%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.03" />
          </radialGradient>
          {/* Body gradient */}
          <linearGradient id={`bodyGrad-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.08" />
          </linearGradient>
        </defs>
      )}

      {/* Main group with breathing */}
      <g style={animate ? { animation: `breathe-${uid} 3.5s ease-in-out ${animDelay}s infinite`, transformOrigin: `${cx}px ${s * 0.85}px` } : {}} filter={animate ? `url(#shadow-${uid})` : undefined}>

        {/* === BODY === */}
        <ellipse cx={cx} cy={bodyY + bodyH * 0.4} rx={bodyW / 2} ry={bodyH * 0.55} fill={shirtColor} />
        <ellipse cx={cx} cy={bodyY + bodyH * 0.4} rx={bodyW / 2} ry={bodyH * 0.55} fill={`url(#bodyGrad-${uid})`} />

        {/* Shirt collar / neckline */}
        <path
          d={`M${cx - bodyW * 0.14},${bodyY + bodyH * 0.02} Q${cx},${bodyY + bodyH * 0.22} ${cx + bodyW * 0.14},${bodyY + bodyH * 0.02}`}
          fill="none" stroke={skinTone} strokeWidth={s * 0.025} strokeLinecap="round"
        />

        {/* Accessory badge on shirt */}
        <g style={animate ? { animation: `float-${uid} 4s ease-in-out ${animDelay + 1}s infinite`, transformOrigin: `${accX}px ${accY}px` } : {}}>
          <AccessoryIcon type={accessory} x={accX} y={accY} size={accSize} />
        </g>

        {/* Left arm */}
        <g style={animate ? { animation: `wave-${uid} 5s ease-in-out ${animDelay + 0.5}s infinite`, transformOrigin: `${cx - bodyW / 2 + armW}px ${bodyY + bodyH * 0.15}px` } : {}}>
          <rect x={cx - bodyW / 2 - armW * 0.3} y={bodyY + bodyH * 0.08} width={armW} height={armLen} rx={armW / 2} fill={shirtColor} />
          <circle cx={cx - bodyW / 2 - armW * 0.3 + armW / 2} cy={bodyY + bodyH * 0.08 + armLen + handR * 0.5} r={handR} fill={skinTone} />
        </g>

        {/* Right arm */}
        <g>
          <rect x={cx + bodyW / 2 - armW * 0.7} y={bodyY + bodyH * 0.08} width={armW} height={armLen} rx={armW / 2} fill={shirtColor} />
          <circle cx={cx + bodyW / 2 - armW * 0.7 + armW / 2} cy={bodyY + bodyH * 0.08 + armLen + handR * 0.5} r={handR} fill={skinTone} />
        </g>

        {/* Neck */}
        <rect x={cx - s * 0.055} y={bodyY - s * 0.01} width={s * 0.11} height={s * 0.04} rx={s * 0.02} fill={skinTone} />

        {/* === HEAD GROUP with subtle sway === */}
        <g style={animate ? { animation: `sway-${uid} 5s ease-in-out ${animDelay + 0.3}s infinite`, transformOrigin: `${cx}px ${headY + headR * 0.8}px` } : {}}>

          {/* Head base */}
          <circle cx={cx} cy={headY} r={headR} fill={skinTone} />
          <circle cx={cx} cy={headY} r={headR} fill={`url(#headGrad-${uid})`} />

          {/* Ears */}
          <ellipse cx={cx - headR * 0.92} cy={headY + headR * 0.08} rx={headR * 0.16} ry={headR * 0.2} fill={skinTone} />
          <ellipse cx={cx + headR * 0.92} cy={headY + headR * 0.08} rx={headR * 0.16} ry={headR * 0.2} fill={skinTone} />
          <ellipse cx={cx - headR * 0.92} cy={headY + headR * 0.08} rx={headR * 0.09} ry={headR * 0.12} fill={`${skinTone}88`} />
          <ellipse cx={cx + headR * 0.92} cy={headY + headR * 0.08} rx={headR * 0.09} ry={headR * 0.12} fill={`${skinTone}88`} />

          {/* === EYES === */}
          {/* Left eye */}
          <g style={animate ? { animation: `blink-${uid} ${3.5 + animDelay * 0.3}s ease-in-out ${animDelay * 0.7}s infinite`, transformOrigin: `${cx - eyeSpacing}px ${eyeY}px` } : {}}>
            <ellipse cx={cx - eyeSpacing} cy={eyeY} rx={eyeRx} ry={eyeRy} fill="#fff" />
            {/* Iris */}
            <circle cx={cx - eyeSpacing} cy={eyeY + eyeRy * 0.08} r={irisR} fill={eyeColor} />
            {/* Pupil */}
            <circle cx={cx - eyeSpacing} cy={eyeY + eyeRy * 0.08} r={pupilR} fill="#1A1A1A" />
            {/* Eye shine – large */}
            <circle cx={cx - eyeSpacing + eyeRx * 0.3} cy={eyeY - eyeRy * 0.2} r={eyeRx * 0.32} fill="#fff" opacity={0.9} />
            {/* Eye shine – small */}
            <circle cx={cx - eyeSpacing - eyeRx * 0.15} cy={eyeY + eyeRy * 0.25} r={eyeRx * 0.14} fill="#fff" opacity={0.6} />
          </g>

          {/* Right eye */}
          <g style={animate ? { animation: `blink-${uid} ${3.5 + animDelay * 0.3}s ease-in-out ${animDelay * 0.7}s infinite`, transformOrigin: `${cx + eyeSpacing}px ${eyeY}px` } : {}}>
            <ellipse cx={cx + eyeSpacing} cy={eyeY} rx={eyeRx} ry={eyeRy} fill="#fff" />
            <circle cx={cx + eyeSpacing} cy={eyeY + eyeRy * 0.08} r={irisR} fill={eyeColor} />
            <circle cx={cx + eyeSpacing} cy={eyeY + eyeRy * 0.08} r={pupilR} fill="#1A1A1A" />
            <circle cx={cx + eyeSpacing + eyeRx * 0.3} cy={eyeY - eyeRy * 0.2} r={eyeRx * 0.32} fill="#fff" opacity={0.9} />
            <circle cx={cx + eyeSpacing - eyeRx * 0.15} cy={eyeY + eyeRy * 0.25} r={eyeRx * 0.14} fill="#fff" opacity={0.6} />
          </g>

          {/* Eyebrows */}
          <path
            d={`M${cx - eyeSpacing - eyeRx * 0.9},${eyeY - eyeRy * 1.3 + headR * eb.ly} Q${cx - eyeSpacing},${eyeY - eyeRy * 1.6 + headR * eb.ly + headR * eb.curve} ${cx - eyeSpacing + eyeRx * 0.9},${eyeY - eyeRy * 1.3 + headR * eb.ly}`}
            fill="none" stroke={hairColor} strokeWidth={headR * 0.06} strokeLinecap="round" opacity={0.65}
          />
          <path
            d={`M${cx + eyeSpacing - eyeRx * 0.9},${eyeY - eyeRy * 1.3 + headR * eb.ry} Q${cx + eyeSpacing},${eyeY - eyeRy * 1.6 + headR * eb.ry - headR * eb.curve} ${cx + eyeSpacing + eyeRx * 0.9},${eyeY - eyeRy * 1.3 + headR * eb.ry}`}
            fill="none" stroke={hairColor} strokeWidth={headR * 0.06} strokeLinecap="round" opacity={0.65}
          />

          {/* Nose – tiny, subtle */}
          <ellipse cx={cx} cy={headY + headR * 0.22} rx={headR * 0.06} ry={headR * 0.04} fill="#00000010" />

          {/* Mouth – mood-dependent */}
          <path
            d={mo.d}
            fill={mo.fill || "none"}
            stroke={mo.stroke}
            strokeWidth={mo.sw}
            strokeLinecap="round"
          />

          {/* Cheek blush – soft */}
          <circle cx={cx - headR * 0.48} cy={headY + headR * 0.3} r={headR * 0.13} fill="#FFB0A0" opacity={0.2} />
          <circle cx={cx + headR * 0.48} cy={headY + headR * 0.3} r={headR * 0.13} fill="#FFB0A0" opacity={0.2} />

          {/* Hair */}
          <path d={hairPaths[hair] || hairPaths.kort} fill={hairColor} />
          {/* Hair highlight */}
          <path d={hairPaths[hair] || hairPaths.kort} fill="url(#headGrad-${uid})" opacity={0.3} />
        </g>
      </g>
    </svg>
  );
}

// ============================
// AVATAR BADGE
// ============================
function AvatarBadge({ child, size = 64, selected, onClick, showName = true, animDelay = 0, mood = "glad" }) {
  const [pressed, setPressed] = useState(false);

  const handleClick = () => {
    setPressed(true);
    setTimeout(() => setPressed(false), 400);
    if (onClick) onClick();
  };

  return (
    <div
      onClick={handleClick}
      className="av-badge"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: onClick ? "pointer" : "default",
        padding: "6px",
        borderRadius: "18px",
        background: selected ? "rgba(124,110,230,0.12)" : "transparent",
        border: selected ? "3px solid #7C6EE6" : "3px solid transparent",
        transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
        minWidth: size + 16,
        transform: pressed ? "scale(0.88)" : "scale(1)",
      }}
    >
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: "linear-gradient(145deg, #f8f6ff, #edeaff)",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
        boxShadow: selected ? "0 6px 22px rgba(124,110,230,0.30)" : "0 3px 10px rgba(0,0,0,0.06)",
        transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}>
        <AvatarSVG
          hair={child.hair} skinTone={child.skinTone} hairColor={child.hairColor}
          shirtColor={child.shirtColor} eyeColor={child.eyeColor || "#3B3128"}
          accessory={child.accessory || "star"} mood={mood}
          size={size - 4} animate={true} animDelay={animDelay}
        />
      </div>
      {showName && (
        <span style={{
          marginTop: "5px", fontSize: size < 50 ? "10px" : "13px",
          fontWeight: 600, color: selected ? "#5B4FC7" : "#3E3E50",
          textAlign: "center", maxWidth: size + 24,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {child.name}
        </span>
      )}
    </div>
  );
}

// ============================
// AVATAR SKAPARE – uppdaterad
// ============================
function AvatarCreator({ onSave, onCancel, editChild }) {
  const [name, setName] = useState(editChild?.name || "");
  const [hair, setHair] = useState(editChild?.hair || "kort");
  const [skinTone, setSkinTone] = useState(editChild?.skinTone || SKIN_TONES[0]);
  const [hairColor, setHairColor] = useState(editChild?.hairColor || HAIR_COLORS[0]);
  const [shirtColor, setShirtColor] = useState(editChild?.shirtColor || SHIRT_COLORS[4]);
  const [eyeColor, setEyeColor] = useState(editChild?.eyeColor || EYE_COLORS[0]);
  const [accessory, setAccessory] = useState(editChild?.accessory || "star");
  const [previewMood, setPreviewMood] = useState("glad");

  const preview = { name: name || "?", hair, skinTone, hairColor, shirtColor, eyeColor, accessory };

  const Section = ({ label, children: ch }) => (
    <div style={{ marginBottom: "14px" }}>
      <span style={{ fontSize: "13px", fontWeight: 700, color: "#5A5A6E", letterSpacing: "0.3px" }}>{label}</span>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "7px" }}>{ch}</div>
    </div>
  );

  const ColorBtn = ({ color, isSelected, onClick: oc }) => (
    <button onClick={oc} style={{
      width: 38, height: 38, borderRadius: "50%", border: "3px solid",
      borderColor: isSelected ? "#7C6EE6" : "#E8E6F0", background: color,
      cursor: "pointer", transition: "all 0.2s ease",
      transform: isSelected ? "scale(1.18)" : "scale(1)",
      boxShadow: isSelected ? "0 3px 12px rgba(124,110,230,0.3)" : "none",
    }} />
  );

  const PillBtn = ({ label, isSelected, onClick: oc }) => (
    <button onClick={oc} style={{
      padding: "8px 15px", borderRadius: "12px", border: "2px solid",
      borderColor: isSelected ? "#7C6EE6" : "#E8E6F0",
      background: isSelected ? "#F0EDFF" : "#fff",
      fontSize: "13px", fontWeight: 600, cursor: "pointer",
      color: isSelected ? "#5B4FC7" : "#6E6E80",
      transition: "all 0.15s ease",
    }}>
      {label}
    </button>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(30,30,50,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "16px", backdropFilter: "blur(6px)" }}>
      <div style={{ background: "#fff", borderRadius: "28px", padding: "28px", maxWidth: "460px", width: "100%", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 24px 70px rgba(0,0,0,0.25)", animation: "modalIn 0.35s ease" }}>
        <h2 style={{ margin: "0 0 20px", textAlign: "center", fontSize: "21px", color: "#2E2E3E", fontWeight: 800 }}>
          {editChild ? "Redigera avatar" : "Skapa din avatar"}
        </h2>

        {/* Preview with mood tabs */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
          <div style={{ background: "linear-gradient(145deg, #F5F3FF, #EDE9FF)", borderRadius: "24px", padding: "20px 36px" }}>
            <AvatarBadge child={preview} size={110} showName={!!name} mood={previewMood} />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginBottom: "18px" }}>
          {MOODS.map((m) => (
            <button key={m} onClick={() => setPreviewMood(m)} style={{
              padding: "5px 12px", borderRadius: "10px", border: "2px solid",
              borderColor: previewMood === m ? "#7C6EE6" : "#E8E6F0",
              background: previewMood === m ? "#F0EDFF" : "#fff",
              fontSize: "12px", fontWeight: 600, cursor: "pointer",
              color: previewMood === m ? "#5B4FC7" : "#8E8EA0",
            }}>
              {m === "glad" ? "😊" : m === "koncentrerad" ? "🤔" : "😄"} {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>

        {/* Name */}
        <label style={{ display: "block", marginBottom: "14px" }}>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#5A5A6E" }}>Namn</span>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Skriv barnets namn..."
            style={{ display: "block", width: "100%", padding: "12px 16px", borderRadius: "14px", border: "2px solid #E8E6F0", fontSize: "16px", marginTop: "6px", outline: "none", boxSizing: "border-box" }}
          />
        </label>

        <Section label="Frisyr">
          {HAIR_STYLES.map((h) => <PillBtn key={h} label={h.charAt(0).toUpperCase() + h.slice(1)} isSelected={hair === h} onClick={() => setHair(h)} />)}
        </Section>

        <Section label="Hudfärg">
          {SKIN_TONES.map((c) => <ColorBtn key={c} color={c} isSelected={skinTone === c} onClick={() => setSkinTone(c)} />)}
        </Section>

        <Section label="Hårfärg">
          {HAIR_COLORS.map((c) => <ColorBtn key={c} color={c} isSelected={hairColor === c} onClick={() => setHairColor(c)} />)}
        </Section>

        <Section label="Ögonfärg">
          {EYE_COLORS.map((c) => <ColorBtn key={c} color={c} isSelected={eyeColor === c} onClick={() => setEyeColor(c)} />)}
        </Section>

        <Section label="Tröjfärg">
          {SHIRT_COLORS.map((c) => <ColorBtn key={c} color={c} isSelected={shirtColor === c} onClick={() => setShirtColor(c)} />)}
        </Section>

        <Section label="Kännetecken">
          {ACCESSORIES.map((a) => <PillBtn key={a} label={`${a === "star" ? "⭐" : a === "heart" ? "❤️" : a === "moon" ? "🌙" : a === "flower" ? "🌸" : "⚡"} ${ACCESSORY_LABELS[a]}`} isSelected={accessory === a} onClick={() => setAccessory(a)} />)}
        </Section>

        <div style={{ display: "flex", gap: "12px", marginTop: "6px" }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: "14px", borderRadius: "14px", border: "2px solid #E8E6F0",
            background: "#fff", fontSize: "16px", fontWeight: 600, cursor: "pointer", color: "#8E8EA0",
          }}>Avbryt</button>
          <button
            onClick={() => name.trim() && onSave({ name: name.trim(), hair, skinTone, hairColor, shirtColor, eyeColor, accessory })}
            disabled={!name.trim()}
            style={{
              flex: 1, padding: "14px", borderRadius: "14px", border: "none",
              background: name.trim() ? "linear-gradient(135deg, #7C6EE6, #9B7FD4)" : "#D0D0D8",
              color: "#fff", fontSize: "16px", fontWeight: 700, cursor: name.trim() ? "pointer" : "default",
              boxShadow: name.trim() ? "0 4px 16px rgba(124,110,230,0.3)" : "none",
            }}>
            {editChild ? "Spara" : "Lägg till"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================
// ROOM CARD
// ============================
function RoomCard({ room, children, selectedChild, onRoomClick, childCount }) {
  const isTarget = selectedChild !== null;
  return (
    <div onClick={() => onRoomClick(room.id)}
      style={{
        background: "#fff", borderRadius: "22px", padding: "16px",
        border: isTarget ? `3px dashed ${room.color}` : "2px solid #F0EEF5",
        cursor: isTarget ? "pointer" : "default",
        transition: "all 0.25s ease",
        boxShadow: isTarget ? `0 4px 20px ${room.color}22` : "0 2px 8px rgba(0,0,0,0.03)",
        minHeight: "120px",
      }}
      onMouseEnter={(e) => { if (isTarget) e.currentTarget.style.transform = "scale(1.025)"; e.currentTarget.style.boxShadow = `0 6px 24px ${room.color}20`; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = isTarget ? `0 4px 20px ${room.color}22` : "0 2px 8px rgba(0,0,0,0.03)"; }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
        <div style={{ width: 44, height: 44, borderRadius: "14px", background: `${room.color}14`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>
          {room.icon}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: "15px", color: "#2E2E3E" }}>{room.name}</div>
          <div style={{ fontSize: "12px", color: "#A0A0B0" }}>{childCount} barn</div>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
        {children.map((child, i) => (
          <AvatarBadge key={child.id} child={child} size={48} animDelay={i * 0.5} />
        ))}
      </div>
      {isTarget && (
        <div style={{ textAlign: "center", padding: "10px", color: room.color, fontSize: "13px", fontWeight: 600, animation: "fadeInUp 0.3s ease" }}>
          Tryck för att flytta hit
        </div>
      )}
    </div>
  );
}

// ============================
// MAIN APP
// ============================
export default function FritidsCheckIn() {
  const [kids, setKids] = useState(DEMO_KIDS.map((k) => ({ ...k, room: null, checkedIn: false })));
  const [selectedKid, setSelectedKid] = useState(null);
  const [view, setView] = useState("board");
  const [showCreator, setShowCreator] = useState(false);
  const [editingKid, setEditingKid] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [parentSearch, setParentSearch] = useState("");
  const nextId = useRef(Math.max(...DEMO_KIDS.map((k) => k.id), 0) + 1);

  const checkedInKids = kids.filter((k) => k.checkedIn && k.room);
  const notCheckedIn = kids.filter((k) => !k.checkedIn);

  const handleCheckIn = (kidId) => { setKids((p) => p.map((k) => (k.id === kidId ? { ...k, checkedIn: true } : k))); setSelectedKid(kidId); };
  const handleMoveToRoom = (roomId) => { if (selectedKid === null) return; setKids((p) => p.map((k) => (k.id === selectedKid ? { ...k, room: roomId } : k))); setSelectedKid(null); };
  const handleGoHome = () => { if (selectedKid === null) return; setKids((p) => p.map((k) => (k.id === selectedKid ? { ...k, room: null, checkedIn: false } : k))); setSelectedKid(null); };
  const handleSelectKid = (kidId) => { setSelectedKid(selectedKid === kidId ? null : kidId); };
  const handleAddKid = (data) => {
    if (editingKid) { setKids((p) => p.map((k) => (k.id === editingKid.id ? { ...k, ...data } : k))); setEditingKid(null); }
    else { setKids((p) => [...p, { ...data, id: nextId.current++, room: null, checkedIn: false }]); }
    setShowCreator(false);
  };
  const handleRemoveKid = (kidId) => { setKids((p) => p.filter((k) => k.id !== kidId)); };
  const handleResetDay = () => { setKids((p) => p.map((k) => ({ ...k, room: null, checkedIn: false }))); setSelectedKid(null); };
  const filteredNotCheckedIn = notCheckedIn.filter((k) => k.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div style={{ minHeight: "100vh", background: "#F8F7FC", fontFamily: "'Inter', -apple-system, system-ui, sans-serif" }}>
      <style>{`
        @keyframes fadeInUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes modalIn { from { opacity:0; transform:scale(0.93) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes slideIn { from { opacity:0; transform:translateX(-8px); } to { opacity:1; transform:translateX(0); } }
        .av-badge:hover { transform: scale(1.06) !important; }
        * { box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-thumb { background:#D0D0D8; border-radius:3px; }
      `}</style>

      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg, #7C6EE6, #9B7FD4, #B08BD6)", padding: "16px 20px", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", boxShadow: "0 4px 20px rgba(124,110,230,0.25)" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "21px", fontWeight: 800, letterSpacing: "-0.3px" }}>Fritids Incheckning</h1>
          <div style={{ fontSize: "13px", opacity: 0.85, marginTop: "2px" }}>{checkedInKids.length} incheckade &middot; {notCheckedIn.length} ej incheckade</div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {[{ id: "board", label: "Tavla", icon: "🏠" }, { id: "parent", label: "Förälder", icon: "👨‍👩‍👧" }, { id: "admin", label: "Admin", icon: "⚙️" }].map((v) => (
            <button key={v.id} onClick={() => { setView(v.id); setSelectedKid(null); }}
              style={{ padding: "8px 15px", borderRadius: "12px", border: "2px solid rgba(255,255,255,0.25)", background: view === v.id ? "rgba(255,255,255,0.22)" : "transparent", color: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s ease" }}>
              {v.icon} {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* === BOARD VIEW === */}
      {view === "board" && (
        <div style={{ padding: "16px", maxWidth: "1200px", margin: "0 auto" }}>
          {selectedKid !== null && (
            <div style={{ background: "linear-gradient(135deg, #7C6EE6, #9B7FD4)", borderRadius: "18px", padding: "14px 20px", marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", color: "#fff", flexWrap: "wrap", gap: "10px", animation: "fadeInUp 0.3s ease", boxShadow: "0 6px 24px rgba(124,110,230,0.25)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <AvatarBadge child={kids.find((k) => k.id === selectedKid)} size={52} showName={false} />
                <span style={{ fontWeight: 700, fontSize: "16px" }}>{kids.find((k) => k.id === selectedKid)?.name} — Välj ett rum!</span>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={handleGoHome} style={{ padding: "10px 18px", borderRadius: "12px", border: "2px solid rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.12)", color: "#fff", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>🏡 Hemgång</button>
                <button onClick={() => setSelectedKid(null)} style={{ padding: "10px 18px", borderRadius: "12px", border: "2px solid rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.12)", color: "#fff", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>✕ Avbryt</button>
              </div>
            </div>
          )}

          {notCheckedIn.length > 0 && (
            <div style={{ background: "#fff", borderRadius: "22px", padding: "16px", marginBottom: "16px", border: "2px solid #F0EEF5", animation: "fadeInUp 0.4s ease" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                <h2 style={{ margin: 0, fontSize: "16px", color: "#2E2E3E", fontWeight: 700 }}>📋 Ej incheckade ({notCheckedIn.length})</h2>
                <input type="text" placeholder="Sök barn..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ padding: "8px 14px", borderRadius: "12px", border: "2px solid #E8E6F0", fontSize: "14px", outline: "none", width: "170px" }} />
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {filteredNotCheckedIn.map((kid, i) => <AvatarBadge key={kid.id} child={kid} size={58} onClick={() => handleCheckIn(kid.id)} animDelay={i * 0.25} />)}
              </div>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(265px, 1fr))", gap: "14px" }}>
            {ROOMS.map((room) => {
              const roomKids = kids.filter((k) => k.room === room.id && k.checkedIn);
              return <RoomCard key={room.id} room={room} children={roomKids} childCount={roomKids.length} selectedChild={selectedKid} onRoomClick={handleMoveToRoom} />;
            })}
          </div>

          {checkedInKids.length > 0 && (
            <div style={{ background: "#fff", borderRadius: "22px", padding: "16px", marginTop: "16px", border: "2px solid #F0EEF5" }}>
              <h2 style={{ margin: "0 0 12px", fontSize: "16px", color: "#2E2E3E", fontWeight: 700 }}>👆 Tryck på ett barn för att flytta</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {checkedInKids.map((kid, i) => <AvatarBadge key={kid.id} child={kid} size={58} selected={selectedKid === kid.id} onClick={() => handleSelectKid(kid.id)} animDelay={i * 0.35} />)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* === PARENT VIEW === */}
      {view === "parent" && (
        <div style={{ padding: "16px", maxWidth: "600px", margin: "0 auto" }}>
          <div style={{ background: "#fff", borderRadius: "22px", padding: "24px", border: "2px solid #F0EEF5", animation: "fadeInUp 0.4s ease" }}>
            <h2 style={{ margin: "0 0 16px", fontSize: "20px", color: "#2E2E3E", textAlign: "center", fontWeight: 800 }}>👨‍👩‍👧 Var är mitt barn?</h2>
            <input type="text" placeholder="Sök på barnets namn..." value={parentSearch} onChange={(e) => setParentSearch(e.target.value)}
              style={{ display: "block", width: "100%", padding: "14px 18px", borderRadius: "16px", border: "2px solid #E8E6F0", fontSize: "18px", outline: "none", textAlign: "center", marginBottom: "20px", boxSizing: "border-box" }} />
            {parentSearch.trim() ? (
              <div>
                {kids.filter((k) => k.name.toLowerCase().includes(parentSearch.toLowerCase())).map((kid, i) => {
                  const room = ROOMS.find((r) => r.id === kid.room);
                  return (
                    <div key={kid.id} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", borderRadius: "18px", marginBottom: "12px", background: kid.checkedIn && room ? `${room.color}0C` : "#FEF5F5", border: `2px solid ${kid.checkedIn && room ? room.color + "25" : "#F5D0D0"}`, animation: `slideIn 0.3s ease ${i * 0.1}s both` }}>
                      <AvatarBadge child={kid} size={64} showName={false} animDelay={i * 0.4} mood={kid.checkedIn && room ? "glad" : "koncentrerad"} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "18px", color: "#2E2E3E" }}>{kid.name}</div>
                        {kid.checkedIn && room ? (
                          <div style={{ fontSize: "16px", color: room.color, fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}><span style={{ fontSize: "20px" }}>{room.icon}</span> {room.name}</div>
                        ) : kid.checkedIn ? (
                          <div style={{ fontSize: "16px", color: "#E8A840", fontWeight: 600 }}>Incheckad — väljer rum</div>
                        ) : (
                          <div style={{ fontSize: "16px", color: "#A0A0B0", fontWeight: 600 }}>Ej incheckad</div>
                        )}
                      </div>
                    </div>
                  );
                })}
                {kids.filter((k) => k.name.toLowerCase().includes(parentSearch.toLowerCase())).length === 0 && (
                  <div style={{ textAlign: "center", color: "#A0A0B0", padding: "20px", fontSize: "15px" }}>Inget barn hittades</div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: "center", color: "#A0A0B0", padding: "20px", fontSize: "15px" }}>Skriv ditt barns namn för att se var hen befinner sig</div>
            )}
          </div>
        </div>
      )}

      {/* === ADMIN VIEW === */}
      {view === "admin" && (
        <div style={{ padding: "16px", maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ background: "#fff", borderRadius: "22px", padding: "24px", border: "2px solid #F0EEF5", animation: "fadeInUp 0.4s ease" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px", flexWrap: "wrap", gap: "10px" }}>
              <h2 style={{ margin: 0, fontSize: "19px", color: "#2E2E3E", fontWeight: 800 }}>⚙️ Hantera barn ({kids.length})</h2>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={handleResetDay} style={{ padding: "10px 16px", borderRadius: "12px", border: "2px solid #F5D0D0", background: "#FEF5F5", color: "#D06060", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>🔄 Ny dag</button>
                <button onClick={() => { setEditingKid(null); setShowCreator(true); }} style={{ padding: "10px 16px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #7C6EE6, #9B7FD4)", color: "#fff", fontSize: "13px", fontWeight: 700, cursor: "pointer", boxShadow: "0 3px 12px rgba(124,110,230,0.25)" }}>+ Lägg till barn</button>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "10px" }}>
              {kids.map((kid, i) => (
                <div key={kid.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "16px", background: "#FAFAFE", border: "2px solid #F0EEF5", animation: `slideIn 0.3s ease ${i * 0.04}s both` }}>
                  <AvatarBadge child={kid} size={50} showName={false} animDelay={i * 0.15} />
                  <div style={{ flex: 1, fontWeight: 700, fontSize: "15px", color: "#2E2E3E" }}>{kid.name}</div>
                  <button onClick={() => { setEditingKid(kid); setShowCreator(true); }} style={{ width: 34, height: 34, borderRadius: "10px", border: "none", background: "#E8E6F0", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>✏️</button>
                  <button onClick={() => handleRemoveKid(kid.id)} style={{ width: 34, height: 34, borderRadius: "10px", border: "none", background: "#FDE8E8", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>🗑️</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showCreator && <AvatarCreator editChild={editingKid} onSave={handleAddKid} onCancel={() => { setShowCreator(false); setEditingKid(null); }} />}
    </div>
  );
}
