"use client";

import { createContext, useContext, useMemo, useState } from "react";

export type IdeActivityView = "explorer" | "search" | "git" | "run" | "extensions";

interface IdeContextValue {
  openTabs: string[];
  activeTabPath: string | null;
  openFile: (path: string) => void;
  closeTab: (path: string) => void;
  setActiveTabPath: (path: string) => void;

  activityView: IdeActivityView;
  setActivityView: (view: IdeActivityView) => void;

  ordinoPanelOpen: boolean;
  setOrdinoPanelOpen: (open: boolean) => void;

  expandedFolders: Set<string>;
  toggleFolder: (path: string) => void;
}

const IdeContext = createContext<IdeContextValue | null>(null);

const INITIAL_TABS = [
  "src/components/checkout/order-summary.tsx",
  "src/lib/pricing.ts",
];

const INITIAL_EXPANDED = [
  "src",
  "src/components",
  "src/components/checkout",
  "src/lib",
];

export function IdeProvider({ children }: { children: React.ReactNode }) {
  const [openTabs, setOpenTabs] = useState<string[]>(INITIAL_TABS);
  const [activeTabPath, setActiveTabPathState] = useState<string | null>(
    INITIAL_TABS[0],
  );
  const [activityView, setActivityView] = useState<IdeActivityView>("explorer");
  const [ordinoPanelOpen, setOrdinoPanelOpen] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    () => new Set(INITIAL_EXPANDED),
  );

  function openFile(path: string) {
    setOpenTabs((tabs) => (tabs.includes(path) ? tabs : [...tabs, path]));
    setActiveTabPathState(path);
  }

  function closeTab(path: string) {
    setOpenTabs((tabs) => {
      const next = tabs.filter((tab) => tab !== path);
      setActiveTabPathState((current) => {
        if (current !== path) return current;
        return next[next.length - 1] ?? null;
      });
      return next;
    });
  }

  function setActiveTabPath(path: string) {
    setActiveTabPathState(path);
  }

  function toggleFolder(path: string) {
    setExpandedFolders((folders) => {
      const next = new Set(folders);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }

  const value = useMemo<IdeContextValue>(
    () => ({
      openTabs,
      activeTabPath,
      openFile,
      closeTab,
      setActiveTabPath,
      activityView,
      setActivityView,
      ordinoPanelOpen,
      setOrdinoPanelOpen,
      expandedFolders,
      toggleFolder,
    }),
    [openTabs, activeTabPath, activityView, ordinoPanelOpen, expandedFolders],
  );

  return <IdeContext.Provider value={value}>{children}</IdeContext.Provider>;
}

export function useIde() {
  const context = useContext(IdeContext);
  if (!context) {
    throw new Error("useIde must be used within an IdeProvider");
  }
  return context;
}
