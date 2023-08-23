import React, { ReactNode } from "react";

const viewportContext = React.createContext({ width: window.innerWidth, height: window.innerHeight });

export const ViewportProvider = ({ children }: { children: string | JSX.Element | JSX.Element[] | (() => JSX.Element) }) => {
    const [width, setWidth] = React.useState(window.innerWidth);
    const [height, setHeight] = React.useState(window.innerHeight);
    const handleWindowResize = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    };

    React.useEffect(() => {
        window.addEventListener("resize", handleWindowResize);
        return () => window.removeEventListener("resize", handleWindowResize);
    }, []);

    return (
        <viewportContext.Provider value={{ width, height }}>
            {children as ReactNode}
        </viewportContext.Provider>
    );
};

export const useViewport = () => {
    const { width, height } = React.useContext(viewportContext);
    return { width, height };
};