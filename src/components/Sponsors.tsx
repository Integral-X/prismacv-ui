import { Radar } from "lucide-react";

interface SponsorProps {
  icon: JSX.Element;
  name: string;
}

const sponsors: SponsorProps[] = [
  {
    icon: <Radar size={34} />,
    name: "Google",
  },
  {
    icon: <Radar size={34} />,
    name: "Microsoft",
  },
  {
    icon: <Radar size={34} />,
    name: "Amazon",
  },
  {
    icon: <Radar size={34} />,
    name: "Apple",
  },
  {
    icon: <Radar size={34} />,
    name: "Meta",
  },
  {
    icon: <Radar size={34} />,
    name: "Netflix",
  },
];

export const Sponsors = () => {
  return (
    <section
      id="sponsors"
      className="container pt-24 sm:py-32"
    >
      <h2 className="text-center text-md lg:text-xl font-bold mb-8 text-primary">
        Trusted by Job Seekers at Top Companies
      </h2>

      <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
        {sponsors.map(({ icon, name }: SponsorProps) => (
          <div
            key={name}
            className="flex items-center gap-1 text-muted-foreground/60"
          >
            <span>{icon}</span>
            <h3 className="text-xl  font-bold">{name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};
