"use client";

import { useState, useEffect, useCallback } from "react";

export interface Preferences {
  tone: string;
  audience: string;
  length: string;
  contentType: string;
  language: string;
  imageUrl?: string | null;
}

const defaultPreferences: Preferences = {
  tone: "Bold",
  audience: "Founders",
  length: "Medium",
  contentType: "Thought Leadership",
  language: "English",
  imageUrl: null,
};

export function usePreferences() {
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);

  const fetchPreferences = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/preferences");
      const json = await res.json();
      if (json.success && json.data) {
        setPreferences(json.data);
      }
    } catch (err) {
      console.error("Failed to load preferences:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  const updatePreference = async (key: keyof Preferences, value: string | null) => {
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);

    try {
      await fetch("/api/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.error("Failed to update preferences:", err);
    }
  };

  return {
    preferences,
    loading,
    updatePreference,
    refreshPreferences: fetchPreferences,
  };
}
