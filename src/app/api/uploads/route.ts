import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

const uploadDir = path.join(process.cwd(), 'public', 'uploads');

async function ensureDir(){
  try { await fs.mkdir(uploadDir, { recursive: true }); } catch {}
}

export async function POST(req: Request){
  try {
    await ensureDir();
    const form = await req.formData();
    const file = form.get('file');
    if(!file || !(file instanceof File)){
      return NextResponse.json({ ok:false, error:'Arquivo (file) requerido' }, { status:400 });
    }
    const bytes = await file.arrayBuffer();
    if(bytes.byteLength > 5 * 1024 * 1024){
      return NextResponse.json({ ok:false, error:'Arquivo excede 5MB' }, { status:413 });
    }
    const buffer = Buffer.from(bytes);
    const allowed = ['application/pdf','image/png','image/jpeg','image/jpg'];
    if(file.type && !allowed.includes(file.type)){
      return NextResponse.json({ ok:false, error:'Tipo de arquivo não permitido' }, { status:415 });
    }
    const ext = path.extname(file.name) || '';
    const safeName = crypto.randomBytes(8).toString('hex') + ext;
    const target = path.join(uploadDir, safeName);
    await fs.writeFile(target, buffer);
    const publicUrl = `/uploads/${safeName}`;
    return NextResponse.json({ ok:true, data:{ url: publicUrl, name: file.name, size: buffer.length } });
  } catch {
    return NextResponse.json({ ok:false, error:'Falha no upload' }, { status:500 });
  }
}
