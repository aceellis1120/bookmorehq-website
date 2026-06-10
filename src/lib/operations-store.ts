import { BlobPreconditionFailedError, get, put } from "@vercel/blob";
import {
  createEmptyOperationsState,
  type OperationsState,
} from "@/lib/operations-types";

const productionPath = "operations/production-state.json";
const developmentPath = "operations/development-state.json";

function statePath() {
  return process.env.VERCEL_ENV === "production"
    ? productionPath
    : developmentPath;
}

async function streamToText(stream: ReadableStream<Uint8Array>) {
  return new Response(stream).text();
}

async function readStateWithEtag() {
  const result = await get(statePath(), {
    access: "private",
    useCache: false,
  });

  if (!result || result.statusCode !== 200) {
    return { state: createEmptyOperationsState(), etag: undefined };
  }

  const state = JSON.parse(
    await streamToText(result.stream),
  ) as OperationsState;
  state.processedBlandCallIds ??= [];
  state.alertedBlandCallIds ??= [];
  return { state, etag: result.blob.etag.replace(/^W\//, "") };
}

function isPreconditionFailure(error: unknown) {
  return (
    error instanceof BlobPreconditionFailedError ||
    (error instanceof Error &&
      error.message.includes("Precondition failed: ETag mismatch"))
  );
}

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function readOperationsState() {
  if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_STORE_ID) {
    return createEmptyOperationsState();
  }

  try {
    return (await readStateWithEtag()).state;
  } catch {
    return createEmptyOperationsState();
  }
}

export async function updateOperationsState(
  update: (state: OperationsState) => OperationsState | void,
) {
  if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_STORE_ID) {
    throw new Error("Operations storage is not configured.");
  }

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const { state, etag } = await readStateWithEtag();
    const original = JSON.stringify(state);
    const updated = update(structuredClone(state)) ?? state;
    if (JSON.stringify(updated) === original) return state;
    updated.updatedAt = new Date().toISOString();

    try {
      await put(statePath(), JSON.stringify(updated), {
        access: "private",
        addRandomSuffix: false,
        allowOverwrite: Boolean(etag),
        ifMatch: etag,
        contentType: "application/json",
        cacheControlMaxAge: 60,
      });
      return updated;
    } catch (error) {
      if (isPreconditionFailure(error) && attempt < 5) {
        await wait(150 * (attempt + 1));
        continue;
      }
      throw error;
    }
  }

  throw new Error("The operations record changed during this update.");
}

export async function initializeOperationsState() {
  return updateOperationsState((state) => state);
}
