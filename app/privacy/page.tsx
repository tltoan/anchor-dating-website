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

export default function PrivacyPage() {
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
            Privacy Policy
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
              Anchored (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is
              committed to protecting your privacy. This Privacy Policy explains
              how we collect, use, disclose, and safeguard your information when
              you use the Anchored mobile application (the &quot;Service&quot;).
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <p>
              Please read this Privacy Policy carefully. By using the Service,
              you agree to the collection and use of information in accordance
              with this policy.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <h2>1. Information We Collect</h2>
          </AnimatedSection>

          <AnimatedSection delay={0.25}>
            <h3>1.1 Information You Provide Directly</h3>
            <p>
              <strong>Account Information:</strong>
            </p>
            <ul>
              <li>Phone number (for authentication)</li>
              <li>Full name</li>
              <li>Date of birth</li>
              <li>Gender (optional)</li>
              <li>Email address (if provided)</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <p>
              <strong>Profile Information:</strong>
            </p>
            <ul>
              <li>Location (city, state)</li>
              <li>Current location (for matching purposes)</li>
              <li>Profession/occupation</li>
              <li>Hometown</li>
              <li>Profile photos (up to 6 photos)</li>
              <li>Voice recordings (optional)</li>
              <li>Height information</li>
              <li>Height verification video (optional)</li>
              <li>Personal interests and characteristics</li>
              <li>Looking for preferences (dating goals)</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={0.35}>
            <p>
              <strong>Communication Data:</strong>
            </p>
            <ul>
              <li>Messages sent through the Service</li>
              <li>Match interactions</li>
              <li>Date activity information</li>
              <li>Application responses</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <p>
              <strong>Payment Information:</strong>
            </p>
            <ul>
              <li>Subscription status</li>
              <li>Purchase history</li>
              <li>
                Payment processing is handled by Apple and RevenueCat; we do not
                store credit card information
              </li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={0.45}>
            <h3>1.2 Information Collected Automatically</h3>
            <p>
              <strong>Device Information:</strong>
            </p>
            <ul>
              <li>Device type and model</li>
              <li>Operating system version</li>
              <li>Unique device identifiers</li>
              <li>Mobile network information</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={0.5}>
            <p>
              <strong>Usage Information:</strong>
            </p>
            <ul>
              <li>App features used</li>
              <li>Time spent on the app</li>
              <li>Screens visited</li>
              <li>Interactions with matches</li>
              <li>Search queries and filters</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={0.55}>
            <p>
              <strong>Location Information:</strong>
            </p>
            <ul>
              <li>
                Precise location (GPS coordinates) when using location-based
                features
              </li>
              <li>General location (city/region) for profile display</li>
              <li>Location history for matching purposes</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={0.6}>
            <p>
              <strong>Technical Data:</strong>
            </p>
            <ul>
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Time zone settings</li>
              <li>App crashes and errors</li>
              <li>Performance data</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={0.65}>
            <h3>1.3 Information from Third Parties</h3>
            <p>
              <strong>Social Media:</strong>
            </p>
            <ul>
              <li>
                If you link your social media accounts, we may collect
                information from those platforms
              </li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={0.7}>
            <p>
              <strong>Authentication Services:</strong>
            </p>
            <ul>
              <li>Phone verification data from Twilio</li>
              <li>Authentication tokens from Supabase</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={0.75}>
            <h2>2. How We Use Your Information</h2>
            <p>We use the collected information for the following purposes:</p>
          </AnimatedSection>

          <AnimatedSection delay={0.8}>
            <h3>2.1 Core Service Functions</h3>
            <ul>
              <li>Create and manage your account</li>
              <li>Provide matching and dating features</li>
              <li>Display your profile to potential matches</li>
              <li>Enable communication with other users</li>
              <li>Process and fulfill date activities</li>
              <li>Verify your identity and age</li>
              <li>Facilitate height verification</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={0.85}>
            <h3>2.2 Service Improvement</h3>
            <ul>
              <li>Analyze usage patterns and trends</li>
              <li>Improve matching algorithms</li>
              <li>Develop new features</li>
              <li>Conduct research and analysis</li>
              <li>Test new functionality</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={0.9}>
            <h3>2.3 Communication</h3>
            <ul>
              <li>Send notifications about matches, messages, and dates</li>
              <li>Provide customer support</li>
              <li>Send service announcements and updates</li>
              <li>Respond to your inquiries</li>
              <li>Request feedback and reviews</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={0.95}>
            <h3>2.4 Safety and Security</h3>
            <ul>
              <li>Detect and prevent fraud</li>
              <li>Monitor for prohibited content</li>
              <li>Enforce our Terms of Service</li>
              <li>Protect user safety</li>
              <li>Resolve disputes</li>
              <li>Comply with legal obligations</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={1.0}>
            <h3>2.5 Marketing and Advertising</h3>
            <ul>
              <li>Send promotional materials (with your consent)</li>
              <li>Provide personalized recommendations</li>
              <li>Analyze effectiveness of marketing campaigns</li>
              <li>Show relevant in-app content</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={1.05}>
            <h3>2.6 Legal Compliance</h3>
            <ul>
              <li>Comply with legal obligations</li>
              <li>Respond to legal requests</li>
              <li>Protect our rights and property</li>
              <li>Prevent illegal activities</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={1.1}>
            <h2>3. How We Share Your Information</h2>
          </AnimatedSection>

          <AnimatedSection delay={1.15}>
            <h3>3.1 With Other Users</h3>
            <p>
              Your profile information is visible to other users for matching
              purposes, including:
            </p>
            <ul>
              <li>Profile photos</li>
              <li>Name (first name only)</li>
              <li>Age</li>
              <li>Location (general area)</li>
              <li>Profession</li>
              <li>Interests and characteristics</li>
              <li>Height (if verified)</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={1.2}>
            <h3>3.2 With Service Providers</h3>
            <p>
              We share information with third-party service providers who
              perform services on our behalf:
            </p>
            <p>
              <strong>Supabase:</strong>
            </p>
            <ul>
              <li>Data storage and hosting</li>
              <li>User authentication</li>
              <li>Database management</li>
              <li>File storage (profile photos, voice recordings)</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={1.25}>
            <p>
              <strong>RevenueCat:</strong>
            </p>
            <ul>
              <li>Subscription management</li>
              <li>Payment processing</li>
              <li>Purchase analytics</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={1.3}>
            <p>
              <strong>Twilio:</strong>
            </p>
            <ul>
              <li>SMS verification</li>
              <li>Phone authentication</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={1.35}>
            <p>
              <strong>Apple:</strong>
            </p>
            <ul>
              <li>App distribution</li>
              <li>In-app purchases</li>
              <li>Push notifications</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={1.4}>
            <h3>3.3 For Legal Reasons</h3>
            <p>We may disclose your information if required to:</p>
            <ul>
              <li>Comply with legal obligations</li>
              <li>Respond to legal requests (subpoenas, court orders)</li>
              <li>Protect our rights and property</li>
              <li>Prevent fraud or illegal activity</li>
              <li>Protect user safety</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={1.45}>
            <h3>3.4 Business Transfers</h3>
            <p>
              In the event of a merger, acquisition, bankruptcy, or sale of
              assets, your information may be transferred to the acquiring
              entity.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={1.5}>
            <h3>3.5 With Your Consent</h3>
            <p>
              We may share your information for other purposes with your
              explicit consent.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={1.55}>
            <h2>4. Data Storage and Security</h2>
          </AnimatedSection>

          <AnimatedSection delay={1.6}>
            <h3>4.1 Data Storage</h3>
            <p>
              Your information is stored on secure servers provided by Supabase.
              Data is stored in:
            </p>
            <ul>
              <li>United States data centers</li>
              <li>Encrypted databases</li>
              <li>Secure cloud storage</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={1.65}>
            <h3>4.2 Security Measures</h3>
            <p>We implement industry-standard security measures, including:</p>
            <ul>
              <li>Encryption in transit (HTTPS/TLS)</li>
              <li>Encryption at rest</li>
              <li>Secure authentication (JWT tokens)</li>
              <li>Regular security audits</li>
              <li>Access controls and authentication</li>
              <li>Firewall protection</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={1.7}>
            <h3>4.3 Data Retention</h3>
            <p>We retain your information:</p>
            <ul>
              <li>While your account is active</li>
              <li>As needed to provide the Service</li>
              <li>As required by law</li>
              <li>To resolve disputes</li>
              <li>To enforce our Terms of Service</li>
            </ul>
            <p>
              You may request deletion of your account and data at any time.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={1.75}>
            <h3>4.4 Security Limitations</h3>
            <p>
              While we strive to protect your information, no method of
              transmission or storage is 100% secure. We cannot guarantee
              absolute security of your data.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={1.8}>
            <h2>5. Your Privacy Rights</h2>
          </AnimatedSection>

          <AnimatedSection delay={1.85}>
            <h3>5.1 Access and Portability</h3>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Request a copy of your data</li>
              <li>Export your data in a portable format</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={1.9}>
            <h3>5.2 Correction and Update</h3>
            <p>You can:</p>
            <ul>
              <li>Update your profile information in the app</li>
              <li>Correct inaccurate data</li>
              <li>Request corrections through customer support</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={1.95}>
            <h3>5.3 Deletion</h3>
            <p>You can:</p>
            <ul>
              <li>Delete your account through the app settings</li>
              <li>Request deletion of specific data</li>
              <li>Request complete data deletion</li>
            </ul>
            <p>
              <strong>Note:</strong> Some information may be retained for legal
              compliance or legitimate business purposes.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={2.0}>
            <h3>5.4 Opt-Out Rights</h3>
            <p>You can opt out of:</p>
            <ul>
              <li>Marketing emails (unsubscribe link provided)</li>
              <li>Push notifications (device settings)</li>
              <li>Location tracking (device settings)</li>
              <li>Certain data collection (app settings)</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={2.05}>
            <h3>5.5 Do Not Sell</h3>
            <p>We do not sell your personal information to third parties.</p>
          </AnimatedSection>

          <AnimatedSection delay={2.1}>
            <h3>5.6 California Privacy Rights (CCPA)</h3>
            <p>If you are a California resident, you have additional rights:</p>
            <ul>
              <li>Right to know what personal information is collected</li>
              <li>
                Right to know if personal information is sold or disclosed
              </li>
              <li>Right to opt-out of sale of personal information</li>
              <li>Right to deletion</li>
              <li>Right to non-discrimination</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={2.15}>
            <h3>5.7 European Privacy Rights (GDPR)</h3>
            <p>
              If you are in the European Economic Area, you have rights under
              GDPR:
            </p>
            <ul>
              <li>Right to access</li>
              <li>Right to rectification</li>
              <li>Right to erasure</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object</li>
              <li>Right to withdraw consent</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={2.2}>
            <h2>6. Children&apos;s Privacy</h2>
            <p>
              The Service is NOT intended for users under 18 years of age. We do
              not knowingly collect information from children under 18.
            </p>
            <p>If we discover that a user is under 18:</p>
            <ul>
              <li>The account will be immediately terminated</li>
              <li>All data will be deleted</li>
              <li>The user will be notified</li>
            </ul>
            <p>
              If you believe a user is under 18, please contact us immediately.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={2.25}>
            <h2>7. Location Information</h2>
          </AnimatedSection>

          <AnimatedSection delay={2.3}>
            <h3>7.1 How We Use Location</h3>
            <p>We collect and use location information to:</p>
            <ul>
              <li>Show you nearby matches</li>
              <li>Display your general location to other users</li>
              <li>Enable location-based features</li>
              <li>Improve matching algorithms</li>
              <li>Verify date check-ins</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={2.35}>
            <h3>7.2 Location Permissions</h3>
            <p>You can control location access through:</p>
            <ul>
              <li>Device settings (iOS Location Services)</li>
              <li>App permissions</li>
              <li>In-app settings</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={2.4}>
            <h3>7.3 Location Precision</h3>
            <ul>
              <li>
                <strong>Precise location:</strong> Used for matching and
                check-ins (GPS coordinates)
              </li>
              <li>
                <strong>General location:</strong> Displayed on your profile
                (city/region)
              </li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={2.45}>
            <h2>8. Photos and Media</h2>
          </AnimatedSection>

          <AnimatedSection delay={2.5}>
            <h3>8.1 Photo Storage</h3>
            <p>Profile photos are:</p>
            <ul>
              <li>Stored securely in Supabase Storage</li>
              <li>Accessible via public URLs (for profile display)</li>
              <li>Subject to Row Level Security policies</li>
              <li>Retained until you delete them or close your account</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={2.55}>
            <h3>8.2 Photo Guidelines</h3>
            <p>All photos must:</p>
            <ul>
              <li>Be of you (the account owner)</li>
              <li>Not contain nudity or explicit content</li>
              <li>Not violate third-party rights</li>
              <li>Comply with our Terms of Service</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={2.6}>
            <h3>8.3 Voice Recordings</h3>
            <p>Voice recordings are:</p>
            <ul>
              <li>Optional profile features</li>
              <li>Stored securely in Supabase Storage</li>
              <li>Used for profile enhancement</li>
              <li>Can be deleted at any time</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={2.65}>
            <h3>8.4 Height Verification Videos</h3>
            <p>Height verification videos are:</p>
            <ul>
              <li>Used solely for height verification</li>
              <li>Processed and then deleted</li>
              <li>Not shared with other users</li>
              <li>Not used for any other purpose</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={2.7}>
            <h2>9. Communications</h2>
          </AnimatedSection>

          <AnimatedSection delay={2.75}>
            <h3>9.1 Service Communications</h3>
            <p>We may send you:</p>
            <ul>
              <li>Account notifications</li>
              <li>Match notifications</li>
              <li>Message alerts</li>
              <li>Date reminders</li>
              <li>Security alerts</li>
              <li>Policy updates</li>
            </ul>
            <p>
              These communications are necessary for the Service and cannot be
              opted out of while maintaining an account.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={2.8}>
            <h3>9.2 Marketing Communications</h3>
            <p>We may send you:</p>
            <ul>
              <li>Promotional offers</li>
              <li>Feature announcements</li>
              <li>Tips and recommendations</li>
              <li>Surveys and feedback requests</li>
            </ul>
            <p>You can opt out of marketing communications at any time.</p>
          </AnimatedSection>

          <AnimatedSection delay={2.85}>
            <h3>9.3 Push Notifications</h3>
            <p>You can control push notifications through:</p>
            <ul>
              <li>Device settings</li>
              <li>App notification preferences</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={2.9}>
            <h2>10. Cookies and Tracking</h2>
          </AnimatedSection>

          <AnimatedSection delay={2.95}>
            <h3>10.1 Cookies</h3>
            <p>We use cookies and similar technologies to:</p>
            <ul>
              <li>Maintain your session</li>
              <li>Remember your preferences</li>
              <li>Analyze usage patterns</li>
              <li>Improve performance</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={3.0}>
            <h3>10.2 Analytics</h3>
            <p>We use analytics tools to understand:</p>
            <ul>
              <li>How users interact with the app</li>
              <li>Which features are most popular</li>
              <li>Where improvements are needed</li>
              <li>App performance metrics</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={3.05}>
            <h3>10.3 Third-Party Tracking</h3>
            <p>
              Our third-party service providers may use their own tracking
              technologies.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={3.1}>
            <h2>11. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries
              other than your own. By using the Service, you consent to such
              transfers.
            </p>
            <p>
              We ensure appropriate safeguards are in place for international
              transfers, including:
            </p>
            <ul>
              <li>Standard contractual clauses</li>
              <li>Privacy Shield frameworks (where applicable)</li>
              <li>Adequate data protection measures</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={3.15}>
            <h2>12. Changes to Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will
              be communicated through:
            </p>
            <ul>
              <li>In-app notifications</li>
              <li>Email notifications (if applicable)</li>
              <li>Updated &quot;Last Updated&quot; date</li>
            </ul>
            <p>
              Your continued use of the Service after changes constitutes
              acceptance of the updated Privacy Policy.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={3.2}>
            <h2>13. Data Breach Notification</h2>
            <p>
              In the event of a data breach that affects your personal
              information:
            </p>
            <ul>
              <li>We will notify affected users promptly</li>
              <li>We will notify relevant authorities as required by law</li>
              <li>We will take immediate steps to mitigate the breach</li>
              <li>
                We will provide information on protective measures you can take
              </li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={3.25}>
            <h2>14. Your Responsibilities</h2>
            <p>You are responsible for:</p>
            <ul>
              <li>Keeping your account credentials secure</li>
              <li>Not sharing your account with others</li>
              <li>Reporting security concerns promptly</li>
              <li>Using the Service in compliance with our Terms</li>
              <li>
                Protecting your own privacy when interacting with other users
              </li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={3.3}>
            <h2>15. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or wish to
              exercise your privacy rights, please contact us:
            </p>
            <p>
              <strong>Email:</strong> privacy@anchoredapp.com
              <br />
              <strong>Support Email:</strong> support@anchoredapp.com
              <br />
              <strong>Address:</strong> [Your Company Address]
            </p>
            <p>
              <strong>For GDPR requests:</strong> gdpr@anchoredapp.com
              <br />
              <strong>For CCPA requests:</strong> ccpa@anchoredapp.com
            </p>
          </AnimatedSection>

          <AnimatedSection delay={3.35}>
            <h2>16. Specific Disclosures</h2>
          </AnimatedSection>

          <AnimatedSection delay={3.4}>
            <h3>16.1 Information We Collect (Summary)</h3>
            <div className="legal-table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Examples</th>
                    <th>Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Identifiers</td>
                    <td>Name, phone number, device ID</td>
                    <td>Account creation, authentication</td>
                  </tr>
                  <tr>
                    <td>Demographics</td>
                    <td>Age, gender, location</td>
                    <td>Matching, profile display</td>
                  </tr>
                  <tr>
                    <td>Commercial</td>
                    <td>Subscription status, purchases</td>
                    <td>Billing, service provision</td>
                  </tr>
                  <tr>
                    <td>Location</td>
                    <td>GPS coordinates, city/region</td>
                    <td>Matching, location-based features</td>
                  </tr>
                  <tr>
                    <td>User Content</td>
                    <td>Photos, messages, voice recordings</td>
                    <td>Profile display, communication</td>
                  </tr>
                  <tr>
                    <td>Usage Data</td>
                    <td>App interactions, preferences</td>
                    <td>Service improvement, analytics</td>
                  </tr>
                  <tr>
                    <td>Device Data</td>
                    <td>Device type, OS version, IP address</td>
                    <td>Technical support, security</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={3.45}>
            <h3>16.2 Categories of Third Parties</h3>
            <p>We share information with:</p>
            <ul>
              <li>Service providers (Supabase, RevenueCat, Twilio)</li>
              <li>Platform providers (Apple)</li>
              <li>Analytics providers</li>
              <li>Legal authorities (when required)</li>
              <li>Other users (profile information only)</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={3.5}>
            <h3>16.3 Business Purpose Disclosures</h3>
            <p>
              In the past 12 months, we have disclosed the following categories
              for business purposes:
            </p>
            <ul>
              <li>Identifiers (to service providers)</li>
              <li>Device data (to service providers)</li>
              <li>Usage data (to analytics providers)</li>
              <li>Commercial data (to payment processors)</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection delay={3.55}>
            <h3>16.4 Sales of Personal Information</h3>
            <p>
              <strong>We do not sell personal information.</strong>
            </p>
          </AnimatedSection>

          <AnimatedSection delay={3.6}>
            <h2>17. Automated Decision Making</h2>
            <p>We use automated systems for:</p>
            <ul>
              <li>Matching algorithms</li>
              <li>Content moderation</li>
              <li>Fraud detection</li>
              <li>Spam filtering</li>
            </ul>
            <p>
              You have the right to request human review of automated decisions
              that significantly affect you.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={3.65}>
            <h2>18. Aggregated and Anonymized Data</h2>
            <p>
              We may use aggregated or anonymized data that cannot identify you
              for:
            </p>
            <ul>
              <li>Research and analysis</li>
              <li>Public reporting</li>
              <li>Service improvement</li>
              <li>Product development</li>
            </ul>
            <p>This data is not subject to this Privacy Policy.</p>
          </AnimatedSection>

          <AnimatedSection delay={3.7}>
            <hr />
            <p>
              <strong>
                By using Anchored, you acknowledge that you have read and
                understood this Privacy Policy.
              </strong>
            </p>
          </AnimatedSection>
        </div>
      </motion.div>
    </div>
  );
}
