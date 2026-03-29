import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";

const contactInfo = [
  {
    label: "Visit Us",
    icon: <MapPin strokeWidth={3} stroke="#1c7690" size={16} />,
    value: "place_holder for now",
  },
  {
    label: "Call Us",
    icon: <Phone strokeWidth={3} stroke="#1c7690" size={16} />,
    value: "+(251) 9 345 6789",
  },
  {
    label: "Email Us",
    icon: <Mail strokeWidth={3} stroke="#1c7690" size={16} />,
    value: "abcdxyz@gmail.com",
  },
];

const socialLinks = [
  {
    name: "facebook",
    Icon: Facebook,
  },
  {
    name: "twitter",
    Icon: Twitter,
  },
  {
    name: "instagram",
    Icon: Instagram,
  },
  {
    name: "linkedin",
    Icon: Linkedin,
  },
];

const ContactUs = () => {
  return (
    <div className="min-h-screen w-full bg-white">
      <header className="relative flex h-64 w-full items-center justify-center overflow-hidden bg-white md:h-80">
        <div className="g-size-[32px_32px] absolute inset-0 h-full w-full bg-primary-light bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]"></div>
        <div className="absolute top-[-50%] left-1/2 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-primary opacity-15 blur-[100px]"></div>

        <div className="absolute right-[-10%] bottom-[-20%] h-[250px] w-[250px] rounded-full bg-[#1c7690] opacity-10 blur-[80px]"></div>

        {/* Header Content */}
        <div className="relative z-10 max-w-2xl px-4 text-center space-y-4">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary uppercase md:text-sm">
            We'd love to hear from you
          </span>

          <h1 className="text-4xl font-bold md:text-5xl bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Contact Us
          </h1>

          <p className="mx-auto max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
            Have a question or suggestion? We’re here to help you navigate your
            journey with ease and confidence.
          </p>
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl px-4 text-center md:text-start">
        <section className="mt-3 flex flex-col gap-10 md:mt-15 md:flex-row md:gap-12 lg:mt-25 lg:gap-15">
          <div className="w-full md:w-[75%]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.4335081856325!2d38.81740157402512!3d9.02415939103699!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b9b00494cc865%3A0x4f49120935ffe6ab!2sLamberet%20Menaharia!5e0!3m2!1sen!2set!4v1774782285540!5m2!1sen!2set"
              style={{ border: 0 }}
              loading="lazy"
              aria-hidden="false"
              className="min-h-110 w-full rounded-lg bg-slate-50 shadow-sm"
            ></iframe>
          </div>

          <div className="flex flex-1 flex-col items-center md:items-baseline">
            <h2 className="relative mb-6 inline-block text-xl font-semibold text-[#022539] after:mt-4 after:block after:w-20 after:border after:border-primary sm:text-2xl md:mb-7 md:text-3xl after:md:mt-6 lg:mb-9 after:lg:mt-9">
              Quick Support
            </h2>
            {contactInfo.map(({ icon, label, value }, index) => (
              <div className="mb-7 md:mb-3 lg:mb-7" key={index}>
                <div className="flex flex-col items-center gap-4 md:mb-3 md:flex-row md:items-start lg:mb-0">
                  <div className="mt-2 rounded-full bg-slate-50 p-2 md:bg-transparent md:p-0">
                    {icon}
                  </div>
                  <h4 className="text-base font-semibold text-[#022539]">
                    {label}
                  </h4>
                </div>
                <div className="md:mb-3 md:ml-8">
                  <p className="whitespace-pre-line text-gray-600">{value}</p>
                </div>
              </div>
            ))}
            <div className="flex gap-3 md:mt-5 lg:mt-2">
              {socialLinks.map(({ Icon, name }, index) => (
                <div
                  className="rounded-full bg-primary p-2 transition-all duration-300 hover:-translate-y-1 hover:bg-[#e08919]"
                  key={index}
                >
                  <a href={name} aria-label={name}>
                    <Icon size={18} color="white" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="my-10 md:my-15 lg:my-25">
          <div>
            <h2 className="relative mb-6 inline-block text-xl font-semibold text-[#022539] after:mt-4 after:block after:w-20 after:border after:border-primary sm:text-2xl md:mb-7 md:text-3xl after:md:mt-6 lg:mb-9 after:lg:mt-9">
              Get in touch
            </h2>
            <div className="flex flex-col gap-y-4">
              <input
                type="text"
                placeholder="Name"
                className="rounded border border-transparent bg-[#F6F7FB] p-3 py-3 tracking-wider transition-all duration-300 outline-none placeholder:text-[#8B8B8B] focus:border-[#1c7690] focus:bg-white lg:px-6"
              />
              <input
                type="email"
                placeholder="Email"
                className="rounded border border-transparent bg-[#F6F7FB] p-3 py-3 tracking-wider transition-all duration-300 outline-none placeholder:text-[#8B8B8B] focus:border-[#1c7690] focus:bg-white lg:px-6"
              />
              <textarea
                className="resize-none rounded border border-transparent bg-[#F6F7FB] p-3 py-3 tracking-wider transition-all duration-300 outline-none placeholder:text-[#8B8B8B] focus:border-[#1c7690] focus:bg-white lg:px-6"
                name="message"
                id="message"
                placeholder="Message"
                rows={5}
              ></textarea>
            </div>
            <button
              type="submit"
              className="mt-6 cursor-pointer rounded bg-primary p-2 text-sm font-medium text-white shadow-md transition-all hover:-translate-y-px hover:bg-primary/90 hover:shadow-lg md:text-base lg:mt-5 lg:px-6 lg:py-3"
            >
              Send message
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactUs;
