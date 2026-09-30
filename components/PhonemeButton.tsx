"use client";

type PhonemeButtonProps = {
  symbol: string;
  label: string;
  example: string;
  onClick: (symbol: string) => void;
};

export default function PhonemeButton({
  symbol,
  label,
  example,
  onClick,
}: PhonemeButtonProps) {
  return (
    <div className="phoneme-button-wrapper">
      <button
        type="button"
        className="phoneme-button"
        onClick={() => onClick(symbol)}
        aria-label={`${symbol}, ${label}, as in ${example}`}
      >
        {symbol}
      </button>

      <div className="phoneme-tooltip" role="tooltip">
        <strong>{label}</strong>
        <span>as in {example}</span>
      </div>
    </div>
  );
}