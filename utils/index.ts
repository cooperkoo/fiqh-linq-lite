import { Message } from "@/types";
import { createParser, ParsedEvent, ReconnectInterval } from "eventsource-parser";

export const OpenAIStream = async (messages: Message[]) => {
  const encoder = new TextEncoder();

  const prompt = messages
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n") + "\nAssistant:";

  const res = await fetch("https://ai-law.greenootech.com/api/generate", {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({
      model: "qwen:7b",
      prompt,
      stream: true
    })
  });

  if (res.status !== 200) {
    const errText = await res.text();
    console.error("API error:", errText);
    throw new Error("Ollama API returned an error");
  }

  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const reader = res.body?.getReader();
      if (!reader) {
        controller.error("No response body");
        return;
      }

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;

          try {
            const json = JSON.parse(line);
            const text = json.response;
            if (json.done) {
              controller.close();
              return;
            }
            const chunk = encoder.encode(text);
            controller.enqueue(chunk);
          } catch (err) {
            console.error("Parse error:", err);
            controller.error(err);
          }
        }
      }
    }
  });

  return stream;
};