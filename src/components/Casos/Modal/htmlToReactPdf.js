import React from 'react';
import { Text, View, Image } from '@react-pdf/renderer';

// Estilos mínimos para textos
const defaultStyles = {
    p: { fontSize: 12, marginBottom: 6 },
    li: { fontSize: 12, marginBottom: 4 },
    h1: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    h2: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
    h3: { fontSize: 14, fontWeight: 'bold', marginBottom: 6 },
    bold: { fontWeight: 'bold' },
};

export function parseHTMLtoReactPDF(html) {
    if (!html) return null;

    // Use native DOMParser available in browsers
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const root = doc.body;

    const convertNode = (node, index) => {
        // Texto puro (Node.TEXT_NODE === 3)
        if (node.nodeType === 3) {
            const text = node.textContent.trim();
            if (!text) return null;
            return <Text key={index}>{text}</Text>;
        }

        // Elementos (Node.ELEMENT_NODE === 1)
        if (node.nodeType === 1) {
            const tagName = node.tagName.toUpperCase();

            // Imagen
            if (tagName === 'IMG') {
                const src = node.getAttribute('src');
                return <Image key={index} src={src} style={{ marginBottom: 10 }} />;
            }

            // Párrafo
            if (tagName === 'P') {
                return (
                    <View key={index} style={defaultStyles.p}>
                        {Array.from(node.childNodes).map((c, i) => convertNode(c, i))}
                    </View>
                );
            }

            // Negrita
            if (tagName === 'B' || tagName === 'STRONG') {
                return (
                    <Text key={index} style={defaultStyles.bold}>
                        {node.textContent}
                    </Text>
                );
            }

            // Listas UL
            if (tagName === 'UL') {
                return (
                    <View key={index} style={{ marginBottom: 8 }}>
                        {Array.from(node.children).map((li, i) => (
                            <View key={i} style={{ flexDirection: 'row' }}>
                                <Text style={{ marginRight: 6 }}>•</Text>
                                <Text style={defaultStyles.li}>{li.textContent}</Text>
                            </View>
                        ))}
                    </View>
                );
            }

            // Listas OL
            if (tagName === 'OL') {
                return (
                    <View key={index} style={{ marginBottom: 8 }}>
                        {Array.from(node.children).map((li, i) => (
                            <View key={i} style={{ flexDirection: 'row' }}>
                                <Text style={{ marginRight: 6 }}>{i + 1}.</Text>
                                <Text style={defaultStyles.li}>{li.textContent}</Text>
                            </View>
                        ))}
                    </View>
                );
            }

            // Encabezados
            if (/H[1-6]/.test(tagName)) {
                const level = tagName.toLowerCase();
                return (
                    <Text key={index} style={defaultStyles[level] || defaultStyles.h2}>{node.textContent}</Text>
                );
            }

            // Contenedor genérico (DIV, SPAN, etc.)
            return (
                <View key={index}>
                    {Array.from(node.childNodes).map((c, i) => convertNode(c, i))}
                </View>
            );
        }

        return null;
    };

    return (
        <View>
            {Array.from(root.childNodes).map((c, i) => convertNode(c, i))}
        </View>
    );
}
