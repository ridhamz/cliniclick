import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import PDFDocument from 'pdfkit'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const prescription = await prisma.prescription.findUnique({
      where: { id },
      include: {
        consultation: {
          include: {
            appointment: {
              include: {
                patient: true,
                doctor: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!prescription) {
      return NextResponse.json(
        { message: 'Prescription not found' },
        { status: 404 }
      )
    }

    if (session.user?.role === 'PATIENT') {
      const patient = await prisma.patient.findUnique({
        where: { userId: session.user.id },
      })
      if (!patient || prescription.consultation?.appointment?.patientId !== patient.id) {
        return NextResponse.json(
          { message: 'Unauthorized access' },
          { status: 403 }
        )
      }
    }

    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
    })
    
    const chunks: Buffer[] = []
    doc.on('data', (chunk: Buffer) => {
      chunks.push(chunk)
    })
    
    doc.fontSize(20)
      .text('ORDONNANCE MÉDICALE', { align: 'center' })
    
    doc.moveDown()
    doc.moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .stroke()
    
    doc.moveDown(2)
    
    doc.fontSize(12)
      .text('Informations Patient:')
    
    doc.moveDown(0.5)
      .fontSize(11)
    
    const patientName = `${prescription.consultation?.appointment?.patient?.firstName || ''} ${prescription.consultation?.appointment?.patient?.lastName || ''}`
    doc.text(`Nom: ${patientName}`, { indent: 20 })
    
    if (prescription.consultation?.appointment?.patient?.phone) {
      doc.text(`Téléphone: ${prescription.consultation.appointment.patient.phone}`, { indent: 20 })
    }
    
    doc.moveDown()
    
    doc.fontSize(12)
      .text('Médecin:')
    
    doc.moveDown(0.5)
      .fontSize(11)
    
    const doctorName = prescription.consultation?.appointment?.doctor?.user?.email?.split('@')[0] || 'Médecin'
    doc.text(`Dr. ${doctorName}`, { indent: 20 })
    
    if (prescription.consultation?.appointment?.doctor?.specialization) {
      doc.text(`Spécialité: ${prescription.consultation.appointment.doctor.specialization}`, { indent: 20 })
    }
    
    const dateStr = new Date(prescription.createdAt).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    doc.text(`Date: ${dateStr}`, { indent: 20 })
    
    doc.moveDown(2)
    
    doc.fontSize(12)
      .text('MÉDICAMENTS PRESCRITS:')
    
    doc.moveDown(0.5)
      .fontSize(11)
    
    const medications = prescription.medications || ''
    doc.text(medications, {
      indent: 20,
      width: 495,
      align: 'left',
    })
    
    if (prescription.instructions) {
      doc.moveDown(1.5)
        .fontSize(12)
        .text('INSTRUCTIONS:')
      
      doc.moveDown(0.5)
        .fontSize(11)
      
      const instructions = prescription.instructions
      doc.text(instructions, {
        indent: 20,
        width: 495,
        align: 'left',
      })
    }
    
    doc.moveDown(3)
      .fontSize(10)
      .text('Signature du médecin:')
    
    doc.moveTo(50, doc.y + 15)
      .lineTo(200, doc.y + 15)
      .stroke()
    
    const pageHeight = doc.page.height
    const pageWidth = doc.page.width
    doc.fontSize(8)
      .fillColor('gray')
      .text('Document généré par Cliniclick', pageWidth / 2, pageHeight - 50, {
        align: 'center',
        width: pageWidth,
      })
    
    doc.end()
    
    return new Promise<NextResponse>((resolve, reject) => {
      doc.on('end', () => {
        try {
          const pdfBuffer = Buffer.concat(chunks)
          resolve(
            new NextResponse(pdfBuffer, {
              headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="ordonnance-${id.slice(0, 8)}.pdf"`,
                'Content-Length': pdfBuffer.length.toString(),
              },
            })
          )
        } catch (err) {
          console.error('Error creating response:', err)
          reject(
            NextResponse.json(
              { message: 'Error creating PDF response' },
              { status: 500 }
            )
          )
        }
      })
      
      doc.on('error', (error) => {
        console.error('PDF generation error:', error)
        reject(
          NextResponse.json(
            { message: `Error generating PDF: ${error.message}` },
            { status: 500 }
          )
        )
      })
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { message: `Error generating PDF: ${errorMessage}` },
      { status: 500 }
    )
  }
}
