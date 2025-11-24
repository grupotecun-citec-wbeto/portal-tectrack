import React, { useMemo, useState, useEffect, useRef } from "react";
import { Tree, Input } from "antd";
import "antd/dist/reset.css";
import { Box, Tag, TagLabel, TagCloseButton, HStack, Text, VStack, Button, Icon } from "@chakra-ui/react";
import { isEmptyArray } from "formik";

// redux
import { useSelector, useDispatch } from 'react-redux';

import {
  FaTools,
  FaBalanceScale,
  FaClipboardCheck,
  FaArrowUp,
  FaMicrochip,
  FaArrowDown,
  FaChalkboardTeacher,
  FaChartLine,
  FaClipboardList,
  FaCog,
  FaTag,
  FaSitemap
} from "react-icons/fa";

const { Search } = Input;

/** Construye un árbol SOLO con lo seleccionado/semiseleccionado */
function buildSelectedTree(nodes, checkedSet, halfSet) {
  const walk = (arr) =>
    arr
      .map((n) => {
        const children = n.children ? walk(n.children) : [];
        const checked = checkedSet.has(n.key);
        const halfChecked =
          !checked && (halfSet.has(n.key) || children.some((c) => c.checked || c.halfChecked));

        // incluir si está checked o si algún hijo quedó incluido
        if (checked || halfChecked || children.length > 0) {
          return {
            key: n.key,
            title: n.title,
            ...(n.marcaId ? { marcaId: n.marcaId } : {}),
            checked,
            halfChecked,
            ...(children.length ? { children } : {}),
          };
        }
        return null;
      })
      .filter(Boolean);
  return walk(nodes);
}

/** Filtro simple por texto que mantiene la jerarquía */
/**
 * @param {Array<SystemNode>} nodes
 * @param {string} q
 * @returns {Array<SystemNode>}
 */
function filterTreeByText(nodes, q) {
  if (!q) return nodes;
  const term = q.toLowerCase();
  /**
   * @param {Array<SystemNode>} arr 
   * @returns {Array<SystemNode>}
   */
  const walk = (arr) =>
    arr
      .map((n) => {
        const self = n.title.toLowerCase().includes(term);
        const kids = self ? n.children : n.children.length > 0 ? walk(n.children) : [];
        if (self || kids.length) {
          return { ...n, ...(kids.length ? { children: kids } : { children: undefined }) };
        }
        return null;
      })
      .filter(Boolean);
  return walk(nodes);
}

/**
 * Recorre todos los nodos y devuelve una lista de keys.
 * @param {Array<SystemNode>} nodes
 * @returns {Array<string>}
 */
function getAllKeys(nodes) {
  const keys = [];
  const walk = (arr) => {
    arr.forEach((n) => {
      keys.push(n.key);
      if (n.children && n.children.length > 0) {
        walk(n.children);
      }
    });
  };
  walk(nodes);
  return keys;
}

function findRelatedKeys(nodes, targetKey) {
  const descendants = [];
  const ancestors = [];

  const traverse = (currentNodes, currentAncestors) => {
    for (const node of currentNodes) {
      if (node.key === targetKey) {
        const collect = (n) => {
          descendants.push(n.key);
          if (n.children) n.children.forEach(collect);
        }
        collect(node);
        ancestors.push(...currentAncestors);
        return true;
      }
      if (node.children) {
        if (traverse(node.children, [...currentAncestors, node.key])) return true;
      }
    }
    return false;
  };

  traverse(nodes, []);
  return { descendants, ancestors };
}

function extractKeysFromSavedTree(nodes) {
  const checked = [];
  const halfChecked = [];

  const traverse = (list) => {
    list.forEach((node) => {
      if (node.checked) checked.push(node.key);
      if (node.halfChecked) halfChecked.push(node.key);
      if (node.children && node.children.length > 0) {
        traverse(node.children);
      }
    });
  };

  traverse(nodes);
  return { checked, halfChecked };
}

/**
 * 
 * @param {*} prop 
 * @returns 
 */
