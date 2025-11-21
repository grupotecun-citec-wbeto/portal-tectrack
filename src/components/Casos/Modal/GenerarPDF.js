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
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: auto !important;
      z-index: 9999 !important;
    }

    /* Asegurar que el contenido del reporte sea visible */
    #report-content {
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
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
    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} className="rich-text-content" style={{ fontSize: "11px", fontFamily: "Helvetica, Arial, sans-serif" }} />;
  };

  const labelStyle = { fontWeight: "bold", fontSize: "11px", marginBottom: "2px", marginTop: "5px" };
  const inputStyle = { border: "1px solid #000", padding: "5px", borderRadius: "5px", minHeight: "20px", fontSize: "11px", backgroundColor: "#fff" };
  const sectionTitleStyle = { fontWeight: "bold", fontSize: "16px", textAlign: "center", margin: "10px 0", padding: "5px", borderRadius: "5px" };
  const subTitleStyle = { fontWeight: "bold", fontSize: "12px", marginBottom: "5px", marginTop: "10px", padding: "5px", borderRadius: "5px", display: "inline-block" };

  return (
    <Box id="report-content" bg="white" p="10mm" maxW="210mm" mx="auto" fontFamily="Helvetica, Arial, sans-serif" color="#333">
      {/* Encabezado */}
      <Image
        src={portada_reporte_citec}
        w="100%"
        h="150px"
        objectFit="cover"
        mb="10px"
        ml="-10px"
        width="calc(100% + 20px)"
      />

      {/* Primera Sección: Datos Principales */}
      <Flex mb="10px">
        <Box w="50%" pr="2">
          <Box mb="2">
            <Text style={labelStyle}>Ubicación</Text>
            <Box style={inputStyle}>{ubicacion}</Box>
          </Box>
          <Box mb="2">
            <Text style={labelStyle}>Lugar</Text>
            <Box style={inputStyle}>{lugar}</Box>
          </Box>
          <Box mb="2">
            <Text style={labelStyle}>Nombre de Usuario</Text>
            <Box style={inputStyle}>{nameUsuario}</Box>
          </Box>
        </Box>
        <Box w="50%" pl="2">
          <Box mb="2">
            <Text style={labelStyle}>Número:</Text>
            <Box style={inputStyle}>{codigo}</Box>
          </Box>
          <Box mb="2">
            <Text style={labelStyle}>Fecha:</Text>
            <Box style={inputStyle}>{(fecha !== '' && fecha) ? format(new Date(fecha), 'yyyy-MM-dd') : ''}</Box>
          </Box>
        </Box>
      </Flex>

      {/* Segunda Sección: Detalle de Equipos */}
      <Box mb="10px">
        <Text style={sectionTitleStyle}>DETALLE DE EQUIPOS</Text>
        <Divider borderColor="black" borderBottomWidth="2px" mb="10px" />

        <Box mb="2">
          <Text style={labelStyle}>Proyecto</Text>
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
      <Box mb="10px">
        <Text style={sectionTitleStyle}>DETALLE DE LA VISITA</Text>
        <Divider borderColor="black" borderBottomWidth="2px" mb="10px" />

        <Box mb="2">
          <Text style={labelStyle}>Sistema del Equipo</Text>
          <Box style={inputStyle}>{sistemas}</Box>
        </Box>

        <Box className="page-break-avoid">
          <Text style={subTitleStyle}>Hallazgos Encontrados</Text>
          <Divider borderColor="black" w="35%" mb="5px" />
          <Box border="1px solid #000" borderRadius="3px" p="5px" minH="50px" bg="white">
            {renderHTML(hallazgos)}
          </Box>
        </Box>

        <Box mt="10px" className="page-break-avoid">
          <Text style={subTitleStyle}>Acciones Ejecutadas</Text>
          <Divider borderColor="black" w="35%" mb="5px" />
          <Box border="1px solid #000" borderRadius="3px" p="5px" minH="50px" bg="white">
            {renderHTML(accionesEjecutadas)}
          </Box>
        </Box>

        <Box mt="10px" className="page-break-avoid">
          <Text style={subTitleStyle}>Recomendaciones</Text>
          <Divider borderColor="black" w="35%" mb="5px" />
          <Box border="1px solid #000" borderRadius="3px" p="5px" minH="50px" bg="white">
            {renderHTML(recomendaciones)}
          </Box>
        </Box>
      </Box>

      {/* Cuarta Sección: Datos del Técnico */}
      <Box mb="10px" className="page-break-avoid">
        <Text style={sectionTitleStyle}>DATOS DEL TÉCNICO</Text>
        <Divider borderColor="black" borderBottomWidth="2px" mb="10px" />

        <Box mb="2">
          <Text style={labelStyle}>Elaborado por</Text>
          <Box style={inputStyle}>{elaboradoPor}</Box>
        </Box>
        <Box mb="2">
          <Text style={labelStyle}>Revisado por</Text>
          <Box style={inputStyle}>{revisadoPor}</Box>
        </Box>
        <Box mb="2">
          <Text style={labelStyle}>Fecha de emisión</Text>
          <Box style={inputStyle}>{fechaEmision}</Box>
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
    </Box>
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
        <Button
          colorScheme="blue"
          size="lg"
          onClick={handlePrint}
          mb="20px"
        >
          Imprimir / Guardar como PDF
        </Button>
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