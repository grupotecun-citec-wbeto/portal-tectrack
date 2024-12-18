import React from "react";
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Image, PDFViewer   } from "@react-pdf/renderer";
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

// Estilos del reporte
const styles = StyleSheet.create({
    page: {
      paddingVertical:0,
      paddingHorizontal:10,
      fontFamily: "Helvetica",
      fontSize: 11,
      color: "#333",
      lineHeight: 0,
      backgroundColor:"#f5f5f5"
    },
    header: {
      fontSize: 16,
      textAlign: "center",
      fontWeight: "bold",
    },
    section: {
      borderRadius:5,
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
        fontSize:16,
        padding:5,
        borderRadius:5,
        textAlign:"center"
    },
    labelSubTitle: {
        fontWeight: "bold",
        marginBottom: 2,
        fontSize:12,
        padding:5,
        borderRadius:5,
        maxWidth:"25%",
      },
    textArea: {
      border: "1px solid #000",
      padding: 5,
      minHeight: 50,
      borderRadius: 3,
      marginTop: 5,
      backgroundColor:"#FFFFFF",
    },
    input: {
      border: "1px solid #000",
      padding: 5,
      minHeight: 2,
      borderRadius: 5,
      marginTop: 5,
      marginLeft: 5,
      backgroundColor:"#FFFFFF",
    },
    labelInput: {
        border: "2pt solid #000",
        fontWeight: "bold",
        marginTop: 5,
        paddingTop:5,
        backgroundColor:"#FFFFFF",
        borderRadius:5,
        paddingLeft:5
      
    },
    separator: {
      borderBottom: "2px solid #000",
    },
    separatorSubTitle: {
        borderBottom: "1px solid #000",
        maxWidth:"35%",
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
      height: 20,             // Altura de las celdas
      border: "1pt solid #000", 
      justifyContent: "center",
      alignItems: "center",
      display: "flex",
      marginLeft: 5,
      marginTop:5,
      backgroundColor:"#FFFFFF",
      borderRadius:5,
      padding:3.6
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
        border: "2pt solid #000",
        borderRadius:5,
        backgroundColor:"#FFFFFF",
        padding: 10,
        marginBottom: 5,
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
    equipmentDetail:{
     text:"Los equipos se encuentran en condiciones operativas. Se verificó el sistema y se documentaron todas las piezas críticas.",
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
      reviewedBy: "Marlon Flores",
      reportDate: "2024-06-10",
    },
  };

// Componente de Documento
const MyPDFDocument = () => {

    

    return(
        <Document>
        <Page size="A4" style={styles.page}>
          {/* Encabezado Principal 
          
          <Image
                src={fondo} // Reemplaza con la ruta de tu imagen
                style={styles.imageCover}
            />*/}
            
                <Image
                    src={portada_reporte_citec} // Reemplaza con la ruta de tu imagen
                    style={{ width: "104%", height: 150, marginLeft:-10,  }}
                />
                {/* Primera Sección: Datos Principales */}
                <View style={styles.section}>
                    <View style={styles.row}>
                        {/* Primera Columna */}
                        <View style={styles.column}>
                            <View style={styles.sectionInput}>
                                <Text style={styles.labelInput}>Ubicación</Text>
                                <Text style={styles.input}>{reportData.location}</Text>
                            </View>
                            <View style={styles.sectionInput}>
                                <Text style={styles.labelInput}>Lugar</Text>
                                <Text style={styles.input}>{reportData.place}</Text>
                            </View>
                            <View style={styles.sectionInput}>
                                <Text style={styles.labelInput}>Nombre de Usuario</Text>
                                <Text style={styles.input}>{reportData.username}</Text>
                            </View>
        
                        </View>
        
                        {/* Segunda Columna */}
                        <View style={styles.column}>
                            <View style={styles.sectionInput}>
                                <Text style={styles.labelInput}>Número:</Text>
                                <Text style={styles.input}>{reportData.number}</Text>
                            </View>
                            <View style={styles.sectionInput}>
                                <Text style={styles.labelInput}>Fecha:</Text>
                                <Text style={styles.input}>{reportData.date}</Text>
                            </View>
            
                            <View style={styles.sectionInput}>
                                <Text style={styles.labelInput}>Celular:</Text>
                                <Text style={styles.input}>{reportData.phone}</Text>
                            </View>
            
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
                        <Text style={styles.input}>{reportData.equipmentDetail.proyecto}</Text>
                    </View>
                    <View style={styles.gridContainer}>
                        <Text style={styles.gridItem}>747-27</Text>
                        <Text style={styles.gridItem}>747-27</Text>
                        <Text style={styles.gridItem}>747-28</Text>
                        <Text style={styles.gridItem}>747-29</Text>
                    </View>
                </View>
            
                {/* Separador <View style={styles.separator} /> */}
        
            
                {/* Tercera Sección: Detalle de la Visita */}
                <View style={styles.section}>
                    <Text style={styles.labelTitle}>DETALLE DE LA VISITA</Text>
                    
                    <View style={styles.separator} />
                    
                    <View style={styles.sectionInput}>
                        <Text style={styles.labelInput}>Sistema del Equipo</Text>
                        <Text style={styles.input}>{reportData.visitDetail.system}</Text>
                    </View>
                
                    
                    <Text style={styles.labelSubTitle}>Hallazgos Encontrados</Text>
                    <View style={styles.separatorSubTitle} />
                    <Text style={styles.textArea} >{reportData.visitDetail.findings}</Text>
                
                    <View style={styles.section} break={true} minPresenceAhead={100}>
                        <Text style={styles.labelSubTitle}>Acciones Ejecutadas</Text>
                        <View style={styles.separatorSubTitle} />
                        <Text style={styles.textArea}>{reportData.visitDetail.actions}</Text>
                    </View>
                
                    <View style={styles.section} break={true} minPresenceAhead={100}>
                        <Text style={styles.labelSubTitle}>Recomendaciones</Text>
                        <View style={styles.separatorSubTitle} />
                        <Text style={styles.textArea}>{reportData.visitDetail.recommendations}</Text>
                    </View>
                
                
                </View>
        
                {/* Cuarta Sección Datos del Técnico */}
                <View style={styles.section}>
                    <Text style={styles.labelTitle}>DATOS DEL TÉCNICO</Text>
                    
                    <View style={styles.separator} />
                
                    <View style={styles.sectionInput}>
                        <Text style={styles.labelInput}>Elaborado por</Text>
                        <Text style={styles.input}>{reportData.technicianData.preparedBy}</Text>
                    </View>
                    <View style={styles.sectionInput}>
                        <Text style={styles.labelInput}>Revisado por</Text>
                        <Text style={styles.input}>{reportData.technicianData.reviewedBy}</Text>
                    </View>
                    <View style={styles.sectionInput}>
                        <Text style={styles.labelInput}>Fecha de emisión</Text>
                        <Text style={styles.input}>{reportData.technicianData.reportDate}</Text>
                    </View>
                </View>
                
                <View style={{ flexDirection: "column", alignItems: "center"}}>
                    <View style={styles.imageContent} break={true} minPresenceAhead={100}>
                        <Image
                            src="https://i.ibb.co/rfCKH0D/OIP.jpg"
                            style={{ width: 474, height: 266, marginBottom: 5 }}
                        />
                    </View>
                    
                    {/*<Text style={{ fontSize: 10 }}>Descripción de la Imagen</Text>*/}
                    
                    <View style={styles.imageContent} break={true} minPresenceAhead={100}>
                        <Image
                            src="https://i.ibb.co/rfCKH0D/OIP.jpg"
                            style={{ width: 474, height: 266, marginBottom: 5 }}
                        />
                    </View>

                    <View style={styles.imageContent} break={true} minPresenceAhead={100}>
                        <Image
                            src="https://i.ibb.co/rfCKH0D/OIP.jpg"
                            style={{ width: 474, height: 266, marginBottom: 5 }}
                        />
                    </View>
                    
                    {/*<Text style={{ fontSize: 10 }}>Descripción de la Imagen</Text>*/}
                </View>
                
              
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

  const GenerarPDF = () => (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <PDFViewer style={{ height: '800px' }} >
        <MyPDFDocument />
      </PDFViewer>
    </Flex>
  );
  
  export default GenerarPDF;