import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key)) {
    throw new Error('Resend not connected');
  }
  return {apiKey: connectionSettings.settings.api_key, fromEmail: connectionSettings.settings.from_email};
}

async function getUncachableResendClient() {
  const { apiKey, fromEmail } = await getCredentials();
  return {
    client: new Resend(apiKey),
    fromEmail: fromEmail || 'onboarding@resend.dev'
  };
}

export async function sendOtpEmail(email: string, code: string, type: 'verification' | 'reset') {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    
    const subject = type === 'verification' 
      ? 'Verify Your Email - INSocial Connect+' 
      : 'Reset Your Password - INSocial Connect+';
    
    const message = type === 'verification'
      ? `Your verification code is: ${code}\n\nThis code will expire in 10 minutes.`
      : `Your password reset code is: ${code}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email.`;

    const { data, error } = await client.emails.send({
      from: fromEmail,
      to: [email],
      subject: subject,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">${type === 'verification' ? 'Verify Your Email' : 'Reset Your Password'}</h2>
          <p style="font-size: 16px; color: #666;">
            ${type === 'verification' 
              ? 'Thank you for signing up! Please use the following code to verify your email:' 
              : 'You requested to reset your password. Use the following code:'}
          </p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #333; letter-spacing: 5px; margin: 0;">${code}</h1>
          </div>
          <p style="font-size: 14px; color: #999;">
            This code will expire in 10 minutes.
            ${type === 'reset' ? '<br><br>If you didn\'t request this, please ignore this email.' : ''}
          </p>
        </div>
      `
    });

    if (error) {
      console.error('Failed to send email:', error);
      throw new Error('Failed to send email');
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email sending error:', error);
    
    if (isDevelopment) {
      console.log('\n================================================');
      console.log(`📧 EMAIL SERVICE NOT CONFIGURED - DEVELOPMENT MODE`);
      console.log(`📬 To: ${email}`);
      console.log(`📝 Type: ${type === 'verification' ? 'Email Verification' : 'Password Reset'}`);
      console.log(`🔐 OTP CODE: ${code}`);
      console.log('================================================\n');
      return { success: true, data: null };
    }
    
    throw error;
  }
}

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
