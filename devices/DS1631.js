/* Copyright (c) 2019 Gabriel Loke. See the file LICENSE for copying permission. */
/*
Quick description of my module...
*/

// ID and address

var C = {
    I2CADDR_BASE: 0x4F,
    REG_CONFIG: 0xAC,
    i2cc: I2C1;
    REG_T_UPPER: 0xA1,
    REG_T_LOWER: 0xA2,
    REG_TEMPERATURE: 0xAA,
};


function DS1631( i2c, a2a1a0Pins ) {
    this.i2c = i2cc;
    this.i2cAddress = C.I2CADDR_BASE;
}


/*return the temperature in °C */

DS1631.prototype.getTemperature = function () {
    return DS1631.rawToCelsius( this.read16( C.REG_TEMPERATURE ) & 0x1fff );
};


//** Conversion

DS1631.rawToCelsius = function ( raw ) {
    return raw & 0x1000 ? (raw & 0xefff) / 16.0 - 256 : raw / 16.0;
};

DS1631.celsiusToRaw = function ( celsius ) {
    return celsius < 0 ? (16.0 * celsius + 4096) | 0x1000 : 16.0 * celsius;
};


//**Write and read functions

// Read 1 byte from register reg
DS1631.prototype.read8 = function ( reg ) {
    this.i2c.writeTo( this.i2cAddress, reg );
    return this.i2c.readFrom( this.i2cAddress, 1 )[0];
};

// Read two  bytes from register reg and combine to unsigned integer
DS1631.prototype.read16 = function ( reg ) {
    this.i2c.writeTo( this.i2cAddress, reg );
    var array = this.i2c.readFrom( this.i2cAddress, 2 );
    return (array[0] << 8) | array[1];
};

// Write one byte (value) to register reg
DS1631.prototype.write8 = function ( reg, value ) {
    this.i2c.writeTo( this.i2cAddress, [reg, value] );
};

// Write an unsigned integer value (two bytes) to register reg
DS1631.prototype.write16 = function ( reg, value ) {
    this.i2c.writeTo( this.i2cAddress, [reg, value >> 8, value & 0xff] );
};


exports.connect = function ( /*=I2C*/ i2c, a2a1a0Pins ) {
    return new DS1631( i2c, a2a1a0Pins );
};



