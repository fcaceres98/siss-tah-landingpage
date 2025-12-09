import { ResponseData } from "@/components/types/responseData";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";

interface ResponseConfig {
  color: string;
  textColor: string;
  icon: React.ReactNode;
  label: string;
}

interface ResponsePageProps {
    response: ResponseData | null;
}
const ResponsePage: React.FC<ResponsePageProps> = ({ response }) => {
    const [config, setConfig] = useState<ResponseConfig | null>(null);
    const [LoadingConfig, setLoadingConfig] = useState<boolean>(true);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                setLoadingConfig(true);
                
                const data = response || {
                    status: "PENDING",
                    message: "No response data available.",
                    reason: "",
                    date: ""
                };

                switch (data.status.toLowerCase()) {
                    case "approved":
                        setConfig({
                            color: "border-green-500 bg-green-100",
                            textColor: "text-green-700",
                            icon: <CheckCircle className="w-6 h-6 text-green-500" />,
                            label: "Aprovado"
                        });
                        break;
                    case "rejected":
                        setConfig({
                            color: "border-red-500 bg-red-100",
                            textColor: "text-red-700",
                            icon: <XCircle className="w-6 h-6 text-red-500" />,
                            label: "Rechazado"
                        });
                        break;
                    case "pending":
                    default:
                        setConfig({
                            color: "border-yellow-500 bg-yellow-100",
                            textColor: "text-yellow-700",
                            icon: <Clock className="w-6 h-6 text-yellow-500" />,
                            label: "Pendiente"
                        });
                        break;
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingConfig(false);
            }
        };

        fetchConfig();
    }, [response]);
     
    return (
        <div>
            {LoadingConfig ? (
                <div className="p-6">
                    <Skeleton className="w-full h-[20px]" />
                </div>
            ) : (
                <div className="p-6">
                    <div className={`border-l-4 ${config?.color} rounded-lg p-6 flex items-start gap-4`}>
                        <div>{config?.icon}</div>
                        <div className="flex-1">
                            <h3 className={`text-lg font-semibold ${config?.textColor}`}>
                                {config?.label}
                            </h3>
                            <p className="mt-4 text-sm bg-white text-black p-4 rounded border">
                                {response?.message}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResponsePage