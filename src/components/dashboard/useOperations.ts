"use client";

import { useCallback, useEffect, useState } from "react";
import type { OperationsPayload } from "@/lib/operations-types";

export function useOperations() {
  const [data, setData] = useState<OperationsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/dashboard/operations", {
        cache: "no-store",
      });
      const payload = (await response.json()) as OperationsPayload & {
        error?: string;
      };
      if (!response.ok) throw new Error(payload.error || "Unable to load data.");
      setData(payload);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load dashboard data.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const runOperation = useCallback(async (body: Record<string, unknown>) => {
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/dashboard/operations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = (await response.json()) as OperationsPayload & {
        error?: string;
      };
      if (!response.ok) throw new Error(payload.error || "Unable to save.");
      setData(payload);
      return payload;
    } catch (saveError) {
      const message =
        saveError instanceof Error ? saveError.message : "Unable to save.";
      setError(message);
      throw saveError;
    } finally {
      setSaving(false);
    }
  }, []);

  return { data, loading, saving, error, refresh, runOperation };
}
