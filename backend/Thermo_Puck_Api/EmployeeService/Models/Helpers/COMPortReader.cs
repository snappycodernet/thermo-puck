using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Ports;
using System.Linq;
using System.Threading;
using System.Web;

namespace Thermo_Puck.Models.Helpers
{
  public class COMPortReader
  {
    public string DataPacket { get; set; } = "";
    private SerialPort COMPort = new SerialPort();
    private int port = 0;
    public static bool EnableDTR = false;

    public SensorModel ReadData(int port)
    {
      this.port = port;

      try
      {
        if(!COMPort.IsOpen)
        {
          COMPort.PortName = "COM" + this.port;
          COMPort.BaudRate = 115200;
          COMPort.DataBits = 8;
          COMPort.Handshake = Handshake.None;
          COMPort.Parity = Parity.None;
          COMPort.StopBits = StopBits.One;
          COMPort.ReadTimeout = 5000;
          COMPort.DtrEnable = EnableDTR;

          COMPort.Open();
        }

        DataPacket = COMPort.ReadLine();
      }
      catch (TimeoutException) { COMPort.Close(); Thread.Sleep(500); EnableDTR = !EnableDTR; return ReadData(port); }
      catch (InvalidOperationException iex) { string readthis = iex.Message; return null; }
      catch(UnauthorizedAccessException ex) { throw new Exception("UnauthorizedAccess: " + ex.Message); }
      catch(IOException) { return null; }
      finally
      {
        COMPort.Close();
      }

      return GenerateFilteredDataPacket(DataPacket);
    }

    private SensorModel GenerateFilteredDataPacket(string dataPacket)
    {
      SensorModel model = new SensorModel();

      if (dataPacket.Length > 0 && dataPacket.Contains(",") && dataPacket.Contains("AE") && !dataPacket.Contains(",,"))
      {
        string[] splitData = dataPacket.Split(',');

        if (splitData.Length < 9)
        {
          double internalTemp = 0.00;
          double externalTemp1 = 0.00;
          double externalTemp2 = 0.00;
          double battery = 0.00;
          double range = 0.00;

          double.TryParse(splitData[2], out internalTemp);
          double.TryParse(splitData[3], out externalTemp1);
          double.TryParse(splitData[4], out externalTemp2);
          double.TryParse(splitData[5], out battery);
          double.TryParse(splitData[splitData.Length - 1], out range);

          if(battery > 0)
          {
            battery = Math.Floor(((battery - 3) / (4.23 - 3)) * 100);
          }

          if(battery > 100)
          {
            battery = 100;
          }

          model.Model = splitData[0];
          model.Serial = splitData[1];
          model.InternalTemp = internalTemp;
          model.ExternalTemp1 = externalTemp1;
          model.ExternalTemp2 = externalTemp2;
          model.BatteryPercentage = battery;
          model.RangeSensorReading = range;
        }
      }
      else
      {
        model.Model = "";
        model.Serial = "AEXXX";
        model.InternalTemp = 0;
        model.ExternalTemp1 = 0;
        model.ExternalTemp2 = 0;
        model.BatteryPercentage = 0;
        model.RangeSensorReading = 0;
      }

      return model;
    }
  }
}
