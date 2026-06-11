import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const output = path.join(root, "public", "closer-training.mp4");
const poster = path.join(root, "public", "closer-training-poster.jpg");
const captions = path.join(root, "public", "closer-training.vtt");
const work = fs.mkdtempSync(path.join(os.tmpdir(), "bookmorehq-video-"));

const slides = [
  {
    eyebrow: "BOOKMOREHQ CLOSER TRAINING",
    title: ["What You Will", "Be Selling"],
    points: [
      "A 24/7 AI receptionist for service businesses",
      "Built to recover missed and after-hours calls",
    ],
    narration:
      "Welcome to BookMoreHQ. You will be selling a twenty-four seven AI receptionist to service businesses such as HVAC, roofing, plumbing, electrical, landscaping, and similar companies. The offer is simple: help the business answer more calls, qualify more leads, and respond faster.",
  },
  {
    eyebrow: "THE BUSINESS PROBLEM",
    title: ["Missed Calls", "Cost Real Jobs"],
    points: [
      "Owners and technicians cannot answer every call",
      "Voicemail and slow follow-up lose high-value leads",
      "After-hours demand often goes to a competitor",
    ],
    narration:
      "The problem is not that contractors need more software. The problem is that owners and technicians cannot answer every call. Calls hit voicemail, follow-up happens too late, and high-value customers call the next company. You are selling recovered opportunities and dependable coverage.",
  },
  {
    eyebrow: "THE SOLUTION",
    title: ["One System That", "Answers And Qualifies"],
    points: [
      "Answers with the client's business identity",
      "Captures name, phone, address, service, and urgency",
      "Routes urgent calls and sends structured lead alerts",
    ],
    narration:
      "BookMoreHQ builds a receptionist around the client's services, hours, territory, tone, emergency rules, and approved answers. It captures the caller's name, callback number, address, requested service, urgency, and preferred time. Urgent calls can be routed, and the business receives a structured lead alert.",
  },
  {
    eyebrow: "HOW YOU DEMONSTRATE IT",
    title: ["Let The Prospect", "Call It Live"],
    points: [
      "Use the demo number in your dashboard",
      "Give one realistic service scenario",
      "Connect the result to missed-call revenue",
    ],
    narration:
      "Do not over-explain the technology. Let the prospect call the live demo number from your dashboard. Give them a realistic service scenario, let the receptionist qualify the call, then show how the lead is captured. Connect that experience to the revenue they currently lose from missed calls.",
  },
  {
    eyebrow: "PACKAGES AND COMMISSION",
    title: ["Recommend One", "Package"],
    points: [
      "Starter: $3,000 today, then $1,000 monthly - earn $1,000",
      "Growth: $4,000 today, then $1,500 monthly - earn $1,250",
      "Scale: $5,500 today, then $2,500 monthly - earn $1,500",
    ],
    narration:
      "Recommend the package that fits the business. Starter is three thousand dollars today, then one thousand monthly, and pays a one thousand dollar commission. Growth is four thousand today, then fifteen hundred monthly, and pays twelve fifty. Scale is fifty-five hundred today, then twenty-five hundred monthly, and pays fifteen hundred.",
  },
  {
    eyebrow: "YOUR DAILY WORKFLOW",
    title: ["Call. Qualify.", "Demo. Close."],
    points: [
      "Add qualified owners to your pipeline",
      "Book meetings through your personal calendar link",
      "Send your assigned checkout link while on the call",
    ],
    narration:
      "Your workflow is call, qualify, demonstrate, and close. Add prospects to your pipeline. Use your personal BookMoreHQ booking link for follow-up meetings. When the owner is ready, send the package checkout link from your dashboard. Stay with them through payment and onboarding.",
  },
  {
    eyebrow: "THE STANDARD",
    title: ["Sell Clearly.", "Never Overpromise."],
    points: [
      "Do not guarantee revenue or booked jobs",
      "Do not promise integrations that are not confirmed",
      "Use the dashboard, follow up, and keep clean records",
    ],
    narration:
      "Sell clearly and never overpromise. Do not guarantee revenue, booked jobs, or integrations that fulfillment has not confirmed. Use the approved script, keep your pipeline current, and follow up when you say you will. Your dashboard contains the demo, booking link, packages, checkout links, and commission tracking.",
  },
];

function escapeXml(value) {
  return value.replace(
    /[<>&'"]/g,
    (character) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&apos;",
        '"': "&quot;",
      })[character],
  );
}

