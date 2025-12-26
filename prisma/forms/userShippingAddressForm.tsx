"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

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
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River",
  "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
  "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau",
  "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara", "FCT"
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
        <Label className="block text-sm font-medium mb-1">Country</Label>
        <div className="flex gap-2">
          <select
            value={["Nigeria", "United Kingdom", "United States", "Canada", "Ghana"].includes(address.country) ? address.country : "Other"}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "Other") {
                handleChange("country", ""); // Clear for manual entry
              } else {
                handleChange("country", val);
              }
              setShowStateSelect(val === "Nigeria");
              setShowCityInput(val !== "Nigeria"); // Allow city input for non-Nigeria immediately
              setShowAddressInput(false);
            }}
            className="input w-full border-2 border-input h-7 rounded-sm"
          >
            <option value="Nigeria">Nigeria</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="Ghana">Ghana</option>
            <option value="Other">Other (Type below)</option>
          </select>
        </div>
        {(!["Nigeria", "United Kingdom", "United States", "Canada", "Ghana"].includes(address.country)) && (
          <Input
            type="text"
            value={address.country}
            onChange={(e) => handleChange("country", e.target.value)}
            className="input mt-2"
            placeholder="Type your country name"
          />
        )}
      </div>

      {/* State */}
      {showStateSelect && (
        <div>
          <Label className="block text-sm font-medium mb-1">State</Label>
          <select
            value={address.state}
            onChange={(e) => {
              handleChange("state", e.target.value);
              setShowCityInput(true);
              setShowAddressInput(false);
            }}
            className="input w-full border-2 border-input h-7 rounded-sm"
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
          <Label className="block text-sm font-medium mb-1">City</Label>
          <Input
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
            <Label className="block text-sm font-medium mb-1">Address</Label>
            <Input
              type="text"
              value={address.address}
              onChange={(e) => handleChange("address", e.target.value)}
              name="address"
              className="input"
              placeholder="Street Address"
            />
          </div>

          <div>
            <Label className="block text-sm font-medium mb-1">Phone</Label>
            <Input
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
              <Label className="block text-sm font-medium mb-1">ZIP / Postal Code (optional)</Label>
              <Input
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

