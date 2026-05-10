using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TestApi.Domain.Entities;

namespace TestApi.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BuyerController : ControllerBase
    {
        // Static buyer data
        private static readonly List<BuyerModel> _buyers = new List<BuyerModel>
        {
            new BuyerModel { BuyerId = 1, BuyerName = "SSI", IsActive = true },
            new BuyerModel { BuyerId = 2, BuyerName = "H&M", IsActive = true },
            new BuyerModel { BuyerId = 3, BuyerName = "CELIO", IsActive = true },
            new BuyerModel { BuyerId = 4, BuyerName = "NYGARD", IsActive = false },
            new BuyerModel { BuyerId = 5, BuyerName = "KARIBAN", IsActive = true }
        };

        [HttpGet("get-buyers")]
        public IActionResult GetBuyers(int? BuyerId = null)
        {
            var data = _buyers
                .Where(b => b.IsActive && (!BuyerId.HasValue || b.BuyerId == BuyerId.Value))
                .Select(b => new
                {
                    BuyerId = b.BuyerId,
                    BuyerName = b.BuyerName
                })
                .ToList();

            return Ok(new { success = true, data = data, total = data.Count });
        }
    }

    public class BuyerModel
    {
        public int BuyerId { get; set; }
        public string BuyerName { get; set; }
        public bool IsActive { get; set; }
    }
}
