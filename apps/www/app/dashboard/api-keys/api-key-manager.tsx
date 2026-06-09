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
    month: "short",
    day: "numeric",
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
      <div className="flex items-center gap-3 min-w-0">
        <KeyRoundIcon className="size-4 text-muted-foreground shrink-0" />
        <div className="min-w-0">
          <p className="font-medium text-sm truncate">{apiKey.name}</p>
          <p className="text-xs font-mono text-muted-foreground">
            {apiKey.keyPrefix}
          </p>
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-6 text-xs text-muted-foreground shrink-0">
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
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogPopup className="p-6">
        <DialogTitle>Copy your API key</DialogTitle>
        <p className="text-sm text-muted-foreground mt-1 mb-4">
          This key will only be shown once. Store it somewhere safe.
        </p>
        <div className="flex gap-2">
          <Input
            className="font-mono text-xs"
            nativeInput
            readOnly
            value={rawKey}
          />
          <Button onClick={handleCopy} variant="outline" size="icon">
            <CopyIcon className="size-4" />
          </Button>
        </div>
        {copied && (
          <p className="text-xs text-muted-foreground mt-2">
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
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: newKeyName }),
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
        { ...keyData, usageCount: 0, lastUsedAt: null },
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
          rawKey={revealedKey}
          onClose={() => setRevealedKey(null)}
        />
      )}

      <div className="space-y-3">
        {/* Create form */}
        {showCreate ? (
          <form
            onSubmit={handleCreate}
            className="flex gap-2 rounded-lg border bg-card px-4 py-3"
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
          <div className="py-12 text-center text-sm text-muted-foreground rounded-lg border border-dashed">
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
        <p className="text-xs text-muted-foreground pt-2">
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
