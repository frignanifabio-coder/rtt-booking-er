import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ROAD-ER Admin",
  description: "Pannello amministrazione",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}