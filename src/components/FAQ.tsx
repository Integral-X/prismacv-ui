import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "Is PrismaCV really free to use?",
    answer: "Yes! We offer a free plan that includes basic templates and PDF downloads. You can create your first resume without any payment.",
    value: "item-1",
  },
  {
    question: "What makes PrismaCV resumes ATS-friendly?",
    answer:
      "Our templates are designed with Applicant Tracking Systems in mind. We use proper formatting, standard fonts, and clear section headers that ATS software can easily parse and read.",
    value: "item-2",
  },
  {
    question:
      "Can I edit my resume after downloading it?",
    answer:
      "Yes! You can return to PrismaCV anytime to edit your resume. Your work is automatically saved, and you can download updated versions whenever needed.",
    value: "item-3",
  },
  {
    question: "How does the AI-powered content suggestion work?",
    answer: "Our AI analyzes your job title and industry to suggest relevant skills, achievements, and action verbs that make your resume more impactful.",
    value: "item-4",
  },
  {
    question:
      "What file formats can I download my resume in?",
    answer:
      "You can download your resume as a PDF, which is the most widely accepted format by employers. Our Premium plan also includes Word document exports.",
    value: "item-5",
  },
];

export const FAQ = () => {
  return (
    <section
      id="faq"
      className="container py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Frequently Asked{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Questions
        </span>
      </h2>

      <Accordion
        type="single"
        collapsible
        className="w-full AccordionRoot"
      >
        {FAQList.map(({ question, answer, value }: FAQProps) => (
          <AccordionItem
            key={value}
            value={value}
          >
            <AccordionTrigger className="text-left">
              {question}
            </AccordionTrigger>

            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h3 className="font-medium mt-4">
        Still have questions?{" "}
        <a
          rel="noreferrer noopener"
          href="#"
          className="text-primary transition-all border-primary hover:border-b-2"
        >
          Contact us
        </a>
      </h3>
    </section>
  );
};
