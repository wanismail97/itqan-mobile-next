// ─── Product Placeholder — Grey placeholder when no image is available ────

interface Props {
  label: string;
}

export default function ProductPlaceholder({ label }: Props) {
  return (
    <div className="h-full w-full flex items-center justify-center text-gray-500 font-medium bg-gray-300">
      {label}
    </div>
  );
}
