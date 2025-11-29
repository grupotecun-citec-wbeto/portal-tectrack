import { FEATURES } from "@features";
import dashRoutes, { addRoutes, addToCategory } from "@routes";

export const buildRoutes = () => {
    const sortedFeatures = [...FEATURES].sort((a, b) => (a.order || 999) - (b.order || 999));

    sortedFeatures.forEach(feature => {
        if (feature.enabled && feature.route) {
            if (feature.category) {
                const categoryObj = dashRoutes.find(r => r.category === feature.category);
                if (categoryObj && categoryObj.views) {
                    const existsInCategory = categoryObj.views.some(r => r.path === feature.route.path);
                    if (!existsInCategory) {
                        addToCategory(feature.category, feature.route);
                    }
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