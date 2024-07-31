import React, { useState, useEffect } from 'react';
import ColorPicker from './ColorPicker';
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from './Alert';

const ColorWheel = () => {
  const [baseColor, setBaseColor] = useState([255, 0, 0]);
  const [harmonyMode, setHarmonyMode] = useState("analogous");
  const [harmonicColors, setHarmonicColors] = useState([]);

  const rgbToHex = (r, g, b) => {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join('');
  };

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : null;
  };

  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  };

  const hslToRgb = (h, s, l) => {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  };

  const calculateHarmonicColors = () => {
    const [h, s, l] = rgbToHsl(...baseColor);
    let colors = [];

    switch (harmonyMode) {
      case "analogous":
        colors = [
          hslToRgb((h + 30) % 360, s, l),
          baseColor,
          hslToRgb((h + 330) % 360, s, l)
        ];
        break;
      case "monochromatic":
        colors = [
          hslToRgb(h, s, Math.max(0, l - 30)),
          baseColor,
          hslToRgb(h, s, Math.min(100, l + 30))
        ];
        break;
      case "complementary":
        colors = [
          baseColor,
          hslToRgb((h + 180) % 360, s, l)
        ];
        break;
      case "triad":
        colors = [
          hslToRgb((h + 120) % 360, s, l),
          baseColor,
          hslToRgb((h + 240) % 360, s, l)
        ];
        break;
      case "tetrad":
        colors = [
          baseColor,
          hslToRgb((h + 90) % 360, s, l),
          hslToRgb((h + 180) % 360, s, l),
          hslToRgb((h + 270) % 360, s, l)
        ];
        break;
      default:
        colors = [baseColor];
    }

    setHarmonicColors(colors);
  };

  useEffect(() => {
    calculateHarmonicColors();
  }, [baseColor, harmonyMode]);

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Color Harmony Generator</h1>
      
      <div className="mb-4">
        <label className="block mb-2">Base Color:</label>
        <ColorPicker
          initialColor={baseColor}
          onColorChange={setBaseColor}
        />
      </div>
      
      <div className="mb-4">
        <label className="block mb-2">Harmony Mode:</label>
        <select 
          value={harmonyMode} 
          onChange={(e) => setHarmonyMode(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="analogous">Analogous</option>
          <option value="monochromatic">Monochromatic</option>
          <option value="complementary">Complementary</option>
          <option value="triad">Triad</option>
          <option value="tetrad">Tetrad</option>
        </select>
      </div>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Harmonic Colors:</h2>
        <div className="flex flex-wrap gap-2">
          {harmonicColors.map((color, index) => (
            <div key={index} className="text-center">
              <div 
                className="w-20 h-20 rounded-full mb-1" 
                style={{ backgroundColor: `rgb(${color.join(',')})` }}
              ></div>
              <span className="text-sm">{rgbToHex(...color)}</span>
            </div>
          ))}
        </div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Tip</AlertTitle>
        <AlertDescription>
          Use the color wheel to change the base color and see how it affects the harmony!
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ColorWheel;