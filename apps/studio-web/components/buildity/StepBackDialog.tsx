"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

interface StepBackDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onReset: () => void
  onKeep: () => void
}

export function StepBackDialog({ open, onOpenChange, onReset, onKeep }: StepBackDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="rounded-xl bg-card border border-border max-w-sm"
      >
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-foreground">
            이전 스텝으로 이동
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            이전 스텝을 변경하면 이후 스텝의 추천이 달라질 수 있습니다. 이후 스텝을 초기화할까요,
            유지할까요?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton={false} className="bg-transparent border-t-0">
          <button
            onClick={onKeep}
            className="border border-border rounded-xl px-5 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
          >
            유지
          </button>
          <button
            onClick={onReset}
            className="bg-primary text-primary-foreground rounded-xl px-5 py-2.5 text-sm font-display font-bold shadow-sm hover:shadow-md transition-all"
          >
            초기화
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
