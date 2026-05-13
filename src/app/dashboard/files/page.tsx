"use client";

import * as React from "react";
import {
  Archive,
  Download,
  FileSearch,
  Files,
  FolderOpen,
  Search,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FileRecord = {
  folder: string;
  id: number;
  name: string;
  status: "Active" | "Archived";
  type: string;
  updated: string;
};

const initialFiles: FileRecord[] = [
  {
    folder: "Schemas",
    id: 1,
    name: "customer_schema.csv",
    status: "Active",
    type: "CSV",
    updated: "Today",
  },
  {
    folder: "Policies",
    id: 2,
    name: "pii_access_rules.md",
    status: "Active",
    type: "Markdown",
    updated: "Yesterday",
  },
  {
    folder: "Queries",
    id: 3,
    name: "monthly_revenue.sql",
    status: "Archived",
    type: "SQL",
    updated: "May 8",
  },
];

export default function FilesPage() {
  const [files, setFiles] = React.useState<FileRecord[]>(initialFiles);
  const [folder, setFolder] = React.useState("All");
  const [message, setMessage] = React.useState("Search and file actions are live.");
  const [query, setQuery] = React.useState("");

  const folders = ["All", ...Array.from(new Set(files.map((file) => file.folder)))];
  const visibleFiles = files.filter((file) => {
    const matchesFolder = folder === "All" || file.folder === folder;
    const matchesQuery =
      file.name.toLowerCase().includes(query.toLowerCase()) ||
      file.type.toLowerCase().includes(query.toLowerCase());

    return matchesFolder && matchesQuery;
  });

  function addFolder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("folder") ?? "").trim();

    if (!name) {
      setMessage("Folder name is required.");
      return;
    }

    setFiles((current) => [
      {
        folder: name,
        id: Date.now(),
        name: "empty-folder-placeholder.txt",
        status: "Active",
        type: "Folder",
        updated: "Just now",
      },
      ...current,
    ]);
    setFolder(name);
    setMessage(`${name} folder created.`);
    form.reset();
  }

  function archiveFile(id: number) {
    setFiles((current) =>
      current.map((file) =>
        file.id === id
          ? {
              ...file,
              status: file.status === "Active" ? "Archived" : "Active",
            }
          : file,
      ),
    );
    setMessage("File status updated.");
  }

  function deleteFile(id: number) {
    setFiles((current) => current.filter((file) => file.id !== id));
    setMessage("File removed from the browser list.");
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Files</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Browse workspace files
          </h2>
        </div>
        <Badge className="rounded-md" variant="outline">
          {visibleFiles.length} visible
        </Badge>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="min-w-0">
          <Card className="rounded-md shadow-sm">
            <CardHeader className="border-b">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle>File library</CardTitle>
                  <CardDescription>
                    Filter by folder, search names, archive, and remove files.
                  </CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex h-9 items-center gap-2 rounded-md border bg-background px-3">
                    <Search className="size-4 text-muted-foreground" />
                    <input
                      className="w-48 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search files"
                      value={query}
                    />
                  </div>
                  <Select value={folder} onValueChange={setFolder}>
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Folder" />
                    </SelectTrigger>
                    <SelectContent>
                      {folders.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 p-4">
              {visibleFiles.length === 0 ? (
                <div className="rounded-md border border-dashed bg-muted/30 p-8 text-center">
                  <FileSearch className="mx-auto size-8 text-muted-foreground" />
                  <p className="mt-3 font-medium">No files match this filter</p>
                </div>
              ) : (
                visibleFiles.map((file) => (
                  <div
                    className="flex flex-wrap items-center justify-between gap-3 rounded-md border bg-background p-3"
                    key={file.id}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
                        <Files className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{file.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {file.folder} - {file.type} - {file.updated}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          file.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {file.status}
                      </Badge>
                      <Button
                        onClick={() => setMessage(`${file.name} download prepared.`)}
                        size="icon"
                        title="Download file"
                        type="button"
                        variant="outline"
                      >
                        <Download className="size-4" />
                      </Button>
                      <Button
                        onClick={() => archiveFile(file.id)}
                        size="icon"
                        title="Archive file"
                        type="button"
                        variant="outline"
                      >
                        <Archive className="size-4" />
                      </Button>
                      <Button
                        onClick={() => deleteFile(file.id)}
                        size="icon"
                        title="Delete file"
                        type="button"
                        variant="outline"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </section>

        <aside className="grid h-fit gap-4">
          <Card className="rounded-md shadow-sm">
            <CardHeader>
              <CardTitle>Create folder</CardTitle>
              <CardDescription>Add a new library folder.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4" onSubmit={addFolder}>
                <div className="grid gap-2">
                  <Label htmlFor="folder-name">Folder name</Label>
                  <Input id="folder-name" name="folder" placeholder="Compliance" />
                </div>
                <Button type="submit">
                  <FolderOpen className="size-4" />
                  Create folder
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-md shadow-sm">
            <CardContent className="p-4 text-sm text-muted-foreground">
              {message}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
