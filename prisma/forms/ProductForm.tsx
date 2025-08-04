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
  const [formData, setFormData] = useState<Omit<any, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    description: '',
    category: '',
    price: 0,
    images: '',
  });
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get('/api/dbhandler?model=product');
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch books', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`/api/dbhandler?model=product&id=${editId}`, formData);
      } else {
        await axios.post('/api/dbhandler?model=product', formData);
      }
      resetForm();
      fetchBooks();
    } catch (err) {
      alert('Failed to save book.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return;
    try {
      await axios.delete(`/api/dbhandler?model=product&id=${id}`);
      fetchBooks();
    } catch (err) {
      alert('Failed to delete book.');
    }
  };

  const handleEdit = (product: any) => {
    setEditId(product.id);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      images: product.images,
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      price: 0,
      images: null,
    });
    setEditId(null);
  };

  return (
    <div>
      
      <form onSubmit={handleSubmit} className='flex flex-col w-full max-w-sm gap-2 justify-center items-center p-3 border-2 border-secondary-foreground rounded-sm m-2'>
        <h2>Product Form</h2>
        <Input
          placeholder="Ministry ID"
          value={formData.ministryId}
          onChange={(e) => setFormData({ ...formData, ministryId: e.target.value })}
        />
        <Input
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <Input
          placeholder="Author"
          value={formData.author || ''}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
        />
        <Input
          placeholder="Cover URL"
          value={formData.coverUrl || ''}
          onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
        />
        <Input
          placeholder="PDF/EPUB URL"
          value={formData.fileUrl}
          onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Downloads"
          value={formData.downloads}
          onChange={(e) => setFormData({ ...formData, downloads: Number(e.target.value) })}
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
                  <Button onClick={() => handleEdit(item)} className='flex-1'>Edit</Button>
                  <Button onClick={() => handleDelete(item.id)} variant='ghost' className='flex-1 border-2 border-accent'>Delete</Button>
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