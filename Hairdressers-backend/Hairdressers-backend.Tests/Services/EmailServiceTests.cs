using Hairdressers_backend.Services;
using Microsoft.Extensions.Configuration;
using Moq;
using Resend;
using Xunit;

namespace Hairdressers_backend.Tests.Services
{
    public class EmailServiceTests
    {
        private readonly Mock<IResend> _resendMock;
        private readonly EmailService _service;

        public EmailServiceTests()
        {
            _resendMock = new Mock<IResend>();

            var config = new ConfigurationBuilder()
                .AddInMemoryCollection(new Dictionary<string, string?>
                {
                    ["Resend:FromEmail"] = "salon@jenny.com",
                    ["Resend:SalonName"] = "Jenny Hairdresser"
                })
                .Build();

            _service = new EmailService(_resendMock.Object, config);
        }

        // ─── SendAppointmentPendingAsync ─────────────────────────────────────────────

        [Fact]
        public async Task SendPending_CallsResend_Once()
        {
            await _service.SendAppointmentPendingAsync(
                "client@example.com", "Marie", "Balayage", new DateTime(2026, 5, 10, 14, 0, 0));

            _resendMock.Verify(r => r.EmailSendAsync(It.IsAny<EmailMessage>(), It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task SendPending_SendsToCorrectRecipient()
        {
            EmailMessage? captured = null;
            _resendMock
                .Setup(r => r.EmailSendAsync(It.IsAny<EmailMessage>(), It.IsAny<CancellationToken>()))
                .Callback<EmailMessage, CancellationToken>((msg, _) => captured = msg)
                .ReturnsAsync(default(ResendResponse<Guid>));

            await _service.SendAppointmentPendingAsync(
                "client@example.com", "Marie", "Balayage", new DateTime(2026, 5, 10, 14, 0, 0));

            Assert.NotNull(captured);
            Assert.Contains("client@example.com", captured.To);
        }

        [Fact]
        public async Task SendPending_HtmlBodyContainsFirstName()
        {
            EmailMessage? captured = null;
            _resendMock
                .Setup(r => r.EmailSendAsync(It.IsAny<EmailMessage>(), It.IsAny<CancellationToken>()))
                .Callback<EmailMessage, CancellationToken>((msg, _) => captured = msg)
                .ReturnsAsync(default(ResendResponse<Guid>));

            await _service.SendAppointmentPendingAsync(
                "client@example.com", "Marie", "Balayage", new DateTime(2026, 5, 10, 14, 0, 0));

            Assert.Contains("Marie", captured!.HtmlBody);
        }

        [Fact]
        public async Task SendPending_HtmlBodyContainsServiceName()
        {
            EmailMessage? captured = null;
            _resendMock
                .Setup(r => r.EmailSendAsync(It.IsAny<EmailMessage>(), It.IsAny<CancellationToken>()))
                .Callback<EmailMessage, CancellationToken>((msg, _) => captured = msg)
                .ReturnsAsync(default(ResendResponse<Guid>));

            await _service.SendAppointmentPendingAsync(
                "client@example.com", "Marie", "Balayage", new DateTime(2026, 5, 10, 14, 0, 0));

            Assert.Contains("Balayage", captured!.HtmlBody);
        }

        // ─── SendAppointmentAcceptedAsync ────────────────────────────────────────────

        [Fact]
        public async Task SendAccepted_CallsResend_Once()
        {
            await _service.SendAppointmentAcceptedAsync(
                "client@example.com", "Luc", "Corte", new DateTime(2026, 6, 1, 10, 0, 0));

            _resendMock.Verify(r => r.EmailSendAsync(It.IsAny<EmailMessage>(), It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task SendAccepted_HtmlBodyContainsFirstName()
        {
            EmailMessage? captured = null;
            _resendMock
                .Setup(r => r.EmailSendAsync(It.IsAny<EmailMessage>(), It.IsAny<CancellationToken>()))
                .Callback<EmailMessage, CancellationToken>((msg, _) => captured = msg)
                .ReturnsAsync(default(ResendResponse<Guid>));

            await _service.SendAppointmentAcceptedAsync(
                "client@example.com", "Luc", "Corte", new DateTime(2026, 6, 1, 10, 0, 0));

            Assert.Contains("Luc", captured!.HtmlBody);
        }

        [Fact]
        public async Task SendAccepted_SubjectMentionsConfirmation()
        {
            EmailMessage? captured = null;
            _resendMock
                .Setup(r => r.EmailSendAsync(It.IsAny<EmailMessage>(), It.IsAny<CancellationToken>()))
                .Callback<EmailMessage, CancellationToken>((msg, _) => captured = msg)
                .ReturnsAsync(default(ResendResponse<Guid>));

            await _service.SendAppointmentAcceptedAsync(
                "client@example.com", "Luc", "Corte", new DateTime(2026, 6, 1, 10, 0, 0));

            Assert.Contains("confirmé", captured!.Subject, StringComparison.OrdinalIgnoreCase);
        }

        // ─── SendAppointmentCancelledAsync ───────────────────────────────────────────

        [Fact]
        public async Task SendCancelled_CallsResend_Once()
        {
            await _service.SendAppointmentCancelledAsync(
                "client@example.com", "Ana", "Tinte", new DateTime(2026, 7, 15, 9, 0, 0));

            _resendMock.Verify(r => r.EmailSendAsync(It.IsAny<EmailMessage>(), It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task SendCancelled_HtmlBodyContainsServiceName()
        {
            EmailMessage? captured = null;
            _resendMock
                .Setup(r => r.EmailSendAsync(It.IsAny<EmailMessage>(), It.IsAny<CancellationToken>()))
                .Callback<EmailMessage, CancellationToken>((msg, _) => captured = msg)
                .ReturnsAsync(default(ResendResponse<Guid>));

            await _service.SendAppointmentCancelledAsync(
                "client@example.com", "Ana", "Tinte", new DateTime(2026, 7, 15, 9, 0, 0));

            Assert.Contains("Tinte", captured!.HtmlBody);
        }

        [Fact]
        public async Task SendCancelled_SubjectMentionsAnnulation()
        {
            EmailMessage? captured = null;
            _resendMock
                .Setup(r => r.EmailSendAsync(It.IsAny<EmailMessage>(), It.IsAny<CancellationToken>()))
                .Callback<EmailMessage, CancellationToken>((msg, _) => captured = msg)
                .ReturnsAsync(default(ResendResponse<Guid>));

            await _service.SendAppointmentCancelledAsync(
                "client@example.com", "Ana", "Tinte", new DateTime(2026, 7, 15, 9, 0, 0));

            Assert.Contains("annulé", captured!.Subject, StringComparison.OrdinalIgnoreCase);
        }

        // ─── Configuration manquante ─────────────────────────────────────────────────

        [Fact]
        public void Constructor_ThrowsInvalidOperation_WhenFromEmailNotConfigured()
        {
            var badConfig = new ConfigurationBuilder()
                .AddInMemoryCollection(new Dictionary<string, string?>())
                .Build();

            Assert.Throws<InvalidOperationException>(
                () => new EmailService(_resendMock.Object, badConfig)
            );
        }
    }
}
