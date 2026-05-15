'use client';

import { useState } from 'react';

import { allowedFileTypes, maxUploadBytes } from '@/lib/constants';
import type { AssetCategory } from '@/types';

const categories: AssetCategory[] = [
  'LOGO',
  'BRAND_GUIDELINES',
  'IMAGE',
  'VIDEO',
  'TESTIMONIAL',
  'CASE_STUDY',
  'OFFER_COPY',
  'SALES_PAGE_COPY',
  'CONTENT_EXAMPLE',
  'EMAIL_SMS_COPY',
  'OTHER',
];

export function AssetUploadForm({ clientRecordId }: { clientRecordId: string }) {
  const [status, setStatus] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('Preparing upload...');
    const form = event.currentTarget;
    const formData = new FormData(form);
    const file = formData.get('file');

    if (!(file instanceof File)) {
      setStatus('Choose a file first.');
      return;
    }
    if (!allowedFileTypes.includes(file.type as (typeof allowedFileTypes)[number])) {
      setStatus('File type is not allowed.');
      return;
    }
    if (file.size > maxUploadBytes) {
      setStatus('File is too large.');
      return;
    }

    const presign = await fetch('/api/assets/presign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientRecordId,
        category: formData.get('category'),
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        description: formData.get('description') || undefined,
      }),
    });

    if (!presign.ok) {
      const body = await presign.json().catch(() => null);
      setStatus(body?.error || 'Unable to prepare upload.');
      return;
    }

    const { uploadUrl } = (await presign.json()) as { uploadUrl: string };
    setStatus('Uploading...');
    const upload = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    });

    if (!upload.ok) {
      setStatus('S3 upload failed. The Airtable metadata was created for operator review.');
      return;
    }

    form.reset();
    setStatus('Uploaded. Refresh the page to see the latest asset metadata.');
  }

  return (
    <form onSubmit={onSubmit} className="ae-panel rounded-lg p-6">
      <h2 className="text-lg font-semibold text-fg">Upload to Asset Library</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            name="category"
            className="mt-2 w-full rounded-none border border-line px-4 py-3 text-sm"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.replaceAll('_', ' ')}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="file">
            File
          </label>
          <input
            id="file"
            name="file"
            type="file"
            required
            className="mt-2 w-full rounded-none border border-line px-4 py-3 text-sm"
          />
        </div>
      </div>
      <div className="mt-4">
        <label className="text-sm font-medium text-slate-700" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="mt-2 w-full rounded-none border border-line px-4 py-3 text-sm"
        />
      </div>
      <button
        type="submit"
        className="ae-action mt-5 px-5 py-2.5 text-sm font-semibold"
      >
        Create presigned upload
      </button>
      {status ? <p className="mt-4 text-sm text-slate-600">{status}</p> : null}
    </form>
  );
}
