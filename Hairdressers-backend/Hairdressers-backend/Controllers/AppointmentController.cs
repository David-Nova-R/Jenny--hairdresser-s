using Microsoft.AspNetCore.Mvc;

namespace Hairdressers_backend.Controllers
{
    public class AppointmentController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
