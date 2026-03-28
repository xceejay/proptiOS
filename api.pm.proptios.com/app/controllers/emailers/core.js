const ECN = require("../../config/constants");
const postmark = require("postmark");

const client = new postmark.ServerClient(
  process.env.POSTMARK_SERVER_TOKEN || "8a2efd67-7a24-44f6-9f4d-24deb18b79a0"
);

const transactionalEmailDisabled =
  String(process.env.DISABLE_TRANSACTIONAL_EMAIL || "").toLowerCase() === "true";

const sendEmailWithTemplate = (payload) => {
  if (transactionalEmailDisabled) {
    return Promise.resolve(null);
  }

  return client.sendEmailWithTemplate(payload).catch((error) => {
    console.error("Transactional email failed:", error.message || error);
    return null;
  });
};

const earlyAccessMail = (to_email, user_fullname) =>
  sendEmailWithTemplate({
    From: ECN.CONSTANTS.MAIN_EMAIL,
    To: to_email,
    TemplateAlias: "early-access-mail",
    TemplateModel: {
      user_fullname,
    },
  });

const jodTenDollars = (to_email, user_fullname) =>
  sendEmailWithTemplate({
    From: ECN.CONSTANTS.MAIN_EMAIL,
    To: to_email,
    TemplateAlias: "jod-10-dollars",
    TemplateModel: {
      user_fullname,
      action_url: "https://api.pm.proptios.com/",
    },
  });

const earlyAccessBetaTestingMail = (to_email, user_fullname, signupURL) =>
  sendEmailWithTemplate({
    From: ECN.CONSTANTS.MAIN_EMAIL,
    To: to_email,
    TemplateAlias: "early-access-beta-testing-mail",
    TemplateModel: {
      user_fullname,
      action_url: signupURL,
    },
  });

const welcomeEmail = (to_email, user_fullname) =>
  sendEmailWithTemplate({
    From: ECN.CONSTANTS.MAIN_EMAIL,
    To: to_email,
    TemplateAlias: "welcome-user-email",
    TemplateModel: {
      user_fullname,
    },
  });

const maintenanceEmail = (to_email, user_fullname) =>
  sendEmailWithTemplate({
    From: ECN.CONSTANTS.MAIN_EMAIL,
    To: to_email,
    TemplateAlias: "jod-maintenance",
    TemplateModel: {
      user_fullname,
    },
  });

const backOnlineEmail = (to_email, user_fullname) =>
  sendEmailWithTemplate({
    From: ECN.CONSTANTS.MAIN_EMAIL,
    To: to_email,
    TemplateAlias: "jod-back-online",
    TemplateModel: {
      user_fullname,
    },
  });

const liveDemoEmail = (to_email, user_fullname) =>
  sendEmailWithTemplate({
    From: ECN.CONSTANTS.MAIN_EMAIL,
    To: to_email,
    TemplateAlias: "live-demo",
    TemplateModel: {
      user_fullname,
    },
  });

const stableJOD = (to_email, user_fullname) =>
  sendEmailWithTemplate({
    From: ECN.CONSTANTS.MAIN_EMAIL,
    To: to_email,
    TemplateAlias: "jod-stable-build",
    TemplateModel: {
      user_fullname,
    },
  });

const seasonalGreetings = (to_email, user_fullname) =>
  sendEmailWithTemplate({
    From: ECN.CONSTANTS.MAIN_EMAIL,
    To: to_email,
    TemplateAlias: "jod-xmas",
    TemplateModel: {
      user_fullname,
    },
  });

const JODSale = (to_email) =>
  sendEmailWithTemplate({
    From: ECN.CONSTANTS.MAIN_EMAIL,
    To: to_email,
    TemplateAlias: "jod-sale-email",
    TemplateModel: {},
    MessageStream: "broadcast-mail-server",
  });

const emailActivation = (to_email, user_fullname, url) =>
  sendEmailWithTemplate({
    From: ECN.CONSTANTS.MAIN_EMAIL,
    To: to_email,
    TemplateAlias: "email-activation",
    TemplateModel: {
      user_fullname,
      action_url: url,
    },
  });

const forgotPassword = (to_email, user_fullname, url) =>
  sendEmailWithTemplate({
    From: ECN.CONSTANTS.MAIN_EMAIL,
    To: to_email,
    TemplateAlias: "forgot-password",
    TemplateModel: {
      user_fullname,
      reset_password_link: url,
    },
  });

const recordingTempLink = (to_email, user_fullname, domain, room, url) =>
  sendEmailWithTemplate({
    From: ECN.CONSTANTS.MAIN_EMAIL,
    To: to_email,
    TemplateAlias: "recording_available",
    TemplateModel: {
      user_fullname,
      domain,
      room,
      link: url,
    },
  });

module.exports = {
  earlyAccessMail,
  forgotPassword,
  welcomeEmail,
  emailActivation,
  earlyAccessBetaTestingMail,
  jodTenDollars,
  recordingTempLink,
  maintenanceEmail,
  backOnlineEmail,
  liveDemoEmail,
  stableJOD,
  seasonalGreetings,
  JODSale,
};
