import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Bold, Italic, List, ListOrdered, Quote } from 'lucide-react'
import { cn } from '../../lib/utils'

function MenuBar({ editor }) {
  if (!editor) return null

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border bg-canvas/30 px-3 py-2">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
        icon={Bold}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
        icon={Italic}
      />
      <div className="mx-1 h-4 w-[1px] bg-ink-200" />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
        icon={List}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
        icon={ListOrdered}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive('blockquote')}
        icon={Quote}
      />
    </div>
  )
}

function ToolbarButton({ onClick, active, icon: Icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-7 w-7 items-center justify-center rounded transition-colors',
        active ? 'bg-ink-900/10 text-ink-900' : 'text-ink-500 hover:bg-ink-900/5 hover:text-ink-900'
      )}
    >
      <Icon size={14} />
    </button>
  )
}

export function RichTextEditor({ content, onChange, placeholder = 'Write notes...' }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        className: 'prose prose-sm prose-moss max-w-none focus:outline-none min-h-[120px] px-4 py-3',
      },
    },
  })

  return (
    <div className="overflow-hidden rounded-md border border-border bg-surface shadow-sm focus-within:border-moss-500 focus-within:ring-1 focus-within:ring-moss-500">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
