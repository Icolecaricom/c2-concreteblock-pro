import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const company = formData.get('company') as string;
    const projectDesc = formData.get('projectDesc') as string;
    const preferredContact = formData.get('preferredContact') as string;
    const file = formData.get('file') as File | null;

    // Validate required fields
    if (!name || !email || !projectDesc) {
      return NextResponse.json(
        { error: 'Name, email, and project description are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    let fileName = null;
    let fileUrl = null;
    let fileType = null;

    // Handle file upload
    if (file && file.size > 0) {
      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: 'Invalid file type. Allowed: PDF, JPG, PNG' },
          { status: 400 }
        );
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: 'File size exceeds 10MB limit' },
          { status: 400 }
        );
      }

      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadsDir, { recursive: true });

      // Generate unique filename
      const timestamp = Date.now();
      const ext = file.name.split('.').pop();
      fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      
      // Save file
      const filePath = path.join(uploadsDir, fileName);
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      fileUrl = `/uploads/${fileName}`;
      fileType = file.type;
    }

    // Create plan submission
    const planSubmission = await db.planSubmission.create({
      data: {
        name,
        email,
        phone: phone || null,
        company: company || null,
        projectDesc,
        fileName,
        fileUrl,
        fileType,
        preferredContact: preferredContact || 'email'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Plan submitted successfully',
      id: planSubmission.id
    });
  } catch (error) {
    console.error('Plan submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit plan' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const submissions = await db.planSubmission.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Get submissions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}
