"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

type ShippingAddress = {
  id?: string;
  country: string;
  state: string;
  city: string;
  address: string;
  zip?: string;
  phone?: string;
};

const NIGERIA_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River",
  "Delta","Ebonyi","Edo","Ekiti","Enugu","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina",
  "Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau",
  "Rivers","Sokoto","Taraba","Yobe","Zamfara","FCT"
];

type Props = {
  userId: string;
  existing?: ShippingAddress;
  onSaved?: (address: ShippingAddress) => void;
};

export default function ShippingAddressForm({ userId, existing, onSaved }: Props) {
  const [address, setAddress] = useState<ShippingAddress>({
    country: existing?.country || "Nigeria",
    state: existing?.state || "Ilorin",
    city: existing?.city || "",
    address: existing?.address || "",
    zip: existing?.zip || "",
    phone: existing?.phone || "",
    id: existing?.id,
  });

  const [showStateSelect, setShowStateSelect] = useState(address.country === "Nigeria");
  const [showCityInput, setShowCityInput] = useState(!!address.state);
  const [showAddressInput, setShowAddressInput] = useState(!!address.city);

  const handleChange = (field: keyof ShippingAddress, value: string) => {
    const updated = { ...address, [field]: value };
    setAddress(updated);
    if (onSaved) onSaved(updated); // notify parent
  };

  return (
    <div className="flex flex-col gap-3 p-3 border rounded shadow max-w-md">
      {/* Country */}
      <div>
        <label className="block text-sm font-medium mb-1">Country</label>
        <select
          value={address.country}
          onChange={(e) => {
            handleChange("country", e.target.value);
            setShowStateSelect(e.target.value === "Nigeria");
            setShowCityInput(false);
            setShowAddressInput(false);
          }}
          className="input"
        >
          <option value="Nigeria">Nigeria</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* State */}
      {showStateSelect && (
        <div>
          <label className="block text-sm font-medium mb-1">State</label>
          <select
            value={address.state}
            onChange={(e) => {
              handleChange("state", e.target.value);
              setShowCityInput(true);
              setShowAddressInput(false);
            }}
            className="input"
          >
            {NIGERIA_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* City */}
      {showCityInput && (
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <input
            type="text"
            value={address.city}
            onChange={(e) => {
              handleChange("city", e.target.value);
              setShowAddressInput(!!e.target.value);
            }}
            className="input"
            placeholder="City"
          />
        </div>
      )}

      {/* Address & Phone */}
      {showAddressInput && (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              value={address.address}
              onChange={(e) => handleChange("address", e.target.value)}
              name="address"
              className="input"
              placeholder="Street Address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="text"
              value={address.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              name="phone"
              className="input"
              placeholder="Phone Number"
            />
          </div>

          {address.country === "Nigeria" && (
            <div>
              <label className="block text-sm font-medium mb-1">ZIP / Postal Code (optional)</label>
              <input
                type="text"
                value={address.zip}
                onChange={(e) => handleChange("zip", e.target.value)}
                name="zip"
                className="input"
                placeholder="ZIP / Postal Code"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

