import { useEffect, useState } from 'react';
import axios from 'axios';
import { Country, State, City } from 'country-state-city';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const REGIONS = [
    "Africa",
    "Asia",
    "Europe",
    "North America",
    "South America",
    "Oceania",
    "Antarctica",
    "United Kingdom", // As requested group
];

export default function AddressPriceForm() {
    const [fees, setFees] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        scope: 'country', // 'country' | 'region'
        region: '',
        country: '',
        state: '',
        city: '',
        price: '',
    });
    const [editId, setEditId] = useState<string | null>(null);

    // Derived lists for dropdowns
    const countries = Country.getAllCountries();
    const states = formData.country ? State.getStatesOfCountry(formData.country) : [];
    const cities = formData.country && formData.state ? City.getCitiesOfState(formData.country, formData.state) : [];

    useEffect(() => {
        fetchFees();
    }, []);

    const fetchFees = async () => {
        const res = await axios.get('/api/dbhandler?model=deliveryFee');
        setFees(res.data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let payload: any = {
            price: parseFloat(formData.price),
        };

        if (formData.scope === 'region') {
            payload.region = formData.region;
            payload.country = null;
            payload.state = null;
            payload.city = null;
        } else {
            payload.region = null;
            payload.country = formData.country;
            payload.state = formData.state || null;
            payload.city = formData.city || null;
        }

        if (editId) {
            await axios.put(`/api/dbhandler?model=deliveryFee&id=${editId}`, payload);
        } else {
            await axios.post('/api/dbhandler?model=deliveryFee', payload);
        }
        resetForm();
        fetchFees();
    };

    const handleEdit = (item: any) => {
        if (item.region) {
            setFormData({
                scope: 'region',
                region: item.region,
                country: '',
                state: '',
                city: '',
                price: item.price.toString(),
            });
        } else {
            setFormData({
                scope: 'country',
                region: '',
                country: item.country,
                state: item.state || '',
                city: item.city || '',
                price: item.price.toString(),
            });
        }
        setEditId(item.id);
    };

    const handleDelete = async (id: string) => {
        await axios.delete(`/api/dbhandler?model=deliveryFee&id=${id}`);
        fetchFees();
    };

    const resetForm = () => {
        setFormData({ scope: 'country', region: '', country: '', state: '', city: '', price: '' });
        setEditId(null);
    };

    const getName = (type: 'country' | 'state' | 'city', code: string, countryCode?: string) => {
        if (!code) return 'All';
        if (type === 'country') return Country.getCountryByCode(code)?.name || code;
        if (type === 'state') return State.getStateByCodeAndCountry(code, countryCode!)?.name || code;
        return code;
    };

    const onRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({ ...formData, region: e.target.value });
    }

    const onCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({ ...formData, country: e.target.value, state: '', city: '' });
    }

    const onStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({ ...formData, state: e.target.value, city: '' });
    }

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className='flex flex-col w-full max-w-lg gap-3 p-4 border rounded-md m-auto bg-card text-card-foreground shadow-sm'>
                <h2 className='font-semibold text-xl'>Manage Delivery Fees</h2>

                <Tabs value={formData.scope} onValueChange={(v) => setFormData({ ...formData, scope: v })} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="country">Country Specific</TabsTrigger>
                        <TabsTrigger value="region">Region / Group</TabsTrigger>
                    </TabsList>
                </Tabs>

                {formData.scope === 'region' ? (
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium">Region / Group</label>
                        <select
                            className="w-full rounded-md border p-2 bg-background"
                            value={formData.region}
                            onChange={onRegionChange}
                            required={formData.scope === 'region'}
                        >
                            <option value="">Select Region</option>
                            {REGIONS.map((r) => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                    </div>
                ) : (
                    <>
                        {/* Country */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium">Country</label>
                            <select
                                className="w-full rounded-md border p-2 bg-background"
                                value={formData.country}
                                onChange={onCountryChange}
                                required={formData.scope === 'country'}
                            >
                                <option value="">Select Country</option>
                                {countries.map((c) => (
                                    <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* State */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium">State (Optional)</label>
                            <select
                                className="w-full rounded-md border p-2 bg-background"
                                value={formData.state}
                                onChange={onStateChange}
                                disabled={!formData.country}
                            >
                                <option value="">All States</option>
                                {states.map((s) => (
                                    <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* City */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium">City (Optional)</label>
                            <select
                                className="w-full rounded-md border p-2 bg-background"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                disabled={!formData.state}
                            >
                                <option value="">All Cities</option>
                                {cities.map((c: any) => (
                                    <option key={c.name} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </>
                )}

                {/* Price */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium">Price (₦)</label>
                    <Input
                        type="number"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                    />
                </div>

                <div className="flex gap-2 pt-2">
                    <Button type="submit" className="flex-1">{editId ? 'Update Fee' : 'Add Fee'}</Button>
                    {editId && <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>}
                </div>
            </form>

            {/* List */}
            <div className="mt-8 max-w-3xl m-auto">
                <h3 className="font-semibold text-lg mb-4">Current Delivery Fees</h3>
                <div className="grid gap-3">
                    {fees.length === 0 ? <p className="text-muted-foreground text-center">No fees configured.</p> : null}
                    {fees.map((item) => (
                        <div key={item.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-muted/50 p-3 rounded-lg border">
                            <div className="mb-2 sm:mb-0">
                                {item.region ? (
                                    <div className="font-medium text-base text-primary">
                                        Region: {item.region}
                                    </div>
                                ) : (
                                    <div className="font-medium text-base">
                                        {getName('country', item.country)}
                                        {item.state && ` > ${getName('state', item.state, item.country)}`}
                                        {item.city && ` > ${item.city}`}
                                    </div>
                                )}
                                <div className="text-sm text-muted-foreground">Price: ₦{item.price.toLocaleString()}</div>
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>Edit</Button>
                                <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>Delete</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
