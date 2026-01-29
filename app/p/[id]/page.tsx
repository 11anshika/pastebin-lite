import kv from '@/lib/kv';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  const key = `paste:${params.id}`;
  
  const current_views = await kv.hincrby(key, "current_views", 1);
  const paste: any = await kv.hgetall(key);

  if (!paste) notFound();

  const isExpired = paste.expires_at && Date.now() > paste.expires_at;
  const limitReached = paste.max_views && current_views > paste.max_views;

  if (isExpired || limitReached) notFound();

  return (
    <div className="max-w-4xl mx-auto p-10">
      <h1 className="text-xl font-bold mb-4">View Paste</h1>
      <pre className="p-6 bg-slate-100 rounded-lg overflow-auto border whitespace-pre-wrap">
        {paste.content}
      </pre>
    </div>
  );
}