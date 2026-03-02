import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendEnrollmentEmail = async (data: {
    userName: string;
    userEmail: string;
    courseTitle: string;
    price: number;
}) => {
    // Email to User
    await transporter.sendMail({
        from: `"VEDINC" <${process.env.EMAIL_USER}>`,
        to: data.userEmail,
        subject: `Enrollment Confirmed - ${data.courseTitle}`,
        html: `
      <h2>Welcome to VEDINC 🎉</h2>
      <p>Hi ${data.userName},</p>
      <p>You have successfully enrolled in:</p>
      <h3>${data.courseTitle}</h3>
      <p><strong>Amount Paid:</strong> ₹${data.price}</p>
      <br/>
      <a href="${process.env.APP_URL}/industry-hub">
        Start Learning
      </a>
      <br/><br/>
      <p>Thank you for choosing VEDINC.</p>
    `,
    });

    // Email to Admin
    await transporter.sendMail({
        from: `"VEDINC" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `New Enrollment - ${data.courseTitle}`,
        html: `
      <h3>New Enrollment</h3>
      <p><strong>Name:</strong> ${data.userName}</p>
      <p><strong>Email:</strong> ${data.userEmail}</p>
      <p><strong>Course:</strong> ${data.courseTitle}</p>
      <p><strong>Amount:</strong> ₹${data.price}</p>
    `,
    });
};
