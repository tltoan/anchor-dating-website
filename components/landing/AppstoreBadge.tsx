import Link from "next/link";
import Image from "next/image";

const appstoreLink =
  "https://apps.apple.com/us/app/anchor-dating-first/id6757112248";

export default function AppStoreBadge() {
  return (
    <Link href={appstoreLink} className="inline-block" target="_blank">
      <Image
        src="/Download_on_the_App_Store_Badge.png"
        alt="App Store Badge"
        width={200}
        height={200}
      />
    </Link>
  );
}
