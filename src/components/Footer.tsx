import { LogoIcon } from "./Icons";

export const Footer = () => {
  return (
    <footer id="footer">
      <hr className="w-11/12 mx-auto" />

      <section className="container py-20 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8">
        <div className="col-span-full xl:col-span-2">
          <a
            rel="noreferrer noopener"
            href="/"
            className="font-bold text-xl flex"
          >
            <LogoIcon />
            PrismaCV
          </a>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Product</h3>
          <div>
            <a
              rel="noreferrer noopener"
              href="#features"
              className="opacity-60 hover:opacity-100"
            >
              Features
            </a>
          </div>

          <div>
            <a
              rel="noreferrer noopener"
              href="#pricing"
              className="opacity-60 hover:opacity-100"
            >
              Pricing
            </a>
          </div>

          <div>
            <button
              type="button"
              className="opacity-60 hover:opacity-100 text-left cursor-pointer"
            >
              Templates
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Resources</h3>
          <div>
            <button
              type="button"
              className="opacity-60 hover:opacity-100 text-left cursor-pointer"
            >
              Career Blog
            </button>
          </div>

          <div>
            <button
              type="button"
              className="opacity-60 hover:opacity-100 text-left cursor-pointer"
            >
              Resume Examples
            </button>
          </div>

          <div>
            <button
              type="button"
              className="opacity-60 hover:opacity-100 text-left cursor-pointer"
            >
              Help Center
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Company</h3>
          <div>
            <button
              type="button"
              className="opacity-60 hover:opacity-100 text-left cursor-pointer"
            >
              About Us
            </button>
          </div>

          <div>
            <button
              type="button"
              className="opacity-60 hover:opacity-100 text-left cursor-pointer"
            >
              Careers
            </button>
          </div>

          <div>
            <a
              rel="noreferrer noopener"
              href="#faq"
              className="opacity-60 hover:opacity-100"
            >
              FAQ
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Legal</h3>
          <div>
            <button
              type="button"
              className="opacity-60 hover:opacity-100 text-left cursor-pointer"
            >
              Privacy Policy
            </button>
          </div>

          <div>
            <button
              type="button"
              className="opacity-60 hover:opacity-100 text-left cursor-pointer"
            >
              Terms of Service
            </button>
          </div>

          <div>
            <button
              type="button"
              className="opacity-60 hover:opacity-100 text-left cursor-pointer"
            >
              Cookie Policy
            </button>
          </div>
        </div>
      </section>

      <section className="container pb-14 text-center">
        <h3>
          &copy; 2025 PrismaCV. All rights reserved.{" "}
        </h3>
      </section>
    </footer>
  );
};
