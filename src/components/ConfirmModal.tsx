"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle } from "lucide-react"

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  isDestructive?: boolean
  isLoading?: boolean
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = true,
  isLoading = false,
}: ConfirmModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            {isDestructive && (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
            )}
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription className="mt-2 text-gray-600">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-bold uppercase tracking-wide text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={
              isDestructive
                ? "bg-red-600 text-white px-6 py-2 text-sm font-bond uppercase tracking-wide hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                : "bg-gray-900 text-white px-6 py-2 text-sm font-bold uppercase tracking-wide hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            }
          >
            {isLoading && (
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            {isLoading ? "Processing..." : confirmText}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
