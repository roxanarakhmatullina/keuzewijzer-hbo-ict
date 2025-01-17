namespace Server.Services
{
    using System.Net;
    using System.Net.Mail;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Options;

    public class EmailService
    {
        private readonly IConfiguration _configuration;
        private readonly EmailSettings _emailSettings;

        public EmailService(IConfiguration configuration, IOptions<EmailSettings> emailSettings)
        {
            _configuration = configuration;
            _emailSettings = emailSettings.Value;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            try
            {
                var fromEmail = _emailSettings.From;
                var smtpServer = _emailSettings.SmtpServer;
                var port = _emailSettings.Port;
                var username = _emailSettings.Username;
                var password = _emailSettings.Password;

                using var smtpClient = new SmtpClient(smtpServer, port)
                {
                    Credentials = new NetworkCredential(username, password),
                    EnableSsl = true
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(fromEmail),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };
                mailMessage.To.Add(toEmail);

                await smtpClient.SendMailAsync(mailMessage);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending email: {ex.Message}");
                throw;
            }
        }
    }
    
    public class EmailSettings
    {
        public string From { get; set; }
        public string SmtpServer { get; set; }
        public int Port { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
    }
}