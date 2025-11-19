import React, { useState, useEffect, useRef } from "react";
//redux
import { useSelector, useDispatch } from 'react-redux';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Image, PDFViewer } from "@react-pdf/renderer";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
// Chakra imports
import {
  Flex,
  flexbox,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
  useColorModeValue
} from "@chakra-ui/react";

//images
import portada_reporte_citec from 'assets/img/portadas/portada_reporte_citec.png'
import fondo from 'assets/img/portadas/fondo_reporte.jpg'

//CUSTOM IMPORTS
import CasoModalTextArea from './CasoModalTextArea'
import CasoModalInput from './CasoModalInput'
import CasoFormulario from "./CasoFormulario";
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';

// Estilos del reporte
const styles = StyleSheet.create({
  page: {
    paddingVertical: 0,
    paddingHorizontal: 10,
    fontFamily: "Helvetica",
    fontSize: 11,
    color: "#333",
    lineHeight: 0,
    backgroundColor: "#f5f5f5"
  },
  header: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  section: {
    borderRadius: 5,
  },
  sectionInput: {
    flexDirection: "row",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    width: "48%", // Ajusta el ancho para dos columnas
  },
  label: {

    fontWeight: "bold",
    marginBottom: 0,

  },

  labelTitle: {
    fontWeight: "bold",
    marginBottom: 2,
    marginTop: 2,
    fontSize: 16,
    padding: 5,
    borderRadius: 5,
    textAlign: "center"
  },
  labelSubTitle: {
    fontWeight: "bold",
    marginBottom: 2,
    fontSize: 12,
    padding: 5,
    borderRadius: 5,
    maxWidth: "25%",
  },
  textArea: {
    border: "1px solid #000",
    padding: 5,
    minHeight: 50,
    borderRadius: 3,
    marginTop: 5,
    backgroundColor: "#FFFFFF",
    objectFit: "contain"
  },
  input: {
    border: "1px solid #000",
    padding: 5,
    minHeight: 2,
    borderRadius: 5,
    marginTop: 5,
    marginLeft: 5,
    backgroundColor: "#FFFFFF",
  },
  labelInput: {
    //border: "2pt solid #000",
    fontWeight: "bold",
    marginTop: 5,
    paddingTop: 5,
    //backgroundColor:"#FFFFFF",
    //borderRadius:5,
    //paddingLeft:5

  },
  separator: {
    borderBottom: "2px solid #000",
  },
  separatorSubTitle: {
    borderBottom: "1px solid #000",
    maxWidth: "35%",
  },
  gridContainer: {
    display: "flex",
    flexDirection: "row", // Para crear filas horizontales
    flexWrap: "wrap",     // Permite que las columnas se envuelvan en una nueva fila
    marginBottom: 10,
    marginTop: 10,
  },
  gridItem: {
    width: "30%",        // Divide el contenedor en 3 columnas (33.33% cada una)
    height: 85,             // Altura de las celdas
    border: "1pt solid #000",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    marginLeft: 5,
    marginTop: 5,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    padding: 3.6
  },
  imageCover: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    objectFit: 'cover',
  },
  content: {
    position: "relative", // Asegura que el contenido se renderice sobre la imagen
    zIndex: 1, // Eleva el contenido por encima del fondo
  },
  imageContent: {
    border: "1pt solid #000",
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    padding: 2,
    //marginBottom: 5,
  },
});

// Datos de ejemplo
const reportData = {
  location: "Ciudad de Guatemala",
  place: "Edificio Torre 4",
  username: "Juan Pérez",
  number: "123456",
  date: "2024-06-10",
  phone: "555-123-4567",
  equipmentDetail: {
    text: "Los equipos se encuentran en condiciones operativas. Se verificó el sistema y se documentaron todas las piezas críticas.",
    proyecto: "FRENTE 16"
  },
  visitDetail: {
    system: "Sistema principal de climatización todo es posible",
    findings: "Se encontraron filtros sucios y fugas menores en el ducto principal. .",
    actions: "Limpieza de filtros y sellado de fugas con material aprobado. ",
    recommendations:
      "Recomendar mantenimiento periódico y reemplazo de filtros cada 6 meses.",
  },
  technicianData: {
    preparedBy: "Billy Guillen",
    reviewedBy: "Jefatura de CITEC",
    reportDate: "2024-06-10",
  },
};

