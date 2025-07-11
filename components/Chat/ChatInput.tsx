import { Message } from "@/types";
import { IconArrowUp } from "@tabler/icons-react";
import { FC, KeyboardEvent, useEffect, useRef, useState } from "react";

interface Props {
  onSend: (message: Message) => void;
  loading: boolean;
}

export const ChatInput: FC<Props> = ({ onSend, loading }) => {
  const [content, setContent] = useState<string>("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length > 4000) {
      alert("Message limit is 4000 characters");
      return;
    }

    setContent(value);
  };

  const handleSend = () => {
    if (!content || loading) {
      return;
    }
    onSend({ role: "user", content });
    setContent("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !loading) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        className="min-h-[44px] rounded-lg pl-4 pr-12 py-2 w-full focus:outline-none focus:ring-1 focus:ring-neutral-300 border-2 border-neutral-200 disabled:bg-neutral-100"
        style={{ resize: "none" }}
        placeholder={loading ? "Sila tunggu..." : "Taip mesej..."}
        value={content}
        rows={1}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={loading}
      />

      <button
        onClick={handleSend}
        disabled={loading}
        className={`absolute right-2 bottom-3 h-8 w-8 rounded-full p-1 ${
          loading ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:opacity-80"
        } text-white`}
      >
        <IconArrowUp className="h-full w-full" />
      </button>
    </div>
  );
};