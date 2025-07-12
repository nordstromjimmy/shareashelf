"use client";

import { useState } from "react";
import Image from "next/image";

export default function HowItWorksModal() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  const steps = [
    {
      image: "/howitworks/1.png",
      title: "1. Create your digital shelf with ease",
    },
    {
      image: "/howitworks/2.png",
      title: "2. Add your bottles",
    },
    {
      image: "/howitworks/3.png",
      title: "3. Customize and share your shelf with a unique link",
    },
    {
      image: "/howitworks/4.png",
      title: "4. Let people inspect your bottles and read your notes",
    },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setShow(false);
      setStep(0);
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="hover:bg-orange-600 px-4 py-2 mt-4 rounded-lg font-semibold transition shadow z-40 cursor-pointer"
      >
        How it works
      </button>

      {show && (
        <div
          className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50 p-4"
          onClick={() => {
            setShow(false);
            setStep(0);
          }}
        >
          <div
            className="flex flex-col items-center space-y-6 max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {" "}
            <h3 className="text-3xl font-bold text-orange-400 text-center">
              {steps[step].title}
            </h3>
            <Image
              src={steps[step].image}
              alt={steps[step].title}
              width={800}
              height={800}
              className="rounded-lg shadow-lg object-contain w-full max-h-[60vh]"
            />
            <div className="flex justify-between w-full mt-8 space-x-4">
              <button
                onClick={handlePrev}
                disabled={step === 0}
                className={`flex-1 py-3 rounded-lg font-semibold transition text-xl  ${
                  step === 0
                    ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                    : "bg-zinc-800 hover:bg-orange-600 text-white cursor-pointer"
                }`}
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition text-xl cursor-pointer"
              >
                {step === steps.length - 1 ? "Finish" : "Next"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
