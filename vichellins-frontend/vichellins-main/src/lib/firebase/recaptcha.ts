import { RecaptchaVerifier } from "firebase/auth";
import React from "react";
import { auth } from "./config";

// generate recaptcha
const setUpRecaptcha = async ({
  recaptchaWidgetId,
  setRecaptchaWidgetId,
}: {
  recaptchaWidgetId: string | null;
  setRecaptchaWidgetId: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  try {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {
            // reCAPTCHA solved
            console.log("reCAPTCHA solved");
          },
          "expired-callback": () => {
            // Response expired
            console.log("reCAPTCHA expired");
            if (recaptchaWidgetId) {
              window.grecaptcha.reset(recaptchaWidgetId);
              console.log("Reset");
            }
          },
        }
      );
      window.recaptchaVerifier.render().then((widgetId: string) => {
        setRecaptchaWidgetId(widgetId); // Store the widget ID
      });
    }
  } catch (error) {
    throw new Error(error as string);
  }
};

export default setUpRecaptcha;