function wrapText(value, maxLength = 38) {
  const words = value.split(/\s+/);
  const lines = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > maxLength && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

function slideSvg(slide, index) {
  const title = slide.title
    .map(
      (line, lineIndex) =>
        `<text x="100" y="${260 + lineIndex * 88}" fill="#ffffff" font-family="sans-serif" font-size="72" font-weight="700">${escapeXml(line)}</text>`,
    )
    .join("");
  const points = slide.points
    .map((point, pointIndex) => {
      const lines = wrapText(point);
      return `
        <rect x="710" y="${205 + pointIndex * 125}" width="470" height="92" rx="8" fill="#ffffff" fill-opacity="${pointIndex === 0 ? "0.12" : "0.07"}"/>
        <circle cx="750" cy="${251 + pointIndex * 125}" r="9" fill="#4f8cff"/>
        <text x="778" y="${235 + pointIndex * 125}" fill="#ffffff" font-family="sans-serif" font-size="23" font-weight="600">
          ${lines
            .map(
              (line, lineIndex) =>
                `<tspan x="778" dy="${lineIndex === 0 ? "0" : "27"}">${escapeXml(line)}</tspan>`,
            )
            .join("")}
        </text>`;
    })
    .join("");

  return `
    <svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
      <rect width="1280" height="720" fill="#101923"/>
      <rect x="0" y="0" width="22" height="720" fill="#155eef"/>
      <circle cx="1175" cy="95" r="170" fill="#155eef" fill-opacity="0.18"/>
      <rect x="100" y="94" width="42" height="42" rx="8" fill="#155eef"/>
      <path d="M114 116h14M121 109v14" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
      <text x="158" y="124" fill="#ffffff" font-family="sans-serif" font-size="27" font-weight="700">BookMoreHQ</text>
      <text x="100" y="188" fill="#8fb4ff" font-family="sans-serif" font-size="19" font-weight="700">${escapeXml(slide.eyebrow)}</text>
      ${title}
      <text x="100" y="595" fill="#98a2b3" font-family="sans-serif" font-size="20">Closer launch system</text>
      <text x="1138" y="650" fill="#98a2b3" font-family="sans-serif" font-size="18">${index + 1} / ${slides.length}</text>
      ${points}
    </svg>`;
}

function duration(file) {
  return Number(
    execFileSync(
      "ffprobe",
      [
        "-v",
        "error",
        "-show_entries",
        "format=duration",
        "-of",
        "default=noprint_wrappers=1:nokey=1",
        file,
      ],
      { encoding: "utf8" },
    ).trim(),
  );
}

const clips = [];
const cues = [];
let timeline = 0;

function timestamp(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = (seconds % 60).toFixed(3).padStart(6, "0");
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${remainder}`;
}

for (const [index, slide] of slides.entries()) {
  const base = path.join(work, `slide-${index + 1}`);
  const png = `${base}.png`;
  const audio = `${base}.aiff`;
  const clip = `${base}.mp4`;

  await sharp(Buffer.from(slideSvg(slide, index))).png().toFile(png);
  execFileSync("say", [
    "-v",
    "Daniel",
    "-r",
    "178",
    "-o",
    audio,
    slide.narration,
  ]);
  const seconds = duration(audio) + 0.6;
  const fadeOut = Math.max(0, seconds - 0.45).toFixed(2);
  cues.push(
    `${index + 1}\n${timestamp(timeline)} --> ${timestamp(timeline + seconds)}\n${slide.narration}\n`,
  );
  timeline += seconds;

  execFileSync(
    "ffmpeg",
    [
      "-y",
      "-loop",
      "1",
      "-i",
      png,
      "-i",
      audio,
      "-vf",
      `scale=1280:720,fade=t=in:st=0:d=0.35,fade=t=out:st=${fadeOut}:d=0.4`,
      "-c:v",
      "libx264",
      "-preset",
      "medium",
      "-crf",
      "22",
      "-pix_fmt",
      "yuv420p",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-t",
      seconds.toFixed(2),
      "-shortest",
      clip,
    ],
    { stdio: "ignore" },
  );
  clips.push(clip);
}

const concatFile = path.join(work, "concat.txt");
fs.writeFileSync(
  concatFile,
  clips.map((clip) => `file '${clip.replaceAll("'", "'\\''")}'`).join("\n"),
);
execFileSync(
  "ffmpeg",
  [
    "-y",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    concatFile,
    "-c",
    "copy",
    "-movflags",
    "+faststart",
    output,
  ],
  { stdio: "ignore" },
);
execFileSync(
  "ffmpeg",
  ["-y", "-ss", "0.5", "-i", output, "-frames:v", "1", "-q:v", "2", poster],
  { stdio: "ignore" },
);
fs.writeFileSync(captions, `WEBVTT\n\n${cues.join("\n")}`);

console.log(output);
console.log(`duration=${duration(output).toFixed(1)}s`);
console.log(`size=${(fs.statSync(output).size / 1024 / 1024).toFixed(1)}MB`);
fs.rmSync(work, { recursive: true, force: true });
