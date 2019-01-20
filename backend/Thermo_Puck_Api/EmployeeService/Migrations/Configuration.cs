namespace Thermo_Puck.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
  using Thermo_Puck.Models;

    internal sealed class Configuration : DbMigrationsConfiguration<Thermo_Puck.Models.Thermo_PuckContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(Thermo_Puck.Models.Thermo_PuckContext context)
        {
      context.SensorModels.AddOrUpdate(x => x.Id, new SensorModel() { Id = 1, Model = "TP3a", MAC_Address = "TF2:99393:3933", BatteryPercentage = 100, ChargeRate = 75, ExternalTemp1 = 75, ExternalTemp2 = 70, InternalTemp = 59, RangeSensorReading = -55 });
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data.
        }
    }
}
