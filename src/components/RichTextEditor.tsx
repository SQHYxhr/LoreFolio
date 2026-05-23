"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Heading2, ImageIcon, Italic, List, ListOrdered } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  onInsertImage: (insert: (url: string, alt?: string) => void) => void;
  placeholder?: string;
}

export function RichTextEditor({
  value,
  onChange,
  onInsertImage,
  placeholder = "写下完整的设定细节，可插入图片...",
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: true }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "entry-editor prose prose-stone max-w-none min-h-[220px] px-3 py-2 focus:outline-none text-sm leading-relaxed",
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const incoming = value || "<p></p>";
    if (current !== incoming && value !== current) {
      editor.commands.setContent(incoming, { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) return null;

  const insertImage = () => {
    onInsertImage((url, alt) => {
      editor.chain().focus().setImage({ src: url, alt: alt || "设定插图" }).run();
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-input bg-card">
      <div className="flex flex-wrap gap-1 border-b border-border/80 bg-secondary/40 p-1.5">
        <ToolbarButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="加粗"
        >
          <Bold className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="斜体"
        >
          <Italic className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="小标题"
        >
          <Heading2 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="无序列表"
        >
          <List className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="有序列表"
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton active={false} onClick={insertImage} title="插入图片">
          <ImageIcon className="h-3.5 w-3.5" />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarButton({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      title={title}
      className={cn("h-8 w-8 p-0", active && "bg-primary/15 text-primary")}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
