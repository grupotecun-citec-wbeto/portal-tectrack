import React, { useState, useMemo } from "react";
import { Tree, Input } from "antd";
import { Box, Text } from "@chakra-ui/react";

const { Search } = Input;

const systems = [
  {
    title: "Sistema de Inspecciones",
    key: "0-0",
    children: [
      { title: "DOA (Damage On Arrival)", key: "0-0-0" },
      { title: "SMC (Stock Maintenance Check)", key: "0-0-1" },
      { title: "PQC (PDI Quality Control)", key: "0-0-2" },
    ],
  },
  {
    title: "Sistema de Taller",
    key: "0-1",
    children: [
      { title: "Diagnóstico", key: "0-1-0" },
      { title: "Mantenimiento", key: "0-1-1" },
      { title: "Reportes Técnicos", key: "0-1-2" },
    ],
  },
];

export default function SystemsTreeWithSearch() {
  const [searchValue, setSearchValue] = useState("");
  const [checkedKeys, setCheckedKeys] = useState([]);

  // 🔍 Filtro básico que mantiene solo los nodos que coinciden
  const filteredData = useMemo(() => {
    if (!searchValue) return systems;
    const filter = (nodes) =>
      nodes
        .map((node) => {
          if (
            node.title.toLowerCase().includes(searchValue.toLowerCase())
          ) {
            return node;
          }
          if (node.children) {
            const filteredChildren = filter(node.children);
            if (filteredChildren.length > 0)
              return { ...node, children: filteredChildren };
          }
          return null;
        })
        .filter(Boolean);
    return filter(systems);
  }, [searchValue]);

  return (
    <Box borderWidth="1px" rounded="xl" p={4}>
      <Text fontWeight="bold" mb={3}>
        Sistemas y subsistemas
      </Text>

      <Search
        placeholder="Buscar..."
        allowClear
        onChange={(e) => setSearchValue(e.target.value)}
        style={{ marginBottom: 8 }}
      />

      <Tree
        checkable
        defaultExpandAll
        treeData={filteredData}
        checkedKeys={checkedKeys}
        onCheck={(keys) => setCheckedKeys(keys)}
      />
    </Box>
  );
}
