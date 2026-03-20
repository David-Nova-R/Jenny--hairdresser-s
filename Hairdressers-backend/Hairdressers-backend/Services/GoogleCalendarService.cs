using Google.Apis.Auth.OAuth2;
using Google.Apis.Calendar.v3.Data;
using Google.Apis.Calendar.v3;
using Google.Apis.Services;
using Hairdressers_backend.Interfaces;

namespace Hairdressers_backend.Services
{
    public class GoogleCalendarService : IGoogleCalendarService
    {
        private readonly CalendarService _calendarService;
        private readonly string _calendarId;

        public GoogleCalendarService(IConfiguration configuration)
        {
            var credentialsPath = configuration["Google:ServiceAccountPath"]
                ?? throw new InvalidOperationException("Google credentials path not found.");

            _calendarId = configuration["Google:CalendarId"]
                ?? throw new InvalidOperationException("Google Calendar ID not found.");

            GoogleCredential credential = GoogleCredential
                .FromFile(credentialsPath)
                .CreateScoped(CalendarService.Scope.Calendar);

            _calendarService = new CalendarService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = "Hairdresser Backend"
            });
        }

        public async Task<string> CreateEventAsync(string title, string description, DateTime start, DateTime end)
        {
            var newEvent = new Event()
            {
                Summary = title,
                Description = description,
                Start = new EventDateTime()
                {
                    DateTimeDateTimeOffset = start,
                    TimeZone = "America/Toronto"
                },
                End = new EventDateTime()
                {
                    DateTimeDateTimeOffset = end,
                    TimeZone = "America/Toronto"
                }
            };

            var request = _calendarService.Events.Insert(newEvent, _calendarId);
            var createdEvent = await request.ExecuteAsync();

            return createdEvent.Id;
        }

        public async Task DeleteEventAsync(string eventId)
        {
            await _calendarService.Events.Delete(_calendarId, eventId).ExecuteAsync();
        }
    }
}
