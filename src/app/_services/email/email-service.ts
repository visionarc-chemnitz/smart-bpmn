import nodemailer, { Transporter } from "nodemailer";
import fs from "fs";
import path from "path";

interface EmailOptions {
  to: string;
  subject: string;
  emailHeaderContent: string;
  emailContent: string;
  buttonText: string;
  buttonLink: string;
}

class EmailService {
  private transporter: Transporter;
  private defaultFrom: string;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      secure: false,
      auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY,
      },
    });
    this.defaultFrom = `"VisionArc" <${process.env.RESEND_FROM}>`; 
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const baseTemplatePath = path.join(process.cwd(), "src", "app", "email-template", "base-template.html");
      const baseTemplate = fs.readFileSync(baseTemplatePath, "utf8");

      const populatedHtml = this.replaceTemplateVariables(baseTemplate, {
        emailHeaderContent: options.emailHeaderContent,
        emailContent: options.emailContent,
        buttonText: options.buttonText || "signIn",
        buttonLink: options.buttonLink || `${process.env.NEXT_PUBLIC_APP_URL}/auth/signin`,
      });

      const res = await this.transporter.sendMail({
        from: this.defaultFrom,
        to: options.to,
        subject: options.subject,
        html: populatedHtml,
      });

      return res;

      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }

  private replaceTemplateVariables(template: string, data: Record<string, string>): string {
    return Object.keys(data).reduce(
      (acc, key) => acc.replace(new RegExp(`{{${key}}}`, "g"), data[key]),
      template
    );
  }
}

const emailService = new EmailService();
export default emailService;
