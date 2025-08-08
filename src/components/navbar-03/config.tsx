import {
  PlaneTakeoff,
  Images,
  Handshake,
  TriangleAlert,
  MessageCircleQuestionMark,
  MapPin,
} from "lucide-react";

export const arrAboutUs = [
  {
    title: "Itinerario",
    icon: PlaneTakeoff,
    description: "Lista de nuestro itinerario de Vuelos.",
    href: "#",
  },
  {
    title: "Galeria",
    icon: Images,
    description: "Nuestra galeria de Imagenes.",
    href: "/image-gallery",
  },
  {
    title: "Terminos y Condiciones",
    icon: Handshake,
    description: "Nuestros terminos de reservacion y politicas internas.",
    href: "/terms-conditions",
  },
  {
    title: "Mercancias Peligrosas",
    icon: TriangleAlert,
    description: "Te mostramos los productos y objetos considerados Peligrosas por el AHAC.",
    href: "#",
  },
  {
    title: "Preguntas Frecuentes",
    icon: MessageCircleQuestionMark,
    description: "Revisa la lista de preguntas frecuentes.",
    href: "#",
  }
];

export const arrDestinations = [
  {
    title: "Honduras",
    icon: MapPin,
    description: "Rica en cultura, naturaleza exuberante y gente cálida.",
  },
  {
    title: "Mexico",
    icon: MapPin,
    description: "Historia milenaria, sabores intensos y tradiciones profundamente vivas.",
  },
];
