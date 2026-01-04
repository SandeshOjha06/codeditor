"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useTransition } from "react"
import { updatePlayground } from "./actions"

export default function SidebarList({ playgrounds }: { playgrounds: any[] }) {
  const pathname = usePathname()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [, startTransition] = useTransition()

  function startEdit(pg: any) {
    setEditingId(pg.id)
    setTitle(pg.title ?? "")
  }

  function save(id: string) {
    if (!title.trim()) return setEditingId(null)

    startTransition(async () => {
      await updatePlayground({ id, title })
      setEditingId(null)
    })
  }

  return (
    <div className="flex-1 overflow-auto px-2 py-3">
      <ul className="space-y-1">
        {playgrounds.map((pg) => {
          const isActive = pathname === `/dashboard/${pg.id}`

          return (
            <li key={pg.id}>
              {editingId === pg.id ? (
                <input
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => save(pg.id)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && save(pg.id)
                  }
                  className="w-full rounded bg-gray-800 px-3 py-2 text-sm text-gray-200 outline-none"
                />
              ) : (
                <Link
                  href={`/dashboard/${pg.id}`}
                  onDoubleClick={(e) => {
                    e.preventDefault()
                    startEdit(pg)
                  }}
                  className={`
                    block rounded-md px-3 py-2 text-sm transition
                    ${
                      isActive
                        ? "bg-blue-600/20 text-blue-400"
                        : "text-gray-300 hover:bg-gray-800"
                    }
                  `}
                >
                  <div className="truncate font-medium">
                    {pg.title ?? "Untitled Playground"}
                  </div>
                  <div className="truncate text-xs text-gray-500">
                    {pg.language ?? "Unknown"}
                  </div>
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
