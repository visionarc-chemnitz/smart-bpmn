"use client";

import React from 'react';
import FloatingFigures from '@/components/ui/floating-figures';
import { useToggleButton } from '@/hooks/use-toggle-button';

export default function TermsPage() {
  const { toggleButton } = useToggleButton();

  return (
    // Use min-h-screen so the page can grow and let the browser handle scrolling
    <div className="relative min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <FloatingFigures />
      <div className="absolute top-4 right-4">
        {toggleButton()}
      </div>
      <div className="max-w-4xl w-full mx-auto">
        {/* Remove internal scroll: let the whole page scroll instead */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
          <article className="prose dark:prose-dark">
            <h1><strong>Terms and Conditions</strong></h1>
            <p className="text-sm text-gray-500">Effective Date: 05-02-2025</p><br></br>
            <p>
              Welcome to VisionArc! These Terms and Conditions govern your use of our platform.
              By accessing or using Smart BPMN, you agree to comply with these Terms. If you do not agree, please refrain from using our services.
            </p><br></br>
            <h2><strong>1. Use of Third-Party Services</strong></h2>
            <p>
              Smart BPMN integrates third-party services, including but not limited to the Groq API, for processing and functionality. As we do not operate our own servers, the processing of your data is conducted through third-party service providers. By using our platform, you acknowledge and agree to these dependencies and their respective terms.
            </p>
            <p>
              We are not responsible for downtime, performance issues, or data handling policies of third-party services. Users should review Groq API’s terms and privacy policies before using our platform.
            </p><br></br>
            <h2><strong>2. User Responsibilities</strong></h2>
            <p>
              You must use Smart BPMN in compliance with all applicable laws and regulations. You must not misuse, reverse-engineer, or attempt to gain unauthorized access to any part of our platform. You are responsible for ensuring that your uploaded content does not infringe on intellectual property rights, violate privacy laws, or contain harmful content.
            </p><br/>
            <h2><strong>3. Data Privacy & GDPR Compliance
              </strong></h2>
            <p>
              We are committed to protecting your personal data and complying with the General Data Protection Regulation (GDPR). As we rely on third-party providers, we ensure:
            </p>
            <ul className="list-disc list-inside">
              <li>Your data is processed with appropriate security measures.</li>
              <li>Only necessary data is collected to provide the service.</li>
              <li>You have the right to request data deletion, correction, or access to your personal information.</li>
              <li>We do not store your data on our own servers; data processing is handled through external services that comply with GDPR standards.</li>
            </ul><br/>
            <p>
              By using Smart BPMN, you acknowledge that your data may be processed by third-party services outside the EEA, where data protection regulations may differ.
            </p><br></br>
            <h2><strong>4. Limitations of Liability</strong></h2>
            <p>
              Smart BPMN is provided without any warranties, express or implied. We do not guarantee that the platform will be free from errors, uninterrupted, or meet specific user requirements. We are not liable for any loss, damages, or data breaches arising from third-party integrations.
            </p><br/>
            <h2><strong>5. Changes to Terms and Conditions</strong></h2>
            <p>
              We reserve the right to modify these Terms at any time. Any significant changes will be communicated via our platform or email. Continued use of Smart BPMN after changes signifies acceptance of the new terms.
            </p><br/>
            <h2><strong>6. Contact Us</strong></h2>
            <p>
              For any inquiries regarding these Terms, please contact us at{" "}
              <a href="mailto:visionarc.chemnitz@gmail.com" className="text-blue-500">
                visionarc.chemnitz@gmail.com
              </a>.
            </p><br></br>
            <p>
              By using Smart BPMN, you acknowledge and agree to these Terms and Conditions. If you do not agree, please discontinue use of the platform immediately.
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}