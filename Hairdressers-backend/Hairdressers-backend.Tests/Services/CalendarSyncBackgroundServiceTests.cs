using Hairdressers_backend.Interfaces;
using Hairdressers_backend.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Hairdressers_backend.Tests.Services
{
    public class CalendarSyncBackgroundServiceTests
    {
        private readonly Mock<IAppointmentService> _appointmentServiceMock;
        private readonly Mock<IServiceScopeFactory> _scopeFactoryMock;
        private readonly Mock<ILogger<CalendarSyncBackgroundService>> _loggerMock;
        private readonly CalendarSyncBackgroundService _service;

        public CalendarSyncBackgroundServiceTests()
        {
            _appointmentServiceMock = new Mock<IAppointmentService>();
            _loggerMock = new Mock<ILogger<CalendarSyncBackgroundService>>();

            var providerMock = new Mock<IServiceProvider>();
            providerMock
                .Setup(p => p.GetService(typeof(IAppointmentService)))
                .Returns(_appointmentServiceMock.Object);

            var scopeMock = new Mock<IServiceScope>();
            scopeMock.Setup(s => s.ServiceProvider).Returns(providerMock.Object);

            _scopeFactoryMock = new Mock<IServiceScopeFactory>();
            _scopeFactoryMock.Setup(f => f.CreateScope()).Returns(scopeMock.Object);

            _service = new CalendarSyncBackgroundService(_scopeFactoryMock.Object, _loggerMock.Object);
        }

        // ─── Helpers ────────────────────────────────────────────────────────────────

        /// <summary>
        /// Lance le service en arrière-plan (sans await pour éviter que TaskCanceledException
        /// remonte au test quand Task.Delay est interrompu), attend le signal TCS,
        /// puis arrête proprement le service.
        /// </summary>
        private async Task RunUntilSyncCalled(TaskCompletionSource syncCalled)
        {
            // Fire-and-forget : on ne veut pas que l'exception de Task.Delay propagée
            // lorsqu'on arrête le service remonte jusqu'au test
            _ = _service.StartAsync(CancellationToken.None);

            await syncCalled.Task.WaitAsync(TimeSpan.FromSeconds(5));

            // StopAsync annule le token interne → Task.Delay retourne immédiatement,
            // mais StopAsync utilise Task.WhenAny donc ne propage pas TaskCanceledException
            await _service.StopAsync(CancellationToken.None);
        }

        // ─── Tests ──────────────────────────────────────────────────────────────────

        [Fact]
        public async Task ExecuteAsync_CallsSyncOnce_OnFirstIteration()
        {
            var syncCalled = new TaskCompletionSource();
            _appointmentServiceMock
                .Setup(s => s.SyncFromGoogleCalendarAsync())
                .Returns(() =>
                {
                    syncCalled.TrySetResult();
                    return Task.CompletedTask;
                });

            await RunUntilSyncCalled(syncCalled);

            _appointmentServiceMock.Verify(s => s.SyncFromGoogleCalendarAsync(), Times.Once);
        }

        [Fact]
        public async Task ExecuteAsync_CreatesScopeForEachIteration()
        {
            var syncCalled = new TaskCompletionSource();
            _appointmentServiceMock
                .Setup(s => s.SyncFromGoogleCalendarAsync())
                .Returns(() =>
                {
                    syncCalled.TrySetResult();
                    return Task.CompletedTask;
                });

            await RunUntilSyncCalled(syncCalled);

            _scopeFactoryMock.Verify(f => f.CreateScope(), Times.Once);
        }

        [Fact]
        public async Task ExecuteAsync_DoesNotCrash_WhenSyncThrowsException()
        {
            var syncCalled = new TaskCompletionSource();
            _appointmentServiceMock
                .Setup(s => s.SyncFromGoogleCalendarAsync())
                .Returns(() =>
                {
                    syncCalled.TrySetResult();
                    return Task.FromException(new Exception("Erreur Google Calendar simulée"));
                });

            // Ne doit pas lancer d'exception
            var ex = await Record.ExceptionAsync(() => RunUntilSyncCalled(syncCalled));

            Assert.Null(ex);
            _appointmentServiceMock.Verify(s => s.SyncFromGoogleCalendarAsync(), Times.Once);
        }

        [Fact]
        public async Task ExecuteAsync_LogsError_WhenSyncThrowsException()
        {
            var syncCalled = new TaskCompletionSource();
            _appointmentServiceMock
                .Setup(s => s.SyncFromGoogleCalendarAsync())
                .Returns(() =>
                {
                    syncCalled.TrySetResult();
                    return Task.FromException(new Exception("Erreur test"));
                });

            await RunUntilSyncCalled(syncCalled);

            _loggerMock.Verify(
                l => l.Log(
                    LogLevel.Error,
                    It.IsAny<EventId>(),
                    It.IsAny<It.IsAnyType>(),
                    It.IsAny<Exception>(),
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.Once);
        }

        [Fact]
        public async Task ExecuteAsync_LogsInformation_OnSuccessfulSync()
        {
            var syncCalled = new TaskCompletionSource();
            _appointmentServiceMock
                .Setup(s => s.SyncFromGoogleCalendarAsync())
                .Returns(() =>
                {
                    syncCalled.TrySetResult();
                    return Task.CompletedTask;
                });

            await RunUntilSyncCalled(syncCalled);

            _loggerMock.Verify(
                l => l.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.IsAny<It.IsAnyType>(),
                    null,
                    It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
                Times.AtLeastOnce);
        }

        [Fact]
        public async Task StopAsync_CompletesWithoutException()
        {
            var syncCalled = new TaskCompletionSource();
            _appointmentServiceMock
                .Setup(s => s.SyncFromGoogleCalendarAsync())
                .Returns(() =>
                {
                    syncCalled.TrySetResult();
                    return Task.CompletedTask;
                });

            _ = _service.StartAsync(CancellationToken.None);
            await syncCalled.Task.WaitAsync(TimeSpan.FromSeconds(5));

            var stopException = await Record.ExceptionAsync(
                () => _service.StopAsync(CancellationToken.None)
            );

            Assert.Null(stopException);
        }
    }
}
