import React, { useState, useEffect } from 'react';
import { HexColorPicker } from "react-colorful";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from './Alert';

const ColorWheel = () => {
  const [baseColor, setBaseColor] = useState("#ff0000");
  const [harmonyMode, setHarmonyMode] = useState("analogous");
  const [harmonicColors, setHarmonicColors] = useState([]);

  const hslToHex = (h, s, l) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const hexToHsl = (hex) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  };

  const calculateHarmonicColors = () => {
    const [h, s, l] = hexToHsl(baseColor);
    let colors = [];

    switch (harmonyMode) {
      case "analogous":
        colors = [
          hslToHex((h + 30) % 360, s, l),
          baseColor,
          hslToHex((h + 330) % 360, s, l)
        ];
        break;
      case "monochromatic":
        colors = [
          hslToHex(h, s, Math.max(0, l - 30)),
          baseColor,
          hslToHex(h, s, Math.min(100, l + 30))
        ];
        break;
      case "complementary":
        colors = [
          baseColor,
          hslToHex((h + 180) % 360, s, l)
        ];
        break;
      case "triad":
        colors = [
          hslToHex((h + 120) % 360, s, l),
          baseColor,
          hslToHex((h + 240) % 360, s, l)
        ];
        break;
      case "tetrad":
        colors = [
          baseColor,
          hslToHex((h + 90) % 360, s, l),
          hslToHex((h + 180) % 360, s, l),
          hslToHex((h + 270) % 360, s, l)
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
        <HexColorPicker color={baseColor} onChange={setBaseColor} />
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
                style={{ backgroundColor: color }}
              ></div>
              <span className="text-sm">{color}</span>
            </div>
          ))}
        </div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Tip</AlertTitle>
        <AlertDescription>
          Click on the color wheel to change the base color and see how it affects the harmony!
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ColorWheel;