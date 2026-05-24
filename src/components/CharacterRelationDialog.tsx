"use client";

import { useEffect, useState } from "react";
import type { CharacterRelation, Entry, RelationDirection, RelationStatus, RelationType } from "@/types";
import { RELATION_TYPE_LABELS, RELATION_TYPES } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CharacterRelationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingRelation: CharacterRelation | null;
  currentCharacterId: string;
  projectId: string;
  characterEntries: Entry[];
  existingRelations: CharacterRelation[];
  onSave: (
    input: {
      projectId: string;
      fromCharacterId: string;
      toCharacterId: string;
      relationType: RelationType;
      customLabel: string;
      direction: RelationDirection;
      status: RelationStatus;
      note: string;
    },
    editRelationId?: string,
  ) => void;
}

export function CharacterRelationDialog({
  open,
  onOpenChange,
  editingRelation,
  currentCharacterId,
  projectId,
  characterEntries,
  existingRelations,
  onSave,
}: CharacterRelationDialogProps) {
  const [toCharacterId, setToCharacterId] = useState("");
  const [relationType, setRelationType] = useState<RelationType>("unknown");
  const [customLabel, setCustomLabel] = useState("");
  const [direction, setDirection] = useState<RelationDirection>("directed");
  const [status, setStatus] = useState<RelationStatus>("current");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const isEditing = Boolean(editingRelation);
  const candidates = characterEntries.filter((e) => e.id !== currentCharacterId);

  useEffect(() => {
    if (editingRelation) {
      const target =
        editingRelation.fromCharacterId === currentCharacterId
          ? editingRelation.toCharacterId
          : editingRelation.fromCharacterId;
      setToCharacterId(target);
      setRelationType(editingRelation.relationType);
      setCustomLabel(editingRelation.customLabel);
      setDirection(editingRelation.direction);
      setStatus(editingRelation.status);
      setNote(editingRelation.note);
      setError("");
    } else {
      setToCharacterId("");
      setRelationType("unknown");
      setCustomLabel("");
      setDirection("directed");
      setStatus("current");
      setNote("");
      setError("");
    }
  }, [editingRelation, currentCharacterId, open]);

  const isDuplicate = (): boolean => {
    const trimmedLabel = customLabel.trim();
    return existingRelations.some((r) => {
      if (isEditing && r.id === editingRelation?.id) return false;
      return (
        r.fromCharacterId === currentCharacterId &&
        r.toCharacterId === toCharacterId &&
        r.relationType === relationType &&
        r.customLabel.trim() === trimmedLabel &&
        r.direction === direction
      );
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toCharacterId) {
      setError("请选择目标角色");
      return;
    }
    if (isDuplicate()) {
      setError("已存在完全相同的关系记录");
      return;
    }
    onSave(
      {
        projectId,
        fromCharacterId: currentCharacterId,
        toCharacterId,
        relationType,
        customLabel: customLabel.trim(),
        direction,
        status,
        note,
      },
      editingRelation?.id,
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "编辑关系" : "添加关系"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "修改角色之间的关系信息" : "为当前角色添加与其他角色之间的关系"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {candidates.length === 0 ? (
            <div className="rounded-lg border border-border bg-muted/30 p-4 text-center text-sm text-muted-foreground">
              当前项目还没有其他角色可建立关系
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="target-character">目标角色</Label>
              <select
                id="target-character"
                value={toCharacterId}
                onChange={(e) => {
                  setToCharacterId(e.target.value);
                  setError("");
                }}
                className="flex h-9 w-full rounded-lg border border-input bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              >
                <option value="" disabled>
                  选择角色...
                </option>
                {candidates.map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.title || "未命名条目"}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="relation-type">关系类型</Label>
            <select
              id="relation-type"
              value={relationType}
              onChange={(e) => {
                setRelationType(e.target.value as RelationType);
                setError("");
              }}
              className="flex h-9 w-full rounded-lg border border-input bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {RELATION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {RELATION_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-label">自定义标签（可选，覆盖预设）</Label>
            <Input
              id="custom-label"
              placeholder="如：青梅竹马、宿敌兼知己..."
              value={customLabel}
              onChange={(e) => {
                setCustomLabel(e.target.value);
                setError("");
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="direction">方向</Label>
              <select
                id="direction"
                value={direction}
                onChange={(e) => setDirection(e.target.value as RelationDirection)}
                className="flex h-9 w-full rounded-lg border border-input bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="directed">单向</option>
                <option value="mutual">双向</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">状态</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as RelationStatus)}
                className="flex h-9 w-full rounded-lg border border-input bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="current">当前</option>
                <option value="past">过去</option>
                <option value="ambiguous">模糊</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">备注</Label>
            <Textarea
              id="note"
              placeholder="可选：补充描述关系细节..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
            />
          </div>

          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : null}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit" disabled={candidates.length === 0}>
              保存
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