const getIcon = (title) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("instalación")) return <Icon as={FaTools} color="blue.500" />;
  if (lowerTitle.includes("calibración")) return <Icon as={FaBalanceScale} color="orange.500" />;
  if (lowerTitle.includes("inspección técnica")) return <Icon as={FaClipboardCheck} color="green.500" />;
  if (lowerTitle.includes("actualización")) return <Icon as={FaArrowUp} color="cyan.500" />;
  if (lowerTitle.includes("cambio de hardware")) return <Icon as={FaMicrochip} color="purple.500" />;
  if (lowerTitle.includes("downgrade")) return <Icon as={FaArrowDown} color="red.500" />;
  if (lowerTitle.includes("capacitación")) return <Icon as={FaChalkboardTeacher} color="yellow.500" />;
  if (lowerTitle.includes("seguimiento")) return <Icon as={FaChartLine} color="teal.500" />;
  if (lowerTitle.includes("evaluación")) return <Icon as={FaClipboardList} color="pink.500" />;
  if (lowerTitle.includes("configuración")) return <Icon as={FaCog} color="gray.500" />;

  // Heuristics for Brand and System if not explicitly matched above
  // Assuming "Sistema" nodes might contain "Sistema" in title or be root
  if (lowerTitle.includes("sistema")) return <Icon as={FaSitemap} color="blue.600" />;

  // Default for others, potentially "Marca" if it's a brand node
  // Since we don't have explicit "Marca" text in all brand nodes, we might use a generic tag icon
  // for nodes that don't match the above but are likely brands (intermediate nodes)
  return <Icon as={FaTag} color="gray.400" />;
};

/**
 * 
 * @param {*} prop 
 * @returns 
 */
