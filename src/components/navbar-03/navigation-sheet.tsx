import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { arrAboutUs, arrDestinations } from "./config";
import { Logo } from "./logo";

export const NavigationSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <Logo />

        <div className="mt-12 text-base space-y-4">
          <Link href="#">Inicio</Link>

          <div>
            <div className="font-bold">Quienes Somos</div>
            <ul className="mt-2 space-y-3 ml-1 pl-4 border-l">
              {arrAboutUs.map((aboutUs) => (
                <li key={aboutUs.title}>
                  <Link href="#" className="flex items-center gap-2">
                    <aboutUs.icon className="h-5 w-5 mr-2 text-muted-foreground" />
                    {aboutUs.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-bold">Destinos</div>
            <ul className="mt-2 space-y-3 ml-1 pl-4 border-l">
              {arrDestinations.map((destinations) => (
                <li key={destinations.title}>
                  <Link href="#" className="flex items-center gap-2">
                    <destinations.icon className="h-5 w-5 mr-2 text-muted-foreground" />
                    {destinations.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <Link href="#">Contactenos</Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};
