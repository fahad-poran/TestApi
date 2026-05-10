using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TestApi.Application.DTOs;
using TestApi.Application.Interfaces;

namespace TestApi.Application.Services
{
    //public class RBOSetupService : IRBOSetupService
    //{
        //private readonly ApplicationDbContext _context;

        //public RBOSetupService(ApplicationDbContext context)
        //{
        //    _context = context;
        //}

        //public async Task<List<BuyerDropdownDto>> GetBuyersForDropdown(string staticBuyerName, int? id = null)
        //{
        //    var query = _context.RBOWiseAppSetups
        //        .Where(r => r.IsActive == 1);

        //    if (id.HasValue && id.Value > 0)
        //    {
        //        query = query.Where(r => r.RBOWiseAppSetupId == id.Value);
        //    }

        //    var buyers = await query
        //        .Select(r => new BuyerDropdownDto
        //        {
        //            Id = r.RBOWiseAppSetupId,
        //            Name = r.RBOName,
        //            BuyerName = staticBuyerName
        //        })
        //        .OrderBy(r => r.Name)
        //        .ToListAsync();

        //    return buyers;
        
    
}
