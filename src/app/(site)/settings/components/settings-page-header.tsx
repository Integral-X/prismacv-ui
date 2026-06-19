interface SettingsPageHeaderProps {
  title: string;
  description: string;
}

export function SettingsPageHeader({
  title,
  description,
}: SettingsPageHeaderProps) {
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-bold text-content-primary">{title}</h1>
      <p className="mt-1 text-sm text-content-secondary">{description}</p>
    </header>
  );
}
