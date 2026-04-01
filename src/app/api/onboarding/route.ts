import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Log submission
    console.log("Onboarding submission received:", JSON.stringify(data, null, 2));

    // Save to JSON file
    const dir = path.join(process.cwd(), "data", "onboarding-submissions");
    await mkdir(dir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `onboarding-${timestamp}.json`;
    const filepath = path.join(dir, filename);

    await writeFile(filepath, JSON.stringify(data, null, 2), "utf-8");

    return Response.json({ success: true, filename });
  } catch (error) {
    console.error("Onboarding submission error:", error);
    return Response.json(
      { success: false, error: "Failed to save submission" },
      { status: 500 }
    );
  }
}
