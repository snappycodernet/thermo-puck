namespace Thermo_Puck.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial : DbMigration
    {
        public override void Up()
        {
      CreateTable(
          "dbo.SensorModels",
          c => new
          {
            Id = c.Int(nullable: false, identity: true),
            Model = c.String(nullable: false),
            MAC_Address = c.String(nullable: false),
            InternalTemp = c.Double(nullable: false),
            ExternalTemp1 = c.Double(nullable: false),
            ExternalTemp2 = c.Double(nullable: false),
            BatteryPercentage = c.Double(nullable: false),
            RangeSensorReading = c.Double(nullable: false),
            ChargeRate = c.Double(nullable: false),
            ReadDate = DateTime.Now,
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.SensorModels");
        }
    }
}
