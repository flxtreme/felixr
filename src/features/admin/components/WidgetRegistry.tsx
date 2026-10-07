import { ReactNode } from "react";
import { WidgetQuickCreate } from "./WidgetQuickCreate";


const widgetMapRegistry: Record<string, ReactNode> = {
    "quick-create": <WidgetQuickCreate />,
}


interface WidgetRegistryProps {
    includes: (keyof typeof widgetMapRegistry)[]
}

export const WidgetRegistry = (props: WidgetRegistryProps) => {
    const { includes } = props;

    return (
        <div className="flex flex-col flex-1 h-full overflow-y-auto overflow-x-hidden gap-4 w-full">
            {includes.map((widget) => (
                <div key={widget}>
                    {widgetMapRegistry[widget]}
                </div>
            ))}
        </div>
    )
}