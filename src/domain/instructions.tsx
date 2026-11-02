const commonUsersInstruction =
  "To create a new match, please select the user from the 'Ready to match' list or go to the 'Matching' section.";

export const INSTRUCTIONS = {
  dashboard: {
    application: (estimatedTimeInMinutes: number): JSX.Element => (
      <>
        <p>
          Estimated time to complete this form is {estimatedTimeInMinutes} minutes. Your answers will be automatically
          saved, and you can pause and return to your form at any time.
        </p>
        <p>*Please note that some of your answers may be shared as part of the matching and onboarding processes.</p>
      </>
    ),
    matchCompleted: (userName: string): JSX.Element => (
      <>
        <p>Dear {userName},</p>
        <p>
          Thank you for your patience and the time you've dedicated to this process. We are pleased to inform you that
          your matching is now complete.
        </p>
        <p>
          The details have been sent to your registered email address. Please check your inbox for all the necessary
          information.
        </p>
        <p>Thank you for choosing our platform.</p>
        <p>
          Best regards,
          <br />
          BoardDev team.
        </p>
      </>
    ),
  },
  corporate: {
    customMessage:
      'If a custom message is not specified or is left empty, the default message will be displayed to all users.',
    customMessageSubmit:
      "Type your message, press 'Ctrl + Enter' or click 'Save message' button to set it as the default.",
  },
  users: {
    readyToMatch: commonUsersInstruction,
    matched: commonUsersInstruction,
  },
  match: {
    create:
      'You can pair one Tech Leader with one NPO. No other configurations are allowed. The users can be matched only once.',
    sendToCRM: 'Once sent to the CRM, the match can no longer be modified.',
  },
  corporateClient: {
    invitationLink: 'This link will automatically assign a new user to this company.',
  },
};
