// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract ManufacturerVerifier is AccessControl {
    bytes32 public constant REGULATOR_ROLE = keccak256("REGULATOR_ROLE");
    bytes32 public constant MANUFACTURER_ROLE = keccak256("MANUFACTURER_ROLE");

    mapping(address => bool) public verifiedManufacturers;

    event ManufacturerVerified(address manufacturer);
    event ManufacturerRevoked(address manufacturer);

    constructor(address initialRegulator) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(REGULATOR_ROLE, initialRegulator);
    }

    modifier onlyRegulator() {
        require(hasRole(REGULATOR_ROLE, msg.sender), "Caller is not a regulator");
        _;
    }

    function verifyManufacturer(address manufacturer) public onlyRegulator {
        verifiedManufacturers[manufacturer] = true;
        grantRole(MANUFACTURER_ROLE, manufacturer);
        emit ManufacturerVerified(manufacturer);
    }

    function revokeManufacturer(address manufacturer) public onlyRegulator {
        verifiedManufacturers[manufacturer] = false;
        revokeRole(MANUFACTURER_ROLE, manufacturer);
        emit ManufacturerRevoked(manufacturer);
    }

    function isVerifiedManufacturer(address account) public view returns (bool) {
        return verifiedManufacturers[account];
    }
}