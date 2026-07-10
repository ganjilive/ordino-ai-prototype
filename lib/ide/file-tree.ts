import type { IdeFileNode, IdeNode } from "@/lib/ide/types";

function file(name: string, path: string, language: string): IdeFileNode {
  return { type: "file", name, path, language };
}

export const fileTree: IdeNode[] = [
  {
    type: "folder",
    name: "src",
    path: "src",
    children: [
      {
        type: "folder",
        name: "app",
        path: "src/app",
        children: [
          file("layout.tsx", "src/app/layout.tsx", "typescript"),
          file("page.tsx", "src/app/page.tsx", "typescript"),
          {
            type: "folder",
            name: "checkout",
            path: "src/app/checkout",
            children: [file("page.tsx", "src/app/checkout/page.tsx", "typescript")],
          },
        ],
      },
      {
        type: "folder",
        name: "components",
        path: "src/components",
        children: [
          {
            type: "folder",
            name: "checkout",
            path: "src/components/checkout",
            children: [
              file(
                "order-summary.tsx",
                "src/components/checkout/order-summary.tsx",
                "typescript",
              ),
              file(
                "promo-code-input.tsx",
                "src/components/checkout/promo-code-input.tsx",
                "typescript",
              ),
              file(
                "checkout-form.tsx",
                "src/components/checkout/checkout-form.tsx",
                "typescript",
              ),
            ],
          },
        ],
      },
      {
        type: "folder",
        name: "lib",
        path: "src/lib",
        children: [
          file("pricing.ts", "src/lib/pricing.ts", "typescript"),
          file("promotions.ts", "src/lib/promotions.ts", "typescript"),
          file("types.ts", "src/lib/types.ts", "typescript"),
        ],
      },
    ],
  },
  file("package.json", "package.json", "json"),
  file("README.md", "README.md", "markdown"),
];

function flatten(nodes: IdeNode[]): IdeFileNode[] {
  return nodes.flatMap((node) =>
    node.type === "file" ? [node] : flatten(node.children),
  );
}

export const allFiles = flatten(fileTree);
export const allFilePaths = allFiles.map((f) => f.path);

export function findFile(path: string): IdeFileNode | undefined {
  return allFiles.find((f) => f.path === path);
}
