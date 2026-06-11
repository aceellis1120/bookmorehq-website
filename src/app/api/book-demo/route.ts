import { NextRequest } from "next/server";
import {
  demoOpportunityValues,
  getDemoSlots,
  isValidDemoSlot,
} from "@/lib/demo-booking";
import { getDashboardUsers } from "@/lib/dashboard-users";
import { readOperationsState, updateOperationsState } from "@/lib/operations-store";

type DemoBookingBody = {
  closer?: string;
  company?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  niche?: string;
  slot?: string;
  website?: string;
};

function clean(value: string | undefined, maxLength = 160) {
  return value?.trim().slice(0, maxLength) ?? "";
}

function getCloser(username: string | undefined) {
  const normalized = username?.trim().toLowerCase();
  return getDashboardUsers().find(
    (user) =>
      user.role === "closer" &&
      user.username.trim().toLowerCase() === normalized,
  );
}

export async function GET(request: NextRequest) {
  const closer = getCloser(request.nextUrl.searchParams.get("closer") || "");
  if (!closer) {
    return Response.json({ error: "Closer not found." }, { status: 404 });
  }

  const state = await readOperationsState();
  const booked = new Set(
    state.opportunities
      .filter(
        (record) =>
          record.closer === (closer.closerName || closer.name) &&
          !["Won", "Lost"].includes(record.stage),
      )
      .map((record) => record.nextActionAt),
  );

  return Response.json({
    closerName: closer.name,
    slots: getDemoSlots().filter((slot) => !booked.has(slot)),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as DemoBookingBody;
    const closer = getCloser(body.closer);
    const company = clean(body.company);
    const contactName = clean(body.contactName);
    const email = clean(body.email);
    const phone = clean(body.phone, 40);
    const niche = clean(body.niche, 80);
    const slot = clean(body.slot, 40);
    const honeypot = clean(body.website);

    if (honeypot) {
      return Response.json({ success: true });
    }
    if (!closer) {
      return Response.json({ error: "Closer not found." }, { status: 404 });
    }
    if (!company || !contactName || !email || !phone || !niche) {
      return Response.json(
        { error: "Complete every required field." },
        { status: 400 },
      );
    }
    if (!isValidDemoSlot(slot)) {
      return Response.json(
        { error: "Select an available meeting time." },
        { status: 400 },
      );
    }

    const closerName = closer.closerName || closer.name;
    const values = demoOpportunityValues();
    let booked = false;

    await updateOperationsState((state) => {
      const slotTaken = state.opportunities.some(
        (record) =>
          record.closer === closerName &&
          record.nextActionAt === slot &&
          !["Won", "Lost"].includes(record.stage),
      );
      if (slotTaken) return state;

      const now = new Date().toISOString();
      state.opportunities.unshift({
        id: crypto.randomUUID(),
        company,
        contactName,
        email,
        phone,
        city: "",
        niche,
        serviceId: "ai-receptionist",
        packageId: "starter",
        stage: "Demo",
        closer: closerName,
        nextAction: "Run AI Receptionist demo",
        nextActionAt: slot,
        setupValue: values.setupValue,
        monthlyValue: values.monthlyValue,
        createdAt: now,
        updatedAt: now,
      });
      booked = true;
      return state;
    });

    if (!booked) {
      return Response.json(
        { error: "That time was just booked. Choose another slot." },
        { status: 409 },
      );
    }

    return Response.json({ success: true });
  } catch {
    return Response.json(
      { error: "Unable to book the demo right now." },
      { status: 500 },
    );
  }
}
