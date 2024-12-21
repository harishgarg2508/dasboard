import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const filePath = path.join(process.cwd(), 'data', 'patients.json');

  try {
    const data = await fs.readFile(filePath, 'utf8');
    let patients = JSON.parse(data);

    const updatedPatients = patients.filter((patient: any) => patient.id !== id);

    if (patients.length === updatedPatients.length) {
      return NextResponse.json({ success: false, message: 'Patient not found' }, { status: 404 });
    }

    await fs.writeFile(filePath, JSON.stringify(updatedPatients, null, 2));

    return NextResponse.json({ success: true, message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete patient' }, { status: 500 });
  }
}

