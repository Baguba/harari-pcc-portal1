"use client";

import {
  Factory,
  Package,
  ShoppingBag,
  Wrench,
  Ship,
  Plane,
  Mail,
  Radio,
  Code,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  Factory,
  Package,
  ShoppingBag,
  Wrench,
  Ship,
  Plane,
  Mail,
  Radio,
  Code,
  Lightbulb,
};

export function ActivityIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = map[name] ?? Package;
  return <Icon className={className} aria-hidden />;
}
