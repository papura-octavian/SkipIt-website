"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Check, CheckCircle2, Copy, Loader2, Mail, Send } from "lucide-react";
import { CONTACT_EMAIL, REQUEST_ENDPOINT } from "@/lib/site";

type Status = "idle" | "sending" | "sent" | "failed";

const MIN_REQUEST = 10;
const MAX_REQUEST = 4000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function RequestForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [request, setRequest] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [touched, setTouched] = useState({ email: false, request: false });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const loadedAt = useRef(0);

  useEffect(() => {
    loadedAt.current = Date.now();
  }, []);

  const emailError = !EMAIL_RE.test(email.trim()) ? "Enter a valid email so we can reply." : "";
  const requestError =
    request.trim().length < MIN_REQUEST ? `A few more words, please (at least ${MIN_REQUEST} characters).` : "";
  const showEmailError = touched.email && !!emailError;
  const showRequestError = touched.request && !!requestError;

  const plainText = `Name: ${name.trim() || "-"}\nEmail: ${email.trim()}\n\nRequest:\n${request.trim()}`;
  const mailtoHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    `Tool request${name.trim() ? ` - ${name.trim()}` : ""}`
  )}&body=${encodeURIComponent(plainText)}`;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ email: true, request: true });
    if (emailError || requestError) return;

    setStatus("sending");
    setError("");
    try {
      const res = await fetch(REQUEST_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          request: request.trim(),
          company,
          elapsedMs: Date.now() - loadedAt.current,
        }),
      });
      if (res.ok) {
        setStatus("sent");
        return;
      }
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "");
      setStatus("failed");
    } catch {
      setStatus("failed");
    }
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(`To: ${CONTACT_EMAIL}\n\n${plainText}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the mailto link is still there.
    }
  }

  function reset() {
    setName("");
    setEmail("");
    setRequest("");
    setTouched({ email: false, request: false });
    setStatus("idle");
    loadedAt.current = Date.now();
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "sent" ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-center py-10"
          role="status"
        >
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
            className="mx-auto grid place-items-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan to-pink text-[#0a0a12]"
          >
            <CheckCircle2 className="w-8 h-8" />
          </motion.div>
          <h2 className="mt-6 text-2xl font-semibold">Request sent</h2>
          <p className="mt-2 text-white/60 max-w-sm mx-auto">
            Thanks! We read every idea and will reply to <span className="text-white">{email.trim()}</span>.
          </p>
          <button type="button" onClick={reset} className="btn btn-ghost mt-8 px-6 py-3">
            Send another idea
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={onSubmit}
          noValidate
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-5"
        >
          <input
            type="text"
            name="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[10000px] h-px w-px overflow-hidden"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="rf-name" className="block text-sm text-white/70 mb-1.5">
                Name <span className="text-white/35">(optional)</span>
              </label>
              <input
                id="rf-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={80}
                autoComplete="name"
                className="field"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="rf-email" className="block text-sm text-white/70 mb-1.5">
                Email
              </label>
              <input
                id="rf-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                maxLength={160}
                autoComplete="email"
                aria-invalid={showEmailError}
                aria-describedby={showEmailError ? "rf-email-err" : undefined}
                className="field"
                placeholder="you@email.com"
              />
              {showEmailError && (
                <p id="rf-email-err" className="mt-1.5 text-xs text-pink">
                  {emailError}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="rf-request" className="block text-sm text-white/70 mb-1.5">
              What do you want to solve?
            </label>
            <textarea
              id="rf-request"
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, request: true }))}
              maxLength={MAX_REQUEST}
              aria-invalid={showRequestError}
              aria-describedby="rf-request-help"
              className="field min-h-[170px] resize-y leading-relaxed"
              placeholder="What do you do today, what do you start with, and what should come out at the end?"
            />
            <div id="rf-request-help" className="mt-1.5 flex justify-between gap-4 text-xs">
              <span className={showRequestError ? "text-pink" : "text-white/40"}>
                {showRequestError ? requestError : "Tip: an example input and output helps a lot."}
              </span>
              <span className="font-mono text-white/30 shrink-0">
                {request.length}/{MAX_REQUEST}
              </span>
            </div>
          </div>

          <AnimatePresence>
            {status === "failed" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
                role="alert"
              >
                <div className="rounded-2xl border border-pink/30 bg-pink/[0.07] p-4 text-sm">
                  <p className="flex items-center gap-2 font-medium text-white">
                    <AlertTriangle className="w-4 h-4 text-pink" />
                    {error || "We couldn't send it from here."}
                  </p>
                  <p className="mt-1 text-white/60">
                    Your text is still here. Send it by email instead, it only takes a click:
                  </p>
                  <div className="mt-3 flex flex-col sm:flex-row gap-2">
                    <a href={mailtoHref} className="btn btn-ghost px-4 py-2.5 text-sm">
                      <Mail className="w-4 h-4" />
                      Open email app
                    </a>
                    <button type="button" onClick={copyMessage} className="btn btn-ghost px-4 py-2.5 text-sm">
                      {copied ? <Check className="w-4 h-4 text-cyan" /> : <Copy className="w-4 h-4" />}
                      {copied ? "Copied" : `Copy for ${CONTACT_EMAIL}`}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button type="submit" disabled={status === "sending"} className="btn btn-primary w-full py-3.5 disabled:opacity-70">
            {status === "sending" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send request
              </>
            )}
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
