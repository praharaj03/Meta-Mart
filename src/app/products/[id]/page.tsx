'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useUser } from '@clerk/nextjs';
import { formatINR } from '@/lib/currency';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const { addToCart } = useCart();
  const [data, setData] = useState<any>();
  const [activeImage, setActiveImage] = useState(0);
  const [review, setReview] = useState({ orderId: '', rating: 5, comment: '' });
  const [reviewMessage, setReviewMessage] = useState('');
  useEffect(() => { fetch(`/api/products/${id}`).then(r => r.json()).then(setData); }, [id]);
  if (!data) return <><Navbar /><main className="min-h-screen grid place-items-center pt-20">Loading product…</main></>;
  if (data.error) return <><Navbar /><main className="min-h-screen grid place-items-center pt-20"><Link href="/shop">Back to shop</Link></main></>;
  const { product, reviews } = data;
  const images = product.images?.length ? product.images : [product.image];
  const saveReview = async (e: FormEvent) => {
    e.preventDefault(); setReviewMessage('');
    const res = await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...review, productId: product._id, customerEmail: user?.primaryEmailAddress?.emailAddress, customerName: user?.fullName }) });
    const result = await res.json(); setReviewMessage(res.ok ? 'Thanks — your verified feedback was saved.' : result.error);
    if (res.ok) { setReview({ orderId: '', rating: 5, comment: '' }); fetch(`/api/products/${id}`).then(r => r.json()).then(setData); }
  };
  return <div className="min-h-screen bg-[#08070d]"><Navbar /><main className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
    <Link href="/shop" className="text-sm text-purple-300">← Back to shop</Link>
    <section className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-14">
      <div><div className="overflow-hidden rounded-2xl border border-white/10 bg-[#13111b]"><img src={images[activeImage]} alt={product.name} className="aspect-square w-full object-cover" /></div>
        <div className="mt-3 grid grid-cols-4 gap-3">{images.slice(0, 8).map((image: string, index: number) => <button key={`${image}-${index}`} onClick={() => setActiveImage(index)} className={`overflow-hidden rounded-xl border ${activeImage === index ? 'border-purple-400' : 'border-white/10'}`}><img src={image} alt={`${product.name} view ${index + 1}`} className="aspect-square w-full object-cover" /></button>)}</div>
      </div>
      <div><span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-bold text-purple-200">{product.badge}</span><p className="mt-5 text-sm text-purple-300">{product.category}</p><h1 className="mt-2 text-3xl font-bold sm:text-5xl">{product.name}</h1>
        <div className="mt-4 flex items-center gap-2 text-yellow-400"><FiStar className="fill-current" /> <span>{Number(product.rating).toFixed(1)}</span><span className="text-zinc-400">({product.reviews} reviews)</span></div>
        <div className="mt-6 flex items-end gap-3"><span className="text-3xl font-bold">{formatINR(product.price)}</span><span className="text-lg text-zinc-500 line-through">{formatINR(product.originalPrice)}</span></div>
        <p className="mt-7 leading-7 text-zinc-300">{product.description || `A carefully selected ${product.category.toLowerCase()} essential. Built for everyday use and backed by MetaMart support.`}</p>
        <div className="mt-8 flex flex-wrap gap-3"><button onClick={() => addToCart({ id: product._id, name: product.name, price: product.price, image: product.image })} className="flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 font-bold text-white"><FiShoppingCart /> Add to cart</button><Link href="/cart" className="rounded-xl border border-white/20 px-6 py-3 font-bold">View cart</Link><button aria-label="Save item" className="rounded-xl border border-white/20 p-3"><FiHeart /></button></div>
        <div className="mt-8 grid grid-cols-3 gap-3 text-center text-sm text-zinc-300"><div className="rounded-xl bg-white/5 p-3">Secure payment</div><div className="rounded-xl bg-white/5 p-3">Easy returns</div><div className="rounded-xl bg-white/5 p-3">Fast delivery</div></div>
      </div>
    </section>
    <section className="mt-16 grid gap-8 lg:grid-cols-[1.3fr_.7fr]"><div><h2 className="text-2xl font-bold">Customer feedback</h2>{reviews.length === 0 ? <p className="mt-4 text-zinc-400">No reviews yet. Be the first verified customer to share feedback.</p> : <div className="mt-5 space-y-4">{reviews.map((item: any) => <article key={item._id} className="rounded-2xl border border-white/10 bg-[#13111b] p-5"><div className="flex justify-between gap-3"><b>{item.customerName}</b><span className="text-yellow-400">{'★'.repeat(item.rating)}</span></div><p className="mt-3 text-zinc-300">{item.comment}</p><small className="mt-3 block text-emerald-400">Verified purchase</small></article>)}</div>}</div>
      <form onSubmit={saveReview} className="rounded-2xl border border-white/10 bg-[#13111b] p-5"><h2 className="text-xl font-bold">Leave verified feedback</h2><p className="mt-2 text-sm text-zinc-400">Use the order ID from a completed purchase.</p><input required value={review.orderId} onChange={e => setReview({ ...review, orderId: e.target.value })} placeholder="Order ID" className="mt-4 w-full rounded-xl border border-white/15 bg-black/20 p-3" /><select value={review.rating} onChange={e => setReview({ ...review, rating: Number(e.target.value) })} className="mt-3 w-full rounded-xl border border-white/15 bg-black/20 p-3">{[5,4,3,2,1].map(n => <option key={n} value={n}>{n} stars</option>)}</select><textarea required value={review.comment} onChange={e => setReview({ ...review, comment: e.target.value })} placeholder="Tell other customers about it" className="mt-3 min-h-28 w-full rounded-xl border border-white/15 bg-black/20 p-3" /><button className="mt-3 rounded-xl bg-purple-600 px-5 py-3 font-bold text-white">Submit feedback</button>{reviewMessage && <p className="mt-3 text-sm text-purple-200">{reviewMessage}</p>}</form>
    </section>
  </main><Footer /></div>;
}
