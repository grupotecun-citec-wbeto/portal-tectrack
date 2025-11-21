import React, { useState, useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
//redux
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";
import { format } from "date-fns";
// Chakra imports
import {
  Flex,
  Box,
  Text,
  Image,
  Button,
  Grid,
  GridItem,
  Divider,
  VStack,
  HStack
} from "@chakra-ui/react";

//images
import portada_reporte_citec from 'assets/img/portadas/portada_reporte_citec.png'

//CUSTOM IMPORTS
import CasoFormulario from "./CasoFormulario";
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import html2pdf from 'html2pdf.js';

// Estilos para impresión
const printStyles = `
  #print-root {
    display: none;
  }

  @media print {
    @page {
      size: A4;
      margin: 10mm;
    }
    
    html, body {
      height: auto !important;
      overflow: visible !important;
      background-color: white !important;
    }

    /* Ocultar la aplicación principal */
    #root {
      display: none !important;
    }

    /* Mostrar solo el portal de impresión */
    #print-root {
      display: block !important;
      position: static !important; /* Changed from absolute to static for better flow control */
      width: 100% !important;
      height: auto !important;
      z-index: 9999 !important;
    }

    /* Asegurar que el contenido del reporte sea visible */
    #report-content {
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      padding-bottom: 50px !important; /* Increased padding for footer */
    }

    .no-print {
      display: none !important;
    }
    
    .page-break-avoid {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    
    .page-break-before {
      page-break-before: always !important;
      break-before: always !important;
    }

    img {
      max-width: 100% !important;
      page-break-inside: avoid !important;
    }

    .print-footer {
      display: flex !important;
      justify-content: space-between;
      align-items: center;
      position: fixed !important;
      bottom: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 30px !important;
      font-size: 10px !important;
      color: #000 !important;
      background-color: white !important;
      border-top: 2px solid #000 !important;
      padding: 0 10mm !important;
      z-index: 2147483647 !important;
    }
  }
  
  /* Ocultar footer en pantalla normal */
  .print-footer {
    display: none;
  }
  
  .rich-text-content ul, .rich-text-content ol {
    margin-left: 20px;
  }
  .rich-text-content p {
    margin-bottom: 5px;
  }
`;

const ReportTemplate = ({
  ubicacion, lugar, nameUsuario, codigo, fecha, celular, proyecto, equipos, sistemas,
  hallazgos, accionesEjecutadas, recomendaciones,
  elaboradoPor, revisadoPor, fechaEmision, images
}) => {

  const renderHTML = (htmlContent) => {
    if (!htmlContent) return null;
    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} className="rich-text-content" style={{ fontSize: "12px", fontFamily: "Helvetica, Arial, sans-serif" }} />;
  };

  const textStyle = {marginTop: "-10px"}
  const labelStyle = {fontWeight: "bold", fontSize: "12px", marginBottom: "4px", marginTop: "6px", marginRight: "0px" };
  const labelStyleDownload = {fontWeight: "bold", fontSize: "12px", marginBottom: "4px", marginTop: "-10px", marginRight: "0px" };
  const inputStyle = { border: "1px solid #000", padding: "6px", borderRadius: "5px", minHeight: "24px", fontSize: "12px", backgroundColor: "#fff", lineHeight: "1.4" };
  const sectionTitleStyle = { fontWeight: "bold", fontSize: "16px", textAlign: "center", borderRadius: "5px", marginBottom: "10px" };
  const subTitleStyle = { fontWeight: "bold", fontSize: "12px", marginBottom: "6px", marginTop: "12px", padding: "5px", borderRadius: "5px", display: "inline-block" };
  const boxStyle = { display: "flex", flexDirection: "row", alignItems: "center", marginBottom: "6px" };

  return (
    <>
    <Box id="report-content" bg="white" p="10mm" maxW="210mm" mx="auto" fontFamily="Helvetica, Arial, sans-serif" color="#333">
      
      {/* Encabezado */}
      <Image
        src={portada_reporte_citec}
        w="100%"
        h="150px"
        objectFit="cover"
        mb="15px"
        width="calc(100% + 20px)"
      />
      
        {/* Primera Sección: Datos Principales */}
        <Flex mb="0px">
          <Box w="50%" pr="2">
            <Box style={boxStyle}>
              <Text style={labelStyle}>Ubicación:</Text>
              <Box style={inputStyle}>{ubicacion}</Box>
            </Box>
            <Box style={boxStyle}>
              <Text style={labelStyle}>Lugar:</Text>
              <Box style={inputStyle}>{lugar}</Box>
            </Box>
            <Box style={boxStyle}>
              <Text style={labelStyle}>Nombre de Usuario:</Text>
              <Box style={inputStyle}>{nameUsuario}</Box>
            </Box>
          </Box>
          <Box w="50%" pl="2">
            <Box style={boxStyle}>
              <Text style={labelStyle}>Número:</Text>
              <Box style={inputStyle}>{codigo}</Box>
            </Box>
            <Box style={boxStyle}>
              <Text style={labelStyle}>Fecha:</Text>
              <Box style={inputStyle}>{(fecha !== '' && fecha) ? format(new Date(fecha), 'yyyy-MM-dd') : ''}</Box>
            </Box>
          </Box>
        </Flex>

        {/* Segunda Sección: Detalle de Equipos */}
        <Box mb="0px">
          <Text style={sectionTitleStyle}>DETALLE DE EQUIPOS</Text>
          <Divider borderColor="black" borderBottomWidth="2px" mb="10px" />

          <Box style={boxStyle}>
            <Text style={labelStyle}>Proyecto:</Text>
            <Box style={inputStyle}>{proyecto}</Box>
          </Box>

          <Flex wrap="wrap" mx="-5px">
            {equipos?.codigos?.map((equipo, index) => {
              const chasisValue = equipo.chasis ? (equipo.chasis.includes('|') ? equipo.chasis.split('|')[0] : equipo.chasis) : (equipo.serie ? (equipo.serie.includes('|') ? equipo.serie.split('|')[0] : equipo.serie) : "N/D");
              return (
                <Box key={index} w="33.33%" p="5px">
                  <Box border="1px solid #000" borderRadius="5px" p="5px" fontSize="10px" h="100%">
                    <Text fontWeight="bold">{equipo?.business_name} {equipo?.marca}</Text>
                    <Text>Serie: {chasisValue}</Text>
                    <Text>Cod: {equipo.codigo_finca}</Text>
                    <Text>Proyecto: {equipo.proyecto}</Text>
                    <Text>Cliente: {equipo.cliente}</Text>
                    <Text>Ubicación: {equipo.ubicacion}</Text>
                  </Box>
                </Box>
              )
            })}
          </Flex>
        </Box>

        {/* Tercera Sección: Detalle de la Visita */}
        <Box mb="0px">
          <Text style={sectionTitleStyle}>DETALLE DE LA VISITA</Text>
          <Divider borderColor="black" borderBottomWidth="2px" mb="10px" />

          <Box mb="0">
            <Text style={labelStyle}>Sistema del Equipo</Text>
          </Box>
          <Flex wrap="wrap" mx="-5px">
            {sistemas.split(",")?.map((sistema, index) => {
              return (
                <Box key={index} w="33.33%" p="5px">
                  <Box border="1px solid #000" borderRadius="5px" p="5px" fontSize="10px" h="100%">
                    <Text fontWeight="bold">{sistema}</Text>
                  </Box>
                </Box>
              )
            })}
          </Flex>

          <Box className="page-break-avoid">
            <Text style={subTitleStyle}>Hallazgos Encontrados</Text>
            <Divider borderColor="black" w="35%" mb="5px" />
            <Box border="1px solid #000" borderRadius="3px" p="5px" minH="50px" bg="white">
              {renderHTML(hallazgos)}
            </Box>
          </Box>

          <Box mt="0px" className="page-break-avoid">
            <Text style={subTitleStyle}>Acciones Ejecutadas</Text>
            <Divider borderColor="black" w="35%" mb="5px" />
            <Box border="1px solid #000" borderRadius="3px" p="5px" minH="50px" bg="white">
              {renderHTML(accionesEjecutadas)}
            </Box>
          </Box>

          <Box mt="0px" className="page-break-avoid">
            <Text style={subTitleStyle}>Recomendaciones</Text>
            <Divider borderColor="black" w="35%" mb="5px" />
            <Box border="1px solid #000" borderRadius="3px" p="5px" minH="50px" bg="white">
              {renderHTML(recomendaciones)}
            </Box>
          </Box>
        </Box>

        {/* Cuarta Sección: Datos del Técnico */}
        <Box mb="0px" className="page-break-avoid">
          <Text style={sectionTitleStyle}>DATOS DEL TÉCNICO</Text>
          <Divider borderColor="black" borderBottomWidth="2px" mb="10px" />

          <Box style={boxStyle}>
            <Box style={boxStyle}>
              <Text style={labelStyle}>Elaborado por</Text>
              <Box style={inputStyle}>{elaboradoPor}</Box>
            </Box>
            <Box style={boxStyle} marginLeft={"5px"}>
              <Text style={labelStyle}>Revisado por</Text>
              <Box style={inputStyle}>{revisadoPor}</Box>
            </Box>
            <Box style={boxStyle} marginLeft={"5px"}>
              <Text style={labelStyle}>Fecha de emisión</Text>
              <Box style={inputStyle}>{fechaEmision}</Box>
            </Box>
          </Box>
        </Box>

        {/* Documentación Visual */}
        <Box className="page-break-before">
          <Text style={sectionTitleStyle}>DOCUMENTACIÓN VISUAL</Text>
          <Divider borderColor="black" borderBottomWidth="2px" mb="10px" />

          <VStack spacing="20px">
            {images && images.map((image, index) => (
              <Box key={index} border="1px solid #000" borderRadius="5px" p="2px" bg="white" w="100%" maxW="600px" className="page-break-avoid">
                <Image
                  src={image.src}
                  w="100%"
                  h="auto"
                  objectFit="contain"
                />
              </Box>
            ))}
          </VStack>
        </Box>

        {/* Footer para impresión */}
        <div className="print-footer">
          <span>Reporte Técnico: {codigo}</span>
          <span>Generado el: {fechaEmision}</span>
          <span>Continúa en la siguiente página...</span>
        </div>
    </Box>
        <Box h="50px" bg="gray.100" my="20px" borderTop="1px solid lightgray" borderBottom="1px solid lightgray" display="flex" alignItems="center" justifyContent="center">
          <Text fontSize="lg" fontWeight="bold" color="gray.600">FIN DEL REPORTE</Text>
        </Box>
    
    <Box id="report-content-direct" bg="white" p="10mm" maxW="210mm" mx="auto" fontFamily="Helvetica, Arial, sans-serif" color="#333">
      
      {/* Encabezado */}
      <Image
        src={portada_reporte_citec}
        w="100%"
        h="150px"
        objectFit="cover"
        mb="15px"
        width="calc(100% + 20px)"
      />
      
        {/* Primera Sección: Datos Principales */}
        <Flex mb="0px">
          <Box w="50%" pr="2">
            <Box style={boxStyle}>
              <Text style={labelStyleDownload}>Ubicación:</Text>
              <Box style={inputStyle}><Text style={textStyle}>{ubicacion}</Text></Box>
            </Box>
            <Box style={boxStyle}>
              <Text style={labelStyleDownload}>Lugar:</Text>
              <Box style={inputStyle}><Text style={textStyle}>{lugar}</Text></Box>
            </Box>
            <Box style={boxStyle}>
              <Text style={labelStyleDownload}>Nombre de Usuario:</Text>
              <Box style={inputStyle}> <Text style={textStyle}>{nameUsuario}</Text></Box>
            </Box>
          </Box>
          <Box w="50%" pl="2">
            <Box style={boxStyle}>
              <Text style={labelStyleDownload}>Número:</Text>
              <Box style={inputStyle}> <Text style={textStyle}>{codigo}</Text></Box>
            </Box>
            <Box style={boxStyle}>
              <Text style={labelStyleDownload}>Fecha:</Text>
              <Box style={inputStyle}> 
                <Text style={textStyle}>{(fecha !== '' && fecha) ? format(new Date(fecha), 'yyyy-MM-dd') : ''}</Text>
              </Box>
            </Box>
          </Box>
        </Flex>

        {/* Segunda Sección: Detalle de Equipos */}
        <Box mb="0px">
          <Text style={sectionTitleStyle}>DETALLE DE EQUIPOS</Text>
          <Divider borderColor="black" borderBottomWidth="2px" mb="10px" />

          <Box style={boxStyle}>
            <Text style={labelStyleDownload}>Proyecto:</Text>
            <Box style={inputStyle}>
              <Text style={textStyle}>{proyecto}</Text>
            </Box>
          </Box>

          <Flex wrap="wrap" mx="-5px">
            {equipos?.codigos?.map((equipo, index) => {
              const chasisValue = equipo.chasis ? (equipo.chasis.includes('|') ? equipo.chasis.split('|')[0] : equipo.chasis) : (equipo.serie ? (equipo.serie.includes('|') ? equipo.serie.split('|')[0] : equipo.serie) : "N/D");
              return (
                <Box key={index} w="33.33%" p="5px">
                  <Box border="1px solid #000" borderRadius="5px" p="5px" fontSize="10px" h="100%">
                    <Text fontWeight="bold">{equipo?.business_name} {equipo?.marca}</Text>
                    <Text>Serie: {chasisValue}</Text>
                    <Text>Cod: {equipo.codigo_finca}</Text>
                    <Text>Proyecto: {equipo.proyecto}</Text>
                    <Text>Cliente: {equipo.cliente}</Text>
                    <Text>Ubicación: {equipo.ubicacion}</Text>
                  </Box>
                </Box>
              )
            })}
          </Flex>
        </Box>

        {/* Tercera Sección: Detalle de la Visita */}
        <Box mb="0px">
          <Text style={sectionTitleStyle}>DETALLE DE LA VISITA</Text>
          <Divider borderColor="black" borderBottomWidth="2px" mb="10px" />

          <Box mb="0">
            <Text style={labelStyleDownload}>Sistema del Equipo</Text>
          </Box>
          <Flex wrap="wrap" mx="-5px">
            {sistemas.split(",")?.map((sistema, index) => {
              return (
                <Box key={index} w="33.33%" p="5px">
                  <Box border="1px solid #000" borderRadius="5px" p="5px" fontSize="10px" h="100%">
                    <Text fontWeight="bold" style={textStyle}>{sistema}</Text>
                  </Box>
                </Box>
              )
            })}
          </Flex>

          <Box className="page-break-avoid">
            <Text style={subTitleStyle}>Hallazgos Encontrados</Text>
            <Divider borderColor="black" w="35%" mb="5px" />
            <Box border="1px solid #000" borderRadius="3px" p="5px" minH="50px" bg="white">
              {renderHTML(hallazgos)}
            </Box>
          </Box>

          <Box mt="0px" className="page-break-avoid">
            <Text style={subTitleStyle}>Acciones Ejecutadas</Text>
            <Divider borderColor="black" w="35%" mb="5px" />
            <Box border="1px solid #000" borderRadius="3px" p="5px" minH="50px" bg="white">
              {renderHTML(accionesEjecutadas)}
            </Box>
          </Box>

          <Box mt="0px" className="page-break-avoid">
            <Text style={subTitleStyle}>Recomendaciones</Text>
            <Divider borderColor="black" w="35%" mb="5px" />
            <Box border="1px solid #000" borderRadius="3px" p="5px" minH="50px" bg="white">
              {renderHTML(recomendaciones)}
            </Box>
          </Box>
        </Box>

        {/* Cuarta Sección: Datos del Técnico */}
        <Box mb="0px" className="page-break-avoid">
          <Text style={sectionTitleStyle}>DATOS DEL TÉCNICO</Text>
          <Divider borderColor="black" borderBottomWidth="2px" mb="10px" />

          <Box style={boxStyle}>
            <Box style={boxStyle}>
              <Text style={labelStyleDownload}>Elaborado por</Text>
              <Box style={inputStyle}>
                <Text style={textStyle}>{elaboradoPor}</Text>
              </Box>
            </Box>
            <Box style={boxStyle} marginLeft={"5px"}>
              <Text style={labelStyleDownload}>Revisado por</Text>
              <Box style={inputStyle}>
                <Text style={textStyle}>{revisadoPor}</Text>
              </Box>
            </Box>
            <Box style={boxStyle} marginLeft={"5px"}>
              <Text style={labelStyleDownload}>Fecha de emisión</Text>
              <Box style={inputStyle}>
                <Text style={textStyle}>{fechaEmision}</Text>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Documentación Visual */}
        <Box className="page-break-before">
          <Text style={sectionTitleStyle}>DOCUMENTACIÓN VISUAL</Text>
          <Divider borderColor="black" borderBottomWidth="2px" mb="10px" />

          <VStack spacing="20px">
            {images && images.map((image, index) => (
              <Box key={index} border="1px solid #000" borderRadius="5px" p="2px" bg="white" w="100%" maxW="600px" className="page-break-avoid">
                <Image
                  src={image.src}
                  w="100%"
                  h="auto"
                  objectFit="contain"
                />
              </Box>
            ))}
          </VStack>
        </Box>

        {/* Footer para impresión */}
        <div className="print-footer">
          <span>Reporte Técnico: {codigo}</span>
          <span>Generado el: {fechaEmision}</span>
          <span>Continúa en la siguiente página...</span>
        </div>
    </Box>
    </>
    
  );
};

