import Link from "next/link";
import Image from "next/image";
import LandingFooter from "@/components/LandingFooter";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-white font-dm-serif-display">
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 lg:px-14 backdrop-blur-md"
        style={{ paddingLeft: "1rem", paddingRight: "1rem" }}
      >
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/anchor-header-logo.png"
            alt="Anchor"
            width={64}
            height={64}
            className="rounded-2xl"
            style={{ boxShadow: "7px 10px 6.8px 0px #00000040" }}
          />
        </Link>
        <Link
          href="/events"
          className="text-lg font-bold text-neutral-700 hover:text-black transition-colors"
        >
          Events
        </Link>
      </header>
      {children}
      <LandingFooter />
    </div>
  );
}
