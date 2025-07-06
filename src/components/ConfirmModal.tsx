"use client";

import { useState } from "react";

export default function ConfirmModal({
  onConfirm,
  title,
  message,
  confirmText = "Yes",
  children,
}: {
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <span onClick={() => setOpen(true)}>{children}</span>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-800 p-6 rounded-xl max-w-sm w-full text-center">
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            <p className="text-zinc-300 mb-6">{message}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-zinc-600 hover:bg-zinc-700 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  setOpen(false);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded cursor-pointer"
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
