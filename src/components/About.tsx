import { Statistics } from "./Statistics";

export const About = () => {
  return (
    <section
      id="about"
      className="container py-24 sm:py-32"
    >
      <div className="bg-muted/50 border rounded-lg py-12">
        <div className="px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
          <img
            src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=300&h=400&fit=crop"
            alt="Professional resume builder"
            className="w-[300px] object-contain rounded-lg"
          />
          <div className="bg-green-0 flex flex-col justify-between">
            <div className="pb-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                  About
                </span>{" "}
                PrismaCV
              </h2>
              <p className="text-xl text-muted-foreground mt-4">
                PrismaCV is your trusted partner in landing your dream job. Our AI-powered
                resume builder helps you create professional, ATS-optimized resumes that
                get you past automated screenings and into the interview room. With
                industry-specific templates and expert guidance, we've helped thousands
                of job seekers successfully land positions at Fortune 500 companies.
              </p>
            </div>

            <Statistics />
          </div>
        </div>
      </div>
    </section>
  );
};
