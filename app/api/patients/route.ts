// app/api/patients/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const PATIENTS_FILE = path.join(DATA_DIR, 'patients.json');

// Ensure the data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize patients.json if it doesn't exist
if (!fs.existsSync(PATIENTS_FILE)) {
  fs.writeFileSync(PATIENTS_FILE, JSON.stringify([]));
}

export async function POST(request: NextRequest) {
  try {
    const patient = await request.json();
    const newPatient = {
      ...patient,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    // Read existing patients
    const data = fs.readFileSync(PATIENTS_FILE, 'utf-8');
    const patients = JSON.parse(data);
    patients.push(newPatient);

    // Save updated patients list
    fs.writeFileSync(PATIENTS_FILE, JSON.stringify(patients, null, 2));

    // Save individual patient file
    const patientFile = path.join(DATA_DIR, `patient_${newPatient.id}.json`);
    fs.writeFileSync(patientFile, JSON.stringify(newPatient, null, 2));

    return NextResponse.json({ success: true, patient: newPatient });
  } catch (error) {
    console.error('Error saving patient:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save patient' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const data = fs.readFileSync(PATIENTS_FILE, 'utf-8');
    const patients = JSON.parse(data);
    return NextResponse.json({ success: true, patients });
  } catch (error) {
    console.error('Error reading patients:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to read patients' },
      { status: 500 }
    );
  }
}