/**
 * Refinement intent adapter — re-biases an EmotionIntent for a refine action.
 * Strictly operates on the structured intent (never on couplet text), so the
 * provider always receives a coherent target and the corpus stays original.
 */

import type { EmotionIntent, EmotionKey, RefineRequest } from "@/lib/types";

export function adaptIntentForRefine(base: EmotionIntent, action: RefineRequest["action"]): EmotionIntent {
  const intent: EmotionIntent = { ...base, secondary: [...base.secondary], arc: [...base.arc] };
  const intensity = Math.min(5, base.intensity + 1);
  const push = (emotion: EmotionKey, front = false) => {
    if (!intent.secondary.includes(emotion)) {
      intent.secondary = front ? [emotion, ...intent.secondary].slice(0, 2) : [...intent.secondary, emotion].slice(0, 2);
    }
  };
  switch (action) {
    case "deeper":
      intent.intensity = intensity as EmotionIntent["intensity"];
      push("dard");
      break;
    case "more-pain":
      push("dard", true);
      intent.register = "melancholic";
      break;
    case "more-angry":
      push("gussa", true);
      intent.register = "dramatic";
      break;
    case "more-ishq":
      push("ishq", true);
      break;
    case "more-sufi":
      push("devotion", true);
      intent.direction = "spiritual";
      intent.primary = "spiritualLonging";
      break;
    case "change-ending":
      // selection-level: fresh seed chooses a different closing couplet
      break;
  }
  intent.arc = [intent.primary, ...intent.secondary];
  return intent;
}
