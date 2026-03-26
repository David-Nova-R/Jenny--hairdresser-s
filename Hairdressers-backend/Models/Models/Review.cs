using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Models
{
    public class Review
    {
        public int Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public int Stars { get; set; }
        public virtual User? User { get; set; }
        public bool IsVisible { get; set; }
    }
}
