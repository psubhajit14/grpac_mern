import { useEffect } from "react";
import { useLocation } from "react-router-dom"

export const Ad: React.FC<any> = () => {
    const location = useLocation();
    useEffect(() => {

        (window as any).adsbygoogle = (window as any).adsbygoogle || [] as any
        (window as any).adsbygoogle.push({})
    }, [location.pathname])

    return (
        <div key={location.pathname}>
            <ins
                className="adsbygoogle"
                style={{ display: "inline-block", width: "728px", height: "90px" }}
                data-ad-client="ca-pub-1234567890123456"
                data-ad-slot="1234567890"
            />
        </div>
    )
}

