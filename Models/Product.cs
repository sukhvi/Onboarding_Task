using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace Onboarding_Task.Models
{
    public partial class Product
    {
        public Product()
        {
            Sales = new HashSet<Sales>();
        }

        public int Id { get; set; }
        [Required(ErrorMessage = "Product {0} is required")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Product {0} is required")]
        [Range(0, double.MaxValue)]
        public double Price { get; set; }

        public virtual ICollection<Sales> Sales { get; set; }
    }
}
