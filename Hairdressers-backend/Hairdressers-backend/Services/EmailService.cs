using Hairdressers_backend.Interfaces;
using Resend;

namespace Hairdressers_backend.Services
{
    public class EmailService : IEmailService
    {
        private readonly IResend _resend;
        private readonly string _fromEmail;
        private readonly string _salonName;

        public EmailService(IResend resend, IConfiguration configuration)
        {
            _resend = resend;
            _fromEmail = configuration["Resend:FromEmail"]
                ?? throw new InvalidOperationException("Resend:FromEmail non configuré.");
            _salonName = configuration["Resend:SalonName"] ?? "Jenny Hairdresser";
        }

        public async Task SendAppointmentPendingAsync(
            string toEmail, string firstName, string serviceName, DateTime appointmentDate)
        {
            var message = new EmailMessage
            {
                From = _fromEmail,
                Subject = "Votre demande de rendez-vous a été reçue"
            };
            message.To.Add(toEmail);
            message.HtmlBody = BuildPendingHtml(firstName, serviceName, appointmentDate);

            await _resend.EmailSendAsync(message);
        }

        public async Task SendAppointmentAcceptedAsync(
            string toEmail, string firstName, string serviceName, DateTime appointmentDate)
        {
            var message = new EmailMessage
            {
                From = _fromEmail,
                Subject = "Votre rendez-vous est confirmé"
            };
            message.To.Add(toEmail);
            message.HtmlBody = BuildAcceptedHtml(firstName, serviceName, appointmentDate);

            await _resend.EmailSendAsync(message);
        }

        public async Task SendAppointmentCancelledAsync(
            string toEmail, string firstName, string serviceName, DateTime appointmentDate)
        {
            var message = new EmailMessage
            {
                From = _fromEmail,
                Subject = "Votre rendez-vous a été annulé"
            };
            message.To.Add(toEmail);
            message.HtmlBody = BuildCancelledHtml(firstName, serviceName, appointmentDate);

            await _resend.EmailSendAsync(message);
        }

        // ─── Templates HTML ──────────────────────────────────────────────────────────

        private string BuildPendingHtml(string firstName, string serviceName, DateTime date) => $"""
            <!DOCTYPE html>
            <html lang="fr">
            <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
              <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <div style="background-color: #c0a080; padding: 30px; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 24px;">{_salonName}</h1>
                </div>
                <div style="padding: 30px;">
                  <h2 style="color: #333;">Bonjour {firstName} !</h2>
                  <p style="color: #555; font-size: 16px;">
                    Nous avons bien reçu votre demande de rendez-vous. Elle est en attente de confirmation.
                  </p>
                  <div style="background-color: #f5f0eb; border-left: 4px solid #c0a080; padding: 16px; border-radius: 4px; margin: 20px 0;">
                    <p style="margin: 0; color: #333;"><strong>Service :</strong> {serviceName}</p>
                    <p style="margin: 8px 0 0; color: #333;"><strong>Date :</strong> {date:dddd d MMMM yyyy}</p>
                    <p style="margin: 8px 0 0; color: #333;"><strong>Heure :</strong> {date:HH:mm}</p>
                  </div>
                  <p style="color: #555; font-size: 14px;">
                    Vous recevrez un courriel dès que votre rendez-vous sera confirmé.
                  </p>
                </div>
                <div style="background-color: #f0f0f0; padding: 16px; text-align: center;">
                  <p style="color: #999; font-size: 12px; margin: 0;">{_salonName} — Merci de votre confiance 💛</p>
                  <p style="color: #999; font-size: 12px; margin: 4px 0 0;">Pour toute question, contactez-nous au 514 233-4466</p>
                </div>
              </div>
            </body>
            </html>
            """;

        private string BuildAcceptedHtml(string firstName, string serviceName, DateTime date) => $"""
            <!DOCTYPE html>
            <html lang="fr">
            <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
              <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <div style="background-color: #6aaa64; padding: 30px; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 24px;"> Rendez-vous confirmé</h1>
                </div>
                <div style="padding: 30px;">
                  <h2 style="color: #333;">Bonjour {firstName} !</h2>
                  <p style="color: #555; font-size: 16px;">
                    Votre rendez-vous est confirmé. Nous avons hâte de vous accueillir !
                  </p>
                  <div style="background-color: #f0faf0; border-left: 4px solid #6aaa64; padding: 16px; border-radius: 4px; margin: 20px 0;">
                    <p style="margin: 0; color: #333;"><strong>Service :</strong> {serviceName}</p>
                    <p style="margin: 8px 0 0; color: #333;"><strong>Date :</strong> {date:dddd d MMMM yyyy}</p>
                    <p style="margin: 8px 0 0; color: #333;"><strong>Heure :</strong> {date:HH:mm}</p>
                  </div>
                  <p style="color: #555; font-size: 16px;">
                    Il ne reste qu'une dernière étape : appelez-nous au <strong>514 233-4466</strong> pour obtenir notre adresse !
                  </p>
                  <p style="color: #555; font-size: 14px;">
                    Si vous avez besoin d'annuler ou de modifier votre rendez-vous, contactez-nous le plus tôt possible.
                  </p>
                </div>
                <div style="background-color: #f0f0f0; padding: 16px; text-align: center;">
                  <p style="color: #999; font-size: 12px; margin: 0;">{_salonName} — Merci de votre confiance 💛</p>
                  <p style="color: #999; font-size: 12px; margin: 4px 0 0;">Pour toute question, contactez-nous au 514 233-4466</p>
                </div>
              </div>
            </body>
            </html>
            """;

        private string BuildCancelledHtml(string firstName, string serviceName, DateTime date) => $"""
            <!DOCTYPE html>
            <html lang="fr">
            <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
              <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <div style="background-color: #e05a5a; padding: 30px; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 24px;">Rendez-vous annulé</h1>
                </div>
                <div style="padding: 30px;">
                  <h2 style="color: #333;">Bonjour {firstName} !</h2>
                  <p style="color: #555; font-size: 16px;">
                    Votre rendez-vous a été annulé. Nous espérons vous revoir bientôt.
                  </p>
                  <div style="background-color: #fdf5f5; border-left: 4px solid #e05a5a; padding: 16px; border-radius: 4px; margin: 20px 0;">
                    <p style="margin: 0; color: #333;"><strong>Service :</strong> {serviceName}</p>
                    <p style="margin: 8px 0 0; color: #333;"><strong>Date :</strong> {date:dddd d MMMM yyyy}</p>
                    <p style="margin: 8px 0 0; color: #333;"><strong>Heure :</strong> {date:HH:mm}</p>
                  </div>
                  <p style="color: #555; font-size: 14px;">
                    N'hésitez pas à reprendre un rendez-vous à une date qui vous convient mieux.
                  </p>
                  <div style="text-align: center; margin: 24px 0;">
                    <a href="https://jennystyliste.com" style="background-color: #e05a5a; color: white; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-size: 15px; font-weight: bold;">
                      Prendre un nouveau rendez-vous
                    </a>
                  </div>
                </div>
                <div style="background-color: #f0f0f0; padding: 16px; text-align: center;">
                  <p style="color: #999; font-size: 12px; margin: 0;">{_salonName} — Merci de votre confiance 💛</p>
                  <p style="color: #999; font-size: 12px; margin: 4px 0 0;">Pour toute question, contactez-nous au 514 233-4466</p>
                </div>
              </div>
            </body>
            </html>
            """;
    }
}
