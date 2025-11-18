import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FeatureProps {
  title: string;
  description: string;
  image: string;
}

const features: FeatureProps[] = [
  {
    title: "ATS-Friendly Templates",
    description:
      "Our templates are designed to pass Applicant Tracking Systems, ensuring your resume gets seen by human recruiters.",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=300&h=300&fit=crop",
  },
  {
    title: "Smart Content Suggestions",
    description:
      "AI-powered recommendations help you write compelling bullet points and highlight your achievements effectively.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=300&fit=crop",
  },
  {
    title: "Real-Time Score Analysis",
    description:
      "Get instant feedback on your resume with our scoring system that analyzes keywords, format, and content quality.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=300&fit=crop",
  },
];

const featureList: string[] = [
  "ATS-Optimized",
  "AI-Powered",
  "Industry Templates",
  "Real-time Preview",
  "PDF Export",
  "Multiple Formats",
  "Easy Customization",
  "Mobile Friendly",
  "Professional Design",
];

export const Features = () => {
  return (
    <section
      id="features"
      className="container py-24 sm:py-32 space-y-8"
    >
      <h2 className="text-3xl lg:text-4xl font-bold md:text-center">
        Powerful{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Resume Features
        </span>
      </h2>

      <div className="flex flex-wrap md:justify-center gap-4">
        {featureList.map((feature: string) => (
          <div key={feature}>
            <Badge
              variant="secondary"
              className="text-sm"
            >
              {feature}
            </Badge>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map(({ title, description, image }: FeatureProps) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>

            <CardContent>{description}</CardContent>

            <CardFooter>
              <img
                src={image}
                alt="About feature"
                className="w-[200px] lg:w-[300px] mx-auto"
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
