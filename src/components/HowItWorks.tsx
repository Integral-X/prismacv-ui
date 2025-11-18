import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { MedalIcon, MapIcon, PlaneIcon, GiftIcon } from "../components/Icons";

interface FeatureProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

const features: FeatureProps[] = [
  {
    icon: <MedalIcon />,
    title: "Choose Template",
    description:
      "Select from our collection of professional, industry-specific resume templates designed by experts",
  },
  {
    icon: <MapIcon />,
    title: "Add Your Info",
    description:
      "Fill in your experience, skills, and education with our smart suggestions and AI-powered content",
  },
  {
    icon: <PlaneIcon />,
    title: "Customize Design",
    description:
      "Personalize colors, fonts, and layout to match your style while maintaining ATS compatibility",
  },
  {
    icon: <GiftIcon />,
    title: "Download & Apply",
    description:
      "Export your resume in PDF format and start applying to your dream jobs with confidence",
  },
];

export const HowItWorks = () => {
  return (
    <section
      id="howItWorks"
      className="container text-center py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold ">
        How It{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Works{" "}
        </span>
        in 4 Simple Steps
      </h2>
      <p className="md:w-3/4 mx-auto mt-4 mb-8 text-xl text-muted-foreground">
        Create your professional resume in minutes with our intuitive builder
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map(({ icon, title, description }: FeatureProps) => (
          <Card
            key={title}
            className="bg-muted/50"
          >
            <CardHeader>
              <CardTitle className="grid gap-4 place-items-center">
                {icon}
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>{description}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
