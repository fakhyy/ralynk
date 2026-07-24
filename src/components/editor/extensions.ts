import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Link from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Mathematics from "@tiptap/extension-mathematics";
import Underline from "@tiptap/extension-underline";

export const extensions = [
  StarterKit.configure({
    heading: { levels: [1, 2, 3] },
    codeBlock: {
      HTMLAttributes: {
        class: "rounded-lg bg-muted p-4 text-sm font-mono",
      },
    },
    blockquote: {
      HTMLAttributes: {
        class: "border-l-2 border-border pl-4 text-muted-foreground",
      },
    },
    horizontalRule: {
      HTMLAttributes: {
        class: "my-6 border-border",
      },
    },
  }),
  Placeholder.configure({
    placeholder: ({ node }) => {
      if (node.type.name === "heading") {
        return "Title";
      }
      return "Write your thoughts...";
    },
    showOnlyWhenEditable: true,
    showOnlyCurrent: true,
  }),
  Typography,
  Highlight.configure({ multicolor: false }),
  TaskList,
  TaskItem.configure({ nested: true }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: "underline underline-offset-2 text-foreground/80 hover:text-foreground",
    },
  }),
  Table.configure({ resizable: true }),
  TableRow,
  TableCell,
  TableHeader,
  TextStyle,
  Color,
  Mathematics,
  Underline,
];
