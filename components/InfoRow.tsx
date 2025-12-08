export default function InfoRow({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-md font-medium">{value ?? "N/A"}</p>
    </div>
  );
}
