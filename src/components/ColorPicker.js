import React, { useState, useRef, useEffect } from 'react';

const ColorPicker = ({ initialColor = [1, 1, 1], onColorChange }) => {
  const [color, setColor] = useState(initialColor);
  const [hsb, setHsb] = useState(RgbToHsb(initialColor));
  const [hexColor, setHexColor] = useState(RgbToHex(initialColor));
  const canvasRef = useRef(null);
  const cursorRef = useRef(null);

  useEffect(() => {
    drawColorWheel();
    updateCursorPosition();
  }, []);

  const drawColorWheel = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2;

    for (let angle = 0; angle < 360; angle++) {
      for (let sat = 0; sat < 100; sat++) {
        const rgb = HsbToRgb([angle, sat, 100]);
        ctx.fillStyle = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
        ctx.beginPath();
        ctx.arc(
          centerX,
          centerY,
          (radius * sat) / 100,
          (angle * Math.PI) / 180,
          ((angle + 1) * Math.PI) / 180,
          false
        );
        ctx.lineTo(centerX, centerY);
        ctx.fill();
      }
    }
  };

  const updateCursorPosition = () => {
    const canvas = canvasRef.current;
    const cursor = cursorRef.current;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2;

    const x = centerX + Math.cos(hsb[0] * Math.PI / 180) * hsb[1] / 100 * radius;
    const y = centerY + Math.sin(hsb[0] * Math.PI / 180) * hsb[1] / 100 * radius;

    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;
  };

  const handleColorWheelClick = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const angle = Math.atan2(y - centerY, x - centerX) * 180 / Math.PI;
    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    const saturation = Math.min(100, (distance / (canvas.width / 2)) * 100);

    const newHsb = [
      (angle + 360) % 360,
      saturation,
      hsb[2]
    ];

    setHsb(newHsb);
    const newRgb = HsbToRgb(newHsb);
    setColor(newRgb);
    setHexColor(RgbToHex(newRgb));
    updateCursorPosition();
    onColorChange(newRgb);
  };

  const handleBrightnessChange = (event) => {
    const brightness = parseInt(event.target.value);
    const newHsb = [hsb[0], hsb[1], brightness];
    setHsb(newHsb);
    const newRgb = HsbToRgb(newHsb);
    setColor(newRgb);
    setHexColor(RgbToHex(newRgb));
    onColorChange(newRgb);
  };

  const handleHexChange = (event) => {
    const hex = event.target.value;
    if (/^#?[0-9A-Fa-f]{6}$/.test(hex)) {
      const rgb = HexToRgb(hex.replace('#', ''));
      setColor(rgb);
      setHsb(RgbToHsb(rgb));
      setHexColor(hex);
      updateCursorPosition();
      onColorChange(rgb);
    }
  };

  return (
    <div className="color-picker">
      <div className="color-wheel-container" style={{ position: 'relative' }}>
        <canvas
          ref={canvasRef}
          width={200}
          height={200}
          onClick={handleColorWheelClick}
        />
        <div
          ref={cursorRef}
          style={{
            position: 'absolute',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            border: '2px solid white',
            pointerEvents: 'none',
          }}
        />
      </div>
      <div className="color-controls">
        <input
          type="range"
          min="0"
          max="100"
          value={hsb[2]}
          onChange={handleBrightnessChange}
        />
        <input
          type="text"
          value={hexColor}
          onChange={handleHexChange}
          maxLength={7}
        />
        <div
          className="color-preview"
          style={{
            backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
            width: '50px',
            height: '50px',
          }}
        />
      </div>
    </div>
  );
};

// Helper functions
function RgbToHsb(rgb) {
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  let h = 0;
  const s = max === 0 ? 0 : diff / max;
  const v = max;

  if (max === min) {
    h = 0;
  } else if (max === r) {
    h = (60 * ((g - b) / diff) + 360) % 360;
  } else if (max === g) {
    h = (60 * ((b - r) / diff) + 120) % 360;
  } else if (max === b) {
    h = (60 * ((r - g) / diff) + 240) % 360;
  }

  return [Math.round(h), Math.round(s * 100), Math.round(v * 100)];
}

function HsbToRgb(hsb) {
  const h = hsb[0];
  const s = hsb[1] / 100;
  const v = hsb[2] / 100;
  const i = Math.floor(h / 60) % 6;
  const f = h / 60 - Math.floor(h / 60);
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i) {
    case 0:
      return [Math.round(v * 255), Math.round(t * 255), Math.round(p * 255)];
    case 1:
      return [Math.round(q * 255), Math.round(v * 255), Math.round(p * 255)];
    case 2:
      return [Math.round(p * 255), Math.round(v * 255), Math.round(t * 255)];
    case 3:
      return [Math.round(p * 255), Math.round(q * 255), Math.round(v * 255)];
    case 4:
      return [Math.round(t * 255), Math.round(p * 255), Math.round(v * 255)];
    case 5:
      return [Math.round(v * 255), Math.round(p * 255), Math.round(q * 255)];
  }
}

function RgbToHex(rgb) {
  return '#' + rgb.map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

function HexToRgb(hex) {
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

export default ColorPicker;