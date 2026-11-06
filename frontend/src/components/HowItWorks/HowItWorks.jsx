import {
  ArrowRight,
  Car,
  ClipboardList,
  ShoppingBag,
  Utensils,
} from "lucide-react";

import "./HowItWorks.css";


const steps = [
  {
    number: "01",
    title: "Choose\nYour Food",
    description:
      "Browse our menu and add your favourites.",
    Icon: Utensils,
  },
  {
    number: "02",
    title: "Place\nYour Order",
    description:
      "Quick and easy, no account needed.",
    Icon: ShoppingBag,
  },
  {
    number: "03",
    title: "Track\nYour Order",
    description:
      "Use your order number to check the status.",
    Icon: ClipboardList,
  },
  {
    number: "04",
    title: "Pick It Up",
    description:
      "When it’s ready, come and enjoy!",
    Icon: Car,
  },
];


function HowItWorks() {
  return (
    <section className="how-it-works">
      <div className="how-it-works-container">

        <div className="how-it-works-heading">
          <span>SIMPLE STEPS</span>

          <h2>How It Works</h2>
        </div>


        <div className="how-it-works-steps">

          {steps.map((step, index) => {
            const Icon = step.Icon;

            return (
              <div
                className="how-step-wrapper"
                key={step.number}
              >
                <article className="how-step">

                  <div className="how-step-icon">
                    <Icon
                      size={42}
                      strokeWidth={1.35}
                      aria-hidden="true"
                    />
                  </div>


                  <div className="how-step-content">

                    <span className="how-step-number">
                      {step.number}
                    </span>


                    <div className="how-step-title">
                      <h3>
                        {step.title
                          .split("\n")
                          .map((line, index) => (
                            <span key={index}>
                              {line}
                            </span>
                          ))}
                      </h3>
                    </div>


                    <p>
                      {step.description}
                    </p>

                  </div>

                </article>


                {index < steps.length - 1 && (
                  <span
                    className="how-step-arrow"
                    aria-hidden="true"
                  >
                    <ArrowRight
                      size={20}
                      strokeWidth={1.4}
                    />
                  </span>
                )}

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}


export default HowItWorks;