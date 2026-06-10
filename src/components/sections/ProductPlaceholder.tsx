// ─── Product Placeholder — Grey placeholder when no image is available ────

interface Props {
  label: string;
}

export default function ProductPlaceholder({ label }: Props) {
  return (
    <div className="h-full w-full flex items-center justify-center text-gray-400 font-medium bg-gradient-to-br from-gray-100 to-gray-200 text-sm px-2 text-center">
      <span className="truncate">{label}</span>
    </div>
  );
}
