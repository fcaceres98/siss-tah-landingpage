import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CircleCheck } from "lucide-react";

const plans = [
  {
    name: "HN Palmerola - MX Felipe Angeles",
    price: 480,
    isRecommended: true,
    description:
      "Vuelo ida y vuelta saliendo de HN Palmerola.",
    features: [
      "3 horas de vuelo",
      "1 equipaje de mano 10LB",
      "1 equipaje gratis en carga",
      "Salida desde palmerola 9:00 AM",
      "Salida desde Felipe Angeles 12:40 PM",
    ],
    buttonText: "Reservar Ahora",
    isPopular: true,
  },
];

const Pricing01 = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-6 bg-accent">
      <h1 className="text-5xl font-bold text-center tracking-tight">Precios</h1>
      <div className="mt-12 max-w-screen-lg mx-auto grid grid-cols-1  lg:grid-cols-1 gap-8">
        {plans.map((plan) => (
          <div key={plan.name} className="border rounded-lg p-6 bg-background">
            <h3 className="text-lg font-medium">{plan.name}</h3>
            <p className="mt-2 text-4xl font-bold">${plan.price}</p>
            <p className="mt-4 font-medium text-muted-foreground">
              {plan.description}
            </p>
            <Separator className="my-4" />
            <ul className="space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <CircleCheck className="h-4 w-4 mt-1 text-green-600" />{" "}
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              variant={plan.isPopular ? "default" : "outline"}
              size="lg"
              className="w-full mt-6"
            >
              {plan.buttonText}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing01;
