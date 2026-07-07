"use client";

import { useRouter } from "next/navigation";

import { CheckCircle2, type Clock, FileEdit, PauseCircle } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectStatusToggleProps {
  projectId: string;
  status: string;
  onStatusChange?: (status: string) => void;
}

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof Clock }
> = {
  active: { label: "Active", variant: "default", icon: CheckCircle2 },
  draft: { label: "Draft", variant: "secondary", icon: FileEdit },
  paused: { label: "Paused", variant: "destructive", icon: PauseCircle },
  completed: { label: "Completed", variant: "outline", icon: CheckCircle2 },
};

export function ProjectStatusToggle({ projectId, status, onStatusChange }: ProjectStatusToggleProps) {
  const router = useRouter();
  const current = statusConfig[status] ?? statusConfig.draft;

  async function handleChange(newStatus: string) {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      toast.success("Project status updated");
      onStatusChange?.(newStatus);
      router.refresh();
    } catch {
      toast.error("Failed to update status");
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 gap-1.5 px-2">
          <current.icon className="size-3" />
          <Badge variant={current.variant} className="text-xs">
            {current.label}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => handleChange("draft")}>
          <FileEdit className="mr-2 size-3" />
          Draft
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleChange("active")}>
          <CheckCircle2 className="mr-2 size-3" />
          Active
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleChange("paused")}>
          <PauseCircle className="mr-2 size-3" />
          Paused
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleChange("completed")}>
          <CheckCircle2 className="mr-2 size-3" />
          Completed
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
