// components/BookForm.tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { useEffect, useState } from 'react';

// interface Product {
//   id: string;
//   //ministryId: string;
//   title: string;
//   author?: string;
//   @id @default(auto()) @map("_id") @db.ObjectId
//   name     String
//   description String?
//   category     Category     @relation(fields: [categoryId], references: [id])
//   categoryId    String    @db.ObjectId
//   price    Float
//   stock: any;
//   reviews  Review[]
//   cartItems: any;
//   Featured : any;
//   images: any;
//   createdAt?: Date;
//   updatedAt?: Date; 
// }

export default function ProductForm() {
  const [products, setProducts] = useState<any>([]);
  const [formData, setFormData] = useState<any>({ //useState<Omit<any, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    description: '',
    category: '',
    categoryId: '',
    price: 0,
    images: null,
  });
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);//categories to be mapped to the select input
  const [preview, setPreview] = useState(null);
  const [uploadStatus , setUploadStatus] = useState("");

  const [productImage, setProductImage] = useState(null);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);


  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/dbhandler?model=product');
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  };

  const fetchCategories = async () => {
    const res = await axios.get('/api/dbhandler?model=category');
    setCategories(res.data);
    if (res.data.length > 0) {
      setFormData(prev => ({
        ...prev,
        categoryId: res.data[0].id,
        category: res.data[0].name
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      categoryId: '',
      category: '',
      price: 0,
      images: null,
    });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('product', formData, 'file', file);

    const pformData = new FormData();

    // ✅ only append file if user selected one
    if (file) {
      pformData.append("file", file);
    }

    pformData.append("name", formData.name);
    pformData.append("description", formData.description);
    pformData.append("categoryId", formData.categoryId);
    pformData.append("price", String(formData.price));

    console.log("Submitting product data:", "Edit ID:", editId);
    for (const [key, value] of pformData.entries()) {
      console.log(key + ":", value);
    }

    try {
      if (editId) {
        await axios.put(
          `/api/dbhandler?model=product&id=${editId}`,
          pformData
        );
      } else {
        await axios.post(`/api/product`, pformData);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to save product.");
    }

    resetForm();
    fetchProducts();
  };


  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile.size > 3 * 1024){
      alert("file size greater than 300kb file may not upload")
    }
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  }

  const handleDelete = async (product : any) => {
    if (!confirm(`Are you sure you want to delete ${product.name} product?`)) return;
    try {
      const res = await axios.delete(`/api/dbhandler?model=product&id=${product.id}`);
      if (res.status === 200  || res.status === 201) {
        alert('Product deleted successfully.');
      }
      fetchProducts();
    } catch (err) {
      alert('Failed to delete product.');
    }
  };

  const handleEdit = (product: any) => {
    setEditId(product.id);
    setFile(null);        // 🔑 important
    setPreview(null);     // 🔑 important

    setFormData({
      name: product.name ?? '',
      description: product.description ?? '',
      categoryId: product.categoryId ?? '',
      price: product.price ?? 0,
      images: product.images ?? [],
    });
  };

  

  return (
    <div>
      
      <form onSubmit={handleSubmit} className='flex flex-col w-full max-w-sm gap-2 justify-center items-center p-3 border-2 border-secondary-foreground rounded-sm m-2'>
        <h2>Product Form</h2>

        <div>Product Name </div>
        <Input
          placeholder="Name of product"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />


        <div>Product Description </div>
        <Input
          placeholder="Description of product"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />


        <div>Product Category </div>
        <select 
          value={formData.categoryId} 
          onChange={(e) => {
            const selectedCategory = categories.find(cat => cat.id === e.target.value);
            setFormData({ 
              ...formData, 
              categoryId: e.target.value, 
              category: selectedCategory ? selectedCategory.name : ''
            });
          }}
        >
          {categories.length > 0 ? categories.map((category, index) => (
            <option key={index} value={`${category.id}`}>
              {category.name}
            </option>
          )) : <option value="">No categories</option>}
        </select>


        <div>Product Price </div>
        <Input
          placeholder="Price of product"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          type="number"
        />

        <div>Product Image </div>
        {!preview && formData?.images?.length > 0 && (
          <img
            src={formData.images[0]}
            alt="Current product"
            style={{ maxHeight: '300px', marginTop: '1rem' }}
          />
        )}
        {(preview) && (        //{(preview || formData?.images[0]!=null) && (
              <div style={{ marginTop: '1rem' }}>
                <img src={preview} alt="Selected preview" style={{ maxHeight: '300px' }} />
              </div>
            )}
            <Input
              type="file"
              name='image'
              id='image'
              placeholder="Product image"
              // value={formData.image || ''}
              // onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              onChange={handleImageChange}
            />
        <Button type="submit">{editId ? 'Update' : 'Create'}</Button>
        {editId && <Button type="button" onClick={resetForm}>Cancel</Button>}


        <ul className='w-full'>
          {products.length > 0 ? (
            products.map((item , index) => (
              <li key={index} className="flex flex-col justify-center items-center gap-2 my-2 bg-secondary rounded-md w-full p-2">
                <div className="flex flex-row gap-2">
                  <span>{(index + 1)}. Name : </span>
                  <span>{item.name}</span>
                </div>
                <p>Price : {item.price || <em>No price tag</em>}</p>
                <div className='flex flex-row gap-2 p-1 w-full'>
                  <Button type='button' onClick={() => handleEdit(item)} className='flex-1'>Edit</Button>
                  <Button type='button' onClick={() => handleDelete(item)} variant='ghost' className='flex-1 border-2 border-accent'>Delete</Button>
                </div>
              </li>
            ))
          ) : (
            <p>No available product.</p>
          )}
        </ul>
      </form>
    </div>
  );
}