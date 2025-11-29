import React from "react";
import { FEATURES } from "@features";
import dashRoutes, { addRoutes, addToCategory } from "@routes";
import { LuLayoutGrid } from "react-icons/lu";
import { BiCategoryAlt } from "react-icons/bi";
import { IoFolderOpenOutline } from "react-icons/io5";
import { FiGrid } from "react-icons/fi";


export const buildRoutes = () => {
    const sortedFeatures = [...FEATURES].sort((a, b) => (a.order || 999) - (b.order || 999));

    sortedFeatures.forEach(feature => {
        if (feature.enabled && feature.route) {
            if (feature.category) {
                const categoryObj = dashRoutes.find(r => r.category === feature.category);
                if (categoryObj) {
                    if (categoryObj.views) {
                        const existsInCategory = categoryObj.views.some(r => r.path === feature.route.path);
                        if (!existsInCategory) {
                            addToCategory(feature.category, feature.route);
                        }
                    }
                } else {
                    const newCategory = {
                        name: feature.category.toUpperCase(),
                        path: `/${feature.category}`,
                        category: feature.category,
                        state: `${feature.category}Collapse`,
                        layout: "/admin",
                        views: [feature.route],
                        icon: <FiGrid color='inherit' />
                    };
                    addRoutes(newCategory);
                }
            } else {
                const exists = dashRoutes.some(r => r.path === feature.route.path);
                if (!exists) {
                    addRoutes(feature.route);
                }
            }
        }
    });
    return dashRoutes;
};