// Componente de Documento
const MyPDFDocument = ({ caso_ID, hallazgos, accionesEjecutadas, recomendaciones, ubicacion, lugar, nameUsuario, codigo, fecha, celular, proyecto, equipos, sistemas, elaboradoPor, revisadoPor, fechaEmision, images }) => {


  return (
    <Document minPresenceAhead={100}>
      <Page size="A4" style={styles.page}>
        {/* Encabezado Principal 
          
          <Image
                src={fondo} // Reemplaza con la ruta de tu imagen
                style={styles.imageCover}
            />*/}

        <Image
          src={portada_reporte_citec} // Reemplaza con la ruta de tu imagen
          style={{ width: "104%", height: 150, marginLeft: -10, }}
        />
        {/* Primera Sección: Datos Principales */}
        <View style={styles.section}>
          <View style={styles.row}>
            {/* Primera Columna */}
            <View style={styles.column}>
              <View style={styles.sectionInput}>
                <Text style={styles.labelInput}>Ubicación</Text>
                <Text style={styles.input}>{ubicacion.value}</Text>
              </View>
              <View style={styles.sectionInput}>
                <Text style={styles.labelInput}>Lugar</Text>
                <Text style={styles.input}>{lugar.value}</Text>
              </View>
              <View style={styles.sectionInput}>
                <Text style={styles.labelInput}>Nombre de Usuario</Text>
                <Text style={styles.input}>{nameUsuario.value}</Text>
              </View>

            </View>

            {/* Segunda Columna */}
            <View style={styles.column}>
              <View style={styles.sectionInput}>
                <Text style={styles.labelInput}>Número:</Text>
                <Text style={styles.input}>{codigo.value}</Text>
              </View>
              <View style={styles.sectionInput}>
                <Text style={styles.labelInput}>Fecha:</Text>
                <Text style={styles.input}>{(fecha.value != '') ? format(fecha.value, 'yyyy-MM-dd') : ''}</Text>
              </View>

              {/*<View style={styles.sectionInput}>
                                <Text style={styles.labelInput}>Celular:</Text>
                                <Text style={styles.input}>{celular.value}</Text>
                            </View>*/}

            </View>
          </View>
        </View>

        {/* Separador <View style={styles.separator} /> */}


        {/* Segunda Sección: Detalle del Equipo */}
        <View style={styles.section}>
          <Text style={styles.labelTitle}>DETALLE DE EQUIPOS</Text>

          <View style={styles.separator} />

          <View style={styles.sectionInput}>
            <Text style={styles.labelInput}>Proyecto</Text>
            <Text style={styles.input}>{proyecto.value}</Text>
          </View>
          <View style={styles.gridContainer}>
            {equipos?.value?.codigos?.map((equipo) => {
              const chasisValue = equipo.chasis ? (equipo.chasis.includes('|') ? equipo.chasis.split('|')[0] : equipo.chasis) : (equipo.serie ? (equipo.serie.includes('|') ? equipo.serie.split('|')[0] : equipo.serie) : "N/D");
              return (
                <Text style={styles.gridItem}>
                  <Text>{equipo?.business_name} {equipo?.marca}</Text>
                  <Text>{'\n'}</Text>
                  <Text>Serie: {chasisValue}</Text>
                  <Text>{'\n'}</Text>
                  <Text>Cod: {equipo.codigo_finca}</Text>
                  <Text>{'\n'}</Text>
                  <Text>Proyecto: {equipo.proyecto}</Text>
                  <Text>{'\n'}</Text>
                  <Text>Cliente: {equipo.cliente}</Text>
                  <Text>{'\n'}</Text>
                  <Text>Ubicación: {equipo.ubicacion}</Text>
                </Text>
              )
            })}
          </View>
        </View>

        {/* Separador <View style={styles.separator} /> */}


        {/* Tercera Sección: Detalle de la Visita */}
        <View style={styles.section} wrap={false}>
          <Text style={styles.labelTitle}>DETALLE DE LA VISITA</Text>

          <View style={styles.separator} />

          <View style={styles.sectionInput}>
            <Text style={styles.labelInput}>Sistema del Equipo</Text>
            <Text style={styles.input}>{sistemas.value}</Text>
          </View>

          <Text style={styles.labelSubTitle}>Hallazgos Encontrados</Text>
          <View style={styles.separatorSubTitle} />
          {hallazgos?.img && (
            <Image
              style={styles.textArea}
              key={"hallazgos"}
              src={hallazgos?.img}
            />
          )}

          <View style={styles.section}>
            <Text style={styles.labelSubTitle}>Acciones Ejecutadas</Text>
            <View style={styles.separatorSubTitle} />
            {/*<Text style={styles.textArea}>{accionesEjecutadas.current?.value}</Text>*/}
            {accionesEjecutadas?.img && (
              <Image
                style={styles.textArea}
                key={"accionesEjecutadas"}
                src={accionesEjecutadas?.img}

              />
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.labelSubTitle}>Recomendaciones</Text>
            <View style={styles.separatorSubTitle} />
            {/*<Text style={styles.textArea}>{recomendaciones.current.value}</Text>*/}
            {recomendaciones?.img && (
              <Image
                style={styles.textArea}
                key={"recomendaciones"}
                src={recomendaciones?.img}
              />
            )}
          </View>
        </View>

        {/* Cuarta Sección Datos del Técnico */}
        <View style={styles.section} wrap={false} >
          <Text style={styles.labelTitle}>DATOS DEL TÉCNICO</Text>

          <View style={styles.separator} />

          <View style={styles.sectionInput}>
            <Text style={styles.labelInput}>Elaborado por</Text>
            <Text style={styles.input}>{elaboradoPor.value}</Text>
          </View>
          <View style={styles.sectionInput}>
            <Text style={styles.labelInput}>Revisado por</Text>
            <Text style={styles.input}>{revisadoPor.value}</Text>
          </View>
          <View style={styles.sectionInput}>
            <Text style={styles.labelInput}>Fecha de emisión</Text>
            <Text style={styles.input}>{fechaEmision.value}</Text>
          </View>
        </View>

        <Text style={styles.labelTitle}>DOCUMENTACIÓN VISUAL</Text>

        <View style={styles.separator} />

        {images.value.map((image, index) => (
          <View style={{ flexDirection: "column", alignItems: "center", paddingTop: "10px" }} wrap={false} minPresenceAhead={100}>

            <View key={index} style={styles.imageContent} >
              <Image
                key={index}
                src={image.src}
                style={{
                  width: 570,
                  height: 375,
                  objectFit: "contain"
                }}

              />
            </View>

          </View>
        ))}




      </Page>
    </Document>
  )
};

const GenerarPDF2 = () => {


  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>

      <div>
        <h1>Generador de PDF en ReactJS</h1>
        <PDFDownloadLink
          document={<MyPDFDocument />}
          fileName="reporte.pdf"
          style={{
            textDecoration: "none",
            padding: "10px 20px",
            color: "#fff",
            backgroundColor: "#007bff",
            borderRadius: "5px",
          }}
        >
          {({ blob, url, loading, error }) =>
            loading ? "Generando documento..." : "Descargar PDF"
          }
        </PDFDownloadLink>
      </div>
    </Flex>
  );
};

