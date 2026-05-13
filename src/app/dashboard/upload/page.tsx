"use client";

import * as React from "react";
import {
  CheckCircle2,
  CloudUpload,
  FileUp,
  FolderOpen,
  Plus,
  Upload,
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

type UploadItem = {
  destination: string;
  id: number;
  name: string;
  size: number;
  status: string;
  tags: string;
  type: string;
};

const initialUploads: UploadItem[] = [
  {
    destination: "Data catalog",
    id: 1,
    name: "customer_schema.csv",
    size: 184000,
    status: "Imported",
    tags: "crm, schema",
    type: "text/csv",
  },
  {
    destination: "Bot knowledge",
    id: 2,
    name: "finance_metric_notes.pdf",
    size: 920000,
    status: "Indexed",
    tags: "finance",
    type: "application/pdf",
  },
];

function formatFileSize(size: number) {
  if (size >= 1_000_000) {
    return `${(size / 1_000_000).toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(size / 1000))} KB`;
}

export default function UploadPage() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [destination, setDestination] = React.useState("Data catalog");
  const [message, setMessage] = React.useState("Choose files, add tags, then import them.");
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [uploads, setUploads] = React.useState<UploadItem[]>(initialUploads);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSelectedFiles(Array.from(event.target.files ?? []));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const tags = String(formData.get("tags") ?? "").trim();

    if (selectedFiles.length === 0) {
      setMessage("Select at least one file before importing.");
      return;
    }

    const imported = selectedFiles.map((file, index) => ({
      destination,
      id: Date.now() + index,
      name: file.name,
      size: file.size,
      status: "Imported",
      tags: tags || "untagged",
      type: file.type || "unknown",
    }));

    setUploads((current) => [...imported, ...current]);
    setMessage(`${selectedFiles.length} file${selectedFiles.length === 1 ? "" : "s"} imported.`);
    setSelectedFiles([]);
    form.reset();
    setDestination("Data catalog");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
      <section className="min-w-0">
        <div className="mb-6">
          <p className="text-sm font-medium text-muted-foreground">Upload</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Import schemas, documents, and query files
          </h2>
        </div>

        <Card className="rounded-md border-dashed shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-md bg-muted">
                  <CloudUpload className="size-6" />
                </span>
                <div>
                  <h3 className="font-semibold">Upload queue</h3>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                    Files selected here are added to the local dashboard queue and
                    marked imported when submitted.
                  </p>
                </div>
              </div>
              <Button onClick={() => inputRef.current?.click()} type="button">
                <Plus className="size-4" />
                Select files
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 grid gap-4">
          {uploads.map((file) => (
            <Card className="rounded-md shadow-sm" key={file.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
                    <FileUp className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{file.name}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {file.destination} - {formatFileSize(file.size)} - {file.tags}
                    </p>
                  </div>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                  {file.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <aside className="grid h-fit gap-4">
        <Card className="rounded-md shadow-sm">
          <CardHeader>
            <CardTitle>Import files</CardTitle>
            <CardDescription>Attach files and choose their destination.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <input
                className="hidden"
                multiple
                onChange={handleFileChange}
                ref={inputRef}
                type="file"
              />
              <div className="grid gap-2">
                <Label>Selected files</Label>
                <button
                  className="flex min-h-28 flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-muted/30 p-4 text-center text-sm text-muted-foreground"
                  onClick={() => inputRef.current?.click()}
                  type="button"
                >
                  <Upload className="size-5" />
                  {selectedFiles.length > 0
                    ? `${selectedFiles.length} file${selectedFiles.length === 1 ? "" : "s"} selected`
                    : "Choose files"}
                </button>
                {selectedFiles.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedFiles.map((file) => (
                      <Badge key={`${file.name}-${file.lastModified}`} variant="outline">
                        {file.name}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="upload-destination">Destination</Label>
                <Select value={destination} onValueChange={setDestination}>
                  <SelectTrigger id="upload-destination" className="w-full">
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Data catalog">Data catalog</SelectItem>
                    <SelectItem value="Bot knowledge">Bot knowledge</SelectItem>
                    <SelectItem value="Query library">Query library</SelectItem>
                    <SelectItem value="Compliance vault">Compliance vault</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="upload-tags">Tags</Label>
                <Input id="upload-tags" name="tags" placeholder="schema, finance, pii" />
              </div>
              <Button type="submit">
                <FolderOpen className="size-4" />
                Import files
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-md shadow-sm">
          <CardContent className="flex gap-3 p-4">
            <CheckCircle2 className="mt-0.5 size-4 text-emerald-600" />
            <p className="text-sm text-muted-foreground">{message}</p>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
