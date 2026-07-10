"use client";

import { ChevronDown, ChevronRight, File, Folder, FolderOpen } from "lucide-react";

import { cn } from "@/lib/utils";
import { fileTree } from "@/lib/ide/file-tree";
import type { IdeNode } from "@/lib/ide/types";
import { useIde } from "@/components/ide/ide-context";

function FileRow({ node, depth }: { node: IdeNode; depth: number }) {
  const { activeTabPath, openFile, expandedFolders, toggleFolder } = useIde();
  const paddingLeft = 8 + depth * 14;

  if (node.type === "folder") {
    const expanded = expandedFolders.has(node.path);
    return (
      <div>
        <button
          onClick={() => toggleFolder(node.path)}
          style={{ paddingLeft }}
          className="flex w-full items-center gap-1 py-[3px] pr-2 text-left text-[13px] text-[#cccccc] hover:bg-[#2a2d2e]"
        >
          {expanded ? (
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#cccccc]/70" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#cccccc]/70" />
          )}
          {expanded ? (
            <FolderOpen className="h-3.5 w-3.5 shrink-0 text-[#dcb67a]" />
          ) : (
            <Folder className="h-3.5 w-3.5 shrink-0 text-[#dcb67a]" />
          )}
          <span className="truncate">{node.name}</span>
        </button>
        {expanded && (
          <div>
            {node.children.map((child) => (
              <FileRow key={child.path} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  const active = activeTabPath === node.path;
  return (
    <button
      onClick={() => openFile(node.path)}
      style={{ paddingLeft: paddingLeft + 18 }}
      className={cn(
        "flex w-full items-center gap-1.5 py-[3px] pr-2 text-left text-[13px] text-[#cccccc] hover:bg-[#2a2d2e]",
        active && "bg-[#37373d]",
      )}
    >
      <File className="h-3.5 w-3.5 shrink-0 text-[#858585]" />
      <span className="truncate">{node.name}</span>
    </button>
  );
}

export function FileExplorer() {
  return (
    <div className="flex h-full flex-col bg-[#252526] text-[#cccccc]">
      <div className="px-4 py-2 text-[11px] font-semibold tracking-wide text-[#bbbbbb]">
        Explorer
      </div>
      <div className="px-3 pb-1 text-[11px] font-semibold tracking-wide text-[#bbbbbb]">
        BOOKING-WEBSITE
      </div>
      <div className="flex-1 overflow-y-auto pb-4">
        {fileTree.map((node) => (
          <FileRow key={node.path} node={node} depth={0} />
        ))}
      </div>
    </div>
  );
}
