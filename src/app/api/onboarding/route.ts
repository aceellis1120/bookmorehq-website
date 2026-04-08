import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    console.log("Onboarding submission received:", JSON.stringify(data, null, 2));

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `onboarding-${timestamp}.json`;

    try {
      const baseDir = process.env.VERCEL ? "/tmp" : process.cwd();
      const dir = path.join(baseDir, "data", "onboarding-submissions");
      await mkdir(dir, { recursive: true });
      const filepath = path.join(dir, filename);
      await writeFile(filepath, JSON.stringify(data, null, 2), "utf-8");
      console.log("Onboarding submission saved:", filepath);
    } catch (fileError) {
      console.warn("Onboarding submission could not be written to disk, returning success anyway:", fileError);
    }

    return Response.json({ success: true, filename });
  } catch (error) {
    console.error("Onboarding submission error:", error);
    return Response.json(
      { success: false, error: "Failed to process submission" },
      { status: 500 }
    );
  }
}