const GenerarPDF = () => {

  const { id } = useParams();
  const timeZone = 'America/Guatemala'; // Define tu zona horaria

  /*=======================================================
   BLOQUE: REDUX-PERSIST
   DESCRIPTION: 
  =========================================================*/
  const userData = useSelector((state) => state.userData);  // Acceder al JSON desde el estado
  const dispatch = useDispatch();

  const saveUserData = (json) => {
    dispatch({ type: 'SET_USER_DATA', payload: json });
  };

  const getUserData = () => {
    dispatch({ type: 'GET_USER_DATA' });  // Despachar la acción para obtener datos
  };

  /*====================FIN BLOQUE: REDUX-PERSIST ==============*/

  // ************** useState **************
  const [refresh, setRefresh] = useState(false);
  // hallazgos
  const hallazgos = useRef(null)
  //const [hallazgosValue,setHallazgosValue] = useState('')

  const accionesEjecutadas = useRef(null)
  //const [accionesEjecutadasValue,setaccionesEjecutadasValue] = useState('')

  // recomendaciones
  const recomendaciones = useRef(null)
  //const [recomendacionesValue,setRecomendacionesValue] = useState('')

  // ubiccaion
  const [ubicacionValue, setUbicacionValue] = useState('Guatemala, Guatemala')

  // lugar
  const [lugarValue, setLugarValue] = useState('')

  // nameUusuario
  const [nameUsuarioValue, setNameUsuarioValue] = useState('')

  // codigo 
  const [codigoValue, setCodigoValue] = useState('')

  // fecha
  const [fechaValue, setFechaValue] = useState(null)

  // celular
  const [celularValue, setCelularValue] = useState('')

  // proyecto
  const [proyectoValue, setProyectoValue] = useState('')

  // equipos - lista de codigos de funca de equipos
  const [equiposValue, setEquiposValue] = useState([])

  // elaboradoPor
  const [elaboradoPorValue, setElaboradoPorValue] = useState(userData?.login?.display_name)

  //sistemas
  const [sistemasValue, setSistemasValue] = useState('')

  // revisadoPor
  const [revisadoPorValue, setRevisadoPorValue] = useState('Jefatura de CITEC')

  // fechaEmision
  const [fechaEmisionValue, setFechaEmisionValue] = useState(formatInTimeZone(toZonedTime(new Date(), timeZone), timeZone, 'yyyy-MM-dd'));

  //images  
  const [imagesValue, setImagesValue] = useState([]);

  // ************** useRef **************

  //images
  const imagesRef = useRef(imagesValue)

  //trigger Generar PDF
  const [triggerGenerarPdf, setTriggerGenerarPdf] = useState(false)

  // ************** functions **************

  const handleGenerarPdf = () => {
    setImagesValue(imagesRef.current)
    setTriggerGenerarPdf(!triggerGenerarPdf)
  }

  const handleGuardar = () => {
    console.log("Guardar")
  }




  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <CasoFormulario
        caso_ID={id}
        hallazgos={hallazgos}
        accionesEjecutadas={accionesEjecutadas}
        recomendaciones={recomendaciones}
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

      />

      <Flex direction="column" pt={{ base: "120px", md: "75px" }} mb="20px">

        <div>
          <PDFDownloadLink
            document={
              <MyPDFDocument
                caso_ID={id}
                hallazgos={hallazgos}
                accionesEjecutadas={accionesEjecutadas}
                recomendaciones={recomendaciones}
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

              />
            }
            fileName="reporte.pdf"
            style={{
              textDecoration: "none",
              padding: "10px 20px",
              color: "#fff",
              backgroundColor: "#007bff",
              borderRadius: "5px",
            }}
          >
            {({ blob, url, loading, error }) =>
              loading ? "Generando documento..." : "Descargar PDF"
            }
          </PDFDownloadLink>
        </div>
      </Flex>

      <PDFViewer style={{ height: '800px' }} >
        <MyPDFDocument
          caso_ID={id}
          hallazgos={hallazgos}
          accionesEjecutadas={accionesEjecutadas}
          recomendaciones={recomendaciones}
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

        />
      </PDFViewer>


    </Flex>
  )
}

export default GenerarPDF;