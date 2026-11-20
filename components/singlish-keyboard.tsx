"use client";

import { useEffect, useRef, useState } from "react";
import { singlishToSinhala } from "@/lib/singlish";

type Field = HTMLInputElement | HTMLTextAreaElement;
const TEXT_TYPES = new Set(["text", "search", ""]);

function isTypingField(el: EventTarget | null): el is Field {
  if (el instanceof HTMLTextAreaElement) return !el.readOnly && el.dataset.singlish !== "off";
  if (el instanceof HTMLInputElement) return TEXT_TYPES.has(el.type) && !el.readOnly && el.dataset.singlish !== "off";
  return false;
}

/** Set value so React-controlled inputs also see the change. */
function setFieldValue(el: Field, value: string, caret: number) {
  const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value")?.set?.call(el, value);
  el.setSelectionRange(caret, caret);
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

/**
 * Site-wide Singlish typing: type English letters, get Sinhala (ayubowan style).
 * Works in every text box and text area (admin forms, reviews, contact ...).
 * Default ON (Sinhala first); the floating switch turns it off for English.
 */
export function SinglishKeyboard() {
  const [on, setOn] = useState(true);
  const [focused, setFocused] = useState(false);
  const buf = useRef({ el: null as Field | null, latin: "", start: 0, len: 0 });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("singlish");
      if (saved === "off") setOn(false);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("singlish", on ? "on" : "off");
    } catch {}
    buf.current = { el: null, latin: "", start: 0, len: 0 };
  }, [on]);

  useEffect(() => {
    const reset = () => (buf.current = { el: null, latin: "", start: 0, len: 0 });
    const onFocus = (e: FocusEvent) => {
      setFocused(isTypingField(e.target));
      reset();
    };
    const onBlur = () => setFocused(false);
    const onKey = (e: KeyboardEvent) => {
      if (!on || !isTypingField(e.target) || e.ctrlKey || e.metaKey || e.altKey || e.isComposing) return;
      const el = e.target;
      const b = buf.current;
      const caret = el.selectionStart ?? el.value.length;
      // continue the current word only if the caret is still at its end
      if (b.el !== el || caret !== b.start + b.len || el.selectionStart !== el.selectionEnd) {
        b.el = el;
        b.latin = "";
        b.start = caret;
        b.len = 0;
      }
      let latin = b.latin;
      if (/^[a-zA-Z]$/.test(e.key)) latin += e.key;
      else if (e.key === "Backspace" && latin) latin = latin.slice(0, -1);
      else {
        // space, punctuation, enter, arrows ... end the word
        buf.current = { el: null, latin: "", start: 0, len: 0 };
        return;
      }
      e.preventDefault();
      const sin = singlishToSinhala(latin);
      const v = el.value;
      const next = v.slice(0, b.start) + sin + v.slice(b.start + b.len);
      b.latin = latin;
      b.len = sin.length;
      setFieldValue(el, next, b.start + sin.length);
    };
    document.addEventListener("focusin", onFocus);
    document.addEventListener("focusout", onBlur);
    document.addEventListener("keydown", onKey, true);
    document.addEventListener("mousedown", reset);
    return () => {
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("focusout", onBlur);
      document.removeEventListener("keydown", onKey, true);
      document.removeEventListener("mousedown", reset);
    };
  }, [on]);

  return (
    <div className={`fixed bottom-4 right-4 z-[60] transition ${focused ? "scale-105" : "opacity-90"}`}>
      <div
        className="flex items-center gap-1 rounded-2xl border border-white/40 bg-white/95 p-1 shadow-[0_6px_0_rgba(0,0,0,0.15),0_18px_30px_-10px_rgba(0,0,0,0.45)] backdrop-blur"
        role="group"
        aria-label="Typing language"
      >
        <span className="px-2 text-[11px] font-semibold text-muted">⌨</span>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setOn(true)}
          aria-pressed={on}
          className={`rounded-xl px-3 py-1.5 text-sm font-bold transition ${on ? "bg-accent text-white shadow-[0_3px_0_rgba(0,0,0,0.3)]" : "text-ink"}`}
          title="Type Sinhala with English letters (Singlish)"
        >
          අ Singlish
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setOn(false)}
          aria-pressed={!on}
          className={`rounded-xl px-3 py-1.5 text-sm font-bold transition ${!on ? "bg-accent text-white shadow-[0_3px_0_rgba(0,0,0,0.3)]" : "text-ink"}`}
          title="Type English"
        >
          EN
        </button>
      </div>
      {focused && on && <p className="mt-1 rounded-lg bg-black/70 px-2 py-1 text-center text-[11px] text-white">aayuboowan → ආයුබෝවන්</p>}
    </div>
  );
}
