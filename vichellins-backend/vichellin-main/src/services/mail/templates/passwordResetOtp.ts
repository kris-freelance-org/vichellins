export default (data: { name: string; otp: string; expiresIn: string }): string => {
  const { name, otp, expiresIn } = data;

  return `
  <p>Hello${name ? ' ' + name + ',' : ' there,'}</p>

  <p>You've requested a password reset. Please use the following OTP to reset your password:</p>

  <h2>${otp}</h2>

  <p>This OTP is valid for ${expiresIn}. If you did not request a password reset, please ignore this email.</p>

  <p>Regards,</p>
  <p>${process.env.APP_NAME} Team</p>
  `;
};
