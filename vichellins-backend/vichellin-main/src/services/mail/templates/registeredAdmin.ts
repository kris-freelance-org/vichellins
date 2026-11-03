export default (data: { name: string; email: string; password: string }): string => {
  const { name, email, password } = data;

  return `
  <p>Hello${name ? ' ' + name + ',' : ' there,'}</p>

  <p>You've been added onto the ${process.env.APP_NAME} platform as an Admin.</p>

  <p>Kindly find your login details below:</p>

  <p><b>Email:</b> ${email}</p>
  <p><b>Password:</b> ${password}</p>

  <p>Please change your password after your first login.</p>

  <p>Regards,</p>
  <p>${process.env.APP_NAME} Team</p>
  `;
};
