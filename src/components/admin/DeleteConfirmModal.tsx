import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title?: string;
  itemName?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLoading?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  title = 'क्या आप इस उत्पाद को हटाना चाहते हैं?',
  itemName,
  onConfirm,
  onCancel,
  confirmLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-md bg-[#181a20] border border-zinc-700 rounded-2xl shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4 mb-4">
          <div className="w-10 h-10 rounded-full bg-rose-950/80 border border-rose-800/80 flex items-center justify-center text-rose-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white leading-snug">
              {title}
            </h3>
            {itemName && (
              <p className="mt-1 text-sm font-semibold text-emerald-400">
                &ldquo;{itemName}&rdquo;
              </p>
            )}
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
              यह प्रक्रिया स्थायी है और इस उत्पाद को वेबसाइट एवं डेटाबेस से हटा देगी।
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
          <button
            onClick={onCancel}
            disabled={confirmLoading}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors cursor-pointer"
          >
            रद्द करें
          </button>
          <button
            onClick={onConfirm}
            disabled={confirmLoading}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors shadow-sm cursor-pointer disabled:opacity-50"
          >
            {confirmLoading ? 'हटाया जा रहा है...' : 'हटाएँ'}
          </button>
        </div>
      </div>
    </div>
  );
};
