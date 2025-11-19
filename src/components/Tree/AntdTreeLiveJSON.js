import React, { useMemo, useState, useEffect } from "react";
import { Tree, Input } from "antd";
import "antd/dist/reset.css";
import { isEmptyArray } from "formik";

const { Search } = Input;

/*const treeData = [
  {
    title: "Sistema de Inspecciones",
    key: "inspecciones",
    children: [
      { title: "DOA", key: "inspecciones-doa" },
      { title: "SMC", key: "inspecciones-smc" },
      { title: "PQC", key: "inspecciones-pqc" },
    ],
  },
  {
    title: "Sistema de Taller",
    key: "taller",
    children: [
      { title: "Diagnóstico", key: "taller-diagnostico" },
      { title: "Mantenimiento", key: "taller-mantenimiento" },
      { title: "Reportes", key: "taller-reportes" },
    ],
  },
];*/

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

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Search
        placeholder="Buscar sistema/subsistema…"
        //allowClear
        onChange={(e) => {
          setSearch(e.target.value)
        }}
      />
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
      />

      <div style={{ border: "1px solid #eee", borderRadius: 8, padding: 12 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Selección (JSON)</div>
        <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
          {JSON.stringify(
            selectedJson.filter((node) => node.key.startsWith("A-") && node.key.length !== 2),
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
}
