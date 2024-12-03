export default function ProgressScreenContentHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <>
      <div className="flex items-center gap-2 text-center text-lg font-semibold text-contrast">
        {title}
      </div>
      {description && (
        <div className="text-center text-sm text-muted-contrast">
          {description}
        </div>
      )}
    </>
  );
}
