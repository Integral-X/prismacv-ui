import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TestimonialProps {
  image: string;
  name: string;
  userName: string;
  comment: string;
}

const testimonials: TestimonialProps[] = [
  {
    image: "https://github.com/shadcn.png",
    name: "Sarah Johnson",
    userName: "@sarahj_tech",
    comment: "PrismaCV helped me land my dream job at Google! The ATS optimization made all the difference.",
  },
  {
    image: "https://github.com/shadcn.png",
    name: "Michael Chen",
    userName: "@mchen_dev",
    comment:
      "The AI-powered suggestions helped me highlight my achievements better. Got 3 interview calls in the first week!",
  },

  {
    image: "https://github.com/shadcn.png",
    name: "Emily Rodriguez",
    userName: "@emily_designs",
    comment:
      "As a designer, I loved the customization options. My resume looked professional and stood out. Highly recommend PrismaCV!",
  },
  {
    image: "https://github.com/shadcn.png",
    name: "David Park",
    userName: "@davidp_pm",
    comment:
      "The resume score feature is incredible. It helped me improve my resume before applying and I got much better response rates.",
  },
  {
    image: "https://github.com/shadcn.png",
    name: "Jessica Thompson",
    userName: "@jess_marketing",
    comment:
      "From unemployed to employed in 2 weeks! PrismaCV's templates are clean and professional. Worth every penny!",
  },
  {
    image: "https://github.com/shadcn.png",
    name: "Alex Kumar",
    userName: "@alex_data",
    comment:
      "Best resume builder I've used. The industry-specific templates and real-time preview saved me so much time.",
  },
];

export const Testimonials = () => {
  return (
    <section
      id="testimonials"
      className="container py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold">
        Discover Why
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          {" "}
          Job Seekers Love{" "}
        </span>
        PrismaCV
      </h2>

      <p className="text-xl text-muted-foreground pt-4 pb-8">
        Hear from our users who successfully landed their dream jobs with our platform
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 sm:block columns-2  lg:columns-3 lg:gap-6 mx-auto space-y-4 lg:space-y-6">
        {testimonials.map(
          ({ image, name, userName, comment }: TestimonialProps) => (
            <Card
              key={userName}
              className="max-w-md md:break-inside-avoid overflow-hidden"
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar>
                  <AvatarImage
                    alt=""
                    src={image}
                  />
                  <AvatarFallback>OM</AvatarFallback>
                </Avatar>

                <div className="flex flex-col">
                  <CardTitle className="text-lg">{name}</CardTitle>
                  <CardDescription>{userName}</CardDescription>
                </div>
              </CardHeader>

              <CardContent>{comment}</CardContent>
            </Card>
          )
        )}
      </div>
    </section>
  );
};