export default function AntdTreeLiveJSON(prop) {
  const [checkedKeys, setCheckedKeys] = useState([]); // solo los checked reales
  const [halfCheckedKeys, setHalfCheckedKeys] = useState([]); // semiseleccionados (padres)
  const [search, setSearch] = useState("");
  const { treeData } = prop;

  const filtered = useMemo(() => getAllKeys(filterTreeByText(treeData, search)), [treeData, search]);

  /**************************** Block redux ****************************/
  const userData = useSelector((state) => state.userData);  // Acceder al JSON desde el estado
  const dispatch = useDispatch();

  const lastSavedJsonString = useRef("");

  // Load from Redux on mount or when Redux changes
  useEffect(() => {
    if (userData && userData.casoActivo && userData.casos) {
      const caso = userData.casos[userData.casoActivo.code];
      if (caso && caso.equipos) {
        const equipo = caso.equipos[userData.casoActivo.maquina_id];
        if (equipo && equipo.prediagnostico && equipo.prediagnostico.sistemasSelectedJson) {
          const savedJson = equipo.prediagnostico.sistemasSelectedJson;

          // Break loop: if the incoming data is exactly what we just saved, ignore it.
          if (JSON.stringify(savedJson) === lastSavedJsonString.current) {
            return;
          }

          const { checked, halfChecked } = extractKeysFromSavedTree(savedJson);

          // Avoid setting state if it's effectively the same to prevent render loops
          setCheckedKeys((prev) => {
            const prevSorted = [...prev].sort();
            const checkedSorted = [...checked].sort();
            if (JSON.stringify(prevSorted) === JSON.stringify(checkedSorted)) return prev;
            return checked;
          });
          setHalfCheckedKeys((prev) => {
            const prevSorted = [...prev].sort();
            const halfCheckedSorted = [...halfChecked].sort();
            if (JSON.stringify(prevSorted) === JSON.stringify(halfCheckedSorted)) return prev;
            return halfChecked;
          });
        }
      }
    }
  }, [userData]);

  const [expandedKeys, setExpandedKeys] = useState([]);

  useEffect(() => {
    if (search) {
      setExpandedKeys(filtered);
    } else {
      setExpandedKeys([]);
    }
  }, [filtered, search]);

  const selectedJson = useMemo(() => {
    const checkedSet = new Set(checkedKeys);
    const halfSet = new Set(halfCheckedKeys);
    return buildSelectedTree(treeData, checkedSet, halfSet);
  }, [treeData, checkedKeys, halfCheckedKeys]);

  // Auto-save to Redux when selectedJson changes
  useEffect(() => {
    if (!userData || !userData.casoActivo || !userData.casos) return;

    const caso = userData.casos[userData.casoActivo.code];
    if (!caso || !caso.equipos) return;
    const equipo = caso.equipos[userData.casoActivo.maquina_id];
    if (!equipo || !equipo.prediagnostico) return;

    const currentSaved = equipo.prediagnostico.sistemasSelectedJson;

    // Only save if the data has actually changed
    if (JSON.stringify(selectedJson) !== JSON.stringify(currentSaved)) {
      // Use structuredClone if available, otherwise JSON parse/stringify
      const newUserData = typeof structuredClone === 'function'
        ? structuredClone(userData)
        : JSON.parse(JSON.stringify(userData));

      newUserData.casos[userData.casoActivo.code].equipos[userData.casoActivo.maquina_id].prediagnostico.sistemasSelectedJson = selectedJson;

      // Update ref BEFORE dispatching to prevent the echo
      lastSavedJsonString.current = JSON.stringify(selectedJson);

      dispatch({ type: 'SET_USER_DATA', payload: newUserData });
    }
  }, [selectedJson, userData, dispatch]);

  const handleRemove = (key) => {
    const { descendants, ancestors } = findRelatedKeys(treeData, key);
    const keysToRemove = new Set([...descendants, ...ancestors]);
    setCheckedKeys((prev) => prev.filter((k) => !keysToRemove.has(k)));
    setHalfCheckedKeys((prev) => prev.filter((k) => !keysToRemove.has(k)));
  };

  const renderSelectedNodes = (nodes) => {
    return nodes.map((node) => (
      <Box key={node.key} mb={2}>
        <HStack spacing={2} mb={1}>
          <Tag
            size="md"
            borderRadius="full"
            variant="subtle"
            colorScheme="blue"
            py={1}
          >
            <Box as="span" mr={2} display="flex" alignItems="center">
              {getIcon(node.title)}
            </Box>
            <TagLabel>{node.title}</TagLabel>
            <TagCloseButton onClick={() => handleRemove(node.key)} />
          </Tag>
        </HStack>
        {node.children && node.children.length > 0 && (
          <Box ml={6} borderLeft="2px solid" borderColor="gray.100" pl={2}>
            {renderSelectedNodes(node.children)}
          </Box>
        )}
      </Box>
    ));
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Search
        placeholder="Buscar sistema/subsistema…"
        //allowClear
        onChange={(e) => {
          setSearch(e.target.value)
        }}
      />
      <Button
        size="sm"
        colorScheme="gray"
        variant="outline"
        onClick={() => setExpandedKeys([])}
        width="fit-content"
      >
        Contraer todo
      </Button>
      {console.log("filtered 62318ad4-9729-4e07-800e-79f02aad5bbb", filtered.length > 0)}
      <Tree
        checkable
        expandedKeys={expandedKeys}
        onExpand={setExpandedKeys}
        autoExpandParent
        treeData={treeData}
        checkedKeys={checkedKeys}
        onCheck={(keys, info) => {
          // `keys` puede ser array o objeto { checked, halfChecked } según modo.
          if (Array.isArray(keys)) {
            setCheckedKeys(keys);
            setHalfCheckedKeys(info.halfCheckedKeys || []);
          } else {
            setCheckedKeys(keys.checked || []);
            setHalfCheckedKeys(keys.halfChecked || []);
          }
        }}
        showLine
        showIcon
        icon={(node) => getIcon(node.title)}
      />

      <Box borderWidth="1px" borderRadius="lg" p={4} bg="white" shadow="sm">
        <Text fontWeight="bold" mb={3} fontSize="lg">
          Selección
        </Text>
        {selectedJson.filter((node) => node.key.startsWith("A-") && node.key.length !== 2).length === 0 ? (
          <Text color="gray.500" fontSize="sm">No hay elementos seleccionados</Text>
        ) : (
          <VStack align="stretch" spacing={1}>
            {renderSelectedNodes(selectedJson.filter((node) => node.key.startsWith("A-") && node.key.length !== 2))}
          </VStack>
        )}
      </Box>
    </div>
  );
}
