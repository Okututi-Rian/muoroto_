import { NextRequest, NextResponse } from 'next/server'
import ImageKit from 'imagekit'

export const runtime = 'nodejs'

// Keep instance logic but check env inside handler
let imagekitInstance: ImageKit | null = null;

function getImageKit() {
  if (imagekitInstance) return imagekitInstance;

  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

  if (!publicKey || !privateKey || !urlEndpoint) {
    throw new Error('Missing ImageKit environment variables');
  }

  imagekitInstance = new ImageKit({
    publicKey,
    privateKey,
    urlEndpoint,
  });
  return imagekitInstance;
}

const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as Blob | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: 'File too large. Max 5MB.' }, { status: 413 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Invalid file type. Must be an image.' }, { status: 415 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const filename = (formData.get('filename') as string) || `upload-${Date.now()}`
    console.log('[upload] config check:', {
      hasPublic: !!process.env.IMAGEKIT_PUBLIC_KEY,
      hasPrivate: !!process.env.IMAGEKIT_PRIVATE_KEY,
      hasUrl: !!process.env.IMAGEKIT_URL_ENDPOINT,
      filename
    });

    const ik = getImageKit();
    const result = await ik.upload({
      file: buffer,
      fileName: filename,
      folder: '/muoroto',
    })

    console.log('[upload] success:', result.url)
    return NextResponse.json({ url: result.url, fileId: result.fileId })
  } catch (err: unknown) {
    const error = err as Error & { code?: string; errors?: unknown };
    console.error('[upload] RAW error caught:', err);

    // Attempt to stringify common error properties
    const errorInfo = {
      message: error?.message,
      name: error?.name,
      code: error?.code,
      stack: error?.stack,
      errors: error?.errors,
    };

    console.error('[upload] structured error:', JSON.stringify(errorInfo, null, 2));

    return NextResponse.json({
      error: 'Upload failed',
      details: error?.message || 'Unknown error'
    }, { status: 500 })
  }
}
