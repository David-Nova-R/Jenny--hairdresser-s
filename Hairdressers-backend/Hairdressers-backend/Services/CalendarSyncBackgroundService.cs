using Hairdressers_backend.Interfaces;

namespace Hairdressers_backend.Services
{
    public class CalendarSyncBackgroundService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<CalendarSyncBackgroundService> _logger;
        private readonly TimeSpan _interval = TimeSpan.FromMinutes(5);

        public CalendarSyncBackgroundService(IServiceScopeFactory scopeFactory, ILogger<CalendarSyncBackgroundService> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("CalendarSyncBackgroundService démarré.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _scopeFactory.CreateScope();
                    var appointmentService = scope.ServiceProvider.GetRequiredService<IAppointmentService>();
                    await appointmentService.SyncFromGoogleCalendarAsync();
                    _logger.LogInformation("Sync Google Calendar effectuée à {Time}", DateTime.Now);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Erreur lors de la sync Google Calendar.");
                }

                await Task.Delay(_interval, stoppingToken);
            }
        }
    }
}