const GenerarPDF = () => {

  const { id } = useParams();
  const timeZone = 'America/Guatemala';

  /*=======================================================
   BLOQUE: REDUX-PERSIST
  =========================================================*/
  const userData = useSelector((state) => state.userData);
  const dispatch = useDispatch();

  // ************** useState **************
  const [refresh, setRefresh] = useState(false);
  const forceUpdate = () => setRefresh(prev => !prev);

  // Estado para el nodo del portal de impresión
  const [printNode, setPrintNode] = useState(null);

  // Refs para contenido HTML
  const hallazgos = useRef({ value: '' })
  const accionesEjecutadas = useRef({ value: '' })
  const recomendaciones = useRef({ value: '' })

  // Estados simples
  const [ubicacionValue, setUbicacionValue] = useState('Guatemala, Guatemala')
  const [lugarValue, setLugarValue] = useState('')
  const [nameUsuarioValue, setNameUsuarioValue] = useState('')
  const [codigoValue, setCodigoValue] = useState('')
  const [fechaValue, setFechaValue] = useState(null)
  const [celularValue, setCelularValue] = useState('')
  const [proyectoValue, setProyectoValue] = useState('')
  const [equiposValue, setEquiposValue] = useState([])
  const [elaboradoPorValue, setElaboradoPorValue] = useState(userData?.login?.display_name)
  const [sistemasValue, setSistemasValue] = useState('')
  const [revisadoPorValue, setRevisadoPorValue] = useState('Jefatura de CITEC')
  const [fechaEmisionValue, setFechaEmisionValue] = useState(formatInTimeZone(toZonedTime(new Date(), timeZone), timeZone, 'yyyy-MM-dd'));
  const [imagesValue, setImagesValue] = useState([]);

  //images ref
  const imagesRef = useRef(imagesValue)

  //trigger Generar PDF (ahora solo actualiza la vista previa)
  const [triggerGenerarPdf, setTriggerGenerarPdf] = useState(false)

  // Efecto para crear el nodo del portal de impresión
  useEffect(() => {
    const node = document.createElement('div');
    node.id = 'print-root';
    document.body.appendChild(node);
    setPrintNode(node);

    return () => {
      document.body.removeChild(node);
    };
  }, []);

  const handleGenerarPdf = () => {
    setImagesValue(imagesRef.current)
    setTriggerGenerarPdf(prev => !prev)
  }

  const handleGuardar = () => {
    //console.log("Guardar")
  }

  const handlePrint = () => {
    window.print();
  }

  const handleDownloadPDF = () => {
    const element = document.getElementById('report-content-direct');
    const opt = {
      margin: [0, 0, 10, 0], // Increased bottom margin for footer
      filename: `Reporte_${codigoValue || 'CITEC'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().set(opt).from(element).toPdf().get('pdf').then((pdf) => {
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(100);

        // Footer Text
        const footerText = `Reporte Técnico: ${codigoValue || 'N/A'} | Generado el: ${fechaEmisionValue}`;
        pdf.text(footerText, 10, 285);

        // Continuation Text
        if (i < totalPages) {
          pdf.text('Continúa en la siguiente página...', 10, 290);
        }

        // Page Numbers
        pdf.text(`Página ${i} de ${totalPages}`, 180, 290);
      }
    }).save();
  };

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <style>{printStyles}</style>

      <Box className="no-print">
        <CasoFormulario
          caso_ID={id}
          hallazgos={hallazgos.current}
          accionesEjecutadas={accionesEjecutadas.current}
          recomendaciones={recomendaciones.current}
          ubicacion={{ value: ubicacionValue, set: setUbicacionValue }}
          lugar={{ value: lugarValue, set: setLugarValue }}
          nameUsuario={{ value: nameUsuarioValue, set: setNameUsuarioValue }}
          codigo={{ value: codigoValue, set: setCodigoValue }}
          fecha={{ value: fechaValue, set: setFechaValue }}
          celular={{ value: celularValue, set: setCelularValue }}
          proyecto={{ value: proyectoValue, set: setProyectoValue }}
          equipos={{ value: equiposValue, set: setEquiposValue }}
          sistemas={{ value: sistemasValue, set: setSistemasValue }}
          elaboradoPor={{ value: elaboradoPorValue, set: setElaboradoPorValue }}
          revisadoPor={{ value: revisadoPorValue, set: setRevisadoPorValue }}
          fechaEmision={{ value: fechaEmisionValue, set: setFechaEmisionValue }}
          images={{ value: imagesValue, set: setImagesValue }}
          imagesRef={imagesRef}
          handle={{ generarPdf: handleGenerarPdf, guardar: handleGuardar }}
          onDataChange={forceUpdate}
        />
      </Box>

      <Flex direction="column" pt="20px" mb="20px" alignItems="center" className="no-print">
        <HStack spacing={4} mb="20px">
          <Button
            colorScheme="blue"
            size="lg"
            onClick={handlePrint}
          >
            Imprimir / Guardar como PDF
          </Button>
          <Button
            colorScheme="green"
            size="lg"
            onClick={handleDownloadPDF}
          >
            Descargar PDF Directo
          </Button>
        </HStack>
        <Text mb="10px" fontWeight="bold">Vista Previa del Reporte:</Text>
      </Flex>

      {/* Reporte Visible (Vista Previa) */}
      <Box border="1px solid #e2e8f0" boxShadow="lg" mb="50px">
        <ReportTemplate
          hallazgos={hallazgos.current.value}
          accionesEjecutadas={accionesEjecutadas.current.value}
          recomendaciones={recomendaciones.current.value}
          ubicacion={ubicacionValue}
          lugar={lugarValue}
          nameUsuario={nameUsuarioValue}
          codigo={codigoValue}
          fecha={fechaValue}
          celular={celularValue}
          proyecto={proyectoValue}
          equipos={equiposValue}
          sistemas={sistemasValue}
          elaboradoPor={elaboradoPorValue}
          revisadoPor={revisadoPorValue}
          fechaEmision={fechaEmisionValue}
          images={imagesRef.current}
        />
      </Box>

      {/* Reporte para Impresión (Portal) */}
      {printNode && ReactDOM.createPortal(
        <ReportTemplate
          hallazgos={hallazgos.current.value}
          accionesEjecutadas={accionesEjecutadas.current.value}
          recomendaciones={recomendaciones.current.value}
          ubicacion={ubicacionValue}
          lugar={lugarValue}
          nameUsuario={nameUsuarioValue}
          codigo={codigoValue}
          fecha={fechaValue}
          celular={celularValue}
          proyecto={proyectoValue}
          equipos={equiposValue}
          sistemas={sistemasValue}
          elaboradoPor={elaboradoPorValue}
          revisadoPor={revisadoPorValue}
          fechaEmision={fechaEmisionValue}
          images={imagesRef.current}
        />,
        printNode
      )}
    </Flex>
  )
}

export default GenerarPDF;