import React from 'react';

const PrivacyPolicyPage = () => {

  const lastUpdated = "23rd April 2025";
  const meetupLocation = "[insert your meetup location or city]";

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Privacy Policy</h1>
      <p className="mb-6 text-sm text-gray-600">
        <em>Last updated: {lastUpdated}</em>
      </p>

      <p className="mb-4">
        {'Frontend Leeds ("we", "our", or "us") is committed to protecting your privacy.'}
      </p>

      <h2 className="mt-6 mb-3 text-2xl font-semibold">Information We Collect</h2>
      <ul className="mb-4 list-disc list-inside">
        <li>Name</li>
        <li>Email address</li>
        <li>Optional information provided through event forms or surveys</li>
      </ul>
      <p className="mb-4">
        We collect this information when you register for events or sign up for updates.
      </p>

      <h2 className="mt-6 mb-3 text-2xl font-semibold">How We Use Your Information</h2>
      <p className="mb-4">We use your information to:</p>
      <ul className="mb-4 list-disc list-inside">
        <li>Send event confirmations and reminders</li>
        <li>Share important updates about our events</li>
        <li>Send post-event follow-ups and feedback requests</li>
      </ul>
      <p className="mb-4">
        We <strong>do not</strong> share or sell your information to third parties.
      </p>

      <h2 className="mt-6 mb-3 text-2xl font-semibold">Email Communication</h2>
      <p className="mb-4">
        By registering for an event or signing up via our website, you consent to receive relevant, event-related emails. Every email includes an unsubscribe link.
      </p>

      <h2 className="mt-6 mb-3 text-2xl font-semibold">Your Rights</h2>
      <p className="mb-4">You may request to:</p>
      <ul className="mb-4 list-disc list-inside">
        <li>View the data we have on you</li>
        <li>Have your data corrected or deleted</li>
      </ul>
      <p className="mb-4">
        To make a request, email us at: <code className="px-1 bg-gray-200 rounded dark:bg-gray-700">privacy@frontenleeds.com</code>.
      </p>

      <h2 className="mt-6 mb-3 text-2xl font-semibold">Contact</h2>
      <p className="mb-4">
        If you have questions, contact us at: <br />
        <code className="px-1 bg-gray-200 rounded dark:bg-gray-700">privacy@frontenleeds.com</code> <br />
        Frontend Leeds, {meetupLocation}
      </p>
    </div>
  );
};

export default PrivacyPolicyPage;
