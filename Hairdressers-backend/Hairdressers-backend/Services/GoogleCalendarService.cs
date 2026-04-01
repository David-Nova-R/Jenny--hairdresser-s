using Google.Apis.Auth.OAuth2;
using Google.Apis.Calendar.v3;
using Google.Apis.Calendar.v3.Data;
using Google.Apis.Services;
using Hairdressers_backend.Interfaces;

namespace Hairdressers_backend.Services
{
    public class GoogleCalendarService : IGoogleCalendarService
    {
        private readonly CalendarService _calendarService;
        private readonly string _calendarId;
        private readonly TimeZoneInfo _salonTimeZone;

        public GoogleCalendarService(IConfiguration configuration)
        {
            _calendarId = configuration["Google:CalendarId"]
                ?? throw new InvalidOperationException("Google Calendar ID not found.");

            _salonTimeZone = TimeZoneInfo.FindSystemTimeZoneById("America/Toronto");

            GoogleCredential credential;
            var credentialsJson = configuration["Google:ServiceAccountJson"];
            var credentialsPath = configuration["Google:ServiceAccountPath"];

            if (credentialsJson != null)
                credential = GoogleCredential.FromJson(credentialsJson).CreateScoped(CalendarService.Scope.Calendar);
            else if (credentialsPath != null)
                credential = GoogleCredential.FromFile(credentialsPath).CreateScoped(CalendarService.Scope.Calendar);
            else
                throw new InvalidOperationException("Google credentials non configurés (Google:ServiceAccountJson ou Google:ServiceAccountPath requis).");

            _calendarService = new CalendarService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = "Hairdresser Backend"
            });
        }

        public async Task<string> CreateEventAsync(string title, string description, DateTime start, DateTime end)
        {
            var startLocal = DateTime.SpecifyKind(start, DateTimeKind.Unspecified);
            var endLocal = DateTime.SpecifyKind(end, DateTimeKind.Unspecified);

            var startOffset = new DateTimeOffset(startLocal, _salonTimeZone.GetUtcOffset(startLocal));
            var endOffset = new DateTimeOffset(endLocal, _salonTimeZone.GetUtcOffset(endLocal));

            var newEvent = new Event()
            {
                Summary = title,
                Description = description,
                Start = new EventDateTime()
                {
                    DateTimeDateTimeOffset = startOffset,
                    TimeZone = "America/Toronto"
                },
                End = new EventDateTime()
                {
                    DateTimeDateTimeOffset = endOffset,
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

        public async Task<IList<Event>> GetAppointmentsAsync(DateTime? timeMin = null, DateTime? timeMax = null)
        {
            var request = _calendarService.Events.List(_calendarId);

            var minLocal = DateTime.SpecifyKind(timeMin ?? DateTime.Now, DateTimeKind.Unspecified);
            request.TimeMinDateTimeOffset = new DateTimeOffset(minLocal, _salonTimeZone.GetUtcOffset(minLocal));

            if (timeMax.HasValue)
            {
                var maxLocal = DateTime.SpecifyKind(timeMax.Value, DateTimeKind.Unspecified);
                request.TimeMaxDateTimeOffset = new DateTimeOffset(maxLocal, _salonTimeZone.GetUtcOffset(maxLocal));
            }

            request.SingleEvents = true;
            request.OrderBy = EventsResource.ListRequest.OrderByEnum.StartTime;

            var events = await request.ExecuteAsync();
            return events.Items ?? new List<Event>();
        }
    }
}