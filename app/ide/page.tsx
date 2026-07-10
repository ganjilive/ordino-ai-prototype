"use client";

import { ActivityBar } from "@/components/ide/activity-bar";
import { BottomPanel } from "@/components/ide/bottom-panel";
import { EditorPane } from "@/components/ide/editor-pane";
import { EditorTabs } from "@/components/ide/editor-tabs";
import { FileExplorer } from "@/components/ide/file-explorer";
import { IdeProvider, useIde } from "@/components/ide/ide-context";
import { OrdinoPanel } from "@/components/ide/ordino-panel";
import { StatusBar } from "@/components/ide/status-bar";
import { TitleBar } from "@/components/ide/title-bar";

const VIEW_LABELS: Record<string, string> = {
  search: "Search",
  git: "Source Control",
  run: "Run and Debug",
  extensions: "Extensions",
};

function PrimarySidebar() {
  const { activityView } = useIde();

  if (activityView === "explorer") {
    return <FileExplorer />;
  }

  return (
    <div className="flex h-full flex-col bg-[#252526] text-[#cccccc]">
      <div className="px-4 py-2 text-[11px] font-semibold tracking-wide text-[#bbbbbb]">
        {VIEW_LABELS[activityView]}
      </div>
      <div className="flex flex-1 items-center justify-center px-6 text-center text-[13px] text-[#6b6b6b]">
        Not part of this walkthrough.
      </div>
    </div>
  );
}

function IdeScene() {
  const { ordinoPanelOpen } = useIde();

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-[#1e1e1e] text-[#cccccc]">
      <TitleBar />
      <div className="flex min-h-0 flex-1">
        <ActivityBar />
        <div className="w-60 shrink-0 border-r border-black/30">
          <PrimarySidebar />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1 flex-col">
            <EditorTabs />
            <EditorPane />
          </div>
          <BottomPanel />
        </div>
        {ordinoPanelOpen && <OrdinoPanel />}
      </div>
      <StatusBar />
    </div>
  );
}

export default function IdePage() {
  return (
    <IdeProvider>
      <IdeScene />
    </IdeProvider>
  );
}
