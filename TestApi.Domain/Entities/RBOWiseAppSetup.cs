using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TestApi.Domain.Entities
{
    public class RBOWiseAppSetup
    {
        public int RBOWiseAppSetupId { get; set; }
        public string RBOName { get; set; }
        public int ItemPriceEditable { get; set; }
        public int HasCustomerWisePrice { get; set; }
        public int HasItemVariablePrice { get; set; }
        public int LeadTime { get; set; }
        public string LogoURL { get; set; }
        public int IsCustomerCodeAuto { get; set; }
        public int IsActive { get; set; }
        public string IsOther { get; set; }
        public int IsSSI { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
