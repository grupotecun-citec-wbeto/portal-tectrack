import React, { useState } from "react";
import { Tree } from "antd";
import "antd/dist/reset.css";

const treeData = [
  {
    title: "Sistema de Inspección",
    key: "0-0",
    children: [
      {
        title: "Subsistema DOA",
        key: "0-0-0",
      },
      {
        title: "Subsistema PQC",
        key: "0-0-1",
      },
    ],
  },
  {
    title: "Sistema de Taller",
    key: "0-1",
    children: [
      { title: "Subsistema Mantenimiento", key: "0-1-0" },
      { title: "Subsistema Reportes", key: "0-1-1" },
    ],
  },
];

export default function SystemTree() {
  const [checkedKeys, setCheckedKeys] = useState([]);

  const onCheck = (checked) => {
    setCheckedKeys(checked);
    console.log("Seleccionados:", checked);
  };

  return (
    <Tree
      checkable
      defaultExpandAll
      treeData={treeData}
      checkedKeys={checkedKeys}
      onCheck={onCheck}
    />
  );
}
