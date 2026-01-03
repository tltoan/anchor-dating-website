"use client";

import ScrollAnimatedLanding from "@/components/ScrollAnimatedLanding";

export default function LandingPageRoute() {
  const handleJoinWaitlist = (email: string) => {
    // Handle waitlist signup
    console.log("User joined waitlist:", email);
    // You can add API call here to save the email
  };

  return (
    <ScrollAnimatedLanding
      onJoinWaitlist={handleJoinWaitlist}
      startOffset={0}
      endOffset={1500}
    />
  );
}
