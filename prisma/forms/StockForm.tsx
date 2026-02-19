// MinistryForm.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import StockTable from './stockdatatable';
import { toast } from 'sonner';




export default function StockForm() {
  const [stocks, setStocks] = useState([])
  const [products, setProducts] = useState<any>([]);
  const [formData, setFormData] = useState({
    productId: '',
    addedQuantity: 0,
    costPerProduct: 0,
    pricePerProduct: 0,
    product: '',
  });
  const [editId, setEditId] = useState(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  useEffect(() => {
    fetchStocks();
    fetchProducts()
  }, []);

  const fetchStocks = async () => {
    const res = await axios.get('/api/stock');
    console.log("stocks :", res.data)
    setStocks(res.data);
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/dbhandler?model=product');
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.productId || formData.addedQuantity <= 0 || formData.costPerProduct <= 0 || formData.pricePerProduct <= 0) {
      toast.error('Please fill all fields with valid values');
      return;
    }

    try {
      if (editId) {
        await axios.put('/api/stock', {
          stockId: editId,
          addedQuantity: formData.addedQuantity,
          costPerProduct: formData.costPerProduct,
          pricePerProduct: formData.pricePerProduct,
        });
        toast.success("Stock updated successfully");
      } else {
        await axios.post('/api/stock', {
          productId: formData.productId,
          addedQuantity: formData.addedQuantity,
          costPerProduct: formData.costPerProduct,
          pricePerProduct: formData.pricePerProduct,
        });
        toast.success("Stock created successfully");
      }
      resetForm();
      fetchStocks();
      fetchProducts();
    } catch (err) {
      console.error('Failed to submit stock:', err);
      toast.error("Failed to save stock");
    }
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProductIds.length === 0) {
      toast.error("No products selected for bulk stocking");
      return;
    }
    if (formData.addedQuantity <= 0 || formData.costPerProduct <= 0 || formData.pricePerProduct <= 0) {
      toast.error("Provide valid quantity and prices for all selected products");
      return;
    }

    setIsBulkLoading(true);
    try {
      const promises = selectedProductIds.map(pid => 
        axios.post('/api/stock', {
          productId: pid,
          addedQuantity: formData.addedQuantity,
          costPerProduct: formData.costPerProduct,
          pricePerProduct: formData.pricePerProduct,
        })
      );
      await Promise.all(promises);
      toast.success(`Successfully stocked ${selectedProductIds.length} products`);
      setSelectedProductIds([]);
      resetForm();
      fetchStocks();
      fetchProducts();
    } catch (err) {
      console.error("Bulk stock failed", err);
      toast.error("Some products failed to stock");
    } finally {
      setIsBulkLoading(false);
    }
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProductIds(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };



  const handleEdit = (item) => {
    if (!item?.id || !item?.addedQuantity || !item?.product) {
      console.error('Invalid stock item for edit:', item);
      return;
    }
    setFormData({
      productId: item.productId,
      product: item.product,
      addedQuantity: item.addedQuantity,
      costPerProduct: item.costPerProduct || 0,
      pricePerProduct: item.pricePerProduct || 0,
    });
    setEditId(item.id);
  };

  const handleProductInput = (item) => {
    if (!item) return;

    // Use the actual key your products have
    const productId = item.id || item._id;
    const productName = item.name || item.title;

    if (!productId || !productName) {
      console.error('Invalid product selected:', item);
      return;
    }

    setFormData({
      ...formData,
      productId: String(productId),
      product: productName,
    });
  };


  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/stock?id=${id}`);
      fetchStocks();
    } catch (err) {
      console.error('Failed to delete stock:', err);
    }
  };


  const resetForm = () => {
    setFormData({
      productId: '',
      addedQuantity: 0,
      costPerProduct: 0,
      pricePerProduct: 0,
      product: '',
    });
    setEditId(null);
  };





  return (
    <div>

      <form onSubmit={handleSubmit} className='flex flex-col w-full max-w-sm gap-2 justify-center items-center p-3 border-2 border-secondary-foreground rounded-sm m-2'>
        <h2 className='font-semibold text-lg'>Manage Products Stock</h2>

        <div className="w-full space-y-2 mb-4">
          <Label className="text-base font-semibold">Select Products To Stock</Label>
          <div className="max-h-60 overflow-y-auto border rounded-md p-2 space-y-2">
            {products.length > 0 ? (
              products.map((item: any, index: number) => (
                <div key={item.id} className="flex items-center space-x-2 border-b pb-2 last:border-0 hover:bg-muted/50 p-1 rounded transition-colors">
                  <Checkbox 
                    id={`prod-${item.id}`} 
                    checked={selectedProductIds.includes(item.id)}
                    onCheckedChange={() => toggleProductSelection(item.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <Label 
                      htmlFor={`prod-${item.id}`} 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer block truncate"
                    >
                      {item.name}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">Price: ₦{item.price}</p>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleProductInput(item)} 
                    className="h-8 text-[10px]"
                  >
                    Select
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No products available</p>
            )}
          </div>
          {selectedProductIds.length > 0 && (
            <p className="text-xs font-medium text-primary">{selectedProductIds.length} products selected for bulk stocking</p>
          )}
        </div>

        <div className="w-full space-y-1">
          <Label htmlFor="stock-product-name">Product Name</Label>
          <Input
            id="stock-product-name"
            placeholder="Selected Product Name"
            value={formData.product}
            disabled={true}
          />
        </div>

        <div className="w-full space-y-1">
          <Label htmlFor="stock-product-id">Product ID</Label>
          <Input
            id="stock-product-id"
            placeholder="Selected Product ID"
            value={formData.productId}
            disabled={true}
          />
        </div>

        <div className="w-full space-y-1">
          <Label htmlFor="stock-qty">Quantity to Add</Label>
          <Input
            id="stock-qty"
            type="number"
            placeholder="Quantity to add"
            value={formData.addedQuantity}
            onChange={(e) => setFormData({ ...formData, addedQuantity: Number(e.target.value) })}
          />
        </div>

        <div className="w-full space-y-1">
          <Label htmlFor="stock-cost">Cost Per Product (₦)</Label>
          <Input
            id="stock-cost"
            type="number"
            step="0.01"
            placeholder="Cost per product"
            value={formData.costPerProduct}
            onChange={(e) => setFormData({ ...formData, costPerProduct: Number(e.target.value) })}
          />
        </div>

        <div className="w-full space-y-1 mb-2">
          <Label htmlFor="stock-price">Price Per Product (₦)</Label>
          <Input
            id="stock-price"
            type="number"
            step="0.01"
            placeholder="Price per product"
            value={formData.pricePerProduct}
            onChange={(e) => setFormData({ ...formData, pricePerProduct: Number(e.target.value) })}
          />
        </div>

        <div className="flex w-full gap-2">
          {selectedProductIds.length > 1 ? (
             <Button 
               type="button" 
               className="flex-1" 
               disabled={isBulkLoading}
               onClick={handleBulkSubmit}
             >
               {isBulkLoading ? "Processing..." : `Stock ${selectedProductIds.length} Products`}
             </Button>
          ) : (
            <Button type="submit" className="flex-1">{editId ? 'Update' : 'Stock Product'}</Button>
          )}
          {editId && <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>}
        </div>

        <ul className='w-full'>
          <div>Added Stocks</div>
          {stocks.length > 0 ? (
            // stocks.map((item , index) => (
            //   <li key={index} className="flex flex-col justify-center items-center gap-2 my-2 bg-secondary rounded-md w-full p-2">
            //     <div className="flex flex-row gap-2">
            //       <span>{(index + 1)}. Stocked Product : </span>
            //       <span>{item.product}</span>
            //     </div>
            //     <p>Added Quantity : {item.addedQuantity || <em>No price tag</em>}</p>
            //     <div className='flex flex-row gap-2 p-1 w-full'>
            //       <Button onClick={() => handleEdit(item)} className='flex-1'>Edit</Button>
            //       <Button onClick={() => handleDelete(item.id)} variant='ghost' className='flex-1 border-2 border-accent'>Delete</Button>
            //     </div>
            //   </li>
            // ))
            <StockTable />
          ) : (
            <p>No available stock.</p>
          )}
        </ul>
      </form>
    </div>
  );
}