"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef } from "react";

// Romantic & Professional Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      type: "spring" as const,
      stiffness: 100,
      damping: 20,
    },
  },
};

const headerVariants = {
  hidden: {
    opacity: 0,
    y: -30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 1,
      type: "spring" as const,
      stiffness: 80,
      damping: 15,
    },
  },
};

const floatingVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
    },
  },
};

// Animated Section Component with Romantic Motion
function AnimatedSection({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-150px" }}
      variants={itemVariants}
      transition={{
        delay,
        duration: 0.8,
      }}
      whileHover={{
        scale: 1.01,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
    >
      {children}
    </motion.div>
  );
}

export default function TermsPage() {
  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <div className="legal-container-premium">
      {/* Romantic Background Elements */}
      <div className="legal-background-gradient" />
      <motion.div
        className="romantic-floating-elements"
        variants={floatingVariants}
        animate="animate"
      />

      <motion.div
        className="legal-content-wrapper"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header with Romantic Motion */}
        <motion.div className="legal-header" variants={headerVariants}>
          <motion.div
            whileHover={{
              scale: 1.05,
              y: -3,
            }}
            whileTap={{ scale: 0.98 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
          >
            <Link href="/" className="brand-name">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Anchor
              </motion.span>
            </Link>
          </motion.div>
          <motion.h1
            className="page-title"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 1.2,
              delay: 0.5,
              type: "spring" as const,
              stiffness: 100,
              damping: 15,
            }}
          >
            Terms of Service
          </motion.h1>
          <motion.p
            className="last-updated"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.8,
            }}
          >
            last updated December 6th 2025
          </motion.p>
        </motion.div>

        {/* Content */}
        <div className="legal-content">
          <AnimatedSection>
            <p>
              Welcome to Anchored. Please read these Terms of Service
              (&quot;Terms&quot;) carefully before using the Anchored mobile
              application (the &quot;Service&quot;) operated by Anchored
              (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;).
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Service, you agree to be bound by these
              Terms. If you disagree with any part of the terms, you may not
              access the Service.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <h2>2. Eligibility</h2>
            <p>
              You must be at least 18 years old to use this Service. By using
              the Service, you represent and warrant that:
            </p>
            <ul>
              <li>You are at least 18 years of age</li>
              <li>You have the legal capacity to enter into these Terms</li>
              <li>
                You will comply with these Terms and all applicable local,
                state, national, and international laws
              </li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <h2>3. Account Registration</h2>
          </AnimatedSection>

          <AnimatedSection delay={0.25}>
            <h3>3.1 Account Creation</h3>
            <p>To use Anchored, you must create an account by providing:</p>
            <ul>
              <li>Your phone number for verification</li>
              <li>Your full name</li>
              <li>Your date of birth</li>
              <li>Your location</li>
              <li>Your profession</li>
              <li>Your hometown</li>
              <li>Profile photos</li>
              <li>Optional voice recordings</li>
              <li>Optional height verification</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <h3>3.2 Account Security</h3>
            <p>You are responsible for:</p>
            <ul>
              <li>
                Maintaining the confidentiality of your account credentials
              </li>
              <li>All activities that occur under your account</li>
              <li>
                Notifying us immediately of any unauthorized access or security
                breach
              </li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={0.35}>
            <h3>3.3 Account Accuracy</h3>
            <p>
              You agree to provide accurate, current, and complete information
              during registration and to update such information to keep it
              accurate, current, and complete.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <h2>4. User Conduct</h2>
          </AnimatedSection>

          <AnimatedSection delay={0.45}>
            <h3>4.1 Prohibited Activities</h3>
            <p>You agree NOT to:</p>
            <ul>
              <li>Impersonate any person or entity</li>
              <li>Use the Service for any illegal or unauthorized purpose</li>
              <li>Harass, abuse, or harm another person</li>
              <li>Upload or transmit viruses or malicious code</li>
              <li>Spam or solicit other users for commercial purposes</li>
              <li>
                Collect or harvest any personally identifiable information
              </li>
              <li>
                Use automated systems (bots, scripts, etc.) to access the
                Service
              </li>
              <li>Post false, misleading, or fraudulent content</li>
              <li>Share explicit, offensive, or inappropriate content</li>
              <li>
                Discriminate based on race, religion, gender, sexual
                orientation, or any other protected characteristic
              </li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={0.5}>
            <h3>4.2 Content Standards</h3>
            <p>All content you submit must:</p>
            <ul>
              <li>Be truthful and accurate</li>
              <li>Not violate any third-party rights</li>
              <li>Not contain nudity or sexually explicit material</li>
              <li>Not promote violence or illegal activities</li>
              <li>Comply with all applicable laws</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={0.55}>
            <h2>5. User Content</h2>
          </AnimatedSection>

          <AnimatedSection delay={0.6}>
            <h3>5.1 Ownership</h3>
            <p>
              You retain ownership of any content you submit, post, or display
              on or through the Service (&quot;User Content&quot;).
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.65}>
            <h3>5.2 License Grant</h3>
            <p>
              By submitting User Content, you grant Anchored a worldwide,
              non-exclusive, royalty-free, transferable license to use,
              reproduce, modify, adapt, publish, translate, distribute, and
              display such content in connection with operating and providing
              the Service.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.7}>
            <h3>5.3 Content Removal</h3>
            <p>
              We reserve the right to remove any User Content that violates
              these Terms or is otherwise objectionable, at our sole discretion.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.75}>
            <h3>5.4 Backup and Storage</h3>
            <p>
              While we make reasonable efforts to back up User Content, we are
              not responsible for any loss or corruption of User Content. You
              are solely responsible for maintaining backups of your User
              Content.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.8}>
            <h2>6. Matching and Dating Features</h2>
          </AnimatedSection>

          <AnimatedSection delay={0.85}>
            <h3>6.1 Match Quality</h3>
            <p>
              While we strive to provide quality matches, we do not guarantee:
            </p>
            <ul>
              <li>The accuracy of user profiles</li>
              <li>The behavior or intentions of other users</li>
              <li>That you will find compatible matches</li>
              <li>The success of any relationship</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={0.9}>
            <h3>6.2 User Responsibility</h3>
            <p>You are solely responsible for:</p>
            <ul>
              <li>Your interactions with other users</li>
              <li>Meeting other users in person</li>
              <li>Conducting background checks if desired</li>
              <li>Your personal safety when meeting matches</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={0.95}>
            <h3>6.3 Safety Recommendations</h3>
            <p>We strongly recommend:</p>
            <ul>
              <li>Meeting in public places for first dates</li>
              <li>Informing friends or family of your plans</li>
              <li>Not sharing personal financial information</li>
              <li>Reporting suspicious behavior immediately</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={1.0}>
            <h2>7. Subscriptions and Payments</h2>
          </AnimatedSection>

          <AnimatedSection delay={1.05}>
            <h3>7.1 Premium Features</h3>
            <p>
              Certain features of the Service may require a paid subscription
              (&quot;Premium Subscription&quot;). Current pricing:
            </p>
            <ul>
              <li>Premium Monthly: $25.00/month</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={1.1}>
            <h3>7.2 Billing</h3>
            <ul>
              <li>Subscriptions automatically renew unless cancelled</li>
              <li>You will be charged through your Apple App Store account</li>
              <li>Prices are subject to change with 30 days notice</li>
              <li>No refunds for partial subscription periods</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={1.15}>
            <h3>7.3 Free Tier</h3>
            <p>Free users have access to:</p>
            <ul>
              <li>3 matches per week</li>
              <li>Limited messaging features</li>
              <li>Basic profile features</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={1.2}>
            <h3>7.4 Cancellation</h3>
            <p>
              You may cancel your subscription at any time through your Apple
              App Store account settings. Cancellation takes effect at the end
              of the current billing period.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={1.25}>
            <h2>8. Intellectual Property</h2>
          </AnimatedSection>

          <AnimatedSection delay={1.3}>
            <h3>8.1 Service Ownership</h3>
            <p>
              The Service, including all content, features, and functionality
              (excluding User Content), is owned by Anchored and is protected by
              copyright, trademark, and other intellectual property laws.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={1.35}>
            <h3>8.2 Trademarks</h3>
            <p>
              &quot;Anchored&quot; and the anchor logo are trademarks of
              Anchored. You may not use these trademarks without our prior
              written permission.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={1.4}>
            <h3>8.3 Restrictions</h3>
            <p>You may not:</p>
            <ul>
              <li>Copy, modify, or create derivative works of the Service</li>
              <li>Reverse engineer or decompile the Service</li>
              <li>Remove or modify any copyright or proprietary notices</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={1.45}>
            <h2>9. Privacy</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy,
              which explains how we collect, use, and protect your personal
              information.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={1.5}>
            <h2>10. Third-Party Services</h2>
            <p>
              The Service may contain links to third-party websites or services.
              We are not responsible for:
            </p>
            <ul>
              <li>The content or practices of third-party services</li>
              <li>Your interactions with third-party services</li>
              <li>Any damage or loss caused by third-party services</li>
            </ul>
            <p>Third-party services we use include:</p>
            <ul>
              <li>Supabase (data storage and authentication)</li>
              <li>RevenueCat (subscription management)</li>
              <li>Twilio (SMS verification)</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={1.55}>
            <h2>11. Disclaimer of Warranties</h2>
            <p>
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS
              AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR
              IMPLIED, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul>
              <li>Warranties of merchantability</li>
              <li>Fitness for a particular purpose</li>
              <li>Non-infringement</li>
              <li>Accuracy or reliability</li>
              <li>Uninterrupted or error-free operation</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={1.6}>
            <h2>12. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, ANCHORED SHALL NOT BE
              LIABLE FOR:
            </p>
            <ul>
              <li>
                Indirect, incidental, special, consequential, or punitive
                damages
              </li>
              <li>Loss of profits, revenue, data, or use</li>
              <li>Personal injury or property damage</li>
              <li>
                Damages arising from your use or inability to use the Service
              </li>
              <li>Damages arising from interactions with other users</li>
            </ul>
            <p>
              OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID TO US IN
              THE PAST 12 MONTHS, OR $100, WHICHEVER IS GREATER.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={1.65}>
            <h2>13. Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless Anchored and its
              officers, directors, employees, and agents from any claims,
              damages, liabilities, costs, and expenses (including
              attorneys&apos; fees) arising from:
            </p>
            <ul>
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Your User Content</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={1.7}>
            <h2>14. Termination</h2>
          </AnimatedSection>

          <AnimatedSection delay={1.75}>
            <h3>14.1 Termination by You</h3>
            <p>
              You may terminate your account at any time by contacting us or
              deleting your account through the app.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={1.8}>
            <h3>14.2 Termination by Us</h3>
            <p>
              We may terminate or suspend your account immediately, without
              prior notice, for:
            </p>
            <ul>
              <li>Violation of these Terms</li>
              <li>Fraudulent or illegal activity</li>
              <li>Abusive or harmful behavior</li>
              <li>Any other reason at our sole discretion</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={1.85}>
            <h3>14.3 Effect of Termination</h3>
            <p>Upon termination:</p>
            <ul>
              <li>Your right to use the Service ceases immediately</li>
              <li>Your User Content may be deleted</li>
              <li>Paid subscriptions will not be refunded</li>
              <li>Certain provisions of these Terms survive termination</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={1.9}>
            <h2>15. Dispute Resolution</h2>
          </AnimatedSection>

          <AnimatedSection delay={1.95}>
            <h3>15.1 Governing Law</h3>
            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of the United States, without regard to conflict of law
              provisions.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={2.0}>
            <h3>15.2 Arbitration</h3>
            <p>
              Any disputes arising from these Terms or the Service shall be
              resolved through binding arbitration, except for:
            </p>
            <ul>
              <li>Small claims court matters</li>
              <li>Intellectual property disputes</li>
              <li>Injunctive relief requests</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={2.05}>
            <h3>15.3 Class Action Waiver</h3>
            <p>
              You agree to resolve disputes on an individual basis only. You
              waive any right to participate in class actions or class
              arbitrations.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={2.1}>
            <h2>16. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will
              notify you of material changes by:
            </p>
            <ul>
              <li>Posting the updated Terms in the app</li>
              <li>Sending an email notification (if applicable)</li>
              <li>Displaying a notice in the app</li>
            </ul>
            <p>
              Your continued use of the Service after changes constitutes
              acceptance of the modified Terms.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={2.15}>
            <h2>17. General Provisions</h2>
          </AnimatedSection>

          <AnimatedSection delay={2.2}>
            <h3>17.1 Entire Agreement</h3>
            <p>
              These Terms constitute the entire agreement between you and
              Anchored regarding the Service.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={2.25}>
            <h3>17.2 Severability</h3>
            <p>
              If any provision of these Terms is found to be unenforceable, the
              remaining provisions will remain in full effect.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={2.3}>
            <h3>17.3 Waiver</h3>
            <p>
              Our failure to enforce any right or provision of these Terms will
              not constitute a waiver of such right or provision.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={2.35}>
            <h3>17.4 Assignment</h3>
            <p>
              You may not assign or transfer these Terms without our prior
              written consent. We may assign these Terms without restriction.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={2.4}>
            <h3>17.5 Force Majeure</h3>
            <p>
              We shall not be liable for any failure to perform due to
              circumstances beyond our reasonable control.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={2.45}>
            <h2>18. Contact Information</h2>
            <p>
              If you have questions about these Terms, please contact us at:
            </p>
            <p>
              <strong>Email:</strong> support@anchoredapp.com
              <br />
              <strong>Address:</strong> [Your Company Address]
            </p>
          </AnimatedSection>

          <AnimatedSection delay={2.5}>
            <h2>19. Apple App Store Terms</h2>
            <p>
              These Terms are between you and Anchored only, not with Apple Inc.
              (&quot;Apple&quot;). Apple has no obligation to provide
              maintenance or support services for the Service.
            </p>
            <p>
              In the event of any failure of the Service to conform to any
              applicable warranty:
            </p>
            <ul>
              <li>You may notify Apple for a refund of the purchase price</li>
              <li>Apple has no other warranty obligation</li>
              <li>
                Any other claims, losses, liabilities, damages, costs, or
                expenses are our responsibility
              </li>
            </ul>
            <p>
              Apple and its subsidiaries are third-party beneficiaries of these
              Terms and may enforce these Terms against you.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={2.55}>
            <h2>20. Age Verification</h2>
            <p>
              We reserve the right to verify your age at any time. Failure to
              verify your age may result in account suspension or termination.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={2.6}>
            <h2>21. Background Checks</h2>
            <p>
              WE DO NOT CONDUCT CRIMINAL BACKGROUND CHECKS ON OUR USERS. You are
              solely responsible for conducting any background checks you deem
              necessary.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={2.65}>
            <h2>22. No Guarantee of Results</h2>
            <p>
              We make no guarantees regarding your success in finding matches,
              dates, or relationships through the Service.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={2.7}>
            <hr />
            <p>
              <strong>
                By using Anchored, you acknowledge that you have read,
                understood, and agree to be bound by these Terms of Service.
              </strong>
            </p>
          </AnimatedSection>
        </div>
      </motion.div>
    </div>
  );
}
