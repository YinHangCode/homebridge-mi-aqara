'use strict';

const inherits = require('util').inherits;

module.exports = {
  registerWith: function (hap) {
    const Characteristic = hap.Characteristic;
    const Service = hap.Service;
    
    /// /////////////////////////////////////////////////////////////////////////
    // Sensitivity
    /// ///////////////////////////////////////////////////////////////////////// 
    Characteristic.Sensitivity = function() {
      Characteristic.call(this, 'Sensitivity', 'E863F120-079E-48FF-8F27-9C2605A29F52');
      this.setProps({
        format: Characteristic.Formats.UINT8,
        minValue: 0,
        maxValue: 7,
        validValues: [0, 4, 7],
        perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY, Characteristic.Perms.WRITE]
      });
      this.value = this.getDefaultValue();
    };
    inherits(Characteristic.Sensitivity, Characteristic);
    Characteristic.Sensitivity.UUID = 'E863F120-079E-48FF-8F27-9C2605A29F52';
    
    Characteristic.Sensitivity.HIGH = 0;
    Characteristic.Sensitivity.MEDIUM = 4;
    Characteristic.Sensitivity.LOW = 7;
    
    /// /////////////////////////////////////////////////////////////////////////
    // Duration
    /// ///////////////////////////////////////////////////////////////////////// 
    Characteristic.Duration = function() {
      Characteristic.call(this, 'Duration', 'E863F12D-079E-48FF-8F27-9C2605A29F52');
      this.setProps({
        format: Characteristic.Formats.UINT16,
        unit: Characteristic.Units.SECONDS,
        minValue: 5,
        maxValue: 15 * 3600,
        validValues: [
          5, 10, 20, 30,
          1 * 60, 2 * 60, 3 * 60, 5 * 60, 10 * 60, 20 * 60, 30 * 60,
          1 * 3600, 2 * 3600, 3 * 3600, 5 * 3600, 10 * 3600, 12 * 3600, 15 * 3600
        ],
        perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY, Characteristic.Perms.WRITE]
      });
      this.value = this.getDefaultValue();
    };
    inherits(Characteristic.Duration, Characteristic);
    Characteristic.Duration.UUID = 'E863F12D-079E-48FF-8F27-9C2605A29F52';

    /// /////////////////////////////////////////////////////////////////////////
    // ResetTotal
    /// ///////////////////////////////////////////////////////////////////////// 
    Characteristic.ResetTotal = function() {
      Characteristic.call(this, 'Reset Total', 'E863F112-079E-48FF-8F27-9C2605A29F52');
      this.setProps({
        format: Characteristic.Formats.UINT32,
        unit: Characteristic.Units.SECONDS,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY, Characteristic.Perms.WRITE]
      });
      this.value = this.getDefaultValue();
    };
    inherits(Characteristic.ResetTotal, Characteristic);
    Characteristic.ResetTotal.UUID = 'E863F112-079E-48FF-8F27-9C2605A29F52';

    /// /////////////////////////////////////////////////////////////////////////
    // HistoryStatus
    /// ///////////////////////////////////////////////////////////////////////// 
    Characteristic.HistoryStatus = function() {
      Characteristic.call(this, 'History Status', 'E863F116-079E-48FF-8F27-9C2605A29F52');
      this.setProps({
        format: Characteristic.Formats.DATA,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY, Characteristic.Perms.WRITE]
      });
      this.value = this.getDefaultValue();
    };
    inherits(Characteristic.HistoryStatus, Characteristic);
    Characteristic.HistoryStatus.UUID = 'E863F116-079E-48FF-8F27-9C2605A29F52';

    /// /////////////////////////////////////////////////////////////////////////
    // HistoryEntries
    /// ///////////////////////////////////////////////////////////////////////// 
    Characteristic.HistoryEntries = function() {
      Characteristic.call(this, 'History Entries', 'E863F117-079E-48FF-8F27-9C2605A29F52');
      this.setProps({
        format: Characteristic.Formats.DATA,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY, Characteristic.Perms.WRITE]
      });
      this.value = this.getDefaultValue();
    };
    inherits(Characteristic.HistoryEntries, Characteristic);
    Characteristic.HistoryEntries.UUID = 'E863F117-079E-48FF-8F27-9C2605A29F52';

    /// /////////////////////////////////////////////////////////////////////////
    // HistoryRequest
    /// ///////////////////////////////////////////////////////////////////////// 
    Characteristic.HistoryRequest = function() {
      Characteristic.call(this, 'History Request', 'E863F11C-079E-48FF-8F27-9C2605A29F52');
      this.setProps({
        format: Characteristic.Formats.DATA,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY, Characteristic.Perms.WRITE]
      });
      this.value = this.getDefaultValue();
    };
    inherits(Characteristic.HistoryRequest, Characteristic);
    Characteristic.HistoryRequest.UUID = 'E863F11C-079E-48FF-8F27-9C2605A29F52';

    /// /////////////////////////////////////////////////////////////////////////
    // SetTime
    /// ///////////////////////////////////////////////////////////////////////// 
    Characteristic.SetTime = function() {
      Characteristic.call(this, 'Set Time', 'E863F121-079E-48FF-8F27-9C2605A29F52');
      this.setProps({
        format: Characteristic.Formats.DATA,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY, Characteristic.Perms.WRITE]
      });
      this.value = this.getDefaultValue();
    };
    inherits(Characteristic.SetTime, Characteristic);
    Characteristic.SetTime.UUID = 'E863F121-079E-48FF-8F27-9C2605A29F52';

    /// /////////////////////////////////////////////////////////////////////////
    // LastActivation
    /// ///////////////////////////////////////////////////////////////////////// 
    Characteristic.LastActivation = function() {
      Characteristic.call(this, 'Last Activation', 'E863F11A-079E-48FF-8F27-9C2605A29F52');
      this.setProps({
        format: Characteristic.Formats.UINT32,
        unit: Characteristic.Units.SECONDS,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY]
      });
      this.value = this.getDefaultValue();
    };
    inherits(Characteristic.LastActivation, Characteristic);
    Characteristic.LastActivation.UUID = 'E863F11A-079E-48FF-8F27-9C2605A29F52';

    /// /////////////////////////////////////////////////////////////////////////
    // TimesOpened
    /// ///////////////////////////////////////////////////////////////////////// 
    Characteristic.TimesOpened = function() {
      Characteristic.call(this, 'Times Opened', 'E863F129-079E-48FF-8F27-9C2605A29F52');
      this.setProps({
        format: Characteristic.Formats.UINT32,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY]
      });
      this.value = this.getDefaultValue();
    };
    inherits(Characteristic.TimesOpened, Characteristic);
    Characteristic.TimesOpened.UUID = 'E863F129-079E-48FF-8F27-9C2605A29F52';

    /// /////////////////////////////////////////////////////////////////////////
    // OpenDuration
    /// ///////////////////////////////////////////////////////////////////////// 
    Characteristic.OpenDuration = function() {
      Characteristic.call(this, 'Open Duration', 'E863F118-079E-48FF-8F27-9C2605A29F52');
      this.setProps({
        format: Characteristic.Formats.UINT32,
        unit: Characteristic.Units.SECONDS,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY, Characteristic.Perms.WRITE]
      });
      this.value = this.getDefaultValue();
    };
    inherits(Characteristic.OpenDuration, Characteristic);
    Characteristic.OpenDuration.UUID = 'E863F118-079E-48FF-8F27-9C2605A29F52';

    /// /////////////////////////////////////////////////////////////////////////
    // ClosedDuration
    /// ///////////////////////////////////////////////////////////////////////// 
    Characteristic.ClosedDuration = function() {
      Characteristic.call(this, 'Closed Duration', 'E863F119-079E-48FF-8F27-9C2605A29F52');
      this.setProps({
        format: Characteristic.Formats.UINT32,
        unit: Characteristic.Units.SECONDS,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY, Characteristic.Perms.WRITE]
      });
      this.value = this.getDefaultValue();
    };
    inherits(Characteristic.ClosedDuration, Characteristic);
    Characteristic.ClosedDuration.UUID = 'E863F119-079E-48FF-8F27-9C2605A29F52';
    
    /// /////////////////////////////////////////////////////////////////////////
    // PowerConsumption
    /// ///////////////////////////////////////////////////////////////////////// 
    Characteristic.PowerConsumption = function() {
      Characteristic.call(this, 'Consumption', 'E863F10D-079E-48FF-8F27-9C2605A29F52');
      this.setProps({
        format: Characteristic.Formats.UINT16,
        unit: 'watts',
        maxValue: 1000000000,
        minValue: 0,
        minStep: 1,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY]
      });
      this.value = this.getDefaultValue();
    };
    inherits(Characteristic.PowerConsumption, Characteristic);
    Characteristic.PowerConsumption.UUID = 'E863F10D-079E-48FF-8F27-9C2605A29F52';
    
    /// /////////////////////////////////////////////////////////////////////////
    // PowerConsumptionVA
    /// ///////////////////////////////////////////////////////////////////////// 
    Characteristic.PowerConsumptionVA = function() {
      Characteristic.call(this, 'Consumption VA', 'E863F110-079E-48FF-8F27-9C2605A29F52');
      this.setProps({
        format: Characteristic.Formats.UINT16,
        unit: 'volt-amperes',
        maxValue: 1000000000,
        minValue: 0,
        minStep: 1,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY]
      });
      this.value = this.getDefaultValue();
    };
    inherits(Characteristic.PowerConsumptionVA, Characteristic);
    Characteristic.PowerConsumptionVA.UUID = 'E863F110-079E-48FF-8F27-9C2605A29F52';
    
    /// /////////////////////////////////////////////////////////////////////////
    // TotalPowerConsumption
    /// ///////////////////////////////////////////////////////////////////////// 
    Characteristic.TotalPowerConsumption = function() {
      Characteristic.call(this, 'Total Consumption', 'E863F10C-079E-48FF-8F27-9C2605A29F52');
      this.setProps({
        format: Characteristic.Formats.FLOAT,
        unit: 'kilowatthours',
        maxValue: 1000000000,
        minValue: 0,
        minStep: 0.001,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY]
      });
      this.value = this.getDefaultValue();
    };
    inherits(Characteristic.TotalPowerConsumption, Characteristic);
    Characteristic.TotalPowerConsumption.UUID = 'E863F10C-079E-48FF-8F27-9C2605A29F52';
    
    /// /////////////////////////////////////////////////////////////////////////
    // TotalPowerConsumptionVA
    /// ///////////////////////////////////////////////////////////////////////// 
    Characteristic.TotalPowerConsumptionVA = function() {
      Characteristic.call(this, 'Total Consumption VA', 'E863F127-079E-48FF-8F27-9C2605A29F52');
      this.setProps({
        format: Characteristic.Formats.FLOAT,
        unit: 'kilovolt-ampereshours',
        maxValue: 1000000000,
        minValue: 0,
        minStep: 0.001,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY]
      });
      this.value = this.getDefaultValue();
    };
    inherits(Characteristic.TotalPowerConsumptionVA, Characteristic);
    Characteristic.TotalPowerConsumptionVA.UUID = 'E863F127-079E-48FF-8F27-9C2605A29F52';
    
    /// /////////////////////////////////////////////////////////////////////////
    // Volts
    /// ///////////////////////////////////////////////////////////////////////// 
    Characteristic.Volts = function() {
      Characteristic.call(this, 'Volts', 'E863F10A-079E-48FF-8F27-9C2605A29F52');
      this.setProps({
        format: Characteristic.Formats.UINT16,
        unit: 'volts',
        maxValue: 1000000000,
        minValue: 0,
        minStep: 1,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY]
      });
      this.value = this.getDefaultValue();
    };
    inherits(Characteristic.Volts, Characteristic);
    Characteristic.Volts.UUID = 'E863F10A-079E-48FF-8F27-9C2605A29F52';
    
    /// /////////////////////////////////////////////////////////////////////////
    // Amperes
    /// ///////////////////////////////////////////////////////////////////////// 
    Characteristic.Amperes = function() {
      Characteristic.call(this, 'Amperes', 'E863F126-079E-48FF-8F27-9C2605A29F52');
      this.setProps({
        format: Characteristic.Formats.UINT16,
        unit: 'amperes',
        maxValue: 1000000000,
        minValue: 0,
        minStep: 0.001,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY]
      });
      this.value = this.getDefaultValue();
    };
    inherits(Characteristic.Amperes, Characteristic);
    Characteristic.Amperes.UUID = 'E863F126-079E-48FF-8F27-9C2605A29F52';

    /// /////////////////////////////////////////////////////////////////////////
    // ContactSensor
    /// ///////////////////////////////////////////////////////////////////////// 
    Service.ContactSensor = function(displayName, subtype) {
      Service.call(this, displayName, '00000080-0000-1000-8000-0026BB765291', subtype);
      // Required Characteristics
      this.addCharacteristic(Characteristic.ContactSensorState);

      //EVE
      this.addCharacteristic(Characteristic.TimesOpened);
      this.addCharacteristic(Characteristic.OpenDuration);
      this.addCharacteristic(Characteristic.ClosedDuration);
      this.addCharacteristic(Characteristic.LastActivation);

      // Optional Characteristics
      this.addOptionalCharacteristic(Characteristic.StatusActive);
      this.addOptionalCharacteristic(Characteristic.StatusFault);
      this.addOptionalCharacteristic(Characteristic.StatusTampered);
      this.addOptionalCharacteristic(Characteristic.StatusLowBattery);
      this.addOptionalCharacteristic(Characteristic.Name);
    };
    inherits(Service.ContactSensor, Service);
    Service.ContactSensor.UUID = '00000080-0000-1000-8000-0026BB765291';
    
    /// /////////////////////////////////////////////////////////////////////////
    // Outlet
    /// ///////////////////////////////////////////////////////////////////////// 
    Service.Outlet = function(displayName, subtype) {
      Service.call(this, displayName, '00000047-0000-1000-8000-0026BB765291', subtype);
      
      // Required Characteristics
      this.addCharacteristic(Characteristic.On);
      this.addCharacteristic(Characteristic.OutletInUse);

      //EVE
      this.addOptionalCharacteristic(Characteristic.PowerConsumption);
      this.addOptionalCharacteristic(Characteristic.PowerConsumptionVA);
      this.addOptionalCharacteristic(Characteristic.TotalPowerConsumption);
      this.addOptionalCharacteristic(Characteristic.TotalPowerConsumptionVA);
      this.addOptionalCharacteristic(Characteristic.Volts);
      this.addOptionalCharacteristic(Characteristic.Amperes);

      // Optional Characteristics
      this.addOptionalCharacteristic(Characteristic.Name);
    
    };
    inherits(Service.Outlet, Service);
    Service.Outlet.UUID = '00000047-0000-1000-8000-0026BB765291';
    
    /// /////////////////////////////////////////////////////////////////////////
    // MotionSensor
    /// ///////////////////////////////////////////////////////////////////////// 
    Service.MotionSensor = function(displayName, subtype) {
      Service.call(this, displayName, '00000085-0000-1000-8000-0026BB765291', subtype);
      
      // Required Characteristics
      this.addCharacteristic(Characteristic.MotionDetected);

      //EVE
      this.addOptionalCharacteristic(Characteristic.Duration);
      this.addOptionalCharacteristic(Characteristic.LastActivation);
      this.addOptionalCharacteristic(Characteristic.Sensitivity);

      // Optional Characteristics
      this.addOptionalCharacteristic(Characteristic.StatusActive);
      this.addOptionalCharacteristic(Characteristic.StatusFault);
      this.addOptionalCharacteristic(Characteristic.StatusTampered);
      this.addOptionalCharacteristic(Characteristic.StatusLowBattery);
      this.addOptionalCharacteristic(Characteristic.Name);
    
    };
    inherits(Service.MotionSensor, Service);
    Service.MotionSensor.UUID = '00000085-0000-1000-8000-0026BB765291';

  }
};
