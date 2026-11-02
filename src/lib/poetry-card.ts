/**
 * Poetry card painter — draws a shareable chamber post on canvas.
 * Formats: 4:5 portrait (1080x1350), 1:1 (1080x1080), 9:16 story (1080x1920).
 * Urdu lines are drawn RTL with direction-aware fillText.
 */

export type CardFormat = "4:5" | "1:1" | "9:16";

const SIZE: Record<CardFormat, { w: number; h: number }> = {
  "4:5": { w: 1080, h: 1350 },
  "1:1": { w: 1080, h: 1080 },
  "9:16": { w: 1080, h: 1920 },
};

export interface CardContent {
  lines: string[]; // display lines, decided by caller
  wantRtl: boolean;
  title: string;
  emotions: string;
  concept: string;
  providerLine: string;
  brand?: boolean;
}

async function drawNoise(ctx: CanvasRenderingContext2D, w: number, h: number): Promise<void> {
  // subtle film grain: pre-rendered scatter, cheap and deterministic
  const step = 3;
  ctx.save();
  ctx.globalAlpha = 0.05;
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const v = Math.random();
      ctx.fillStyle = v > 0.5 ? "#f2e8d5" : "#0b0a0d";
      ctx.fillRect(x, y, 1.4, 1.4);
    }
  }
  ctx.restore();
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const wd of words) {
    const test = cur ? cur + " " + wd : wd;
    if (ctx.measureText(test).width > maxWidth && cur) {
      lines.push(cur);
      cur = wd;
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

export async function paintCard(content: CardContent, format: CardFormat): Promise<Blob | null> {
  const canvas = document.createElement("canvas");
  const { w, h } = SIZE[format];
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // make sure the fonts the card uses are actually loaded
  try {
    await (document as Document & { fonts?: FontFaceSet }).fonts?.load("700 64px Cinzel");
    await (document as Document & { fonts?: FontFaceSet }).fonts?.load("400 48px 'Noto Nastaliq Urdu'");
    await (document as Document & { fonts?: FontFaceSet }).fonts?.load("400 36px 'EB Garamond'");
  } catch {
    // fonts fall back silently
  }

  // chamber ground
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#0b0a0d");
  g.addColorStop(0.5, "#120e0c");
  g.addColorStop(1, "#070608");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  const glow = ctx.createRadialGradient(w * 0.78, h * 0.16, 60, w * 0.78, h * 0.16, h * 0.5);
  glow.addColorStop(0, "rgba(217,154,61,0.16)");
  glow.addColorStop(1, "rgba(217,154,61,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  // velvet floor
  const velvet = ctx.createLinearGradient(0, h * 0.8, 0, h);
  velvet.addColorStop(0, "rgba(74,18,32,0)");
  velvet.addColorStop(1, "rgba(74,18,32,0.5)");
  ctx.fillStyle = velvet;
  ctx.fillRect(0, h * 0.8, w, h * 0.2);

  await drawNoise(ctx, w, h);

  const margin = Math.round(w * 0.09);
  const inner = w - margin * 2;

  // gilt border rules
  const ruleGrad = ctx.createLinearGradient(margin, 0, w - margin, 0);
  ruleGrad.addColorStop(0, "rgba(200,162,94,0)");
  ruleGrad.addColorStop(0.5, "rgba(232,205,147,0.9)");
  ruleGrad.addColorStop(1, "rgba(200,162,94,0)");
  ctx.fillStyle = ruleGrad;
  ctx.fillRect(margin, Math.round(h * 0.055), inner, 2);
  ctx.fillRect(margin, Math.round(h - h * 0.055) - 1, inner, 2);

  // nameplate
  ctx.textAlign = "center";
  ctx.fillStyle = "#e8cd93";
  ctx.font = "700 34px Cinzel, serif";
  ctx.letterSpacing = "10px";
  ctx.fillText("MEHFIL AI", w / 2, Math.round(h * 0.055) + 58);
  ctx.letterSpacing = "0px";
  ctx.font = "400 22px 'Courier Prime', monospace";
  ctx.fillStyle = "rgba(184,168,141,0.75)";
  ctx.fillText("JAB DARD LAFZON MEIN DHALTA HAI", w / 2, Math.round(h * 0.055) + 92);

  // poem
  let y = 0;
  const titleFont = "700 44px Cinzel, serif";
  ctx.font = titleFont;
  ctx.fillStyle = "#f2e0b6";
  const titleY = h * 0.2;
  ctx.fillText(content.title.toUpperCase(), w / 2, titleY);

  // gilt harness under title
  const hr = ctx.createLinearGradient(w * 0.3, 0, w * 0.7, 0);
  hr.addColorStop(0, "rgba(200,162,94,0)");
  hr.addColorStop(0.5, "rgba(200,162,94,0.8)");
  hr.addColorStop(1, "rgba(200,162,94,0)");
  ctx.fillStyle = hr;
  ctx.fillRect(w * 0.3, titleY + 26, w * 0.4, 1.6);

  y = titleY + 92;
  const poemFont = content.wantRtl ? "400 46px 'Noto Nastaliq Urdu', serif" : "400 38px 'EB Garamond', serif";
  ctx.font = poemFont;
  ctx.direction = content.wantRtl ? "rtl" : "ltr";
  ctx.fillStyle = "#e7dcc6";
  const lineH = content.wantRtl ? 104 : 64;
  const lines = [];
  for (const line of content.lines) {
    lines.push(...wrap(ctx, line, inner * 0.94));
  }
  const totalH = lines.length * lineH;
  let avail = h - y - h * 0.16;
  // scale down if the poem threatens the footer
  let drawH = lineH;
  if (totalH > avail) {
    drawH = Math.max(content.wantRtl ? 60 : 44, avail / lines.length);
    ctx.font = content.wantRtl ? `400 ${Math.round(drawH * 0.9)}px 'Noto Nastaliq Urdu', serif` : `400 ${Math.round(drawH * 0.58)}px 'EB Garamond', serif`;
  }
  for (const line of lines) {
    ctx.fillText(line, w / 2, y);
    y += drawH;
  }
  ctx.direction = "ltr";

  // footer block
  const footY = h - Math.round(h * 0.075) - 96;
  ctx.textAlign = "center";
  ctx.font = "400 27px 'EB Garamond', serif";
  ctx.fillStyle = "rgba(217,203,178,0.9)";
  ctx.fillText(`${content.emotions}  ·  ${content.concept}`, w / 2, footY);
  ctx.font = "400 21px 'Courier Prime', monospace";
  ctx.fillStyle = "rgba(184,168,141,0.7)";
  ctx.fillText(content.providerLine, w / 2, footY + 40);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png", 0.95);
  });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
