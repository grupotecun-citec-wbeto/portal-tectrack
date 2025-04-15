import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 20,
  },
  title: {
    fontSize: 12,
    marginBottom: 10,
    fontWeight: "bold",
  },
  list: {
    marginLeft: 10,
  },
  item: {
    fontSize: 10,
    marginBottom: 5,
  },
  subItem: {
    fontSize: 7,
    marginLeft: 20,
    marginBottom: 5,
  },
});

// Datos del árbol
const data = [
  {
    name: "dato1",
    children: ["dato1.1", "dato1.2"],
  },
  {
    name: "dato2",
    children: ["dato2.1", "dato2.2"],
  },
];

// Componente para renderizar el árbol
const TreeData = ({style,title}) => (
      <View style={style}>
        <Text style={styles.title}>{title}</Text>
        {data.map((item, index) => (
          <View key={index} style={styles.list}>
            <Text style={styles.item}>{item.name}</Text>
            {item.children.map((child, childIndex) => (
              <Text key={childIndex} style={styles.subItem}>
                - {child}
              </Text>
            ))}
          </View>
        ))}
      </View>
);

export default TreeData;