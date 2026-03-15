"use client";

interface ModerationBannerProps {
  message: string;
  onTryAgain?: () => void;
}

export default function ModerationBanner({ message, onTryAgain }: ModerationBannerProps) {
  const content = (
    <>
      <p
        className="text-center text-2xl font-bold uppercase tracking-[-1px] text-black md:text-3xl"
        style={{ fontFamily: '"Arial Black", "Arial Bold", Arial, sans-serif' }}
      >
        {message}
      </p>
      {onTryAgain && (
        <span
          className="text-[12px] font-bold uppercase text-black"
          style={{ fontFamily: "Arial, sans-serif" }}
        >
          TRY AGAIN
        </span>
      )}
    </>
  );

  return (
    <div className="flex justify-center">
      {onTryAgain ? (
        <button
          type="button"
          onClick={onTryAgain}
          className="flex aspect-square w-full max-w-[min(40vh,360px)] cursor-pointer flex-col items-center justify-center gap-4 rounded-none border-0 bg-gray-200 px-4 py-8 text-left transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-offset-2"
          role="alert"
          aria-label="Error. Click anywhere to try again"
        >
          {content}
        </button>
      ) : (
        <div
          role="alert"
          className="flex aspect-square w-full max-w-[min(40vh,360px)] flex-col items-center justify-center gap-4 rounded-none bg-gray-200 px-4 py-8"
        >
          {content}
        </div>
      )}
    </div>
  );
}
