"use client";

import React, { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

import { format } from "date-fns";
import { es } from "date-fns/locale";

import { InvoiceModule } from "@/components/types/Invoice";
import { Reservations } from "@/components/types/Reservations";
import { SystemSettings } from "@/components/types/SystemSettings";

import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Image from "next/image";

interface InvoicePageProps {
    invoice: InvoiceModule | null;
    reservation: Reservations | null;
}
const InvoicePage: React.FC<InvoicePageProps> = ({ invoice, reservation }) => {

    const invoiceData: InvoiceModule = Array.isArray(invoice) ? invoice[0] : invoice;
    const reservationData: Reservations = Array.isArray(reservation) ? reservation[0] : reservation;

    function formatDateYMDToDMY(dateStr?: string) {
            if (!dateStr) return "—";
            const [year, month, day] = dateStr.split("-");
    
            if (!year || !month || !day) return "—";
    
            // month is 0-based in JS Date
            const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
            if (isNaN(dateObj.getTime())) return "—";
            return format(dateObj, "dd/MM/yyyy", { locale: es });
        }

    function getDuration(departure?: string, arrival?: string) {
        if (!departure || !arrival) return "—";

        // Use a fixed date for both times
        const refDate = "2025-01-01";
        const dep = new Date(`${refDate}T${departure}`);
        const arr = new Date(`${refDate}T${arrival}`);

        if (isNaN(dep.getTime()) || isNaN(arr.getTime())) return "—";

        let diff = (arr.getTime() - dep.getTime()) / 1000; // seconds
        if (diff < 0) diff += 24 * 3600; // handle overnight flights

        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);

        return `${hours}h ${minutes}m`;
    }
    
    const formatDate = (date?: Date | string) => {
        if (!date) return "—";
        return format(new Date(date), "dd/MM/yyyy", { locale: es });
    };

    const [settings, setSettings] = useState<SystemSettings>({});

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch(`${apiUrl}/tahonduras-online/systemsettings/1`); // your backend endpoint
                if (!res.ok) throw new Error("Error fetching system settings");
                const data = await res.json();
                setSettings(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchSettings();
    }, [apiUrl, invoice, reservation]);
    
    const styles: { [k: string]: React.CSSProperties } = {
        page: { fontFamily: "Arial, Helvetica, sans-serif", fontSize: 12, color: "#222", padding: 24, background: "#fff" },
        header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
        logo: { height: 60 },
        company: { lineHeight: "1.1rem" },
        qrBox: { background: "#fff", padding: 6, border: "1px solid #eee" },
        metaRow: { display: "flex", justifyContent: "space-between", marginTop: 10, marginBottom: 10 },
        leftCol: { width: "32%" },
        centerCol: { width: "32%" },
        rightCol: { width: "32%" },
        sectionTitle: { fontWeight: 700, marginTop: 16, marginBottom: 8 },
        flightBox: { border: "1px solid #0b6fb9", marginBottom: 12, background: "#f4fbff" },
        flightHeader: { background: "#0b6fb9", color: "#fff", padding: "6px 8px", fontWeight: 700 },
        flightBody: { display: "flex", padding: 8, gap: 12 },
        flightCol: { flex: 1, borderRight: "1px solid #e0e0e0", padding: "0 8px" },
        ticketsTable: { width: "100%", borderCollapse: "collapse", marginTop: 8 },
        td: { border: "1px solid #ddd", padding: "6px 8px", background: "#fff" },
        totals: { marginTop: 8, textAlign: "right" },
        totalsRow: { display: "flex", justifyContent: "space-between", gap: 12, maxWidth: 240, marginLeft: "auto" },
    };

    const invoiceRef = useRef<HTMLDivElement | null>(null);

    const handlePrint = () => {
        if (!invoiceRef.current) return;
        const content = invoiceRef.current.outerHTML;
        const printWindow = window.open("", "_blank", "width=900,height=700");
        if (!printWindow) return;
        printWindow.document.write(`
            <html>
              <head>
                <title>Invoice</title>
                <style>
                  body { font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 12px; }
                  table { border-collapse: collapse; }
                  /* keep minimal styles for print */
                </style>
              </head>
              <body>${content}</body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        // give browser a moment to render
        setTimeout(() => {
            printWindow.print();
            // optionally close the window after printing
            // printWindow.close();
        }, 300);
    };

    const handleDownloadPdf = async () => {
        if (!invoiceRef.current) return;
        try {
            const element = invoiceRef.current;

            // onclone injection to avoid oklch parsing errors (keep your existing injection)
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                onclone: (clonedDoc) => {
                    try {
                        const style = clonedDoc.createElement("style");
                        style.innerHTML = `
                            html, body { background: #ffffff !important; color: #000 !important; }
                            * { color: #000 !important; background-color: transparent !important; border-color: #ddd !important; box-shadow: none !important; }
                            img, svg { filter: none !important; }
                        `;
                        clonedDoc.head.appendChild(style);
                    } catch (e) {
                        console.warn("onclone style injection failed", e);
                    }
                },
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            // Calculate image height in PDF units (mm) when fitted to pageWidth
            const imgWidthPdf = pageWidth;
            const imgHeightPdf = (canvas.height * imgWidthPdf) / canvas.width; // mm

            if (imgHeightPdf <= pageHeight) {
                // Single page — simple add
                pdf.addImage(imgData, "PNG", 0, 0, imgWidthPdf, imgHeightPdf);
            } else {
                // Multi-page: determine how many canvas pixels fit into one PDF page
                // scale factor: mm per canvas-pixel when fitted to page width
                const mmPerPixel = imgWidthPdf / canvas.width; // mm per px
                const pxPerPage = Math.floor(pageHeight / mmPerPixel); // canvas pixels per PDF page

                let remainingPixels = canvas.height;
                let y = 0;
                let pageIndex = 0;

                while (remainingPixels > 0) {
                    const sliceHeightPx = Math.min(remainingPixels, pxPerPage);
                    const pageCanvas = document.createElement("canvas");
                    pageCanvas.width = canvas.width;
                    pageCanvas.height = sliceHeightPx;

                    const pageCtx = pageCanvas.getContext("2d")!;
                    // draw the slice from the original canvas (y offset in pixels)
                    pageCtx.drawImage(canvas, 0, y, canvas.width, sliceHeightPx, 0, 0, canvas.width, sliceHeightPx);

                    const pageData = pageCanvas.toDataURL("image/png");
                    const pageImageHeightPdf = sliceHeightPx * mmPerPixel; // mm

                    if (pageIndex > 0) pdf.addPage();
                    pdf.addImage(pageData, "PNG", 0, 0, pageWidth, pageImageHeightPdf);

                    y += sliceHeightPx;
                    remainingPixels -= sliceHeightPx;
                    pageIndex++;
                }
            }

            const filename = "TAH-Invoice.pdf";
            pdf.save(filename);
        } catch (err) {
            console.error("Error generating PDF", err);
            window.print();
        }
    };
    
    return (
        <div>
            <div className="flex flex-col md:flex-row gap-4 justify-end mb-4">
                <Button className="mt-4 w-full md:w-1/5" onClick={handleDownloadPdf}>Download PDF</Button>
                <Button className="mt-4 w-full md:w-1/5" onClick={handlePrint}>Print</Button>
            </div>

            <div ref={invoiceRef} style={styles.page}>
                <div style={styles.header}>
                    <div style={{ display: "flex flex-col", gap: 12, alignItems: "start left" }}>
                        <Image src={"/logoTAH-colores.png"} alt="TAH Logo" style={styles.logo} />
                        <div style={styles.company}>
                            <div style={{ color: "#0b6fb9", fontWeight: 800, fontSize: 16 }}>{settings.name}</div>
                            <div>{settings.rtn}</div>
                            <div>{settings.direction}</div>
                            <div>{settings.telephone}</div>
                            <div>{settings.website}</div>
                        </div>
                    </div>

                    <div style={styles.qrBox}>
                        <QRCode value={invoiceData.sequential || "PW"} size={96} />
                    </div>
                </div>

                <div style={styles.metaRow}>
                    <div style={styles.leftCol}>
                        <div><strong>Para</strong></div>
                        <div>{invoiceData.client_rtn}</div>
                        <div>{invoiceData.client_name}</div>
                    </div>

                    <div style={styles.centerCol}>
                        <strong>Contacto</strong><br />
                        <div>{reservationData.contact_first_name + " " + reservationData.contact_last_name}</div>
                        <div>{reservationData.contact_phone}</div>
                        <div>{reservationData.contact_email}</div>
                    </div>

                    <div style={styles.rightCol}>
                        <div><strong>Referencia:</strong> {invoiceData.sequential}</div>
                        <div><strong>Fecha de emisión:</strong> {formatDate(invoiceData.date)}</div>
                        <div><strong>Vence el:</strong> {formatDate(invoiceData.expiration_date)}</div>
                    </div>
                </div>

                <div style={styles.sectionTitle}>Itinerario del Vuelo</div>

                {reservationData.reservation_details?.map((detail, idx) => (
                    <div key={idx} style={styles.flightBox}>
                        <div style={styles.flightHeader}>{detail.flight?.from_destination} ({detail.flight?.from_iata}) - {detail.flight?.to_destination} ({detail.flight?.to_iata}) - Vuelo: TAH-{detail.flight?.flight_no}</div>
                        <div style={styles.flightBody}>
                            <div style={styles.flightCol}>
                                <div style={{ fontWeight: 700, marginBottom: 6 }}>DESDE</div>
                                <div>{formatDateYMDToDMY(detail.flight?.date)}</div>
                                <div>{format(new Date(`2025-01-01T${detail.flight?.departure}`), "h:mm a", { locale: es })}</div>
                                <div style={{ marginTop: 6 }}>{detail.flight?.from_destination} ({detail.flight?.from_iata})</div>
                            </div>
                            <div style={styles.flightCol}>
                                <div style={{ fontWeight: 700, marginBottom: 6 }}>HASTA</div>
                                <div>{formatDateYMDToDMY(detail.flight?.date)}</div>
                                <div>{format(new Date(`2025-01-01T${detail.flight?.arrival}`), "h:mm a", { locale: es })}</div>
                                <div style={{ marginTop: 6 }}>{detail.flight?.to_destination} ({detail.flight?.to_iata})</div>
                            </div>
                            <div style={{ flex: 1, padding: "0 8px" }}>
                                <div style={{ fontWeight: 700, marginBottom: 6 }}>Detalle del Vuelo</div>
                                <div>Aeronave: {detail.flight?.plane.description}</div>
                                <div>Duración: {getDuration(detail.flight?.departure, detail.flight?.arrival)}</div>
                                <div>Equipaje de mano 10KG.</div>
                                <div>Equipaje de carga 25KG</div>
                            </div>
                        </div>
                    </div>
                ))}

                <div style={styles.sectionTitle}>Detalle del Boleto</div>

                <table style={styles.ticketsTable}>
                    <thead>
                        <tr>
                            <th style={styles.td}>#</th>
                            <th style={styles.td}>BOLETO</th>
                            <th style={styles.td}>PASAJERO</th>
                            <th style={styles.td}>ESTADO</th>
                            <th style={styles.td}>TARIFA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservationData.reservation_details?.map((pax, i: number) => (
                            <tr key={i}>
                                <td style={styles.td}>{i + 1}</td>
                                <td style={styles.td}>{pax.ticket}</td>
                                <td style={styles.td}>{pax.detail_document_number} - {pax.detail_first_name + " " + pax.detail_middle_name + " " + pax.detail_last_name}</td>
                                <td style={styles.td}>{pax.flight_type} - {pax.reservation_status}</td>
                                <td style={styles.td}>{pax.flight_fees_value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style={styles.totals}>
                    <div style={styles.totalsRow}>
                        <div>TARIFA:</div>
                        <div>{invoiceData.fee}</div>
                    </div>
                    <div style={styles.totalsRow}>
                        <div>IMPISV:</div>
                        <div>{invoiceData.tax_isv}</div>
                    </div>
                    <div style={styles.totalsRow}>
                        <div>SUBTOTAL:</div>
                        <div>{invoiceData.subtotal}</div>
                    </div>
                    <div style={styles.totalsRow}>
                        <div>DESCUENTO:</div>
                        <div>{invoiceData.discount}</div>
                    </div>
                    <div style={styles.totalsRow}>
                        <div>IMP SALIDA:</div>
                        <div>{reservationData.ishn}</div>
                    </div>
                    <div style={styles.totalsRow}>
                        <div>IMP LLEGADA:</div>
                        <div>{reservationData.iscu}</div>
                    </div>
                    <div style={styles.totalsRow}>
                        <div style={{ fontWeight: 700 }}>TOTAL:</div>
                        <div style={{ fontWeight: 700 }}>{invoiceData.total}</div>
                    </div>
                </div>

                <div style={styles.sectionTitle}>Terminos y Condiciones</div>

                <ul>
                    <li>Este es un contrato de adhesión, por lo que se aplican políticas internas de la empresa.</li>
                    <li>Este boleto aéreo no es reembolsable, no es endosable, ni transferible.</li>
                    <li>El pasajero deberá estar en el aeropuerto por lo menos una hora y media antes del inicio de su vuelo local y tres horas antes de su vuelo internacional, en caso contrario pueden perder su reserva.</li>
                    <li>La empresa se reserva el derecho de cancelar el viaje, retrasarlo o desviar la ruta; cuando, a su juicio, razones fundadas en la protección de la vida humana, la seguridad, razones o condiciones climáticas adversas deben ser atendidas, sin que se considere un incumplimiento del contrato de transporte, ni implique responsabilidad alguna para la compañía.</li>
                    <li>En virtud de la cláusula anterior, la empresa no asume responsabilidad alguna por el transporte del pasajero en el día señalado a una hora determinada; ni a seguir determinadas rutas, ni hacer conexiones según otros itinerarios, ni por los gastos en que incurra el pasajero por tal motivo.</li>
                    <li>La empresa también se reserva el derecho de no aceptar pasajeros que se presenten en circunstancias anormales que pongan en peligro la seguridad de los demás pasajeros o provoquen inconvenientes de cualquier naturaleza.</li>
                    <li>Los boletos tendrán una validez de seis (6) meses a partir de la fecha de emisión, excepto cuando se contemple la fecha de vuelo después de 6 meses desde la emisión.</li>
                    <li>Boleto incluye: Un artículo de mano (cartera, mochila, bolsa para portátil, pañalera) equipaje de mano de 10 Kg, un equipaje de carga de 23 Kg.</li>
                    <li>Segunda pieza de equipaje $ 100.00 más impuesto.</li>
                    <li>Si el pasajero viaja con un arma de fuego, deberá presentarse 2 horas antes del vuelo para realizar su gestión de transporte del arma de fuego ante la autoridad aeroportuaria y pagar un valor de $ 10.00 por arma de fuego. Se permiten 3 armas como máximo por vuelo. Esto solo aplica en vuelos nacionales.</li>
                    <li>Todos los pasajeros están obligados a poseer un documento de identificación válido y original. El pasaporte es obligatorio para los vuelos internacionales, mientras que para los vuelos nacionales se requiere una cédula de identidad, acta de nacimiento en el caso de menores, o pasaporte.</li>
                    <li>Para garantizar el cumplimiento de las normas internacionales, es obligatorio para todos los pasajeros poseer un pasaporte con una validez mínima de seis meses a partir de la fecha del vuelo programado. Este requisito es aplicable a todos los pasajeros, independientemente de su nacionalidad o del destino al que viajen. Los pasajeros son responsables de obtener las visas correspondientes de acuerdo con sus planes de viaje y los requisitos del país de destino. Es esencial verificar los requisitos de la visa y solicitar la visa con suficiente anticipación para evitar interrupciones en el viaje o denegación de entrada.</li>
                    <li>Para garantizar la seguridad y el cumplimiento de las normas de viaje, es obligatorio que todo pasajero menor de edad deba estar acompañado por un custodio y presentar la documentación necesaria según lo dispuesto por la agencia migratoria. Los niños de 0 meses a 2 años se consideran infantes y deben viajar en brazos de un adulto. Si un adulto viaja con más de un bebé, debe pagar el pasaje de un menor.</li>
                    <li>El cambio de fecha de vuelo tendrá una penalidad de $150.00.</li>
                    <li>Por no show la penalidad es de $150.00.</li>
                    <li>NO SOMOS RESPONSABLES DE CONECTAR VUELOS QUE NO SON PARTE DE NUESTRO ITINERARIO.</li>
                </ul>

            </div>
        </div>
    );
};

export default InvoicePage