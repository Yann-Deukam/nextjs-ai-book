
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { steps } from "@/constants";

const LibraryHero = () => {
  return (
    <section className="wrapper pt-8">
      <div className="relative isolate min-h-105 overflow-hidden border border-[#E8CFAE] bg-[#F5DABF] px-7 py-10 sm:px-10 lg:px-14 lg:py-14 rounded-lg mb-10 md:mb-16">
        
        {/* Globe illustration — intentionally cropped */}
        <div className="pointer-events-none absolute bottom-0 right-0 z-0 h-[75%] w-[42%] overflow-hidden">
          <Image
            src="/assets/globe.png"
            alt=""
            width={1000}
            height={1000}
            priority
            className="absolute bottom-[-42%] right-[-45%] h-auto w-[130%] object-contain opacity-20"
          />
        </div>

        <div className="relative z-10 grid min-h-80 grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_340px]">
          
          {/* Hero content */}
          <div className="max-w-2xl">
            <h1 className="font-serif text-4xl font-bold leading-[1.08] tracking-tight text-[#241713] sm:text-5xl lg:text-6xl">
              Your Library
              <span className="block">
                A world of knowledge.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#62534A] sm:text-lg">
              Turn your books into interactive AI conversations.
              Listen, learn, and explore your favorite reads in a whole new way.
            </p>

            <div className="mt-8">
              <Button
                className=" h-14 rounded-sm border border-[#6C151E] bg-[#6C151E] px-7 text-base font-semibold text-white shadow-none transition-colors hover:bg-[#861F2A] hover:text-white"
              >
                <Link href="/upload" className="flex justify-between">
                  <Plus className="mr-2 size-5" />
                  Add new book
                </Link>
              </Button>
            </div>
          </div>

          {/* How it works */}
          <div className="relative z-20 w-full border border-[#E8E0D7] bg-[#FFF8F0] p-6 shadow-[0_8px_30px_rgba(65,40,20,0.06)] sm:p-7">
            <div className="mb-6">
              <h2 className="mt-2 font-serif text-2xl font-bold text-[#241713]">
                How it works
              </h2>
            </div>

            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center border border-[#B9A28B] font-semibold text-[#6C151E]">
                    {step.number}
                  </div>

                  <div className="pt-0.5">
                    <h3 className="font-semibold text-[#241713]">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#76685E]">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LibraryHero;
