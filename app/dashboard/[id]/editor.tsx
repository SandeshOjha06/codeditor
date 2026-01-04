"use client"

import { startTransition, useEffect, useRef, useState, useTransition } from "react"
import { updatePlayground } from "../actions"
import { toast } from "sonner"
import Editor from "@monaco-editor/react"

export default function CodeEditor({ playground }: { playground: any }) {
  const [code, setCode] = useState(playground.code ?? "")
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle")

  const [, startTransition] = useTransition()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [language, setLanguage] = useState(playground.language ?? "javascript")

  // Debounced autosave
  useEffect(() => {
    if (code === playground.code) return

    setStatus("saving")

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      startTransition(async () => {
        await updatePlayground({
          id: playground.id,
          code,
        })
        setStatus("saved")
        // Reset status after 2 seconds
        setTimeout(() => setStatus("idle"), 2000)
      })
    }, 900)
  }, [code, playground.id, playground.code, startTransition])

  function changeLanguage(next:string){
    if(next === language) return

    setLanguage(next)

    startTransition(() => {
      updatePlayground({
        id: playground.id,
        language: next,
      })
    })
  }

 return (
    <div className="flex h-full flex-col gap-3">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        {/* Left: Status */}
        <span className="text-xs text-gray-400">
          {status === "saving" && "Saving…"}
          {status === "saved" && "Saved"}
        </span>

        {/* Right: Language Selector */}
        <select
          value={language}
          onChange={(e) => changeLanguage(e.target.value)}
          className="bg-[#1e1e1e] text-sm text-gray-200 rounded px-2 py-1"
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
        </select>
      </div>

      {/* EDITOR */}
      <div className="flex-1 overflow-hidden rounded-md">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value ?? "")}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            wordWrap: "on",
            smoothScrolling: true,
            cursorSmoothCaretAnimation: "on",
          }}
        />
      </div>
    </div>
  )
}