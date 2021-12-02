const REMAINDER_FREQUENCY_SLIDER_MARKS = [
  {
    value: 1,
    label: "1 time",
  },
  {
    value: 2,
    label: "2 times",
  },
  {
    value: 3,
    label: "3 times",
  },
  {
    value: 4,
    label: "4 times",
  },
  {
    value: 5,
    label: "5 times",
  },
  {
    value: 6,
    label: "6 times",
  },
  {
    value: 7,
    label: "7 times",
  },
];

const customNotification = {
  RI_002: "Encountered an error from server while processing your chat messages",
  RI_004: "Invalid Data. Please make sure you have filled the data with correct format.",
  RI_006: "Successfully fetched the {0}",
  RI_007: "{0} has been successfully removed of user: {1}.",
  RI_008: "Failed to remove {0} for user: {1}. Please try again or contact administrator",
  RI_009: "{0} has successfully been updated of user: {1}.",
  RI_010: "Failed to update {0} of userId: {1}",
  RI_011: "{0} has successfully been added of user: {1}.",
  RI_012: "Failed to add {0} of user: {1}. Please try again or contact administrator",
  RI_013: "Your email to user: {0} has successfully been sent. Please keep cheking Gmail for further updates.",
  RI_014: "Failed to send your email to user: {0} due to an error from Gmail server. Please retry after a while.",
  RI_015: "You are not authorized to access this page. please use http://localhost:3000/sign-in to login.",
  RI_016: "Registration has been completed. Thanks for joing us.",
  RI_017: "Encountered an issue from server. Please try to provider data in correct format.",
  RI_018: "Registration failed! {0}",
  RI_019: "Welcome to your CRM Personalized Dashboard",
  RI_020: "Encountered an issue from server. Please try to provider data in correct format.",
  RI_021: "Failed to logging in user: {0}, due to error: {1}",
  RI_022: "Your credential already exists in our database, please try to login!",
  RI_023: "Failed to authenticate you. Could you please try to logout and login again!",
  RI_024: "We have successfully authenticated you.",
  RI_025: "Getting an issue from server while logging you out. Please retry or contact administrator.",
  RI_026: "Failed to send your chat messages. Please check your internet connectivity and retry.",
  RI_027: "Failed to update your profile data due to exceptions from server. Please re-check if you have been trying to send malformed data!",
  RI_028: "Failed to save your picture since got some exception from server. Note: Picture size must be less than 1 MB.",
  RI_029: "Exception while sending your email. Please re-check if you have been trying to send malformed data!",
  RI_030: "Failed to insert your profile data due to exceptions from server. Please re-check if you have been trying to send malformed data!",
  RI_031: "You have successfully logged-out. Hope to see you again.",
  RI_032: "Error from our side. Please report this issue to administrator. We will send this issue to our engineers right away.",
  RI_033: "Error from our side. Please report this issue to administrator. We will send this issue to our engineers right away.",
  RI_034: "Getting error while processing your request. Please report this issue to administrator. We will send this issue to our engineers right away.",
  RI_035: "Your request has been accepted and is ready to be processed right away, please check notifications for the updates",
  INVALID_DATA: "Please enter valid information to update profile",
  DEFAULT: "Server is unreachable. Please try checking your internet connectivity.",
  INVALID_IMG: "Not able to process selected image. Please try to upload a valid image file.",
  EMPTY_DATA: "Please enter data to update"
}


module.exports = {
  REMAINDER_FREQUENCY_SLIDER_MARKS,
  customNotification
};
