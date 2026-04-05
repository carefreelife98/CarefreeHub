"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (label: string) => void
}

export function ChipInput({ open, onOpenChange, onAdd }: Props) {
  const [value, setValue] = useState("")

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setValue("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="rounded-xl bg-card border border-border max-w-sm"
      >
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-foreground">직접 입력</DialogTitle>
        </DialogHeader>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="칩 내용을 입력하세요"
          className="rounded-lg h-10 border-border bg-card text-foreground"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit()
          }}
          autoFocus
        />
        <DialogFooter showCloseButton={false} className="bg-transparent border-t-0">
          <button
            onClick={() => onOpenChange(false)}
            className="border border-border rounded-xl px-5 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!value.trim()}
            className="bg-primary text-primary-foreground rounded-xl px-5 py-2.5 text-sm font-display font-bold shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            추가
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
