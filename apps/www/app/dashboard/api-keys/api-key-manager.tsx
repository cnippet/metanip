//biome-ignore-all lint/style/noNonNullAssertion:<>

"use client";

import { CopyIcon, KeyRoundIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogPopup, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toastManager } from "@/components/ui/toast";

type ApiKey = {
  id: string;
  name: string;
  keyPrefix: string;
  usageCount: number;
  lastUsedAt: string | null;
  createdAt: string;
};

function formatDate(iso: string | null) {
  if (!iso) return "Never";
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function KeyRow({
  apiKey,
  onDelete,
}: {
  apiKey: ApiKey;
  onDelete: (id: string) => void;
}) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/api-keys/${apiKey.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      onDelete(apiKey.id);
      toastManager.add({ title: "Key revoked", type: "success" });
    } catch {
      toastManager.add({ title: "Failed to revoke key", type: "error" });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border bg-card px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <KeyRoundIcon className="size-4 shrink-0 text-muted-foreground" />
        <div className="min-w-0">
          <p className="truncate font-medium text-sm">{apiKey.name}</p>
          <p className="font-mono text-muted-foreground text-xs">
            {apiKey.keyPrefix}
          </p>
        </div>
      </div>
      <div className="hidden shrink-0 items-center gap-6 text-muted-foreground text-xs sm:flex">
        <div className="text-right">
          <p className="font-medium text-foreground">
            {apiKey.usageCount.toLocaleString()}
          </p>
          <p>requests</p>
        </div>
        <div className="text-right">
          <p className="font-medium text-foreground">
            {formatDate(apiKey.lastUsedAt)}
          </p>
          <p>last used</p>
        </div>
        <div className="text-right">
          <p className="font-medium text-foreground">
            {formatDate(apiKey.createdAt)}
          </p>
          <p>created</p>
        </div>
      </div>
      <Button
        aria-label="Revoke key"
        loading={deleting}
        onClick={handleDelete}
        size="icon-sm"
        variant="ghost"
      >
        <TrashIcon className="size-4 text-muted-foreground" />
      </Button>
    </div>
  );
}

function NewKeyRevealDialog({
  rawKey,
  onClose,
}: {
  rawKey: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(rawKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      open
    >
      <DialogPopup className="p-6">
        <DialogTitle>Copy your API key</DialogTitle>
        <p className="mt-1 mb-4 text-muted-foreground text-sm">
          This key will only be shown once. Store it somewhere safe.
        </p>
        <div className="flex gap-2">
          <Input
            className="font-mono text-xs"
            nativeInput
            readOnly
            value={rawKey}
          />
          <Button onClick={handleCopy} size="icon" variant="outline">
            <CopyIcon className="size-4" />
          </Button>
        </div>
        {copied && (
          <p className="mt-2 text-muted-foreground text-xs">
            Copied to clipboard!
          </p>
        )}
        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>Done</Button>
        </div>
      </DialogPopup>
    </Dialog>
  );
}

export function ApiKeyManager({ initialKeys }: { initialKeys: ApiKey[] }) {
  const [keys, setKeys] = useState(initialKeys);
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [revealedKey, setRevealedKey] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/api-keys", {
        body: JSON.stringify({ name: newKeyName }),
        headers: { "content-type": "application/json" },
        method: "POST",
      });
      const json = (await res.json()) as {
        apiKey?: {
          id: string;
          name: string;
          keyPrefix: string;
          createdAt: string;
          rawKey: string;
        };
        error?: string;
      };
      if (!res.ok) {
        toastManager.add({
          title: json.error ?? "Failed to create key",
          type: "error",
        });
        return;
      }
      const { rawKey, ...keyData } = json.apiKey!;
      setKeys((prev) => [
        { ...keyData, lastUsedAt: null, usageCount: 0 },
        ...prev,
      ]);
      setRevealedKey(rawKey);
      setShowCreate(false);
      setNewKeyName("");
    } catch {
      toastManager.add({ title: "Failed to create key", type: "error" });
    } finally {
      setCreating(false);
    }
  }

  function handleDelete(id: string) {
    setKeys((prev) => prev.filter((k) => k.id !== id));
  }

  return (
    <>
      {revealedKey && (
        <NewKeyRevealDialog
          onClose={() => setRevealedKey(null)}
          rawKey={revealedKey}
        />
      )}

      <div className="space-y-3">
        {/* Create form */}
        {showCreate ? (
          <form
            className="flex gap-2 rounded-lg border bg-card px-4 py-3"
            onSubmit={handleCreate}
          >
            <Input
              autoFocus
              className="flex-1"
              nativeInput
              onChange={(e) =>
                setNewKeyName((e.target as HTMLInputElement).value)
              }
              placeholder="e.g. Production, CI/CD, Blog"
              required
              value={newKeyName}
            />
            <Button loading={creating} size="sm" type="submit">
              Create
            </Button>
            <Button
              onClick={() => {
                setShowCreate(false);
                setNewKeyName("");
              }}
              size="sm"
              type="button"
              variant="ghost"
            >
              Cancel
            </Button>
          </form>
        ) : (
          <Button
            className="w-full justify-start gap-2"
            disabled={keys.length >= 10}
            onClick={() => setShowCreate(true)}
            variant="outline"
          >
            <PlusIcon className="size-4" />
            {keys.length >= 10
              ? "Maximum 10 keys reached"
              : "Create new API key"}
          </Button>
        )}

        {/* Key list */}
        {keys.length === 0 ? (
          <div className="rounded-lg border border-dashed py-12 text-center text-muted-foreground text-sm">
            No API keys yet. Create one to start using the API.
          </div>
        ) : (
          <div className="space-y-2">
            {keys.map((key) => (
              <KeyRow apiKey={key} key={key.id} onDelete={handleDelete} />
            ))}
          </div>
        )}

        {/* Rate limit info */}
        <p className="pt-2 text-muted-foreground text-xs">
          Rate limits:{" "}
          <span className="font-medium text-foreground">
            100 requests / day
          </span>{" "}
          with an API key ·{" "}
          <span className="font-medium text-foreground">
            10 requests / hour
          </span>{" "}
          anonymous
        </p>
      </div>
    </>
  );
}
