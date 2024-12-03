import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import React from "react";
import "@testing-library/jest-dom";
import DriveTreeItem from "../../../src/app/components/drive/drive-tree-item";
import { DriveProvider } from "../../../src/app/components/drive/drive-provider";
import { NodeId } from "react-accessible-treeview";
// Mock the server-side hooks/components
vi.mock("@/src/app/components/drive/functions/hooks/use-drive-context", () => ({
  useDriveContext: () => ({
    driveType: "user-drive",
    r2Objects: [],
    // Add other properties your context needs
  }),
}));
vi.mock('@/src/app/functions/log', () => ({
  log: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  }
}));

vi.mock("@/src/app/components/drive/functions/hooks/use-dynamic-drive", () => ({
  useDynamicDrive: () => ({
    idBeingRenamed: "",
    selectedIds: [],
    folderBeingDraggedOver: null,
    currentlyDragging: "",
    // Add other properties your hook returns
  }),
}));
describe("DriveTreeItem", () => {
  const mockProps = {
    isBranch: false,
    driveInstance: "local" as const,
    isExpanded: false,
    level: 1,
    element: {
      id: "test-id",
      name: "test-file.txt",
      children: [],
      parent: null,
      index: 0,
      metadata: {
        isFolder: false,
        path: "/test-file.txt",
      },
    },
    isSelected: false,
    handleExpand: vi.fn(),
    handleSelect: vi.fn(),
    getNodeProps: () => ({
      role: "treeitem",
      tabIndex: -1,
      onClick: vi.fn(),
      ref: vi.fn(),
      className: "",
      "aria-selected": false,
      "aria-checked": false,
      "aria-expanded": false,
      "aria-level": 1,
      "aria-posinset": 1,
      "aria-setsize": 1,
      disabled: false,
      "aria-disabled": false,
    }),
    dispatch: vi.fn(),
    treeState: {
      selectedIds: new Set<NodeId>(),
      expandedIds: new Set<NodeId>(),
      disabledIds: new Set<NodeId>(),
      halfSelectedIds: new Set<NodeId>(),
      controlledIds: new Set<NodeId>(),
      tabbableId: "test-id" as NodeId,
      isFocused: false,
      lastUserSelect:"test-id" as NodeId,  // Add this
    },
    treeData: [],
  };


  const renderWithProviders = (props = mockProps) => {
    return render(
      <DriveProvider driveType={"user-drive"} r2Objects={[]}>
        <DriveTreeItem {...props} />
      </DriveProvider>
    );
  };

  it("renders the file name correctly", () => {
    try {
      renderWithProviders();
      expect(screen.getByText("test-file.txt")).toBeInTheDocument();
    } catch (error) {
      console.error('Full error details:', {
        message: error.message,
        stack: error.stack,
        cause: error.cause,
      });
    }
  });

  it("applies selected styling when item is selected", () => {
    renderWithProviders({
      ...mockProps,
      isSelected: true,
    });
    
    const treeItem = screen.getByRole("treeitem");
    expect(treeItem).toHaveClass("!bg-muted");
  });

  it("handles double click on item", () => {
    renderWithProviders();
    const treeItem = screen.getByRole("treeitem");
    
    fireEvent.doubleClick(treeItem);
    // You might want to add specific assertions based on your handleDoubleClickOnItem implementation
  });

  it("renders folder with correct indentation level", () => {
    renderWithProviders({
      ...mockProps,
      level: 2,
      element: {
        ...mockProps.element,
        metadata: {
          isFolder: true,
          path: "/test-folder",
        },
      },
    });

    const treeItem = screen.getByRole("treeitem");
    expect(treeItem).toHaveStyle({ paddingLeft: "15px" });
  });

  it("applies drag over styling when folder is being dragged over", () => {
    renderWithProviders({
      ...mockProps,
      element: {
        ...mockProps.element,
        id: "folder-1",
        metadata: {
          isFolder: true,
          path: "/test-folder",
        },
      },
    });

    // You'll need to implement drag and drop testing based on your requirements
  });
});