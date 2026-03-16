import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET() {
  revalidatePath('/servicios');
  revalidatePath('/');
  revalidatePath('/metodo');
  revalidatePath('/sobre');
  revalidatePath('/blog');
  revalidatePath('/contacto');
  return NextResponse.json({ revalidated: true, ts: Date.now() });
}
